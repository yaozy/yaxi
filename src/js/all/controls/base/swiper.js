yaxi.Box.extend('Swiper', function (Class, base) {



    var start, distance, width;



    // 是否自动切换
    this.$('autoplay', true, false);


    // 当前所在滑块的 index
    this.$('current', 0, {
        
        change: false,
        convert: function (value) {

            return (value |= 0) >= 0 ? value : 0;
        }
    });


    // 自动切换时间间隔
    this.$('interval', 5000, false);


    // 滑动动画时长
    this.$('duration', 500, false);




    this.__load_children = function (values, scope) {

        var current = this.current;

        this.__children.load(values, scope);

        if (current > 0)
        {
            this.__set_current(current);
        }
    }


    this.__set_current = function (value) {

        var length = this.__children.length;

        if (length > 0)
        {
            if (value >= length)
            {
                value = length - 1;
            }

            this.$renderer.current(this, value);
        }
    }



    function touchX(event) {

        var touch = event.changedTouches;
        return touch && (touch = touch[0]) ? touch.pageX : -1;
    }



    this.__on_touchstart = function (event) {

        this.$renderer.offset(this, -1);

        (start = touchX(event)) >= 0 && this.boundingClientRect(function (rect) {

            width = rect.width;
        });
    }


    this.__on_touchmove = function (event) {

        var x;

        if (start >= 0 && width > 0 && (x = touchX(event)) >= 0)
        {
            var current = this.current;
            var value = distance = x - start;

            if (current > 0)
            {
                value += -current * width;
            }
    
            this.$renderer.offset(this, value);

            event.stop();
            return false;
        }
    }


    this.__on_touchend = function (event) {

        if (start >= 0 && width > 0)
        {
            var current = this.current;
            var change = distance / yaxi.remRatio;

            if (change < -50)
            {
                if (current < this.__children.length - 1)
                {
                    this.current++;
                }
            }
            else if (change < 50)
            {
                if (current > 0)
                {
                    this.current--;
                }
            }
            
            if (current === this.current)
            {
                this.__set_current(current);
            }
            
            event.stop();
            return false;
        }
    }



}, function Swiper() {

    yaxi.Box.apply(this, arguments);

});
