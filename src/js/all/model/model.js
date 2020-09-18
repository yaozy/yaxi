;(function () {



    var create = Object.create;

    var define = Object.defineProperty;


    var compile = yaxi.pipe.compile;


    // expression缓存
    var cache = create(null);


    // 观察器对象集合
    var controls;


    // 绑定的目标
    var bindingTarget = null;

    // 注册的观测变化数量
    var watchKeys = create(null);


    // 模型原型
    var base = this;


    // 定义属性方法
    var property = yaxi.impl.property();


    
    this.__build_get = function (name) {

        return function () {

            var target, bindings, any;

            if (target = bindingTarget)
            {
                if (bindings = this.__bindings)
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
                    (this.__bindings = {})[name] = [target];
                }
            }

            return this.$storage[name];
        }

    }
    
    
    this.__build_set = function (name, options) {

        var watches = watchKeys;
        var convert = options.convert;

        return function (value) {

            var any = this.$storage;

            if (convert)
            {
                value = convert(value);
            }

            if (value === any[name] || watches[name] && this.$notify(name, value) === false)
            {
                return this;
            }

            any[name] = value;

            if ((any = this.__bindings) && (any = any[name]))
            {
                syncBindings(any);
            }
        }
    }



    // 数组项索引属性
    define(this, '__item_index', {

        get: function () {

            var bindings, any;

            if (bindingTarget)
            {
                if (bindings = this.__bindings)
                {
                    if (any = bindings.__item_index)
                    {
                        any.push(bindingTarget);
                    }
                    else
                    {
                        bindings.__item_index = [bindingTarget];
                    }
                }
                else
                {
                    (this.__bindings = {}).__item_index = [bindingTarget];
                }
            }

            return this.__index + 1 || 0;
        },

        set: function (value) {

            value |= 0;

            if (this.__index === value)
            {
                return;
            }

            var bindings = this.__bindings;

            this.__index = value;

            if (bindings && (bindings = bindings.__item_index))
            {
                value += 1;
                
                for (var name in bindings)
                {
                    var binding = bindings[name];
                    var control = (controls || (controls = yaxi.$controls))[binding.control];
        
                    if (control)
                    {
                        control[binding.property] = binding.pipe ? binding.pipe(value) : value;
                    }
                }
            }
        }
    });



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


    function defineProperties(prototype, properties, subkeys) {

        var options, type;

        for (var name in properties)
        {
            if (name[0] === '$' || name[0] === '_' && name[1] === '_')
            {
                throw 'define model error: field can not use "$" or "__" to start!';
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
            throw message + 'the first item of sub array model must be a none empty object!'
        }

        if (itemName != null && typeof itemName !== 'string')
        {
            throw message + 'the second item for sub array model must be a string or null!';
        }

        if (itemIndex != null && typeof itemIndex !== 'string')
        {
            throw message + 'the third item for sub array model must be a string or null!';
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
    


    function syncBindings(bindings) {

        var binding, model, value, any;

        for (var name in bindings)
        {
            binding = bindings[name];

            // 子模型可能使用计算字段绑定至父模型的属性, 所以此处必须使用binding.model获取当前绑定对应的模型
            if (model = binding.model)
            {
                value = model[binding.field];

                if (any = binding.pipe)
                {
                    value = any(value);
                }
    
                if (any = (controls || (controls = yaxi.$controls))[binding.control])
                {
                    any[binding.property] = value;
                }
            }
        }
    }

    

    // 编译绑定
    function compileBinding(control, model, name, rule) {
    
        var binding, value;

        if (rule !== 1)
        {
            binding = bindingTarget = createBinding(model, rule);
            binding.control = control.uuid;

            value = binding.model[binding.field];

            if (rule.pipe)
            {
                value = rule.pipe(value);
            }

            control[binding.property = name] = value;

            if (binding.model.__model_type === 1)
            {
                (control.__bindings || (control.__bindings = {}))[name] = binding;
            }
        }
        else
        {
            throw 'bind error: binding expression "' + expression + '" is invalid!';
        }
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

        if (any = value.match(/\w+/g))
        {
            value = {
                path: any,
                pipe: pipe,
                bind: value
            };
        }

        return cache[expression] = value || 1;
    }


    // 创建绑定对象
    function createBinding(model, rule) {

        var path = rule.path;
        var name = path[0];
        var item;

        // 绑定结构
        var binding = {
            type: 0,        // 绑定类型 0:模型绑定  1:数组模型子项绑定  2:数组模型子项索引绑定
            model: null,    // 模型对象
            field: name,    // 模型字段名
            control: 0,     // 控件id
            property: ''    // 控件属性名
        };

        while (model)
        {
            // 如果是数组模型子项时只能通过设定的项名或索引名绑定, 不支持直接绑定
            if (item = model.__item)
            {
                // 数组模型子项
                if (name === item[0])
                {
                    binding.type = 1;
    
                    if (path[1])
                    {
                        return findSubModel(model, rule, binding, 1);
                    }

                    binding.model = model;
                    return binding;
                }

                // 数组模型子项索引
                if (name === item[1])
                {
                    if (path[1])
                    {
                        throw 'bind error: "' + name + '" is model index, can not supports sub model!';
                    }

                    binding.type = 2;
                    binding.model = model;
                    binding.field = '__item_index';

                    return binding;
                }
            }
            else if (name in model)
            {
                if (path[1])
                {
                    return findSubModel(model, rule, binding);
                }
 
                binding.model = model;
                return binding;
            }
            
            model = model.$parent;
        }

        throw 'bind error: model field "' + name + '" not exists!';
    }


    function findSubModel(model, rule, binding, index) {

        var path = rule.path;
        var last = path.length - 1;

        index |= 0;

        while (index < last)
        {
            if (model = model[path[index++]])
            {
                if (model.__model_type === 1)
                {
                    continue;
                }

                throw 'bind error: "' + name + '" is not a sub model in "' + rule.bind + '"!';
            }
            else
            {
                throw 'bind error: "' + rule.bind + '" is invalid, can not find submodel "' + path[index - 1] + '"!';
            }
        }

        if (path[last] in model)
        {
            if (binding)
            {
                binding.field = path[last];
                binding.model = model;
                return binding;
            }

            return model[path[last]];
        }

        throw 'bind error: "' + rule.bind + '" is invalid, can not find model field "' + path[last] + '"!';
    }



    // 查找子模型
    this.$findSubmodel = function (expression) {

        var rule = cache[expression] || parseExpression(expression);
        var item = this.__item;

        // 数组子项模型
        if (item && item[0] === rule.path[0])
        {
            return findSubModel(this, rule, null, 1);
        }

        return findSubModel(this, rule);
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
                    var rule = cache[expression] || parseExpression(expression);
        
                    if (name === 'model')
                    {
                        if (rule !== 1)
                        {
                            control.__binding_push = createBinding(model, rule);
                        }
                    }
                    else
                    {
                        compileBinding(control, this, name, rule);
                    }
                }
            }
        }
        finally
        {
            bindingTarget = null;
        }

        return this;
    }



    // 解除绑定
    this.$unbind = function (uuid) {

        var bindings = this.__bindings;
        var values;

        if (bindings)
        {
            for (var name in bindings)
            {
                if (values = bindings[name])
                {
                    for (var i = values.length; i--;)
                    {
                        if (values[i].control === uuid)
                        {
                            values.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }

        return this;
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

        return this;
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

        return this;
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

        return this;
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

        return this;
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
        
        return this;
    }



}).call(Object.create(null));
