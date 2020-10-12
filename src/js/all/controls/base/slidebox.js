yaxi.Box.extend('SlideBox', function (Class, base) {



    // 滑动状态
    var state = {
        start: -1,      // 开始位置, 如果小于0则表示不滑动
        slide: 0,       // 是否已经滑动
        index: 0,       // 当前子项索引
        last: 0,        // 最后子项数
        width: 0,       // 容器宽度
        change: 0,      // 子项索引是否已变化
        capture: 0      // 是否已捕获事件
    };




    // 不支持layout属性
    this.__no_layout();



    // 联动控件的key
    this.$('related', '', false);


    // 获取或设置当前页索引
    this.$('selectedIndex', 0, {

        force: true,
        alias: 'selected-index',

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });



    // 是否支持滑动
    this.$('slide', false, false);


    // 是否自动切换
    this.$('autoplay', true, false);


    // 自动切换时间间隔
    this.$('interval', 5000, false);


    // 滑动动画时长
    this.$('duration', 500, false);




    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        switchChange(this, this.selectedIndex, -1);
    }


    this.__set_selectedIndex = function (value, oldValue) {

        if (this.__children[value])
        {
            switchChange(this, value, oldValue); 
            this.trigger('change', { index: value, lastIndex: oldValue });
        }
    }


    function switchChange(slidebox, index, oldIndex) {

        var children = slidebox.__children;
        var control;

        if (control = slidebox.__find_related(slidebox.related))
        {
            control.selectedIndex = index;
        }

        if (control = oldIndex >= 0 && children[oldIndex])
        {
            control.onhide && control.onhide();
        }
    
        if (control = children[index])
        {
            if (!control.__shown)
            {
                control.__shown = true;
                control.onload && control.onload();
            }

            control.onshow && control.onshow();
        }
    }



    function touchX(event) {

        var touch = event.changedTouches;
        return touch && (touch = touch[0]) ? touch.pageX | 0 : -1;
    }


    this.__on_touchstart = function (event) {

        var s = state;

        if (!s.capture)
        {
            var start = -1;
            var last = this.__children.length - 1;
    
            if (last >= 0 && this.slide)
            {
                s.slide = false;
                s.last = last;
    
                (start = touchX(event)) >= 0 && this.boundingClientRect(function (rect) {
        
                    if ((s.width = rect.width) <= 0)
                    {
                        start = -1;
                    }
                });
            }
    
            s.start = start;
            s.capture = 1;
        }
    }


    function checkSlide(slidebox, state, event) {

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
            state.slide = true;
            state.index = slidebox.selectedIndex;

            slidebox.$renderer.start(slidebox);
        }
        else if (delta <= -4) // 纵向滚动则不再滑动
        {
            return false;
        }
    }


    this.__on_touchmove = function (event) {

        var s = state;

        if (s.start >= 0)
        {
            if (!s.slide && checkSlide(this, s, event) === false)
            {
                s.start = -1;
                return;
            }

            var index = s.index;
            var distance = touchX(event) - s.start;
            var size = s.width / 3 | 0;
            var change = 0;

            if (distance < -size)
            {
                if (index < s.last)
                {
                    change = 1;

                    this.trigger('slide', {
                        index: index + 1,
                        oldIndex: index
                    }, false);
                }
            }
            else if (distance > size)
            {
                if (index > 0)
                {
                    change = -1;

                    this.trigger('slide', {
                        index: index - 1,
                        oldIndex: index
                    }, false);
                }
            }
            else
            {
                if (change = s.change)
                {
                    this.trigger('slide', {
                        index: index,
                        oldIndex: index + change
                    }, false);
                }

                change = 0;
            }

            if (index > 0)
            {
                distance += -index * s.width;
            }

            s.change = change;
            this.$renderer.slide(this, distance);

            event.stop();
            return false;
        }
    }


    this.__on_touchend = function (event) {

        var s = state;

        s.capture = 0;

        if (s.slide)
        {
            if (s.change)
            {
                this.selectedIndex += s.change;
            }
            else
            {
                this.$set('selectedIndex', s.index, true);
            }

            this.$renderer.stop(this);

            event.stop();
            return false;
        }
    }


    this.__on_touchcancel = function () {

        s.capture = 0;
    }



}, function SlideBox() {


    yaxi.Box.apply(this, arguments);


});
