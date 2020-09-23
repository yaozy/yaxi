yaxi.Marquee.renderer(function (renderer, base) {



    renderer.text = function (view, prefix, value) {

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

        //     speed = speed * this.speed | 0;
        //     value = 'marquee ' + speed + 's linear infinite';
        // }

        // view[prefix + 'animation'] = value;
    }


    renderer.speed = function (view) {

        renderer.text.call(this, view, this.text);
    }



});
