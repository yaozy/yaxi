yaxi.Box.extend('ScrollBox', function (Class, base, yaxi) {



    var pulldown, y, top, maxTop, maxHeight, timer;



    // 下拉刷新高度
    this.$('pulldown', '');



    function check(scrollbox, renderer, pulldown, pageY) {

        if (y < 0)
        {
            y = pageY;
            pulldown.status = 1;
        }
        else
        {
            pulldown.height = (pageY - y) + 'px';

            if (timer)
            {
                clearTimeout(timer);
            }

            timer = setTimeout(function () {

                var height = renderer.scrollHeight(scrollbox);

                if (height > maxHeight)
                {
                    maxHeight = height;
                }
                else
                {
                    pulldown.status = 2;
                }

            }, 10);
        }
    }



    this.__on_touchstart = function () {

        y = maxTop = maxHeight = -1;

        if ((pulldown = this.__children[0]) && (pulldown instanceof yaxi.Pulldown))
        {
            pulldown.transition = '';
            pulldown.height = 0;
        }
        else
        {
            pulldown = null;
        }

        maxTop = this.$renderer.maxTop(this);
    }


    this.__on_touchmove = function (event) {

        var touches = event.changedTouches;
        var touch;

        if (touches && (touch = touches[0]))
        {
            var renderer = this.$renderer;
            
            top = renderer.scrollTop(this);

            if (top <= 0)
            {
                if (pulldown)
                {
                    check(this, renderer, pulldown, touch.pageY);
                }
            }
            else
            {
                y = -1;
            }
        }
    }



    this.__on_touchend = function () {

        if (pulldown)
        {
            pulldown.release();
            pulldown = null;
        }
        
        if (top + 20 >= maxTop)
        {
            var children = this.__children;
            var pullup = children[children.length - 1];

            if (pullup && pullup instanceof yaxi.Pullup)
            {
                pullup.start();
            }
        }
    }



}, function ScrollBox() {


    yaxi.Box.call(this);


});
