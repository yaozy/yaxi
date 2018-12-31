window.require || (function () {



    // 全局require
    var global = window.require = factory(location.href.substring(0, location.href.lastIndexOf('/')));

	// 已加载缓存集合
	var modules = global.modules = Object.create(null);

    // 已加载的多语言资源
    var languages = global.languages = Object.create(null);

    // 相对url缓存
    var urls = Object.create(null);




    function factory(base) {

        function require(url, flags) {

            return global.load(require.baseURL, url, flags);
        }

        require.baseURL = base;
        require.runAsThread = runAsThread;

        return require;
    }


    // 作为线程运行
    function runAsThread(fn) {

        return new global.Thread(global.baseURL, this.baseURL, fn);
    }


    function execute(url, ext, flags) {

        var text = ajax(url);
		
		switch (ext)
		{
			case '.css':
                return loadCss(text);

			case '.js':
                return loadJs(text, url, flags);

            case '.json':
                text = text ? JSON.parse(text) : null;
                return { exports: text };

            case '.html':
                if (flags === false)
                {
                    return { exports: text };
                }

                return { exports: new Function(['data', 'color', 'classes'], global.template(text, url)) };

			default:
                return { exports: text };
		}
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

        return { exports: text };
	}


	function loadJs(text, url, flags) {

        var module = { exports: {} };

        if (text)
        {
            text = text + '\n//# sourceURL=' + url;

            // 全局执行
            if (flags === false)
            {
                eval.call(window, module.exports.text = text);
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


    function absolute(url) {

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


    global.absoluteUrl = function (base, url) {

        // 相对根目录
        if (url[0] === '/')
        {
            base = global.baseURL;
            return base + (base[base.length - 1] === '/' ? url.substring(1) : url);
        }

        // 相对当前目录
        url = (base[base.length - 1] === '/' ? base : base + '/') + url;

        return urls[url] || (urls[url] = absolute(url));
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

        url = global.absoluteUrl(base, url);

        if (any = modules[url])
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

        return (modules[url] = execute(any, ext, flags)).exports;
    }

    
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



})();
