var jiac = Object.create(null);


(function (jiac) {



    // 全局require
    var global = window.require = factory(location.href.substring(0, location.href.lastIndexOf('/')));

	// 模块缓存
	var modules = jiac.modules = Object.create(null);

    // 源代码缓存
    var sources = jiac.sources = Object.create(null);

    // 多语言缓存
    var languages = jiac.languages = Object.create(null);

    // 文件对应版本号
    var versions = jiac.versions = Object.create(null);

    // 相对url缓存
    var urls = Object.create(null);

    // 扩展名缓存
    var exts = Object.create(null);



    function factory(base) {

        function require(url, flags) {

            return jiac.loadModule(require.base, url, flags);
        }

        require.base = require.baseURL = base;
        require.runAsThread = runAsThread;

        return require;
    }


    // 作为线程运行
    function runAsThread(fn) {

        return new jiac.Thread(global.base, this.base, fn);
    }


    function execute(url, ext, flags) {

        var text = sources[url] || ajax(url);
		
		switch (ext)
		{
            case '.css':
                loadCss(text);
                return { exports: text };

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

                if (/^\s*</.test(text))
                {
                    text = jiac.template(text);
                }

                return { exports: template(url, text) };

			default:
                return { exports: text };
		}
    }

    function template(url, text) {

        var array = ['var __dirname = "' + url.substring(0, url.lastIndexOf('/') + 1) + '";\n',
            'var __k = jiac.classes;\n',
            'var color = jiac.color;\n\n',
            'with(data)\n{\n',
            'return ',
            text,
            '\n}\n\n//# sourceURL=', url
        ];

        return new Function('data', array.join(''));
    }


    function ajax(url) {

        var xhr = new XMLHttpRequest(),
            version = versions[url],
            text;

        if (!version)
        {
            version = [
                Math.random(),
                Math.random()
            ].join("").replace(/0./g, '')
        }

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
                    throw this.statusText;
                }
                
                this.onreadystatechange = null;
            }
        }

        xhr.send(null);

        return text;
    }


	function loadCss(text) {

        var dom = document.createElement('style'),
            color = jiac.color;  
			
        dom.setAttribute('type', 'text/css');  

        text = text.replace(/@([\w-]+)/g, function (text, key) {

            return color && color[key] || text;
        });
    
        if (dom.styleSheet) // IE  
        {
            dom.styleSheet.cssText = text;  
        }
        else // w3c  
        {
            dom.appendChild(document.createTextNode(text));  
        }
    
        document.head.appendChild(dom);
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
                new Function(['require', 'exports', 'module', 'modules'], text)(
                    factory(url.substring(0, url.lastIndexOf('/') + 1)),
                    module.exports,
                    module,
                    modules);
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


    // 相对路径转绝对路径
    jiac.absoluteUrl = absolute;

    
    // 加载模块
    jiac.loadModule = function (base, url, flags) {

        var ext = exts[url],
            any;

        if (ext)
        {
            url = ext[1];
            ext = ext[0];
        }
        else
        {
            if (ext = url.match(/\.\w+$/))
            {
                exts[url] = [ext = ext[0].toLowerCase(), url];
            }
            else
            {
                exts[url] = [ext = '.js', url += '.js'];
            }
        }

        url = absolute(base, url);

        if (any = modules[url])
        {
            return any.exports;
        }

        if (url.indexOf('{{language}}') >= 0)
        {
            languages[url] = ext;
            any = url.replace('{{language}}', jiac.language);
        }
        else
        {
            any = url;
        }

        return (modules[url] = execute(any, ext, flags)).exports;
    }


    // 缓存源代码
    jiac.cache = function (url, text) {

        if (text && typeof text === 'string')
        {
            sources[absolute(global.base, url)] = text;
        }
    }
    
    
    // 当前语言
    jiac.language = navigator.language || navigator.userLanguage || 'en-US';


    // 切换语言
    jiac.switchLanguage = function (language) {

        jiac.language = language;
        jiac.i18n = languages[language] || languages['en-US'];

        for (var key in languages)
        {
            var url = key.replace('{{language}}', language),
                data = sources[url] || ajax(url);

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



})(jiac);

jiac.Thread = (function () {



    var seed = 1;

    var versions;



    var inject = '' + function () {


        // 全局变量
        var jiac = Object.create(null);


        // 全局require
        var global = jiac.require = factory(base);

        

        // 模块缓存
        var modules = jiac.modules = Object.create(null);

        // 相对url缓存
        var urls = Object.create(null);

        // 扩展名缓存
        var exts = Object.create(null);


        // 源代码缓存
        var sources = Object.create(null);



        // 传入的版本号
        versions = versions ? JSON.parse(versions) : {};

        

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


        function load(base, url, flags) {

            var ext = exts[url],
                any;

            if (ext)
            {
                url = ext[1];
                ext = ext[0];
            }
            else
            {
                if (ext = url.match(/\.\w+$/))
                {
                    exts[url] = [ext = ext[0].toLowerCase(), url];
                }
                else
                {
                    exts[url] = [ext = '.js', url += '.js'];
                }
            }

            url = absolute(base, url);

            if (any = modules[url])
            {
                return any.exports;
            }

            return (modules[url] = execute(url, ext, flags)).exports;
        }


        function ajax(url) {

            var xhr = new XMLHttpRequest(),
                version = versions[url],
                text;

            if (!version)
            {
                version = [
                    Math.random(),
                    Math.random()
                ].join("").replace(/0./g, '')
            }
                            
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
                    new Function(['require', 'exports', 'module', 'modules'], text)(
                        factory(url.substring(0, url.lastIndexOf('/') + 1)),
                        module.exports,
                        module,
                        modules);
                }
            }
    
            return module;
        }


        function execute(url, ext, flags) {

            var text = sources[url] || ajax(url);

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
    
                return load(require.base, url, flags);
            }
    
            require.base = require.baseURL = base;
            return require;
        }


        // 缓存源代码
        jiac.cache = function (url, text) {

            if (text && typeof text === 'string')
            {
                sources[absolute(global.base, url)] = text;
            }
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

        var list = ['var require = function (self, root, base, versions) {\n',
            inject, 
            '\n}(self, "', 
                root[root.length - 1] !== '/' ? root : root.slice(0, -1),  '", "', 
                base, '", "',
                versions || (versions = JSON.stringify(jiac.versions)),
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



    return Thread;
    


})();

;(function () {




    function parse(array, node, space) {

        var attributes = node.attributes,
            tagName = node.tagName,
            item,
            name,
            value,
            bindings,
            styles,
            events,
            any;

        switch (tagName)
        {
            case 'R':
            case 'Ref':
            case 'Require':
            case 'Reference':
                array.push(space, '"Class": jiac.loadModule(__dirname, "', node.getAttribute('src'), '")');
                node.removeAttribute('src');
                break;

            case 'HTML':
            case 'HtmlControl':
                array.push(space, '"Class": __k.HtmlControl,\n');
                array.push(space, '"html": \'', (node.innerHTML || node.textContent).replace(/[\r\n]\s*/g, '').replace(/'/g, '\\\''), '\'');
                node = null;
                break;

            default:
                array.push(space, '"Class": __k.', tagName);
                break;
        }

        if (attributes && attributes[0])
        {
            for (var i = 0, l = attributes.length; i < l; i++)
            {
                item = attributes[i];
                name = item.nodeName;
                value = item.nodeValue;

                if (name === 'style')
                {
                    parseStyle(styles || (styles = []), value, space + '\t');
                    continue;
                }
                
                if (name[1] === '-')
                {
                    any = name[0];
                    name = name.substring(2);

                    // 传入的数据
                    if (any === 'd')
                    {
                        array.push(',\n', space, '"', name, '": ', value);
                        continue;
                    }

                    // 绑定
                    if (any === 'b')
                    {
                        if (bindings)
                        {
                            bindings.push(name, value);
                        }
                        else
                        {
                            bindings = [name, value];
                        }
                        
                        continue;
                    }

                    // 事件
                    if (any === 'e')
                    {
                        if (events)
                        {
                            events.push(name, value);
                        }
                        else
                        {
                            events = [name, value];
                        }

                        continue;
                    }
                }

                array.push(',\n', space, '"', name, '": "', value, '"');
            }

            if (styles)
            {
                array.push(',\n', space, '"style": {', styles.join(''));

                if (any = styles.bindings)
                {
                    array.push(styles[0] ? ',\n' : '', space, '\t"bindings": {\n', any.join(''), '\n', space, '\t}');
                }
                
                array.push('\n', space, '}');
            }

            if (bindings)
            {
                array.push(',\n', space, '"bindings": {');
                writeBindings(array, bindings, space + '\t');
                array.push('\n', space, '}');
            }

            if (events)
            {
                array.push(',\n', space, '"events": {');
                writeEvents(array, events, space + '\t');
                array.push('\n', space, '}');
            }
        }

        if (node && (node = node.firstChild))
        {
            if (tagName === 'Repeater')
            {
                parseTemplate(array, node, space);
            }
            else
            {
                parseChildren(array, node, space);
            }
        }
    }


    function parseTemplate(array, node, space) {

        do
        {
            if (node.nodeType === 1)
            {
                array.push(',\n', space, '\ttemplate: {\n');

                parse(array, node, space + '\t\t');

                array.push('\n', space, '\t}');

                return;
            }
        }
        while (node = node.nextSibling);
    }


    function parseChildren(array, node, space) {

        var flag;

        do
        {
            if (node.nodeType === 1)
            {
                if (flag)
                {
                    array.push(',');
                }
                else
                {
                    array.push(',\n', space, '"children": [');
                    flag = 1;
                }

                array.push('\n', space, '\t{\n');

                parse(array, node, space + '\t\t');

                array.push('\n', space, '\t}');
            }
        }
        while (node = node.nextSibling);

        if (flag)
        {
            array.push('\n', space, ']');
        }
    }


    function parseStyle(array, text, space) {

        var tokens = text.split(';'),
            token,
            index,
            name,
            flag;

        for (var i = 0, l = tokens.length; i < l; i++)
        {
            if ((token = tokens[i]) && (index = token.indexOf(':')) > 0)
            {
                name = token.substring(0, index);
               
                if (!(token = token.substring(index + 1)))
                {
                    continue;
                }

                if (flag)
                {
                    array.push(',');
                }
                else
                {
                    flag = 1;
                }

                array.push('\n', space, '"', name, '": ', '"' + token + '"');
            }
        }
    }


    function writeBindings(array, bindings, space) {

        var index = 0,
            name;

        while (name = bindings[index++])
        {
            if (index > 1)
            {
                array.push(',');
            }

            array.push('\n', space, '"', name, '": "', bindings[index++], '"');
        }
    }


    function writeEvents(array, events, space) {

        var index = 0,
            name;

        while (name = events[index++])
        {
            if (index > 1)
            {
                array.push(',');
            }

            array.push('\n', space, '"', name, '": data.', events[index++]);
        }
    }



    
    jiac.template = function (text) {

        var node = new DOMParser().parseFromString(text, 'text/xml').documentElement,
            array = ['{\n'];

        parse(array, node, '\t');

        array.push('\n};');

        return array.join('');
    }



})();
