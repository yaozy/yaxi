;(function (yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;


    // 管道编译器
    var compile = yaxi.pipe.compile;

    // 控件对象集合
    var controls = yaxi.$controls || (yaxi.$controls = create(null));


    // 绑定的目标
    var bindingTarget = null;



    // 模型原型
    var base = this;


    // 定义属性方法
    var $ = yaxi.impl.property();




    // 定义模型
    yaxi.model = function (properties) {

        var extend = create;
        var prototype = extend(base);
        var subkeys = prototype.$subkeys = extend(null);
        var defaults = prototype.$defaults = extend(null);

        function Model(parent) {

            this.$parent = parent || null;
            this.$storage = extend(defaults);
        }
        
        prototype.$properties = extend(null);
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;

        defineProperties(prototype, properties, subkeys);

        return Model;
    }



    
    this.__build_get = function (name) {

        return function () {

            var control, target;

            // 找到控件才收集依赖
            if ((target = bindingTarget) && (control = controls[target.control]))
            {
                addDep(this, name, target, control);
            }

            return this.$storage[name];
        }
    }
    
    
    this.__build_set = function (name, options) {

        var convert = options.convert;
        var watches;

        return function (value) {

            var storage = this.$storage;
            var bindings;

            if (convert)
            {
                value = convert(value);
            }

            if (value === storage[name] || (watches = this.__watches) && watches[name] && this.$notify(name, value) === false)
            {
                return this;
            }

            storage[name] = value;

            if ((bindings = this.__bindings) && (bindings = bindings[name]))
            {
                syncBindings(bindings);
            }
        }
    }



    this.__index = -1;


    // 添加索引属性
    define(this, '$index', {

        get: function () {

            var control, target;

            // 找到控件才收集依赖
            if ((target = bindingTarget) && (control = controls[target.control]))
            {
                addDep(this, '$index', target, control);
            }

            return this.__index;
        },

        set: function (value) {

            var bindings;

            if (this.__index !== (value |= 0))
            {
                this.__index = value;

                if ((bindings = this.__bindings) && (bindings = bindings.$index))
                {
                    syncBindings(bindings);
                }
            }
        }
    });


    // 顶层模型对象
    define(this, '$top', {
        
        get: function () {

            var target = this;
            var parent;

            while (parent = target.$parent)
            {
                target = parent;
            }

            return target;
        }
    });



    // 添加依赖
    function addDep(model, name, target, control) {

        var bindings, control, any;

        // 给模型添加绑定关系
        if (bindings = model.__bindings)
        {
            if (any = bindings[name])
            {
                any.push(target);
            }
            else
            {
                bindings[name] = [target];
            }
        }
        else
        {
            (model.__bindings = create(null))[name] = [target];
        }

        // 给控件记录依赖关系以便控件销毁时自动解除绑定
        if (bindings = control.__bindings)
        {
            bindings.push(name, model);
        }
        else
        {
            control.__bindings = [name, model];
        }
    }


    // 同步绑定
    function syncBindings(bindings) {

        var index = 0;
        var binding, control, fn;

        while (binding = bindings[index++])
        {
            if (control = controls[binding.control])
            {
                if (fn = binding.fn)
                {
                    control[binding.property] = fn(compile);
                }
            }
            else
            {
                bindings.splice(--index, 1);
            }
        }
    }




    function defineProperties(prototype, properties, subkeys) {

        var options, type;

        for (var name in properties)
        {
            if (name[0] === '$' || name[0] === '_' && name[1] === '_')
            {
                throw new Error('define model error: model field can not use "$" or "__" to begin!');
            }

            if (options = properties[name])
            {
                switch (typeof options)
                {
                    case 'function':
                        // 子模型
                        if (type = options.model)
                        {
                            define(prototype, name, (type === 1 ? defineSubModel : defineSubArrayModel)(name, options));
                            subkeys[name] = type;
                        }
                        else // 计算字段
                        {
                            define(prototype, name, { get: options });
                        }
                        break;
                    
                    case 'object': // 对象
                        if (options instanceof Array) // 子数组模型
                        {
                            define(prototype, name, defineSubArrayModel(name, type = checkSubArrayModel(options)));
                        }
                        else // 子模型
                        {
                            define(prototype, name, defineSubModel(name, type = yaxi.model(options)));
                        }

                        subkeys[name] = type;
                        break;

                    default:
                        $.call(prototype, name, options);
                        break; 
                }
            }
            else
            {
                $.call(prototype, name, options);
            }
        }
    }


    function checkSubArrayModel(options) {

        if (options.length !== 1 && !options[0] || typeof options[0] !== 'object')
        {
            throw new Error('define model error: sub array model must be a none empty object only!');
        }

        return yaxi.arrayModel(options[0]);
    }



    function defineSubModel(name, Model) {
    
        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Model(this));
            },
            set: function (values) {

                var model = this[name];

                if (values)
                {
                    (model || (this[name] = new Model(this))).$assign(values);
                }
                else if (model)
                {
                    model.$clear();
                }
            }
        };
    }


    function defineSubArrayModel(name, ArrayModel) {

        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new ArrayModel(this));
            },
            set: function (values) {

                var arrayModel = this[name];

                if (arrayModel)
                {
                    if (arrayModel.length > 0)
                    {
                        arrayModel.clear();
                    }
                }
                else
                {
                    arrayModel = this[name] = new ArrayModel(this);
                }

                if (values && values.length > 0)
                {
                    arrayModel.push.apply(arrayModel, values);
                }
            }
        };
    }
    
    


    // 绑定
    yaxi.$bind = function (bindings) {

        try
        {
            var uuid = this.uuid;
            var fn;

            for (var name in bindings)
            {
                if (fn = bindings[name])
                {
                    // 字段绑定
                    if (typeof fn !== 'function')
                    {
                        throw new Error('bind error: binding expression "' + fn + '" is not a function!');
                    }
                    else if (name === 'onchange')
                    {
                        this.__b_onchange = fn;
                    }
                    else // 表达式绑定
                    {
                        bindingTarget = yaxi.__bindingTarget = {
                            control: uuid,
                            property: name,
                            fn: fn
                        }

                        this[name] = fn(compile);
                    }
                }
            }
        }
        finally
        {
            // 终止收集依赖
            bindingTarget = yaxi.__bindingTarget = null;
        }
    }


    // 解除绑定
    this.$unbind = function (name, uuid) {

        var bindings = this.__bindings;

        if (bindings && (bindings = bindings[name]))
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i].control === uuid)
                {
                    bindings.splice(i, 1);
                    break;
                }
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

        var target = this;
        var watches, items, index, fn;

        while (target)
        {
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

            target = target.$parent;
        }
    }



    // 手动同步绑定
    this.$sync = function (name) {

        var bindings = this.__bindings;

        if (bindings && (bindings = bindings[name]))
        {
            syncBindings(bindings);
        }
    }



    // 批量赋值
    this.$assign = function (values) {

        if (values)
        {
            values = values.$storage || values;

            for (var name in values)
            {
                this[name] = values[name];
            }
        }
    }


    // 清除属性
    this.$clear = function (deep) {

        var subkeys, sub;

        this.$storage = create(this.$defaults);

        if (deep && (subkeys = this.$subkeys))
        {
            for (var name in subkeys)
            {
                if (sub = this['__sub_' + name])
                {
                    if (subkeys[name] === 1)
                    {
                        sub.$clear();
                    }
                    else
                    {
                        sub.clear();
                    }
                }
            }
        }
    }



}).call(Object.create(null), yaxi);
