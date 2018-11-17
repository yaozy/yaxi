yaxi.Control = yaxi.Observe.extend(function (Class, base) {


    
    var eventTarget = yaxi.EventTarget.prototype;


    // 注册的控件类集合
    var Controls = yaxi.Controls = Object.create(null);



    
    Class.register = function (name) {

        if (name)
        {
            Controls[this.typeName = this.prototype.typeName = name] = this;
        }

        return this;
    }


    

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
    

    // 自定义key
    this.$property('key', '');
    

    // 自定义tag
    this.$property('tag', null);




    // 样式集
    Object.defineProperty(this, 'style', {

        get: function () {

            return this.__style || (this.__style = new yaxi.Style());
        }
    });

    
    this.__convert_style = [0, function (data) {
     
        this.__style = new yaxi.Style(data);
    }];




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



    this.__set_events = false;


    this.__convert_events = [0, function (events) {

        for (var name in events)
        {
            this.on(name, events[name]);
        }
    }];




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
                return this.key === value;

            case '&':
                return this instanceof (Controls[value] || Boolean);

            case '#':
                return this.id === value;

            case '.':
                return (this.$className + (this.$storage.className || '') + ' ').indexOf(value + ' ') >= 0;
        }

        return false;
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



    this.remove = function () {

        var parent = this.parent,
            children,
            index;

        if (parent && (children = parent.__children) && (index = children.indexOf(this)) >= 0)
        {
            children.splice(index, 1);
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
            for (var name in bindings)
            {
                if ((any = bindings[name]) && (any = any.model))
                {
                    any.$unbind(name, this);
                }
            }
        }

        if (any = this.__style)
        {
            any.parent = null;

            if (bindings = any.__bindings)
            {
                for (var name in bindings)
                {
                    if ((any = bindings[name]) && (any = any.model))
                    {
                        any.$unbind(name, this);
                    }
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

        this.parent = null;
        this.destroyed = true;
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
            any.parent = this;
            any.__update_patch();
        }

        if (any = this.__events)
        {
            any.__update_patch();
        }

        return dom;
    }



    this.__update_patch = function () {

        var changes;

        if (changes = this.__changes)
        {
            var storage = this.$storage,
                dom = this.$dom,
                value,
                fn;

            for (var name in changes)
            {
                storage[name] = value = changes[name];

                if (fn = this['__set_' + name])
                {
                    fn.call(this, dom, value);
                }
                else if (fn !== false)
                {
                    if (name in dom)
                    {
                        (fn = updateDom(name, value)).call(this, dom, value);
                    }
                    else
                    {
                        fn = false;
                    }

                    this.constructor.prototype['__set_' + name] = fn;
                }
            }

            this.__changes = null;
        }
    }

    
    this.__set_key = this.__set_tag = false;


    this.__set_className = function (dom, value) {

        dom.className = value ? this.$className + ' ' + value : this.$className;
    }


    this.__set_theme = function (dom, value) {

        dom.setAttribute('theme', value);
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



}).register('Control');
