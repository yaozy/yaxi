yaxi.Box.extend('SlideBox', function (Class, base) {




    Class.allowParent = function (parent) {

        if (parent instanceof Class)
        {
            throw new Error('slidebox cannot be added to slidebox!');
        }

        return true;
    }




    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);




    // 是否自动切换
    this.$('autoplay', false, {

        force: true,
        change: false
    });


    // 自动切换时间间隔
    this.$('interval', 5000, false);


    // 滑动动画时长
    this.$('duration', 500, false);



    this.__set_autoplay = function (value) {

        var interval;

        clearTimeout(this.__auto);

        if (value && (interval = this.interval) > 0)
        {
            this.__auto = setTimeout(autoplay.bind(this), interval);
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
            this.__auto = setTimeout(autoplay.bind(this), interval);
        }
    }


    
    // 滑动状态
    var state = {
        start: -1,      // 开始位置, 如果小于0则表示不滑动
        index: 0,       // 当前子项索引
        last: 0,        // 最后子项数
        move: 0,       // 是否已经滑动
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
        var delta;

        if (x < 0)
        {
            x = -x;
        }

        if (y < 0)
        {
            y = -y;
        }

        // 横向滑动的距离更多则启动滑动功能
        if ((delta = x - y) >= 4)
        {
            state.move = 1;
            state.index = slidebox.selectedIndex;

            slidebox.__start();
        }
        else if (delta <= -4) // 纵向滚动则不再滑动
        {
            return false;
        }
    }


    function checkChange(state, event) {

        // 500ms只要移动了小段距离就算换页
        if (new Date() - state.time < 500)
        {
            var x = event.distanceX;
            var size = 100 * yaxi.remRatio;
    
            if (x  < -size)
            {
                if (state.index < state.last)
                {
                    return 1;
                }
            }
            else if (x > size && state.index > 0)
            {
                return -1;
            }
        }
    }


    this.__on_touchstart = function (event) {

        var s = state;

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

            var index = s.index;
            var distance = touchX(event) - s.start;
            var size = s.width >> 1;
            var change = s.change;

            if (distance < -size)
            {
                if (!change && index < s.last)
                {
                    s.change = 1;
                    this.trigger('transition', index + 1, false);
                }
            }
            else if (distance > size)
            {
                if (!change && index > 0)
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

            if (index > 0)
            {
                distance += -index * s.width;
            }

            this.__move(distance);

            event.stop();
            return false;
        }
    }


    this.__on_touchend = function (event) {

        var s = state;

        s.capture = 0;

        if (s.move)
        {
            this.__stop(s.change || checkChange(s, event));

            event.stop();
            return false;
        }
    }


    this.__on_touchcancel = function () {

        state.capture = 0;
    }



    // 小程序在拖动结束时直接从change事件获取当前索引
    this.__on_change = function (index) {

        this.selectedIndex = index;
        return false;
    }



    this.__start = this.__move = function () {
    }
    
    
    this.__stop = function (change) {
    }




}, function SlideBox() {


    yaxi.Box.apply(this, arguments);


});
