yaxi.Marquee.renderer(function (base) {


    yaxi.template(this, '<div class="$class"><div class="yx-marquee-content"></div></div>')

    
    this.text = function (control, view, value) {

        // var length = value.length;

        // view = view.firstChild;

        // if (length > 0)
        // {
        //     var speed = length >> 5;

        //     if ((speed << 5) < length)
        //     {
        //         speed++;
        //     }
        
        //     if (speed < 1)
        //     {
        //         speed = 1;
        //     }

        //     speed = speed * this.speed | 0;
    
        //     value = '<span "margin-right:100rem;">' + value + '</span>';
    
        //     view.innerHTML = value + value;
        //     value = 'marquee ' + speed + 's linear infinite';
        // }

        // view.style.animation = value;
    }


    this.speed = function (control, view) {

        this.text.call(this, control, view, control.text);
    }


});
