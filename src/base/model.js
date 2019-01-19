;(function () {



    var create = Object.create;

    var define = Object.defineProperty;


    var compile = yaxi.pipe.compile;


    // 绑定的目标
    var bindingTarget = null;

    // 注册的观测变化数量
    var watchKeys = create(null);


    // 模型原型
    var base = this;

    // 定义属性方法
    var property;




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

        prototype.$converter = extend(null);
        
        for (var name in properties)
        {
            if ((options = properties[name]) && typeof options === 'function')
            {
                if (type = options.model)
                {
                    subkeys[name] = type;
                    define(prototype, name, (type === 1 ? submodel : substore)(name, options));
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


    function substore(name, Store) {

        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Store(this));
            },
            set: function (value) {

                var store = this[name];

                if (value && value.length > 0)
                {
                    if (store)
                    {
                        if (store.length > 0)
                        {
                            store.clear();
                        }
                    }
                    else
                    {
                        this[name] = store = new Store(this);
                    }
                    
                    store.push.apply(store, value);
                }
                else if (store && store.length > 0)
                {
                    store.clear();
                }
            }
        };
    }
    


    // 定义属性
    property = yaxi.impl.property(function (name) {

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

    }, function (name, converter) {

        var watches = watchKeys;

        return function (value) {

            var any = this.$storage;

            if (converter)
            {
                value = converter(value);
            }

            if (value === any[name] || watches[name] && this.$notify(name, value) === false)
            {
                return this;
            }

            any[name] = value;

            if ((any = this.__bindings) && (any = any[name]))
            {
                pushBindings(this, any);
            }
        }

    });



    function pushBindings(model, bindings) {

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

    

    // 创建绑定对象
    function createBinding(model, tokens, expression) {

        var name = tokens[0];

        if (!model[name])
        {
            while (model = model.$parent)
            {
                if (name in model)
                {
                    break;
                }
            }
        }

        // 最后一个是绑定的字段
        name = tokens.pop();

        if (model && (!tokens[0] || (model = findSubmodel(model, tokens, name))))
        {
            return {
                model: model,
                name: name 
            };
        }

        throw 'binding expression "' + expression + '" is invalid!';
    }


    function findSubmodel(model, tokens, name) {

        var index = 0;

        while (any = tokens[index++])
        {
            if (model = model[any])
            {
                continue;
            }

            return;
        }

        if (name in model)
        {
            return model;
        }
    }


    // 编译绑定
    function compileBinding(observe, model, name, expression) {
    
        var index = expression.indexOf('|'),
            tokens,
            binding,
            pipe,
            value;

        if (index > 0)
        {
            pipe = expression.substring(index);
            expression = expression.substring(0, index);
        }

        if (tokens = expression.match(/\w+/g))
        {
            binding = bindingTarget = createBinding(model, tokens, expression);
            binding.observe = observe;

            value = binding.model[binding.name];

            if (pipe)
            {
                binding.pipe = pipe = compile(pipe);
                value = pipe(value);
            }

            observe[binding.property = name] = value;

            if (binding.model.__model_type === 1)
            {
                (observe.__bindings || (observe.__bindings = {}))[name] = binding;
            }
        }
    }


    // 编译推送
    function compilePush(observe, model, expression) {
    
        var index = expression.indexOf('|'),
            tokens,
            binding,
            pipe;

        if (index > 0)
        {
            pipe = expression.substring(index);
            expression = expression.substring(0, index);
        }

        if (tokens = expression.match(/\w+/g))
        {
            binding = createBinding(model, tokens, expression);

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

        if (bindings && (bindings = bindings[binding.name]))
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i] === binding)
                {
                    bindings.splice(i, 1);
                    break;
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



    // 保存状态
    this.$save = function () {

        return this;
    }


    // 恢复到上次保存的状态
    this.$restore = function () {

        return this;
    }


    // 获取变化
    this.$changes = function () {

        return this;
    }



    // 赋值
    this.$assign = function (data) {

        if (data)
        {
            var storage = this.$storage || (this.$storage = {}),
                converters = this.$converter,
                converter;

            for (var name in data)
            {
                if (converter = converters[name])
                {
                    storage[name] = converter.fn.call(this, data[name]);
                }
                else
                {
                    this[name] = data[name];
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
