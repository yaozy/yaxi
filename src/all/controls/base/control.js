yaxi.Control = Object.extend.call({}, function (Class, base) {



    var create = Object.create;


    var eventTarget = yaxi.EventTarget.prototype;



    // 注册的控件类集合
    var classes = yaxi.classes;


    
    // 补丁集合
    var patches = yaxi.__patches = [];


    // 渲染前处理集合
    var renderings = [];


    // 渲染后处理集合
    var rendereds = [];


    // 调度器
    var schedule = 0;



    // 注册补丁
    var patch = yaxi.patch = function (control) {

        var parent;

        control.__dirty = true;

        while (parent = control.parent)
        {
            if (parent.__dirty)
            {
                return;
            }

            parent.__dirty = true;
            control = parent;
        }
        if (!control.index) debugger
        patches.push(control);

        if (!schedule)
        {
            schedule = setTimeout(update, 0);
        }
    }


    // 更新补丁
    function update() {

        yaxi.trigger('yaxi-page-patch', patches);
        schedule = patches.length = 0;
    }


    // 通知更新
    yaxi.__notify_update = function (before) {

        var list = before ? renderings : rendereds;
        var index = 0;
        var fn;

        while (fn = list[index++])
        {
            fn.apply(list[index++], list[index++]);
        }

        list.length = 0;
    }


    // 注册渲染前事件
    this.bindBeforeRender = function (fn, args) {

        renderings.push(fn, this, args);
    } 


    // 注册渲染后事件
    this.bindAfterRender = function (fn, args) {

        rendereds.push(fn, this, args);
    }


    
    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$converter = create(null);


    // 不转换Class
    this.$converter.Class = false;


    // 混入存储器(h5用来放置自定义渲染逻辑)
    this.$mixin = create(null);



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
                this.__dirty || patch(this);
            }

        } : function (value) {

            this.$storage[name] = converter.call(this, value);
        }

    });




    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls = create(null);


    // 控件唯一id
    this.$property('uuid', {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });



    // id
    this.$property('id', '', true);


    // 默认class
    this.$class = 'yx-control';


    // class
    this.$property('class', {

        defaultValue: '',

        converter: function (value) {

            if (value)
            {
                this.__class = value = ('' + value).split(/\s+/);
                return value.join(' ');
            }

            this.__class = null;
            return '';
        }

    }, true, 'className');

    
    function change(target, name, value) {

        var changes;

        if (changes = target.__changes)
        {
            changes[name] = value;
        }
        else
        {
            (target.__changes = {})[name] = value;
            target.__dirty || patch(target);
        }
    }


    this.hasClass = function (name) {

        if (name)
        {
            var keys = this.__class;
            return keys ? keys.indexOf(name) >= 0 : false;
        }
        
        return false;
    }


    this.addClass = function (name) {

        var keys;

        if (name && name.search(/\s+/) < 0)
        {
            if (keys = this.__class)
            {
                if (keys.indexOf(name) >= 0)
                {
                    return;
                }

                keys.push(name);
            }
            else
            {
                keys = this.__class = [name];
            }

            change(this, 'class', keys.join(' '));
        }
        else
        {
            throw 'class not null or space';
        }
    }


    this.removeClass = function (name) {

        if (name)
        {
            var keys = this.__class;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);
                change(this, 'class', keys.join(' '));
            }
        }
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var keys = this.__class;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);
                change(this, 'class', keys.join(' '));
            }
            else
            {
                this.addClass(name);
            }
        }
    }
    
    

    // 样式
    this.$property('style', {

        defaultValue: '',

        converter: function (value) {

            if (value)
            {
                value = ('' + value).match(/[:;]|[^:;\s]+/g);

                if (value[value.length - 1] !== ';')
                {
                    value.push(';');
                }

                return (this.__style = value).join('');
            }

            this.__style = null;
            return '';
        }
    });



    this.setStyle = function (name, value) {

        var style, index;

        if (name)
        {
            if (style = this.__style)
            {
                if ((index = style.indexOf(name)) >= 0)
                {
                    style.splice(index, style.indexOf(';', index) - index + 1);
                }
                else
                {
                    style.push(name, ':', value, ';');
                }
            }
            else if (value)
            {
                style = this.__style = [name, ':', value, ';'];
            }

            change(this, 'style', style.join(''));
        }
    }


    this.removeStyle = function (name) {

        var style, index;

        if (name && (style = this.__style) && (index = style.indexOf(name)) >= 0)
        {
            style.splice(index, style.indexOf(';', index) - index + 1);
            change(this, 'style', style.join(''));
        }
    }


    
    // 控件风格
    this.$property('theme', '');
    

    // 是否可见
    this.$property('visible', true);


    // 是否禁用
    this.$property('disabled', false);


    // 是否选中
    this.$property('selected', false);


    // 选中时状态
    this.$property('selectedStatus', null, false, 'selected-status');
    

    // 自定义key
    this.$property('key', '', false);
    

    // 自定义tag
    this.$property('tag', null, false);




    // 父控件
    this.parent = null;


    // 检查父控件(默认允许任意容器控件)
    this.checkParent = true;


    // 顶级控件
    this.$property('root', {

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



    // 赋值
    this.assign = function (values) {

        if (values)
        {
            var converters = this.$converter,
                converter,
                changes,
                any;

            // 优先处理模型
            if (any = values.model)
            {
                this.model = any;
            }

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
                    else if (any = converter.name) // 默认转换器
                    {
                        this.$storage[any] = converter.fn.call(this, values[name]);
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
        }

        return this;
    }
    


    // 扩展查找实现
    yaxi.impl.find.call(this);
    

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

        if (any = this.__uuid)
        {
            delete controls[any];
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

        if (this.__event_keys)
        {
            this.off();
        }

        if (any = this.$view)
        {
            this.destroyView(any);
            this.$view = null;
        }
        
        if (this.ondestroy)
        {
            this.ondestroy();
        }

        this.parent = this.__binding_push = null;
    }


    this.destroyView = function (view) {
    }



    
    this.__class_init = function (Class) {

        Class.register = register;
        Class.allowParent = true;

        this.$defaults = create(this.$defaults);
        this.$converter = create(this.$converter);
        this.$mixin = create(this.$mixin);
    }



    classes[Class.typeName = this.typeName = 'Control'] = Class;

    
    function register(name) {

        if (name)
        {
            var prototype = this.prototype;

            classes[this.typeName = prototype.typeName = name] = this;
            prototype.$class = prototype.$class + ' yx-' + name.toLowerCase();
        }

        return this;
    }


    // 默认允许任意类型父控件
    Class.allowParent = true;



    
    var message1 = ' can not be a sub type';

    var message2 = ' can not be null!';
    

    // 检查父控件
    yaxi.__check_parent = function (Class, parent) {

        var check;

        if (!Class)
        {
            throw 'Class' + message2;
        }

        if (!parent)
        {
            throw 'parent' + message2;
        }

        if (check = Class.allowParent)
        {
            if (check !== true && !check(parent))
            {
                throw Class.typeName + message1 + ' of ' + parent.typeName + '!';
            }
        }
        else if (check = Class.typeName)
        {
            throw check + message1 + '!';
        }
        else
        {
            throw JSON.stringify(Class).substring(0, 20) + '... not a valid type!';
        }
    }



}, function Control() {
 
    var init;

    this.$storage = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});
