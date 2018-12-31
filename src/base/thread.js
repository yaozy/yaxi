;(function () {


    
    var seed = 1;



    var inject = '' + function () {


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

        
        function reply(uuid, value, e) {

            self.postMessage(JSON.stringify([uuid, value, e]));
        }



        var global = factory(base);

        var modules = global.modules = Object.create(null);



        function absolute(base, url) {
    
            // 相对根目录
            if (url[0] === '/')
            {
                return root + url;
            }
    
            // 相对当前目录
            url = (base[base.length - 1] === '/' ? base : base + '/') + url;
            
            while (true)
            {
                base = url.replace(/[^/]*\/\.\.\//, '');
                
                if (base === url)
                {
                    break;
                }
                
                url = base;
            }
            
            return url.replace(/[.]+\//g, '');
        }


        function ajax(url) {

            var xhr = new XMLHttpRequest(),
                text;
                            
            xhr.open('GET', url, false);
    
            xhr.onreadystatechange = function () {
    
                if (this.readyState === 4)
                {
                    if (this.status < 300)
                    {
                        text = this.responseText;
                    }
                    else
                    {
                        throw this.statusText;
                    }
                    
                    this.onreadystatechange = null;
                }
            }
    
            xhr.send(null);

            return text;
        }


        function loadJs(text, url, flags) {

            var module = { exports: {} };
    
            if (text)
            {
                text = text + '\n//# sourceURL=' + url;
    
                // 全局执行
                if (flags === false)
                {
                    eval.call(self, module.exports.text = text);
                }
                else
                {
                    new Function(['require', 'exports', 'module'], text)(
                        factory(url.substring(0, url.lastIndexOf('/') + 1)),
                        module.exports,
                        module);
                }
            }
    
            return module;
        }


        function execute(url, ext, flags) {

            var text = ajax(url);

            switch (ext)
            {
                case '.js':
                    return loadJs(text, url, flags);

                case '.json':
                    text = text ? JSON.parse(text) : null;
                    return { exports: text };

                default:
                    return { exports: text };
            }
        }

        
        function factory(base) {

            function require(url, flags) {
    
                return global.load(require.baseURL, url, flags);
            }
    
            require.baseURL = base;
            return require;
        }


        global.load = function (base, url, flags) {

            var ext = url.match(/\.\w+$/),
                any;

            if (ext)
            {
                ext = ext[0].toLowerCase();
            }
            else
            {
                url += '.js';
                ext = '.js';
            }

            url = absolute(base, url);

            if (any = modules[url])
            {
                return any.exports;
            }

            return (modules[url] = execute(url, ext, flags)).exports;
        }


        return global;

    };


    inject = inject.substring(inject.indexOf('{') + 1);
    inject = inject.substring(0, inject.lastIndexOf('}'));


    

    function Thread(root, base, url) {

        var list = ['var require = function (self, root, base) {\n', 
            inject, 
            '\n}(self, "', 
                root[root.length - 1] !== '/' ? root : root.slice(0, -1),  '", "', 
                base,
            '");\n\n\n\n\n'];

        if (typeof url === 'string')
        {
            list.push('require("' + url + '", false);');
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



    require.Thread = Thread;
    


})();
