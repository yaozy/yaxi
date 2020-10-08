yaxi.Box.extend('ScrollBox', function (Class, base, yaxi) {



    var pulldown, start, switchHeight;



    // 下拉刷新高度为多少rem时变换状态
    this.$('pulldownHeight', 80, false);


    // 上拉刷新高度为多少rem时触发刷新动作
    this.$('pullupHeight', 20, false);




    this.scrollTop = 0;
    

    this.scrollLeft = 0;
    

    this.scrollWidth = 0;
    
    
    this.scrollHeight = 0;

    

    this.scrollTo = function (top) {

        this.$set('scrollTo', top | 0);
    }


    this.scrollIntoView = function (childControl) {

        if (childControl)
        {
            this.$set('scrollIntoView', childControl.uuid);
        }
    }




    this.__on_touchstart = function () {

        if ((pulldown = this.__children[0]) && (pulldown instanceof yaxi.Pulldown))
        {
            start = -1;
            switchHeight = this.pulldownHeight * yaxi.remRatio | 0;

            pulldown.transition = '';
            pulldown.height = 0;
        }
        else
        {
            pulldown = null;
        }
    }

    
    this.__on_touchmove = function (event) {

        var touch;

        if (pulldown && (touch = event.changedTouches) && (touch = touch[0]))
        {
            var status, height;

            if (this.scrollTop <= 0)
            {
                var y = touch.pageY | 0;

                if (start < 0 || start >= y)
                {
                    start = y;
                }
                else
                {
                    y -= start;

                    status = y < switchHeight ? 1 : 2;
                    height = y + 'px';
                }
            }
            else
            {
                start = -1;
            }

            pulldown.status = status || 0;
            pulldown.height = height || '0px';
        }
    }


    this.__on_touchend = function () {

        var control;

        if (control = pulldown)
        {
            pulldown = null;

            if (control.status > 0)
            {
                control.release();
                return;
            }
        }

        var children = this.__children;

        // 最后一个是上拉刷新控件
        if ((control = children[children.length - 1]) && control instanceof yaxi.Pullup)
        {
            var height = this.pullupHeight * yaxi.remRatio; 

            yaxi.boundingClientRects([this, control], function (rect1, rect2) {

                if (rect2.top + height < rect1.height)
                {
                    control.start();
                }
            });
        }
    }



}, function ScrollBox() {


    yaxi.Box.call(this);


});
