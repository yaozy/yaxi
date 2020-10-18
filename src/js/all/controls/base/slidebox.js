yaxi.Box.extend('SlideBox', function (Class, base) {




    Class.allowParent = function (parent) {

        if (parent instanceof Class)
        {
            throw new Error(this.typeName.toLowerCase() + ' cannot be added to slidebox!');
        }

        return true;
    }



    // 是否自动切换
    this.$('autoplay', false, false);


    // 自动切换时间间隔(毫秒)
    this.$('interval', 5000, false);


    // 是否循环
    this.$('circular', true, false);


    // 过渡动画时长(毫秒), 0表示没有过渡动画
    this.$('duration', 0, {

        change: false,

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });


    // 过渡动画类型
    this.$('easingfn', '', false);




    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);



    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        this.__set_selectedIndex(this.selectedIndex, -1);

        this.autoplay && this.__set_autoplay(true);
    }



    this.__set_selectedIndex = function (index, oldIndex) {

        var indexes = this.__indexes;
        var children = this.__children;
        var length = children.length;

        if (length > 1)
        {
            var previous = index - 1;
            var next = index + 1;
            var control;

            // 循环播放要特殊处理
            if (this.circular)
            {
                // 最后一页
                if (next >= length)
                {
                    // 把第一页移到下一页的位置
                    next = 0;
                }
                else if (previous < 0) // 第一页
                {
                    // 把最后一页移到上一页的位置
                    previous = length - 1;
                }
            }

            // 清除原来的动画和变换
            for (var i = indexes.length; i--;)
            {
                var item = indexes[i];

                if (item !== previous && item !== index && item !== next)
                {
                    children[item].transform = children[i].transition = '';
                }
            }

            // 上一页
            if (control = children[previous])
            {
                control.$set('transform', 'translateX(100%)', true);
            }

            // 下一页
            if (control = children[next])
            {
                control.$set('transform', 'translateX(300%)', true);
            }

            indexes[0] = previous;
            indexes[1] = index;
            indexes[2] = next;
        }
        else if (length > 0)
        {
            indexes[0] = indexes[2] = -1;
            indexes[1] = index;
        }
        
        // 当前页
        if (control = children[index])
        {
            control.$set('transform', 'translateX(200%)', true);
        }

        // 切换页面
        this.__switch(this, index, oldIndex); 

        // change事件不冒泡
        this.trigger('change', index, false);
    }


    // 切换autoplay默认实现
    this.__set_autoplay = function (value) {

        var any;

        if (any = this.__time)
        {
            clearTimeout(any);
        }

        if (value && (any = this.interval) > 0)
        {
            // this.__time = setTimeout(autoplay.bind(this), any);
        }
    }


    function autoplay(interval) {

        var index = this.selectedIndex + 1;
        var interval = this.interval;

        if (index >= this.__children.length)
        {
            index = 0;
        }

        this.selectedIndex = index;

        if (interval > 0)
        {
            this.__time = setTimeout(autoplay.bind(this), interval);
        }
    }


    
    // 滑动状态
    var state = {
        start: -1,      // 开始位置, 如果小于0则表示不滑动
        index: 0,       // 当前子项索引
        last: 0,        // 最后子项数
        move: 0,        // 是否已经滑动
        width: 0,       // 容器宽度
        change: 0,      // 子项索引是否已变化
        capture: 0,     // 是否已捕获事件
        time: 0         // 按下时间
    };


    function touchX(event) {

        var touch = event.changedTouches;
        return touch && (touch = touch[0]) ? touch.pageX | 0 : -1;
    }


    function checkMove(slidebox, state, event) {

        var x = event.distanceX;
        var y = event.distanceY;
        var any;

        if (x < 0)
        {
            x = -x;
        }

        if (y < 0)
        {
            y = -y;
        }

        // 横向滑动的距离更多则启动滑动功能
        if ((any = x - y) >= 4)
        {
            state.move = 1;
            state.index = slidebox.selectedIndex;

            if (any = slidebox.__start)
            {
                any.call(slidebox);
            }
        }
        else if (any <= -4) // 纵向滚动则不再滑动
        {
            return false;
        }
    }


    function checkChange(state, event) {

        // 500ms只要移动了小段距离就算换页
        if (new Date() - state.time < 500)
        {
            var index = state.index;
            var x = event.distanceX;
            var size = 100 * yaxi.remRatio;
    
            if (x  < -size)
            {
                if (index < state.last)
                {
                    return 1;
                }
            }
            else if (x > size && index > 0)
            {
                return -1;
            }
        }
    }


    this.__on_touchstart = function (event) {

        var s = state;

        // 先禁止自动播放
        if (this.autoplay)
        {
            this.__autoplay = true;
            this.autoplay = false;
        }

        if (!s.capture)
        {
            var start = -1;
            var last = this.__children.length - 1;
    
            if (last >= 0)
            {
                s.move = 0;
                s.last = last;
    
                (start = touchX(event)) >= 0 && this.boundingClientRect(function (rect) {
        
                    if ((s.width = rect.width) <= 0)
                    {
                        start = -1;
                    }
                });
            }
    
            s.start = start;
            s.time = new Date();
            s.capture = 1;
        }
    }


    this.__on_touchmove = function (event) {

        var s = state;

        if (s.start >= 0)
        {
            if (!s.move && checkMove(this, s, event) === false)
            {
                s.start = -1;
                return;
            }

            var circular = this.circular;
            var index = s.index;
            var distance = touchX(event) - s.start;
            var size = s.width >> 1;
            var change = s.change;

            if (distance < -size)
            {
                if (!change && (circular || index < s.last))
                {
                    s.change = 1;
                    this.trigger('transition', index + 1, false);
                }
            }
            else if (distance > size)
            {
                if (!change && (circular || index > 0))
                {
                    s.change = -1;
                    this.trigger('transition', index - 1, false);
                }
            }
            else if (change)
            {
                s.change = 0;
                this.trigger('transition', index, false);
            }

            if (change = this.__move)
            {
                change.call(this, distance);
            }

            event.stop();
            return false;
        }
    }


    this.__on_touchend = this.__on_touchcancel = function (event) {

        var s = state;

        s.capture = 0;

        if (s.move)
        {
            var index = s.index;
            var change;

            // 已经拖过一半则直接变更索引
            if (change = s.change)
            {
                this.selectedIndex = index + change;
            }
            else if (event.type === 'touchend' && (change = checkChange(s, event))) // 快速停止且移动了1/3也变更索引
            {
                this.selectedIndex = index + change;
                this.trigger('transition', this.selectedIndex, false);
            }
            else // 否则退回原样
            {
                this.__transform(this.__indexes, index);    // 坐标变换
                this.trigger('transition', index, false);   // 触发过渡事件
            }

            if (change = this.__stop)
            {
                change.call(this);
            }

            event.stop();
            return false;
        }
    }



    // 小程序在拖动结束时直接从change事件获取当前索引
    this.__on_change = function (index) {

        this.selectedIndex = index;
        return false;
    }




}, function SlideBox() {


    this.__indexes = [0, 0, 0];
    yaxi.Box.apply(this, arguments);


});
