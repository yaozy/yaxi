(function () {


    var view = document.createElement('div');

    var mask = document.createElement('div');

    var delay;



    view.className = 'yx-toast';
    mask.className = 'yx-mask';



    function show(options) {

        var host = yaxi.__view_host,
            style = view.style;

        close();

        view.innerHTML = (options.loading ? '<span class="yx-toast-loading"></span>' : '')
            + '<span>' + options.text + '</span>';
    
        if (options.mask || options.loading && options.mask !== false)
        {
            mask.style.backgroundColor = '';
            host.appendChild(mask);
        }

        host.appendChild(view);

        style.cssText = options.style || '';
        style.left = (host.clientWidth - view.offsetWidth >> 1) + 'px';

        switch (options.position)
        {
            case 'top':
                style.top = options.offset == null ? '.8rem' : options.offset;
                break;

            case 'bottom':
                style.bottom = options.offset == null ? '.8rem' : options.offset;
                break;

            default:
                style.top = (host.clientHeight - view.offsetHeight >> 1) + 'px';
                break;
        }

        if (options.time >= 0)
        {
            delay = setTimeout(close, options.time || 2500);
        }
    }


    function close() {

        var any;
        
        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (any = view.parentNode)
        {
            any.removeChild(view);
        }

        if (any = mask.parentNode)
        {
            any.removeChild(mask);
        }
    }


    this.toast = function (options) {

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (!options)
        {
            return;
        }

        if (typeof options === 'string')
        {
            options = { text: options, time: 2500 };
        }
        else if (!options.time)
        {
            options.time = 2500;
        }
    
        if (options.delay > 0)
        {
            if (!mask.parentNode)
            {
                mask.style.backgroundColor = 'rgba(255,255,255,0)';
                yaxi.__view_host.appendChild(mask);
            }

            delay = setTimeout(function () {

                show(options);

            }, options.delay);
        }
        else
        {
            show(options);
        }
    }


    this.toast.hide = function () {

        close();
    }

    

}).call(yaxi);
