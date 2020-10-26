;(function (http) {



    // 全局请求拦截
    var beforeHandlers = [];

    // 全局响应拦截
    var afterHandlers = [];



    // 默认超时时间
    http.timeout = 10000;


    // 注册或注销全局请求拦截
    http.before = function (handler, remove) {

        if (typeof handler !== 'function')
        {
            throw 'http request must be a function!';
        }

        if (remove)
        {
            for (var i = beforeHandlers.length; i--;)
            {
                if (beforeHandlers[i] === handler)
                {
                    beforeHandlers.splice(i, 1);
                }
            }
        }
        else
        {
            beforeHandlers.push(handler);
        }
    }


    // 注册或注销全局响应拦截
    http.after = function (handler, remove) {

        if (typeof handler !== 'function')
        {
            throw 'http response must be a function!';
        }

        if (remove)
        {
            for (var i = afterHandlers.length; i--;)
            {
                if (afterHandlers[i] === handler)
                {
                    afterHandlers.splice(i, 1);
                }
            }
        }
        else
        {
            afterHandlers.push(handler);
        }
    }



    function parseAfterHandlers(value) {

        var list = afterHandlers;

        for (var i = 0, l = list.length; i < l; i++)
        {
            value = list[i](value);
        }

        return value;
    }



    function ajax_mock(stream, options) {

        setTimeout(function () {
    
            try
            {
                var response = require('../../mock/' + options.url);
    
                if (typeof response === 'function')
                {
                    stream.resolve(response(options.data, options));
                }
                else
                {
                    stream.resolve(response);
                }
            }
            catch (err)
            {
                console.error(err);
                stream.reject(options.url + '\n' + err);
            }
    
        }, 500);
    }
    

    function encodeData(data) {

        if (data)
        {
            var list = [];
            var encode = encodeURIComponent;
            var value, any;

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

        return '';
    }


    function send(method, url, data, options, flag) {

        var stream, list;

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
        options.timeout = options.timeout || http.timeout;

        if ((list = beforeHandlers).length > 0)
        {
            for (var i = 0, l = list.length; i < l; i++)
            {
                list[i](options);
            }
        }

        stream = new yaxi.Stream();

        if (afterHandlers.length > 0)
        {
            stream.map(parseAfterHandlers);
        }

        if (http.mock)
        {
            ajax_mock(stream, options);
        }
        else
        {
            yaxi.__ajax_send(stream, options);
        }

        return stream;
    }



    http.send = function (method, url, data, options) {

        return send(method ? method.toUpperCase() : 'GET', url, data, options || {}); 
    }



    http.options = function (url, data, options) {

        return send('OPTIONS', url, data, options || {}, true);
    }


    http.head = function (url, data, options) {

        return send('HEAD', url, data, options || {}, true);
    }


    http.get = function (url, data, options) {

        return send('GET', url, data, options || {}, true);
    }


    http.post = function (url, data, options) {

        return send('POST', url, data, options || {});
    }


    http.put = function (url, data, options) {

        return send('PUT', url, data, options || {});
    }
    

    http.delete = function (url, data, options) {

        return send('DELETE', url, data, options || {});
    }


    http.trace = function (url, data, options) {

        return send('TRACE', url, data, options || {});
    }


    http.connect = function (url, data, options) {

        return send('CONNECT', url, data, options || {});
    }


})(yaxi.http = Object.create(null));

