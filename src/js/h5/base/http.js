yaxi.__ajax_send = function (options) {

    var stream = new yaxi.Stream();
    var ajax = new XMLHttpRequest();
    var timeout, any;
    
    // CORS
    if (options.CORS)
    {
        // withCredentials是XMLHTTPRequest2中独有的
        if ('withCredentials' in ajax)
        {
            ajax.withCredentials = true;
        }
        else if (any = window.XDomainRequest)
        {
            ajax = new any();
        }
    }

    ajax.onreadystatechange = function () {

        if (this.readyState === 4)
        {
            this.onreadystatechange = null;

            if (timeout)
            {
                clearTimeout(timeout);

                if (this.status >= 100 && this.status < 300)
                {
                    stream.resolve(this.responseText || this.responseXML);
                }
                else
                {
                    stream.reject({
                        url: options.url,
                        status: this.status || 600,
                        message: this.statusText || this.responseText,
                        options: options
                    });
                }
            }
        }
    }

    ajax.open(options.method, options.url, options.async !== false);

    if (options.contentType)
    {
        ajax.setRequestHeader('Content-Type', options.contentType);

        // if (any = options.data)
        // {
        //     ajax.setRequestHeader('Content-Length', any.length);
        // }
    }

    if (any = options.header)
    {
        for (var name in any)
        {
            ajax.setRequestHeader(name, any[name]);
        }
    }

    timeout = setTimeout(function () {

        timeout = 0;
        ajax.abort();

        stream.reject({
            url: options.url,
            status: 601,
            message: 'ajax request timeout'
        });

    }, options.timeout);

    ajax.send(options.data);

    return stream;
}

