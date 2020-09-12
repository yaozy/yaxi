;(function () {



    var create = Object.create;

    var define = Object.defineProperty;


    var compile = yaxi.pipe.compile;


    // expression缓存
    var cache = create(null);


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

            var bindings, any;

            if (bindingTarget)
            {
                if (bindings = this.__bindings)
                {
                    if (any = bindings[name])
                    {
                        any.push(bindingTarget);
                    }
                    else
                    {
                        bindings[name] = [bindingTarget];
                    }
                }
                else
                {
                    (this.__bindings = {})[name] = [bindingTarget];
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
                syncBindings(this, any);
            }
        }
    }



    // 定义模型
    yaxi.model = function (properties) {

        var extend = create,
            prototype = extend(base),
            subkeys = prototype.$subkeys = extend(null),
            defaults = prototype.$defaults = extend(null),
            options,
            type;

        function Model(parent) {

            this.$parent = parent || null;
            this.$storage = extend(defaults);
        }
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;

        prototype.$converts = extend(null);
        
        for (var name in properties)
        {
            if ((options = properties[name]) && typeof options === 'function')
            {
                if (type = options.model)
                {
                    subkeys[name] = type;
                    define(prototype, name, (type === 1 ? submodel : subarrayModel)(name, options));
                }
                else
                {
                    define(prototype, name, { get: options });
                }
            }
            else
            {
                property.call(prototype, name, options);
            }
        }

        return Model;
    }



    function submodel(name, Model) {
    
        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Model(this));
            },
            set: function (value) {

                var model = this[name];

                if (value)
                {
                    if (value != null)
                    {
                        (model || (this[name] = new Model(this))).$assign(value);
                    }
                }
                else if (model)
                {
                    model.$clear();
                }
            }
        };
    }


    function subarrayModel(name, ArrayModel) {

        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new ArrayModel(this));
            },
            set: function (value) {

                var arrayModel = this[name];

                if (value && value.length > 0)
                {
                    if (arrayModel)
                    {
                        if (arrayModel.length > 0)
                        {
                            arrayModel.clear();
                        }
                    }
                    else
                    {
                        this[name] = arrayModel = new ArrayModel(this);
                    }
                    
                    arrayModel.push.apply(arrayModel, value);
                }
                else if (arrayModel && arrayModel.length > 0)
                {
                    arrayModel.clear();
                }
            }
        };
    }
    


    function syncBindings(model, bindings) {

        var binding, value, pipe;

        for (var name in bindings)
        {
            binding = bindings[name];
            value = model[binding.name];

            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            binding.observe[binding.property] = value;
        }
    }

    

    // 编译绑定
    function compileBinding(observe, model, name, expression) {
    
        var rule = cache[expression] || parseExpression(expression);
        var binding, value;

        if (rule !== 1)
        {
            binding = bindingTarget = createBinding(model, rule);
            binding.observe = observe;

            value = binding.model[binding.name];

            if (rule.pipe)
            {
                value = rule.pipe(value);
            }

            observe[binding.property = name] = value;

            if (binding.model.__model_type === 1)
            {
                (observe.__bindings || (observe.__bindings = {}))[name] = binding;
            }
        }
        else
        {
            throw 'binding expression "' + expression + '" is invalid!';
        }
    }


    function parseExpression(expression) {

        var value, pipe, any;

        if ((any = expression.indexOf('|')) > 0)
        {
            pipe = expression.substring(any);
            value = expression.substring(0, any);
        }
        else
        {
            value = expression;
        }

        if (any = value.match(/\w+/g))
        {
            value = {
                name: any.pop(),
                path: any,
                pipe: pipe,
                bind: value
            };
        }

        return cache[expression] = value || 1;
    }


    // 创建绑定对象
    function createBinding(model, rule) {

        var name = rule.path[0] || rule.name;

        if (model[name] === void 0)
        {
            while (model = model.$parent)
            {
                if (name in model)
                {
                    break;
                }
            }
        }

        if (model)
        {
            return {
                model: model,
                name: name 
            };
        }

        throw '"' + rule.bind + '" is a invalid binding!';
    }


    // 编译推送
    function compilePush(observe, model, expression) {

        var rule = cache[expression] || parseExpression(expression);
        var binding;

        if (rule !== 1)
        {
            binding = createBinding(model, rule);

            if (pipe)
            {
                binding.pipe = compile(pipe);
            }

            observe.__binding_push = binding;
        }
    }



    // 绑定
    this.$bind = yaxi.__bind_model = function (observe, bindings) {

        try
        {
            var expression;

            for (var name in bindings)
            {
                if (expression = bindings[name])
                {
                    if (name === 'change')
                    {
                        compilePush(observe, this, expression);
                    }
                    else
                    {
                        compileBinding(observe, this, name, expression);
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
    this.$unbind = function (binding) {

        var bindings = this.__bindings;
        var values;

        if (bindings)
        {
            // 属性字段绑定
            if (values = bindings[binding.name])
            {
                for (var i = values.length; i--;)
                {
                    if (values[i] === binding)
                    {
                        values.splice(i, 1);
                        break;
                    }
                }
            }
            else // 计算字段绑定
            {
                for (var name in bindings)
                {
                    values = bindings[name];

                    for (var i = values.length; i--;)
                    {
                        if (values[i] === binding)
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

        var binding;

        if ((binding = this.__bindings) && (binding = binding[name]))
        {
            syncBindings(this, binding);
        }
    }



    // 赋值
    this.$assign = function (values) {

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
