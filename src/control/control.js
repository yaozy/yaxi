yaxi.Control = yaxi.Observe.extend(function (Class, base) {



    var create = Object.create;

    var patch = yaxi.__observe_patch;

    
    var eventTarget = yaxi.EventTarget.prototype;

    // 注册的控件类集合
    var classes = yaxi.classes = create(null);


    var host = yaxi.__dom_host = document.createElement('div');

    host.className = 'yx-host';

    if (document.body)
    {
        document.body.appendChild(host);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', function () {

            document.body.appendChild(host);
        });
    }



    Class.register = function (name) {

        if (name)
        {
            classes[this.typeName = this.prototype.typeName = name] = this;
        }

        return this;
    }


    
    
    // 定义属性
    this.$property = yaxi.impl.properties(function (name, change) {

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
            else if (this.$dom)
            {
                if (value !== storage[name])
                {
                    patch(this)[name] = value;
                    storage[name] = value;
                }
            }
            else
            {
                storage[name] = value;
            }

        } : function (value) {

            this.$storage[name] = converter.call(this, value);
        }

    });



    // id
    this.$property('id', '');

    
    // 风格
    this.$property('theme', '');
    

    // class
    this.$property('className', '');


    // 是否禁用
    this.$property('disabled', false);
    

    // 语言
    this.$property('lang', '');
    

    // title
    this.$property('title', '');
    

    // accessKey
    this.$property('accessKey', '');
    

    // alt
    this.$property('alt', '');


    // 绑定的url
    this.$property('url', '', false);


    // 打开url时的参数
    this.$property('args', null, false);
    

    // 自定义key
    this.$property('key', '', false);
    

    // 自定义tag
    this.$property('tag', null, false);



    // 线条 top|left|right|bottom
    this.$property('line', '');


    // svg填充色
    this.$property('fill', '');


    // 绝对定位设置
    this.$property('absolute', '');


    // 布局权重(仅在父容器layout === row || column时有效)
    this.$property('weight', {
     
        defaultValue: 0,

        converter: function (value) {

            return (value = +value) > 0 ? value : 0;
        }

    }, false);




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



    Object.defineProperty(this, 'offsetTop', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetTop: 0;
        }
    });


    Object.defineProperty(this, 'offsetLeft', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetLeft: 0;
        }
    });


    Object.defineProperty(this, 'offsetWidth', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetWidth: 0;
        }
    });


    Object.defineProperty(this, 'offsetHeight', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetHeight: 0;
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

        var dom = this.$dom || (this.$dom = this.$template.cloneNode(true)),
            any;

        dom.$control = this;

        if (this.__changes)
        {
            this.__update_patch();
        }

        if (any = this.__style)
        {
            any.__update_patch();
        }

        if (any = this.__events)
        {
            any.__update_patch();
        }

        return dom;
    }


    // 挂载处理
    this.onmounted = function () {
    }



    this.__update_patch = function () {

        var changes, dom;

        if ((changes = this.__changes) && (dom = this.$dom))
        {
            var storage = this.$storage,
                renderer = this.renderer,
                value,
                fn;

            for (var name in changes)
            {
                storage[name] = value = changes[name];

                if (fn = renderer[name])
                {
                    fn.call(this, dom, value);
                }
                else
                {
                    (renderer[name] = updateDom(name, value)).call(this, dom, value);
                }
            }

            this.__changes = null;
        }
    }

    


    // 更新补丁
    var renderer = this.renderer = create(null);


    renderer.id = function (dom, value) {

        dom.id = value;
    }


    renderer.theme = function (dom, value) {

        dom.setAttribute('theme', value);
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


    renderer.line = function (dom, value) {

        dom.setAttribute('line', value);
    }


    renderer.absolute = function (dom, value) {

        var style = dom.style;

        if (value)
        {
            value = value.split(' ');

            style.position = 'absolute';
            style.top = value[0] || 0;
            style.right = value[1] || 0;
            style.bottom = value[2] || 0;
            style.left = value[3] || 0;
        }
        else
        {
            style.position = '';
        }
    }

    
    renderer.fill = function (dom, value) {

        dom.style.fill = value;
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
