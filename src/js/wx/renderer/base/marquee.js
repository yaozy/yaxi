yaxi.Marquee.renderer(function (base) {



    this.text = function (control, view, prefix, value) {

        // var length = value.length;

        // view[prefix + 'text'] = value;

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

        //     speed = speed * control.speed | 0;
        //     value = 'marquee ' + speed + 's linear infinite';
        // }

        // view[prefix + 'animation'] = value;
    }


    this.speed = function (control, view) {

        this.text.call(this, control, view, control.text);
    }



});
