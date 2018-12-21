window.require || (function () {



	// 已加载缓存集合
	var modules = Object.create(null);

    // 已加载的多语言资源
    var languages = Object.create(null);

    // 内联的模块集合
    var inlines = Object.create(null);


    // 全局require
    var global;




    function factory(base) {

        var last = base.length - 1;

        function require(url, cmd) {

            return execute(require.baseURL, url, cmd);
        }

        if (base[last] === '/')
        {
            base = base.substring(0, last);
        }

        require.baseURL = base;

        return require;
    }



    function execute(base, url, cmd) {

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

        if (any = modules[url])
        {
            return any.exports;
        }

        if (url.indexOf('{{language}}') >= 0)
        {
            languages[url] = ext;
            return load(url, ext, cmd, url.replace('{{language}}', yaxi.language));
        }
        
        return load(url, ext, cmd);
    }

    
	function absouteUrl(base, url) {
		
		var base;
		
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


    function load(url, ext, cmd, path) {

        var text = inlines[path || url] || ajax(path || url);
		
		switch (ext)
		{
			case '.css':
                modules[url] = loadCss(text);
                return true;

			case '.js':
                return (modules[url] = loadJs(text, path || url, cmd)).exports;

            case '.json':
                text = text ? JSON.parse(text) : null;
                modules[url] = { exports: text };
                return text;

			default:
                modules[url] = { exports: text };
                return text;
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

        return { exports: true };
	}


	function loadJs(text, url, cmd) {

        var module = { exports: {} };

        if (text)
        {
            text = text + '\r\n//# sourceURL=' + url;

            if (cmd === false)
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




    global = window.require = factory(location.href.substring(0, location.href.lastIndexOf('/')));
    

    global.execute = execute;


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

    
    
    // 定义window模块
    global.define = function (name, text) {

        
    }



})();
