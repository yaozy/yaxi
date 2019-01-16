yaxi.IFrame = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<iframe class="yx-control yx-iframe"></iframe>');



    this.$property('src', '');



    this.renderer.src = function (dom, value) {

        dom.src = value;
    }



    function findControl(source) {

        var iframes = document.querySelectorAll('iframe');

        for (var i = iframes.length; i--;)
        {
            if (iframes[i].contentWindow === source)
            {
                return iframes[i].$control;
            }
        }
    }


    window.addEventListener('message', function (event) {

        var control, e;

        if (control = findControl(event.source))
        {
            e = new yaxi.Event('message');
            e.data = event.data;
            
            control.trigger(e);
        }
    });


});
