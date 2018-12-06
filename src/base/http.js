/**
 * 本部分代码从flyingon或yaxi框架中相关代码修改而来
 */


// http
(function (yaxi) {



    var http = yaxi.http = Object.create(null);

    var enctype = 'application/x-www-form-urlencoded';

    
    
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


    
    function send(method, url, data, options) {

        var stream = new yaxi.Stream(),
            ajax = stream.ajax = new XMLHttpRequest(),
            type,
            any;

        options = options || {};
        options.method = method;
        options.url = url;
        options.data = data;
        
        if (/get|head|options/i.test(method))
        {
            if (data)
            {
                url = url + (url.indexOf('?') >= 0 ? '&' : '?') + encodeData(data);
                data = null;
            }
        }
        else if ((type = options.contentType) === enctype)
        {
            data = encodeData(data);
        }
        else if (typeof data !== 'string')
        {
            type = 'application/json';
            data = JSON.stringify(data);
        }
        
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
                if (http.timeout)
                {
                    clearTimeout(http.timeout);
                    http.timeout = 0;
                }

                if (this.status >= 100 && this.status < 300)
                {
                    if (this.status === http.redirectStatus)
                    {
                        http.redirect();
                    }
                    else
                    {
                        stream.resolve(this.responseText || this.responseXML);
                    }
                }
                else
                {
                    stream.reject({
                        url: url,
                        status: this.status,
                        message: this.statusText || this.responseText
                    });
                }
                
                // 清除引用
                this.onreadystatechange = null;
            }
        }

        ajax.open(method, url, options.async !== false);
        
        if (type)
        {
            ajax.setRequestHeader('Content-Type', type);
            // ajax.setRequestHeader('Content-Length', data.length);
        }

        if (any = options.header)
        {
            for (var name in any)
            {
                ajax.setRequestHeader(name, any[name]);
            }
        }

        http.timeout = setTimeout(function () {

            ajax.abort();

            stream.reject({
                url: url,
                status: 'timeout',
                message: http.timeoutText
            });

        }, options.timeout || 30000);

        ajax.send(data);

        return stream;
    }



    // 重定向状态码
    http.redirectStatus = 299;


    // 超时提醒
    http.timeoutText = '请求超时!';


    // 重定向
    http.redirect = function () {
        
        location.href = 'index.html';
    }


    http.send = function (method, url, data, options) {

        return send(method || 'GET', url, data, options);
    }


    http.head = function (url, data, options) {

        return send('HEAD', url, data, options);
    }


    http.get = function (url, data, options) {

        return send('GET', url, data, options);
    }


    http.post = function (url, data, options) {

        return send('POST', url, data, options);
    }


    http.put = function (url, data, options) {

        return send('PUT', url, data, options);
    }
    

    http.del = function (url, data, options) {

        return send('DELETE', url, data, options);
    }



})(yaxi);
