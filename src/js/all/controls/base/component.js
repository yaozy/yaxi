yaxi.Component = yaxi.Control.extend(function (Class, base, yaxi) {


    
    var create = Object.create;

    var own = Object.getOwnPropertyNames;


    var A = Array;
    
    var build = yaxi.Control.build;
    

    // 管道编译器
    var compile = yaxi.pipe.compile;


    // 控件对象集合
    var controls = yaxi.$controls;




    this.__build_get = function (name) {

        var yx = yaxi;
        var init = create;

        return function () {

            var target, observes, list;

            if (target = yx.__bindingTarget)
            {
                // 添加观察对象
                if (observes = this.__observes)
                {
                    if (list = observes[name])
                    {
                        list.push(target);
                    }
                    else
                    {
                        observes[name] = [target];
                    }
                }
                else
                {
                    (this.__observes = init(null))[name] = [target];
                }
    
                if (target = controls[target])
                {
                    // 给控件记录依赖关系以便控件销毁时自动解除绑定
                    if (bindings = target.__bindings)
                    {
                        bindings.push(name, this);
                    }
                    else
                    {
                        target.__bindings = [name, this];
                    }
                }
            }

            return this.__fields[name];
        }
    }


    this.__build_set = function (name, options) {

        var convert = options.convert;

        return function (value) {

            var fields = this.__fields;

            value = convert ? convert.call(this, value) : value;

            if (value !== fields[name])
            {
                fields[name] = value;
                onchange.call(this, name);
            }
        }
    }


    function onchange(name) {

        var observes, observe, control, index, fn;
        
        if ((observes = this.__observes) && (observes = observes[name]))
        {
            index = 0;

            while (observe = observes[index++])
            {
                if (control = controls[observe.control])
                {
                    if (fn = observe.fn)
                    {
                        control[observe.property] = fn(compile);
                    }
                }
                else
                {
                    observes.splice(--index, 1);
                }
            }
        }
    }



    this.__load = function (options, scope) {

        var template = this.template;
        var shadowRoot;

        if (template)
        {
            if (typeof template === 'function')
            {
                template = template.call(this) || [];
            }
        }
        else
        {
            template = [];
        }

        if (options[1])
        {
            this.__load_attributes(options[1]);
        }

        if (template[2])
        {
            parseSlots(this, template[2], options[2]);
        }

        // 使用shadow的方式管理组件内部控件的目的是为了隔离
        shadowRoot = this.__shadowRoot = build(this, template, scope);
        shadowRoot.__shadow = true;
    }


    function parseSlots(component, options, slots) {

        var values;

        for (var i = options.length; i--;)
        {
            if (values = options[i])
            {
                if (values[0] === 'slot')
                {
                    values = handleSlots(values[1], slots, values[2]);

                    if (values && values.length > 0)
                    {
                        values = createSlots(component, i, values);
                        options.splice.apply(options, values);
                    }
                }
                else if (values[2])
                {
                    parseSlots(component, values[2], slots);
                }
            }    
        }
    }


    function handleSlots(name, slots, defaults) {

        // 使用者传入了插槽
        if (slots != null)
        {
            name = name && name.name;

            if (typeof slots === 'string')
            {
                if (name)
                {
                    throw new Error('slot input error: named slot can not support string, current slot name "' + name + '"!');
                }

                return [['text', null, slots]];
            }
            
            if (slots.length > 0)
            {
                var outputs = [];
                var index = 0;
                var item;

                // 指定了slot名称
                if (name)
                {
                    while (item = slots[index++])
                    {
                        if (item.slot === name)
                        {
                            outputs.push(item);
                        }
                    }
                }
                else
                {
                    while (item = slots[index++])
                    {
                        if (!item.slot)
                        {
                            outputs.push(item);
                        }
                    }
                }

                return outputs;
            }
        }
        
        return defaults;
    }



    function createSlots(parent, index, items) {

        var length = items.length;
        var outputs = new A(length + 2);
        var control;

        outputs[0] = index;
        outputs[1] = 1;

        for (var i = 0; i < length; i++)
        {
            control = outputs[i + 2] = build(parent, items[i]);
            control.__slot = true;
        }

        return outputs;
    }



    this.$combineChanges = function () {

        var fields = this.__fields;
        var changes = this.__changes;
        var shadowRoot = this.__shadowRoot;
        var properties = this.$properties;
        var names = own(changes);
        var index = 0;
        var name, values;

        while (name = names[index++])
        {
            fields[name] = changes[name];

            switch (properties[name].kind)
            {
                // 从以下三类属性同步到shadowRoot上, 其它属性不处理
                case 'class':
                case 'style':
                case 'attribute':
                    (values || (values = shadowRoot.__changes || (shadowRoot.__changes = create(null))))[name] = changes[name];
                    break;
            }
        }
    }



    // 观测属性变化
    this.$watch = function (name, listener) {

        var watches, items;

        if (name && typeof listener === 'function')
        {
            if (watches = this.__watches)
            {
                if (items = watches[name])
                {
                    items.push(listener);
                }
                else
                {
                    watches[name] = [listener];
                }
            }
            else
            {
                (this.__watches || (this.__watches = create(null)))[name] = [listener];
            }
        }
    }


    // 取消观测属性变化
    this.$unwatch = function (name, listener) {

        var watches, items;

        if (watches = this.__watches)
        {
            if (typeof listener === 'function')
            {
                if (items = watches[name])
                {
                    for (var i = items.length; i--;)
                    {
                        if (items[i] === listener)
                        {
                            items.splice(i, 1);
                            return;
                        }
                    }
                }
            }
            else if (name)
            {
                if ((items = watches[name]) && items.length > 0)
                {
                    items.length = 0;
                    delete watches[name];
                }
            }
            else
            {
                for (name in watches)
                {
                    watches[name].length = 0;
                }
    
                this.__watches = null;
            }
        }
    }


    // 通知属性变化
    this.$notify = function (name, value) {

        var watches, items, index, fn;

        if ((watches = this.__watches) && (items = watches[name]))
        {
            index = 0;

            while (fn = items[index++])
            {
                if (fn.call(target, this, value) === false)
                {
                    return false;
                }
            }
        }
    }



    // 解除绑定
    this.$unbind = function (name, uuid) {

        var observes = this.__observes;

        if (observes && (observes = observes[name]))
        {
            for (var i = observes.length; i--;)
            {
                if (observes[i].control === uuid)
                {
                    observes.splice(i, 1);
                    break;
                }
            }
        }
    }



    this.destroy = function () {

        var root;

        if (root = this.__shadowRoot)
        {
            root.destroy();
            this.__shadowRoot = null;
        }

        base.destroy.call(this);
    }




    // 输出组件创建方法
    yaxi.component = Class.extend.bind(Class);
    
    


}, function Component() {

    var init;

    this.__fields = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});

