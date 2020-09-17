yaxi.Marquee.mixin(function (mixin, base) {


    yaxi.template(this, '<div class="$class"><div class="yx-marquee-content"></div></div>')

    
    mixin.text = function (view, value) {

        var speed = value.length >> 5;
        
        if (speed < 10)
        {
            speed = 10;
        }

        view = view.firstChild;
        view.textContent = value + value + value + value;
        view.style.animation = 'marquee ' + speed + 's linear infinite';
    }


});
