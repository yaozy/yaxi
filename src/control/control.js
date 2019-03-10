yaxi.Control = Object.extend.call({}, function (Class, base) {



    var create = Object.create;


    var eventTarget = yaxi.EventTarget.prototype;

    // 注册的控件类集合
    var classes = yaxi.classes = create(null);


    // 渲染器
    var renderer = this.renderer = create(null);


    if (typeof jiac !== 'undefined')
    {
        jiac.classes = classes;
    }



    Class.register = function (name) {

        if (name)
        {
            classes[this.typeName = this.prototype.typeName = name] = this;
        }

        return this;
    }


    
    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$converter = create(null);


    // 不转换Class
    this.$converter.Class = false;



    // 标记是否已发生变化
    this.__dirty = true;



    // 定义属性
    this.$property = yaxi.impl.property(function (name, change) {

        return change ? function () {

            var value = this.__changes;
            return value && (value = value[name]) !== void 0 ? value : this.$storage[name];

        } : function () {

            return this.$storage[name];
        }

    }, function (name, converter, change) {

        return change ? function (value) {

            var changes = this.__changes,
                storage = this.$storage;

            value = converter.call(this, value);

            if (changes)
            {
                if (value === changes[name])
                {
                    return;
                }

                if (value !== storage[name])
                {
                    changes[name] = value;
                }
                else
                {
                    delete changes[name];
                }
            }
            else if (value !== storage[name])
            {
                (this.__changes = {})[name] = value;

                if (!this.__dirty)
                {
                    this.$patch();
                }
            }

        } : function (value) {

            this.$storage[name] = converter.call(this, value);
        }

    });



    // 控件风格
    this.$property('theme', '');
    

    // 是否可见
    this.$property('visible', true);


    // 线条 top|left|right|bottom|all
    this.$property('line', '');


    // 绑定的url
    this.$property('url', '', false);


    // 打开url时的参数
    this.$property('args', null, false);
    

    // 自定义key
    this.$property('key', '', false);
    

    // 自定义tag
    this.$property('tag', null, false);



    // id
    this.$property('id', '');


    // className
    this.$property('className', '', true, 'class');


    // 是否禁用
    this.$property('disabled', false);
    

    // 语言
    this.$property('lang', '');
    

    // title
    this.$property('title', '');
    

    // accesskey
    this.$property('accesskey', '');
    

    // alt
    this.$property('alt', '');




    // 样式集
    Object.defineProperty(this, 'style', {

        get: function () {

            return this.__style || (this.__style = new yaxi.Style(this));
        }
    });

    
    this.$converter.style = {
        
        fn: function (values) {
     
            (this.__style = new yaxi.Style(this)).assign(values);
        }
    };


    
    // 读取控件样式值
    function get(name) {

        return function () {
    
            return (this.__changes || this.$storage)[name] || '';
        }
    }


    // 设置控件样式值
    function set(name) {

        return function (value) {
        
            var changes;
    
            value = '' + value;
    
            if (changes = this.__changes)
            {
                if (value === changes[name])
                {
                    return;
                }
    
                if (value !== this.$storage[name])
                {
                    changes[name] = value;
                }
                else
                {
                    delete changes[name];
                }
            }
            else if (value !== this.$storage[name])
            {
                (this.__changes = {})[name] = value;
    
                if (!this.__dirty)
                {
                    this.$patch();
                }
            }
        }
    }


    // 控件样式渲染方法
    function rendererFn(name) {

        return function (dom, value) {

            dom.style[name] = value;
        }
    }


    // 给控件扩展样式属性
    ;(function (list) {

        var define = Object.defineProperty,
            styles = yaxi.styles,
            converter = this.$converter,
            renderer = this.renderer,
            style,
            name,
            key,
            css,
            any;

        for (var i = 0, l = list.length; i < l; i++)
        {
            style = styles[css = list[i]];

            if (style)
            {
                name = style[0];
                key = style[2];
            }
            else
            {
                name = key = css.replace(/-(\w)/g, camelize);
            }

            define(this, name, any = {
                get: get(key),
                set: set(key)
            });

            renderer[name] = rendererFn(key);
            converter[name] = key; // 标记样式转换器

            if (css !== name)
            {
                define(this, css, any);
                converter[css] = key;
            }
        }

        function camelize(_, text) {

            return text.toUpperCase();
        }

    }.call(this, ('animation,animation-delay,animation-direction,animation-duration,animation-fill-mode,animation-iteration-count,animation-name,animation-play-state,animation-timing-function,' +
        'background,background-attachment,background-blend-mode,background-clip,background-color,background-image,background-origin,background-position,background-position-x,background-position-y,background-repeat,background-repeat-y,background-size,' +
        'border,border-width,border-style,border-color,border-radius,border-spacing,border-collapse,' +
        'border-image-outset,border-image-repeat,border-image-slice,border-image-source,border-image-width,' +
        'border-bottom,border-bottom-color,border-bottom-left-radius,border-bottom-right-radius,border-bottom-width,' +
        'border-left,border-left-color,border-left-style,border-left-width,' +
        'border-right,border-right-color,border-right-style,border-right-width,' +
        'border-top,border-top-color,border-top-left-radius,border-top-right-radius,border-top-style,border-top-width,' +
        'bottom,box-shadow,box-sizing,break-after,break-before,break-inside,caret-color,' +
        'clip,clip-path,clip-rule,color,cursor,' + 
        'direction,display,' +
        'fill,fill-opacity,fill-rule,float,' +
        'font,font-display,font-family,font-feature-settings,font-kerning,font-size,font-stretch,font-style,font-variant,font-variant-caps,font-variant-east-asian,font-variant-ligatures,font-variant-numeric,font-variation-settings,font-weight,' +
        'height,' +
        'left,' +
        'line-break,line-height,list-style,list-style-image,list-style-position,list-style-type,' +
        'margin,margin-top,margin-left,margin-right,margin-bottom,' +
        'max-height,max-width,min-height,min-width,' +
        'object-fit,object-position,opacity,' +
        'outline,outline-color,outline-offset,outline-style,outline-width,' +
        'overflow,overflow-x,overflow-y,' +
        'padding,padding-top,padding-right,padding-bottom,padding-left,' +
        'position,' +
        'right,' +
        'speak,' +
        'stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,' +
        'top,' +
        'transform,transform-box,transform-origin,transform-style,transition,transition-delay,transition-duration,transition-property,transition-timing-function,' +
        'text-align,text-align-last,text-anchor,text-combine-upright,text-decoration,text-decoration-color,text-decoration-line,text-decoration-skip-ink,text-decoration-style,text-indent,text-orientation,text-overflow,text-rendering,text-shadow,text-size-adjust,text-transform,text-underline-position,' +
        'user-select,' +
        'vertical-align,visibility,' +
        'white-space,width,word-break,word-spacing,word-wrap,writing-mode,' +
        'z-index,zoom').split(',')));


    
    // 赋值
    this.assign = function (values) {

        var converters = this.$converter,
            converter,
            changes,
            key;

        for (var name in values)
        {
            if (converter = converters[name])
            {
                if (typeof converter === 'string') // 样式属性
                {
                    (changes || (changes = this.__changes = {}))[converter] = '' + values[name];
                }
                else if (converter.change) // 需要处理变化
                {
                    (changes || (changes = this.__changes = {}))[converter.name] = converter.fn.call(this, values[name]);
                }
                else if (key = converter.name) // 默认转换器
                {
                    this.$storage[key] = converter.fn.call(this, values[name]);
                }
                else // 自定义转换器
                {
                    converter.fn.call(this, values[name]);
                }
            }
            else if (converter !== false)
            {
                this[name] = values[name];
            }
        }

        return this;
    }
    
    

    // 扩展绑定实现
    yaxi.impl.binding.call(this);


    // 转换bindings
    this.$converter.bindings = {

        fn: this.__set_bindings
    };


    // 推送绑定
    this.$push = function (value) {

        var binding = this.__binding_push,
            pipe;

        if (binding)
        {
            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            binding.model[binding.name] = value;
        }
    }



    // 父控件
    this.parent = null;


    // 顶级控件
    Object.defineProperty(this, 'root', {

        get: function () {

            var target = this,
                parent;

            while (parent = target.parent)
            {
                target = parent;
            }

            return target;
        }
    });



    this.hasClass = function (name) {

        if (name)
        {
            var className = this.className;
            return className ? className.indexOf(name) >= 0 : false;
        }
        
        return false;
    }


    this.addClass = function (name) {

        if (name)
        {
            var className = this.className;

            if (!className)
            {
                this.className = name;
            }
            else if (className.indexOf(name) < 0)
            {
                this.className = className + ' ' + name;
            }
        }
    }


    this.removeClass = function (name) {

        if (name)
        {
            var className = this.className;

            if (className)
            {
                this.className = className.replace(name, '').replace(/(?:^|\s)\s+|\s$/, '');
            }
        }
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var className = this.className;

            if (className && className.indexOf(name) < 0)
            {
                this.className = className.replace(name, '').replace(/(?:^|\s)\s+|\s$/, '');
            }
            else
            {
                this.className = className + ' ' + name;
            }
        }
    }


    
    // 绑定事件
    this.on = eventTarget.on;

    
    // 绑定只执行一次的事件
    this.once = eventTarget.once;


    // 注销事件
    this.off = eventTarget.off;


    // 触发事件
    this.trigger = eventTarget.trigger;


    // 检测是否注册了指定的事件
    this.hasEvent = eventTarget.hasEvent;




    this.$converter.events = {
        
        fn: function (events) {

            for (var name in events)
            {
                this.on(name, events[name]);
            }
        }
    };




    this.find = function (selector) {

        var tokens = selector && yaxi.Query.parse(selector);
        return tokens ? this.__find(tokens, 0) : null;
    }


    this.__find = function (tokens, index) {
    
        var control;

        switch (tokens[index++])
        {
            case '<':
                control = this.__find_up(tokens[index++], tokens[index++], false);
                break;

            case '<<':
                control = this.__find_up(tokens[index++], tokens[index++], true);
                break;

            case '>':
                control = this.__find_down(tokens[index++], tokens[index++], false);
                break;

            case '>>':
                control = this.__find_down(tokens[index++], tokens[index++], true);
                break;
        }

        if (control)
        {
            return tokens[index] ? control.__find(tokens, index) : control;
        }

        return null;
    }


    this.__find_value = function (key, value) {

        switch (key)
        {
            case '@':
                return this.$storage.key === value;

            case '':
                return this instanceof (classes[value] || Boolean);

            case '#':
                return this.$storage.id === value;

            case '.':
                return (this.$className + ' ' + (this.$storage.className || '') + ' ').indexOf(value + ' ') >= 0;

            default:
                return this[key] === value;
        }
    }


    this.__find_up = function (key, value, deep) {

        var parent = this.parent;

        if (parent)
        {
            if (deep)
            {
                do
                {
                    if (parent.__find_value(key, value))
                    {
                        return parent;
                    }
                }
                while (parent = parent.parent);
            }
            else if (parent.__find_value(key, value))
            {
                return parent;
            }
        }
    }


    this.__find_down = function () {

        return null;
    }



    // 从当前控件开始往上查找存在指定属性名的控件(忽略null或0,false等值)
    this.exists = function (name, to) {

        var target = this;

        while (target && target !== to)
        {
            if (target[name])
            {
                return target;
            }

            target = target.parent;
        }
    }


    // 从当前控件开始往上查找具有指定属性名的属性值(忽略null或0,false等值)
    this.findValue = function (name, to) {
        
        var target = this,
            value;

        while (target && target !== to)
        {
            if (value = target[name])
            {
                return value;
            }

            target = target.parent;
        }
    }


    // 从当前控件开始往上查找key属性值
    this.findKey = function (to) {

        var target = this,
            key;

        while (target && target !== to)
        {
            if (key = target.key)
            {
                return key;
            }

            target = target.parent;
        }

        return '';
    }


    // 从当前控件开始往上查找url属性值
    this.findURL = function (to) {

        var target = this,
            url;

        while (target && target !== to)
        {
            if (url = target.url)
            {
                return url;
            }

            target = target.parent;
        }

        return '';
    }




    this.remove = function () {

        var parent = this.parent,
            children,
            index;

        if (parent && (children = parent.__children) && (index = children.indexOf(this)) >= 0)
        {
            children.splice(index, 1);
        }
    }




    var div = document.createElement('div');



    yaxi.template = function (target, html) {

        var dom;

        if (target && html)
        {
            div.innerHTML = html;

            target.$template = dom = div.firstChild;
            target.$className = dom.className || 'yx-control';

            div.removeChild(dom);
        }
    }


    this.$className = 'yx-control';


	yaxi.template(this, '<div class="yx-control"></div>');



    // 渲染控件
    this.render = function () {

        var dom = this.$dom || (this.$dom = this.$template.cloneNode(true));

        dom.$control = this;
        this.__patch(dom);

        return dom;
    }


    // 挂载处理
    this.onmounted = function () {
    }



    // 补丁集合
    var patches = yaxi.__patches = [];

    // 调度器
    var schedule;


    // 更新补丁
    function update() {

        var list = patches,
            index = 0,
            item,
            any;

        while (item = list[index++])
        {
            if (any = item.$dom)
            {
                item.__patch(any);

                if (any = item.invalidate)
                {
                    any.call(item);
                }
            }
        }

        schedule = patches.length = 0;
    }



    // 注册补丁
    this.$patch = function () {

        var target = this,
            parent;

        this.__dirty = true;

        while (parent = target.parent)
        {
            if (parent.__dirty)
            {
                return;
            }

            parent.__dirty = true;
            target = parent;
        }

        patches.push(target);

        if (!schedule)
        {
            schedule = setTimeout(update, 0);
        }
    }


    this.__patch = function (dom) {

        var changes, value, any;

        this.__dirty = false;

        if ((any = this.__style) && (changes = any.__changes))
        {
            any.__patch(dom, changes);
        }

        if (changes = this.__changes)
        {
            var storage = this.$storage,
                renderer = this.renderer;

            for (var name in changes)
            {
                storage[name] = value = changes[name];

                if (any = renderer[name])
                {
                    any.call(this, dom, value);
                }
                else
                {
                    (renderer[name] = updateDom(name, value)).call(this, dom, value);
                }
            }

            this.__changes = null;
            return changes;
        }
    }



    renderer.theme = function (dom, value) {

        dom.setAttribute('theme', value);
    }


    renderer.visible = function (dom, value) {

        dom.setAttribute('display', value ? '' : 'hidden');
    }


    renderer.line = function (dom, value) {

        if (value)
        {
            var style = dom.style,
                name = (value = value.split(' '))[0];

            dom.setAttribute('line', name);

            if (name === 'all')
            {
                style.borderWidth = value[1] || '1px';
            }
            else
            {
                style['border' + name[0].toUpperCase() + name.substring(1) + 'Width'] = value[1] || '1px';
            }
        }
        else
        {
            dom.style.border = '';
            dom.removeAttribute('line');
        }
    }



    renderer.id = function (dom, value) {

        dom.id = value;
    }


    renderer.className = function (dom, value) {

        dom.className = value ? this.$className + ' ' + value : this.$className;
    }


    renderer.disabled = function (dom, value) {

        if (value)
        {
            dom.setAttribute('disabled', 'disabled');
        }
        else
        {
            dom.removeAttribute('disabled');
        }
    }


    renderer.lang = function (dom, value) {

        dom.setAttribute('lang', value);
    }


    renderer.title = function (dom, value) {

        dom.setAttribute('title', value);
    }


    renderer.accessKey = function (dom, value) {

        dom.setAttribute('accessKey', value);
    }

    
    renderer.alt = function (dom, value) {

        dom.setAttribute('alt', value);
    }



    function updateDom(name, value) {

        return typeof value === 'boolean'
        
            ? function (dom, value) {

                if (value)
                {
                    dom.setAttribute(name, name);
                }
                else
                {
                    dom.removeAttribute(name);
                }

            }
            
            : function (dom, value) {

                dom.setAttribute(name, value);
            }
    }

    
    
    this.destroy = function () {

        var bindings, any;

        if (any = this.$dom)
        {
            any.$control = this.$dom = null;
        }

        if (bindings = this.__bindings)
        {
            this.__bindings = null;

            for (var name in bindings)
            {
                if ((any = bindings[name]) && (any = any.model) && any.__bindings)
                {
                    any.$unbind(bindings[name]);
                }
            }
        }

        if ((any = this.__style) && (bindings = any.__bindings))
        {
            any.__bindings = null;

            for (var name in bindings)
            {
                if ((any = bindings[name]) && (any = any.model))
                {
                    any.$unbind(name, this);
                }
            }
        }

        if (this.__event_keys)
        {
            this.off();
        }
        
        if (this.ondestroy)
        {
            this.ondestroy();
        }

        this.parent = this.__binding_push = null;
        this.destroyed = true;
    }



    
    this.__class_init = function (Class) {

        Class.register = Class.superclass.register;

        this.$defaults = create(this.$defaults);
        this.$converter = create(this.$converter);
        this.renderer = create(this.renderer);
    }



}, function Control() {
 
    var init;

    this.$storage = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Control');
