;(function () {



    var create = Object.create;

    var define = Object.defineProperty;


    // 管理编译器
    var compile = yaxi.pipe.compile;


    // expression缓存
    var cache = create(null);


    // 控件对象集合
    var controls = yaxi.$controls || (yaxi.$controls = create(null));


    // 绑定的目标
    var bindingTarget = null;

    // 注册的观测变化数量
    var watchKeys = create(null);


    // 模型原型
    var base = this;


    // 定义属性方法
    var property = yaxi.impl.property();




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
        
        prototype.$converts = extend(null);
        
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

        var watches = watchKeys;
        var convert = options.convert;

        return function (value) {

            var storage = this.$storage;
            var bindings;

            if (convert)
            {
                value = convert(value);
            }

            if (value === storage[name] || watches[name] && this.$notify(name, value) === false)
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
        var binding, model, control, fn, value;

        while (binding = bindings[index++])
        {
            if ((model = binding.model) && (control = controls[binding.control]))
            {
                if (fn = binding.fn)
                {
                    value = fn.call(model, compile);
                }
                else
                {
                    value = model[binding.field];

                    if (fn = binding.pipe)
                    {
                        value = fn(value);
                    }
                }

                control[binding.property] = value;
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
                        property.call(prototype, name, options);
                        break; 
                }
            }
            else
            {
                property.call(prototype, name, options);
            }
        }
    }


    function checkSubArrayModel(options) {

        var message = 'define model error: ';
        var properties = options[0];
        var itemName = options[1];
        var itemIndex = options[2];

        if (!properties || typeof properties !== 'object')
        {
            throw new Error(message + 'the first item of sub array model must be a none empty object!');
        }

        if (itemName != null && typeof itemName !== 'string')
        {
            throw new Error(message + 'the second item for sub array model must be a string or null!');
        }

        if (itemIndex != null && typeof itemIndex !== 'string')
        {
            throw new Error(message + 'the third item for sub array model must be a string or null!');
        }

        return yaxi.arrayModel(properties, itemName, itemIndex);
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
                    values = values.$storage || values;

                    if (model)
                    {
                        for (var key in values)
                        {
                            model[key] = values[key];
                        }
                    }
                    else
                    {
                        (this[name] = new Model(this)).$load(values);
                    }
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
            set: function (value) {

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

                if (value && value.length > 0)
                {
                    arrayModel.push.apply(arrayModel, value);
                }
            }
        };
    }
    
    

    // 编译字段绑定
    function compileFieldBinding(control, model, name, rule) {

        // 绑定结构
        var binding = bindingTarget = {
            type: 0,                        // 绑定类型 0:模型绑定  1:数组模型子项绑定  2:数组模型子项索引绑定  3: 表达式绑定
            model: null,                    // 绑定的模型
            field: rule.last,               // 绑定模型字段
            control: control.uuid,          // 控件id
            property: name                  // 控件属性名
        };

        var model = findModel(model, rule, binding);
        var value = model[binding.field];

        binding.model = model;
        control[name] = rule.pipe ? rule.pipe(value) : value;
    }


    // 编译模型推送绑定
    function compilePushBinding(control, model, rule) {

        // 绑定结构
        var binding = control.__binding_push = {
            model: model,
            field: rule.last
        };

        binding.model = findModel(model, rule, binding);
    }


    // 编译函数绑定
    function compileFunctionBinding(control, model, name, fn) {
    
        bindingTarget = {
            type: 3,                    // 绑定类型 0:模型绑定  1:数组模型子项绑定  2:数组模型子项索引绑定  3: 表达式绑定
            model: model,               // 绑定的模型
            fn: fn,                     // 函数表达式
            control: control.uuid,      // 控件id
            property: name              // 控件属性名
        };

        control[name] = fn.call(model, compile);
    }



    // 解析绑定表达式
    function parseExpression(expression) {

        var value, pipe, any;

        if ((any = expression.indexOf('|')) > 0)
        {
            pipe = compile(expression.substring(any));
            value = expression.substring(0, any);
        }
        else
        {
            value = expression;
        }

        if (any = value.match(/[\w$]+/g))
        {
            value = {
                path: any,
                last: any[any.length - 1],
                pipe: pipe,
                bind: value
            };
        }

        return cache[expression] = value || 1;
    }



    function findModel(model, rule, binding) {

        var path = rule.path;
        var last = path.length - 1;
        var name = path[0];
        var index = 0;

        // 特殊绑定
        switch (name)
        {
            // 当前模型项
            case '$item':
                index++;

                if (binding)
                {
                    binding.type = 1;
                }
                break;

            // 当前模型在array model中的索引
            case '$index':
                if (!binding || last > 0)
                {
                    throw new Error('bind error: $index is a model index field, not a model!');
                }

                if (binding)
                {
                    binding.type = 2;
                    binding.field = '$index';
                }

                return model;

            // 顶层模型
            case '$top':
                index++;
                model = model.$top;
                break;

            // 上级模型
            case '$parent':
                do
                {
                    model = model.$parent;

                    if (!model)
                    {
                        findModelThrow(rule, '"' + path.substring(0, index) + '" not exists!');
                    }
                }
                while ((name = path[++index]) && name === '$parent');
                break;
        }

        while (index < last)
        {
            name = path[index];

            if (model = model[name])
            {
                if (model.__model_type === 1)
                {
                    index++;
                    continue;
                }

                findModelThrow(rule, '"' + name + '" not a submodel!');
            }
            else
            {
                findModelThrow(rule, 'submodel "' + name + '" not exists!');
            }
        }

        name = path[last];

        if (name in model)
        {
            if (binding)
            {
                return model;
            }
            
            if ((last = model[name]) && last.__model_type)
            {
                return last;
            }

            findModelThrow(rule, '"' + name + '" not a model object!');
        }

        findModelThrow(rule, 'field "' + name + '" not exists!');
    }


    function findModelThrow(rule, text) {

        throw new Error('bind error: "' + rule.bind + '" is invalid, ' + text);
    }



    // 查找子模型
    this.$findSubmodel = function (expression) {

        var rule = cache[expression] || parseExpression(expression);
        return findModel(this, rule);
    }



    // 绑定
    this.$bind = function (control, bindings) {

        try
        {
            var expression;

            for (var name in bindings)
            {
                if (expression = bindings[name])
                {
                    // 字段绑定
                    if (typeof expression !== 'function')
                    {
                        var rule = cache[expression] || parseExpression(expression);
        
                        if (rule !== 1)
                        {
                            if (name === 'model')
                            {
                                compilePushBinding(control, this, name, rule);
                            }
                            else
                            {
                                compileFieldBinding(control, this, name, rule);
                            }
                        }
                        else
                        {
                            throw new Error('bind error: binding expression "' + expression + '" is invalid!');
                        }
                    }
                    else // 表达式绑定
                    {
                        compileFunctionBinding(control, this, name, expression);
                    }
                }
            }
        }
        finally
        {
            // 终止收集依赖
            bindingTarget = null;
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

        if (name && typeof listener === 'function')
        {
            if (!++watchKeys[name])
            {
                watchKeys[name] = 1;
            }
            
            var watches = this.__watches,
                items;

            if (watches)
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
                (this.__watches || (this.__watches = {}))[name] = [listener];
            }
        }
    }


    // 取消观测属性变化
    this.$unwatch = function (name, listener) {

        var watches = this.__watches,
            items;

        if (!watches)
        {
            return;
        }

        if (typeof listener === 'function')
        {
            if (watches && (items = watches[name]))
            {
                for (var i = items.length; i--;)
                {
                    if (items[i] === listener)
                    {
                        items.splice(i, 1);
                        watchKeys[name]--;
                        return;
                    }
                }
            }
        }
        else if (name)
        {
            if ((items = watches[name]) && items.length > 0)
            {
                watchKeys[name] -= items.length;
                items.length = 0;

                delete watches[name];
            }
        }
        else
        {
            for (name in watches)
            {
                if ((items = watches[name]) && items.length > 0)
                {
                    watchKeys[name] -= items.length;
                    items.length = 0;
                }
            }

            this.__watches = null;
        }
    }


    // 通知属性变化
    this.$notify = function (name, value) {

        var target = this,
            watches,
            items,
            index,
            fn;

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



    // 加载
    this.$load = function (values) {

        if (values)
        {
            var storage = this.$storage || (this.$storage = {}),
                converts = this.$converts,
                convert;

            for (var name in values)
            {
                if (convert = converts[name])
                {
                    storage[name] = convert.fn.call(this, values[name]);
                }
                else
                {
                    this[name] = values[name];
                }
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



}).call(Object.create(null));
