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
    this.$converts = create(null);


    // 不转换Class
    this.$converts.Class = false;


    // 混入存储器(h5用来放置自定义渲染逻辑)
    this.$mixin = create(null);



    // 标记是否已发生变化
    this.__dirty = true;




    // 扩展属性实现
    this.$property = yaxi.impl.property();



    // 构建会造成class变更的属性
    function build_set_class(name, boolean, prefix) {

        return function (value) {

            var storage = this.$storage;
            var list, className;

            value = boolean ? !!value : '' + value;

            if (value !== storage[name])
            {
                storage[name] = value;
                className = value === true ? prefix : prefix + value;

                if (list = this.__class_data)
                {
                    for (var i = list.length; i--;)
                    {
                        if (list[i].indexOf(prefix) === 0)
                        {
                            if (value)
                            {
                                list[i] = className;
                            }
                            else
                            {
                                list.splice(i, 1);
                            }
                            
                            value = 0;
                            break;
                        }
                    }

                    if (value)
                    {
                        list.push(className);
                    }
                }
                else if (value)
                {
                    this.__class_data = [className];
                }

                this.__class_dirty = true;
                this.__dirty || patch(this);
            }
        }
    }


    // 构建触发变更通知的属性
    function build_set_change(name, convert) {

        return function (value) {

            var storage = this.$storage;
            var changes;

            value = convert ? convert.call(this, value) : value;

            if (changes = this.__changes)
            {
                if (value !== changes[name])
                {
                    if (value !== storage[name])
                    {
                        changes[name] = value;
                    }
                    else
                    {
                        delete changes[name];
                    }
                }
            }
            else if (value !== storage[name])
            {
                (this.__changes = {})[name] = value;
                this.__dirty || patch(this);
            }
        }
    }


    // 构建不触发变更通知的属性
    function build_set_unchange(name, convert) {

        return function (value) {

            this.$storage[name] = convert ? convert.call(this, value) : value;
        }
    }

    
    this.__build_get = function (name, options) {

        return options.change && !options.class ? function () {

            var value = this.__changes;
            return value && (value = value[name]) !== void 0 ? value : this.$storage[name];

        } : function () {

            return this.$storage[name];
        }
    }


    this.__build_set = function (name, options) {

        var value;

        // 造成class变更的属性
        if (value = options.class)
        {
            // 不支持触发自身变更通知
            options.change = false;

            // 不支持转换器
            options.convert = false;

            return build_set_class(name, options.type === 'boolean', value);
        }

        return (options.change ? build_set_change : build_set_unchange)(name, options.convert);
    }

    


    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls = create(null);


    // 控件唯一id
    this.$property('uuid', 0, {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });



    // id
    this.$property('id', '');


    // 默认class
    this.$class = 'yx-control';


    // class
    this.$property('class', '', {

        change: false,

        alias: 'className',

        get: function () {

            return this.$storage.class;
        },

        set: function (value) {

            var storage = this.$storage;

            value = '' + value;

            if (storage.class !== value)
            {
                storage.class = value;

                this.__class_list = value ? value.split(/\s+/) : [];
                this.__class_dirty = true;
                this.__dirty || patch(this);
            }
        }
    });




    this.hasClass = function (name) {

        if (name)
        {
            var keys = this.__class_list;
            return keys ? keys.indexOf(name) >= 0 : false;
        }
        
        return false;
    }


    this.addClass = function (name) {

        var keys;

        if (name && name.search(/\s+/) < 0)
        {
            if (keys = this.__class_list)
            {
                if (keys.indexOf(name) < 0)
                {
                    keys.push(name);
                }
            }
            else
            {
                this.__class_list = [name];
            }

            this.__class_dirty = true;
            this.__dirty || patch(this);
        }
        else
        {
            throw 'class not null or space';
        }
    }


    this.removeClass = function (name) {

        if (name)
        {
            var keys = this.__class_list;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);

                this.__class_dirty = true;
                this.__dirty || patch(this);
            }
        }
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var keys = this.__class_list;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);
            }
            else
            {
                this.addClass(name);
            }

            this.__class_dirty = true;
            this.__dirty || patch(this);
        }
    }
    
    

    // 样式
    this.$property('style', '', {

        change: false,

        get: function () {

            var style = this.__style;
            return style ? style.join('') : '';
        },

        set: function (value) {

            if (value = '' + value)
            {
                value = value.match(/[:;]|[^:;\s]+/g);

                if (value[value.length - 1] !== ';')
                {
                    value.push(';');
                }
            }
            else
            {
                value = null;
            }
            
            this.__style = value;
            this.__style_dirty = true;
            this.__dirty || patch(this);
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
                this.__style = [name, ':', value, ';'];
            }

            this.__style_dirty = true;
            this.__dirty || patch(this);
        }
    }


    this.removeStyle = function (name) {

        var style, index;

        if (name && (style = this.__style) && (index = style.indexOf(name)) >= 0)
        {
            style.splice(index, style.indexOf(';', index) - index + 1);

            this.__style_dirty = true;
            this.__dirty || patch(this);
        }
    }


    
    // 控件风格
    this.$property('theme', '', {

        class: 'yx-theme-'
    });
    

    // 是否隐藏
    this.$property('hidden', false, {

        type: 'boolean',
        class: 'yx-hidden'
    });


    // 是否禁用
    this.$property('disabled', false);


    // 是否选中
    this.$property('selected', false, {

        change: false,

        get: function () {

            return this.__selected || false;
        },

        set: function (value) {

            if ((value = !!value) !== this.__selected)
            {
                // 从不选中状态切换到选中有选中状态值时则切换状态
                if (value && (value = this.__selected_status))
                {
                    changeSelectedStatus(this, value);
                }
                else if (this.__save_status) // 有保存的状态时清空
                {
                    changeSelectedStatus(this);
                }
            }
        }
    });


    // 选中时状态
    this.$property('selectedStatus', null, {
        
        change: false,

        alias: 'selected-status',

        get: function () {

            return this.__selected_status || null;
        },

        set: function (value) {

            this.__selected_status = value;

            if (this.__selected)
            {
                changeSelectedStatus(this, value);
            }
        }
    });



    // 变更选中状态
    function changeSelectedStatus(control, selectedStatus) {

        var status;

        // 有缓存状态时需先恢复
        if (status = control.__save_status)
        {
            for (var name in status)
            {
                var values = status[name];

                // 等于选中值才恢复
                if (control[name] === values[1])
                {
                    control[name] = values[0];
                }
            }

            status = null;
        }

        // 处理选中状态
        if (selectedStatus)
        {
            var converts = control.$converts;
            var convert;
            
            status = {};

            for (var name in selectedStatus)
            {
                var value1 = control[name];
                var value2 = selectedStatus[name];

                if ((convert = converts[name]) && (convert = convert.fn))
                {
                    value2 = convert.call(control, value2);
                }

                if (value1 !== value2)
                {
                    status[name] = [value1, value2];
                    control[name] = value2;
                }
            }
        }

        // 记录保存状态
        control.__save_status = status;
    }

    

    // 自定义key
    this.$property('key', '', {
        
        change: false
    });
    

    // 自定义tag
    this.$property('tag', null, {
        
        change: false
    });




    // 父控件
    this.parent = null;


    // 检查父控件(默认允许任意容器控件)
    this.checkParent = true;


    // 顶级控件
    this.$property('root', null, {

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
            var converts = this.$converts,
                convert,
                changes,
                value,
                any;

            // 优先处理模型
            if (any = values.model)
            {
                this.model = any;
            }

            for (var name in values)
            {
                value = values[name];

                if (convert = converts[name])
                {
                    // 从转换器中获取存储名以解决别名存储的问题
                    name = convert.name;

                    if (any = convert.fn)
                    {
                        value = any.call(this, value);
                    }

                    if (convert.change) // 需要处理变化
                    {
                        (changes || (changes = this.__changes = {}))[name] = value;
                    }
                    else
                    {
                        this.$storage[name] = value;
                    }
                }
                else if (convert !== false)
                {
                    this[name] = value;
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
    this.$converts.bindings = {

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




    this.$converts.events = {
        
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
        this.$converts = create(this.$converts);
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
