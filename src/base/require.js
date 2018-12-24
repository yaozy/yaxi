window.require || (function () {



    // 全局require
    var global = window.require = factory(location.href.substring(0, location.href.lastIndexOf('/')));


	// 已加载缓存集合
	var modules = global.modules = Object.create(null);

    // 已加载的多语言资源
    var languages = global.languages = Object.create(null);

    // 文件集合
    var files = global.files = Object.create(null);




    function factory(base) {

        var last = base.length - 1;

        function require(url, flags) {

            return load(require.baseURL, url, flags);
        }

        if (base[last] === '/')
        {
            base = base.substring(0, last);
        }

        require.baseURL = base;
        require.worker = worker;

        return require;
    }


    
    // 创建webworker工作线程
    function worker(files, fn) {

        return new WebWorker(this.baseURL, files, fn);
    }



    function load(base, url, flags) {

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

        url = url[0] === '/' ? global.baseURL + url : absouteUrl(base, url);

        if (flags !== 'content' && (any = modules[url]))
        {
            return any.exports;
        }

        if (url.indexOf('{{language}}') >= 0)
        {
            languages[url] = ext;
            any = url.replace('{{language}}', yaxi.language);
        }
        else
        {
            any = url;
        }

        switch (flags)
        {
            case 'content':
                return files[any] || ajax(any);

            default:
                return execute(url, ext, flags, any);
        }
    }

    
	function absouteUrl(base, url) {
		
		url = base + '/' + url;
		
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


    function execute(url, ext, flags, file) {

        var text = files[file] || ajax(file);
		
		switch (ext)
		{
			case '.css':
                modules[url] = loadCss(text);
                return true;

			case '.js':
                return (modules[url] = loadJs(text, file, flags)).exports;

            case '.json':
                text = text ? JSON.parse(text) : null;
                modules[url] = { exports: text };
                return text;

			default:
                modules[url] = { exports: text };
                return text;
		}
    }


    function ajax(file) {

        var xhr = new XMLHttpRequest(),
            text;
						
		xhr.open('GET', file, false);

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

        return files[file] = text;
    }


	function loadCss(text) {

        var dom = document.createElement('style');  
			
        dom.setAttribute('type', 'text/css');  
    
        if (dom.styleSheet) // IE  
        {
            dom.styleSheet.cssText = text;  
        }
        else // w3c  
        {
            dom.appendChild(document.createTextNode(text));  
        }
    
        document.head.appendChild(dom);

        return { exports: true };
	}


	function loadJs(text, url, flags) {

        var module = { exports: {} };

        if (text)
        {
            text = text + '\r\n//# sourceURL=' + url;

            if (flags === false)
            {
                eval.call(window, text);
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
    


    function mixin(target, source) {

        var value;

        for (var key in source)
        {
            if ((value = source[key]) && typeof value === 'object')
            {
                mixin(target[key] || (target[key] = {}), value);
            }
            else
            {
                target[key] = value;
            }
        }
    }



    global.load = load;


    global.switchLanguage = function (language) {

        yaxi.language = language;

        for (var key in languages)
        {
            var url = key.replace('{{language}}', language),
                data = ajax(url);

            switch (languages[key])
            {
                case '.js':
                    data = loadJs(data, url).exports;
                    break;

                case '.json':
                    data = data ? JSON.parse(text) : null;
                    break;
            }

            mixin(modules[key].exports, data);
        }
    }




    
    var seed = 1;


    var code = '(' + (function (self) {

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

                            _(uuid, value, e);
                        });

                        fn.apply(target, list);
                    }
                    else
                    {
                        try
                        {
                            _(uuid, fn.apply(target, list));
                        }
                        catch (e)
                        {
                            _(uuid, null, e);
                        }
                    }
                }
                else
                {
                    _(uuid, null, 'not support method "' + method + '"!');
                }
            }
            catch (e)
            {
                _(uuid, null, e);
            }
        });

        
        function _(uuid, value, e) {

            self.postMessage(JSON.stringify([uuid, value, e]));
        }


    }) + ')(this);\n\n\n\n\n\n';

    

    function WebWorker(base, files, fn) {

        var list = [code];

        for (var key in files)
        {
            var text = load(base, key, 'content');

            if (files[key])
            {
                list.push('var ', files[key], ' = (function (require, module, exports) {\nexports = moudle.exports = {};\n\n\n\n',
                        text,
                    'return module;\n\n\n\n})(function () { throw "Can not use require in require.worker!" }, {});');
            }
            else
            {
                list.push(text);
            }
        }

        if (fn)
        {
            if (typeof fn === 'function')
            {
                fn = '\n\n\n\n\n\n;(' + fn + ').call(this, this);';
            }

            list.push(fn);
        }

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


    WebWorker.prototype.exec = function (method, args, callback, async) {

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


    WebWorker.prototype.terminate = function () {

        this.worker.terminate();
    }



})();
