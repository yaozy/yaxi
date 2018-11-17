yaxi.SwipePanel = yaxi.Panel.extend(function (Class, base) {


    
    yaxi.template(this, '<div class="yx-control yx-panel yx-swipepanel"></div>');



    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);

        this.index = 0;
        
        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchcancel);
    }


    
    function touchstart() {

        var next = this.__children[this.index + 1],
            lazy;

        swipe = false;

        if (next && (lazy = next.lazy) && !next.__lazyed)
        {
            if (typeof lazy === 'function')
            {
                lazy.call(next);
            }
            else
            {
                for (var name in lazy)
                {
                    next[name] = lazy[name];
                }
            }

            next.__lazyed = true;
        }
    }


    function touchmove(event) {

        var start = event.start;

        switch (start.swipe)
        {
            case 1:
                swipeMove.call(this, event);
                event.stop();
                return false;

            case 2:
                return;

            default:
                var x = event.distanceX,
                    y = event.distanceY;

                x = x < 0 ? -x : x;
                y = y < 0 ? -y : y;

                if (x > 16 && x > y + 4)
                {
                    // 以当前控件和位置开始滑动
                    start.swipe = 1;
                    start.control = this;
                    start.screenX = event.screenX;
                    start.screenY = event.screenY;

                    swipeMove.call(this, event);

                    event.stop();
                    return false;
                }
                break;
        }
    }


    function touchend(event) {


    }


    function touchcancel(event) {


    }



    function swipeMove(event) {

        var index = this.index,
            x = event.distanceX;

        // 向左滑
        if (x < 0)
        {
            if (index > 0)
            {

            }
        }
        else
        {
            var children = this.__children;
        
            if (index < children.length - 1)
            {

            }
        }
    }


    function swipeEnd() {


    }


    

}).register('SwipePanel');
