
(function (window) {



    var create = Object.create;


    // 全局变量
    var jiac = window.jiac = create(null);


    // 全局require
    var global = window.require = factory(location.href.substring(0, location.href.lastIndexOf('/')));

	// 已加载的模块集合
	var modules = jiac.modules = create(null);

    // 注册的模块
    var cache = jiac.cache = create(null);


    // 相对url缓存
    var urls = create(null);

    // 扩展名缓存
    var exts = create(null);


    // 模块处理
    var handlers = create(null);


    // 默认版本号
    var version = ('' + Math.random()).replace('0.', '')





    function factory(base) {

        function require(url) {

            return jiac.loadModule(require.base, url);
        }

        require.base = require.baseURL = base;
        require.runAsThread = runAsThread;

        return require;
    }


    // 作为线程运行
    function runAsThread(fn) {

        return new jiac.Thread(global.base, this.base, fn);
    }



    function relative(url) {

        var last;

        while (true)
        {
            last = url.replace(/[^/]*\/\.\.\//, '');
            
            if (last === url)
            {
                break;
            }
            
            url = last;
        }
        
        return url.replace(/[.]+\//g, '');
    }


    function absolute(base, url) {

        // 相对根目录
        if (url[0] === '/')
        {
            base = global.base;
            return base + (base[base.length - 1] === '/' ? url.substring(1) : url);
        }

        // 相对当前目录
        url = (base[base.length - 1] === '/' ? base : base + '/') + url;

        return urls[url] || (urls[url] = relative(url));
    }


    function ajax(url) {

        var xhr = new XMLHttpRequest(),
            text;

		xhr.open('GET', url + '?v=' + version, false);

        xhr.onreadystatechange = function () {

            if (this.readyState === 4)
            {
                if (this.status < 300)
                {
                    text = this.responseText;
                }
                else
                {
                    throw new Error(url + '\n' + this.statusText);
                }
                
                this.onreadystatechange = null;
            }
        }

        xhr.send(null);

        return text;
    }


    handlers.js = function (url) {

        var module = { exports: {} },
            any;

        if (any = cache[url])
        {
            any(
                factory(url.substring(0, url.lastIndexOf('/') + 1)),
                module.exports,
                module);
        }
        else if (any = ajax(url))
        {
            any = any + '\n//# sourceURL=' + url;

            try
            {
                new Function(['require', 'exports', 'module'], any)(
                    factory(url.substring(0, url.lastIndexOf('/') + 1)),
                    module.exports,
                    module);
            }
            catch (e)
            {
                if (typeof console !== 'undefined')
                {
                    console.error(url);
                    console.error(e);
                }

                throw e;
            }
        }

		return module;
    }


    handlers.json = function (url) {

        var text = cache[url] || ajax(url);

        return { 
            exports: text ? JSON.parse(text) : null 
        };
    }



    // 相对路径转绝对路径
    jiac.absoluteUrl = absolute;

    
    // 加载模块
    jiac.loadModule = function (base, url) {

        var ext = exts[url],
            any;

        if (ext)
        {
            url = ext[1];
            ext = ext[0];
        }
        else if (any = url.match(/\.json$|\.js$/))
        {
            exts[url] = [ext = any[0].substring(1), url];
        }
        else
        {
            exts[url] = [ext = 'js', url += '.js'];
        }

        url = absolute(base, url);

        if (any = modules[url])
        {
            return any.exports;
        }

        return (modules[url] = handlers[ext](url)).exports;
    }



    // 注册模块
    jiac.module = function (url, content) {

        cache[absolute(global.base, url)] = content;
    }



})(window);

jiac.Thread = (function () {



    var seed = 1;



    var inject = '' + function () {


        var create = Object.create;


        // 全局变量
        var jiac = create(null);


        // 全局require
        var global = jiac.require = factory(base);

        

        // 模块缓存
        var modules = jiac.modules = create(null);

        // 注册的模块
        var cache = jiac.cache = create(null);


        // 相对url缓存
        var urls = create(null);

        // 扩展名缓存
        var exts = create(null);



        // 模块处理
        var handlers = create(null);



        // 默认版本号
        var version = ('' + Math.random()).replace('0.', '')

        
        
        function factory(base) {

            function require(url) {
    
                return load(require.base, url);
            }
    
            require.base = require.baseURL = base;
            return require;
        }


        function relative(url) {

            var last;
    
            while (true)
            {
                last = url.replace(/[^/]*\/\.\.\//, '');
                
                if (last === url)
                {
                    break;
                }
                
                url = last;
            }
            
            return url.replace(/[.]+\//g, '');
        }


        function absolute(base, url) {
    
            // 相对根目录
            if (url[0] === '/')
            {
                return root + url;
            }
    
            // 相对当前目录
            url = (base[base.length - 1] === '/' ? base : base + '/') + url;

            return urls[url] || (urls[url] = relative(url));
        }


        function ajax(url) {

            var xhr = new XMLHttpRequest(),
                text;
  
            xhr.open('GET', url + '?v=' + version, false);
    
            xhr.onreadystatechange = function () {
    
                if (this.readyState === 4)
                {
                    if (this.status < 300)
                    {
                        text = this.responseText;
                    }
                    else
                    {
                        throw new Error(url + '\n' + this.statusText);
                    }
                    
                    this.onreadystatechange = null;
                }
            }
    
            xhr.send(null);

            return text;
        }


        function load(base, url) {

            var ext = exts[url],
                any;

            if (ext)
            {
                url = ext[1];
                ext = ext[0];
            }
            else if (any = url.match(/\.json$|\.js$/))
            {
                exts[url] = [ext = any[0].substring(1), url];
            }
            else
            {
                exts[url] = [ext = 'js', url += '.js'];
            }

            url = absolute(base, url);

            if (any = modules[url])
            {
                return any.exports;
            }

            return (modules[url] = handlers[ext](url)).exports;
        }



        handlers.js = function (url) {

            var module = { exports: {} },
                any;

            if (any = cache[url])
            {
                any(
                    factory(url.substring(0, url.lastIndexOf('/') + 1)),
                    module.exports,
                    module);
            }
            else if (any = ajax(url))
            {
                any = any + '\n//# sourceURL=' + url;

                try
                {
                    new Function(['require', 'exports', 'module'], any)(
                        factory(url.substring(0, url.lastIndexOf('/') + 1)),
                        module.exports,
                        module);
                }
                catch (e)
                {
                    if (typeof console !== 'undefined')
                    {
                        console.error(e.message || e);
                        console.error(url);
                    }
    
                    throw e;
                }
            }

            return module;
        }


        handlers.json = function (url) {

            var text = cache[url] || ajax(url);

            return { 
                exports: text ? JSON.parse(text) : null 
            };
        }


        
        function reply(uuid, value, e) {

            self.postMessage(JSON.stringify([uuid, value, e]));
        }
        

        self.addEventListener('message', function (event) {
            
            var target = this,
                data = event.data,
                uuid = data.uuid,
                method = data.method,
                index = 0,
                list = method.split('.'),
                name,
                fn;

            try
            {
                name = list.pop();

                while (target && (fn = list[index++]))
                {
                    target = target[fn];
                }

                if (target && (fn = target[name]))
                {
                    list = data.args || [];

                    if (data.async)
                    {
                        list.push(function (value, e) {

                            reply(uuid, value, e);
                        });

                        fn.apply(target, list);
                    }
                    else
                    {
                        try
                        {
                            reply(uuid, fn.apply(target, list));
                        }
                        catch (e)
                        {
                            reply(uuid, null, e);
                        }
                    }
                }
                else
                {
                    reply(uuid, null, 'not support method "' + method + '"!');
                }
            }
            catch (e)
            {
                reply(uuid, null, e);
            }
        });


        return global;

    };


    inject = inject.substring(inject.indexOf('{') + 1);
    inject = inject.substring(0, inject.lastIndexOf('}'));


    

    function Thread(root, base, url) {

        var list = ['var require = function (self, root, base) {\n',
            inject, 
            '\n}(self, "', 
                root[root.length - 1] !== '/' ? root : root.slice(0, -1),  '", "', 
                base, '", "',
            '");\n\n\n\n\n'];

        if (typeof url === 'string')
        {
            list.push('require("' + url + '");');
        }
        else
        {
            list.push('' + url);
        }

        list = [list.join('')];

        this.queue = [];
        this.worker = new Worker(URL.createObjectURL(new Blob(list)));
        this.worker.onmessage = onmessage.bind(this);
    }

    
    
    function onmessage(event) {

        var data;

        if (data = event.data)
        {
            var queue = this.queue,
                index = 0,
                uuid = (data = JSON.parse(data))[0],
                item;

            while (item = queue[index])
            {
                if (item === uuid)
                {
                    queue[index + 1].call(this, data[1], data[2]);
                    queue.splice(index, 2);
                    return;
                }

                index += 2;
            }
        }
    }


    Thread.prototype.exec = function (method, args, callback, async) {

        if (method)
        {
            var uuid = seed++;

            this.queue.push(uuid, callback);

            this.worker.postMessage({
                uuid: uuid,
                method: method,
                args: args,
                async: async
            });
        }
    }


    Thread.prototype.terminate = function () {

        this.worker.terminate();
    }



    return Thread;
    


})();
