window.require = window.require || (function () {



	// 已加载缓存集合
	var caches = Object.create(null);

    // 已加载的多语言资源
    var languages = Object.create(null);

	// 基础路径
	var base = location.href.substring(0, location.href.lastIndexOf('/'));




	function absouteUrl(path, url) {
		
		var path;
		
		url = path + url;
		
		while (true)
		{
			path = url.replace(/[^/]*\/\.\.\//, '');
			
			if (path === url)
			{
				break;
			}
			
			url = path;
		}
		
		return url.replace(/[.]+\//g, '');
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

        var module = { exports: {} },
            fn;

        if (text)
        {
            text = text + '\r\n//# sourceURL=' + url;

            if (cmd === false)
            {
                eval.call(window, text);
            }
            else
            {
                url = url.substring(0, url.lastIndexOf('/') + 1);

                fn = require.bind(this, url);
                fn.baseURL = url;

                new Function(['require', 'exports', 'module'], text)(fn, module.exports, module);
            }
        }

		return module;
	}



	function require(path, url, cmd) {
		
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

		url = url[0] === '/' ? base + url : absouteUrl(path || base, url);

		if (any = caches[url])
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


    function load(url, ext, cmd, path) {

        var text = ajax(path || url);
		
		switch (ext)
		{
			case '.css':
                caches[url] = loadCss(text);
                return true;

			case '.js':
                return (caches[url] = loadJs(text, path || url, cmd)).exports;

            case '.json':
                text = text ? JSON.parse(text) : null;
                caches[url] = { exports: text };
                return text;

			default:
                caches[url] = { exports: text };
                return text;
		}
    }




	function requireGlobal(url, cmd) {

		return require(base, url, cmd);
    }



    requireGlobal.fn = require;


    requireGlobal.switchLanguage = function (language) {

        if (language)
        {
            var user = require(base, '/utils/user.js');

            yaxi.language = language;
            
            user.language = language;
            user.save();
        }
        else
        {
            language = yaxi.language;
        }

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

            mixin(caches[key].exports, data);
        }
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



    return requireGlobal;

    

})(window);
