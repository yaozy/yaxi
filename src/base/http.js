// http
yaxi.HTTP = yaxi.http = Object.extend.call({}, function (Class) {


    

    // 重定向状态码
    this.redirectStatus = 299;


    // 重定向
    this.redirect = function () {
        
        location.href = 'index.html';
    }



    this.send = function (options) {

        var self = this,
            stream = new yaxi.Stream(),
            ajax = new XMLHttpRequest(),
            any;
        
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

                if (self)
                {
                    clearTimeout(this.__timeout);
                    self.receive(this, stream, options);
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

        ajax.__timeout = setTimeout(function () {

            self = null;
            ajax.abort();

            stream.reject({
                url: options.url,
                status: 'timeout'
            });

        }, options.timeout || 30000);

        ajax.send(options.data);

        return stream;
    }


    this.receive = function (ajax, stream, options) {

        if (ajax.status >= 100 && ajax.status < 300)
        {
            this.response(ajax, stream, options);
        }
        else
        {
            stream.reject({
                url: options.url,
                status: ajax.status,
                message: ajax.statusText || ajax.responseText,
                options: options
            });
        }
    }


    this.response = function (ajax, stream, options) {

        if (ajax.status === this.redirectStatus)
        {
            this.redirect();
        }
        else
        {
            stream.resolve(ajax.responseText || ajax.responseXML);
        }
    }



    
    function encodeData(data) {

        if (!data)
        {
            return '';
        }

        var list = [],
            encode = encodeURIComponent,
            value,
            any;

        for (var name in data)
        {
            value = data[name];
            name = encode(name);

            if (value === null)
            {
                list.push(name, '=null', '&');
                continue;
            }

            switch (typeof value)
            {
                case 'undefined':
                    list.push(name, '=&');
                    break;

                case 'boolean':
                case 'number':
                    list.push(name, '=', value, '&');
                    break;

                case 'string':
                case 'function':
                    list.push(name, '=', encode(value), '&');
                    break;

                default:
                    if (value instanceof Array)
                    {
                        for (var i = 0, l = value.length; i < l; i++)
                        {
                            if ((any = value[i]) === void 0)
                            {
                                list.push(name, '=&');
                            }
                            else
                            {
                                list.push(name, '=', encode(any), '&'); //数组不支持嵌套
                            }
                        }
                    }
                    else
                    {
                        list.push(name, '=', encodeData(value), '&');
                    }
                    break;
            }
        }

        list.pop();

        return list.join('');
    }


    function parseOptions(method, url, data, options, flag) {

        if (data && !(data instanceof FormData))
        {
            if (flag || /GET|HEAD|OPTIONS/i.test(method))
            {
                url = url + (url.indexOf('?') >= 0 ? '&' : '?') + encodeData(data);
                data = null;
            }
            else if (options.contentType === 'application/x-www-form-urlencoded')
            {
                data = encodeData(data);
            }
            else if (typeof data !== 'string')
            {
                if (!options.contentType)
                {
                    options.contentType = 'application/json';
                }
                
                data = JSON.stringify(data);
            }
        }

        options.method = method;
        options.url = url;
        options.data = data;

        return options;
    }



    ;(this.__class_init = function (Class) {


        var parse = parseOptions;


        Class.send = function (method, url, data, options) {

            options = parse(method ? method.toUpperCase() : 'GET', url, data, options || {}); 
            return new Class().send(options);
        }
    
    
        Class.head = function (url, data, options) {
    
            options = parse('HEAD', url, data, options || {}, true);
            return new Class().send(options);
        }
    
    
        Class.get = function (url, data, options) {
    
            options = parse('GET', url, data, options || {}, true);
            return new Class().send(options);
        }
    
    
        Class.post = function (url, data, options) {
    
            options = parse('POST', url, data, options || {});
            return new Class().send(options);
        }
    
    
        Class.put = function (url, data, options) {
    
            options = parse('PUT', url, data, options || {});
            return new Class().send(options);
        }
        
    
        Class.del = function (url, data, options) {
    
            options = parse('DELETE', url, data, options || {});
            return new Class().send(options);
        }
        
    })(Class);



}, function HTTP() {});

