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

        function Model(data, parent) {

            this.$parent = parent || null;
            this.$storage = extend(defaults);

            if (data)
            {
                this.$load(data);
            }
        }
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;
        
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

                return this[name] || (this[name] = new Model(null, this));
            },
            set: function (value) {

                var model = this[name];

                if (value && typeof value === 'object')
                {
                    if (model)
                    {
                        for (var key in value)
                        {
                            model[key] = value[key];
                        }
                    }
                    else
                    {
                        this[name] = new Model(value, this);
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

                return this[name] || (this[name] = new Store(null, this));
            },
            set: function (value) {

                var store = this[name];

                if (value && value.length > 0)
                {
                    if (store)
                    {
                        if (store && store.length > 0)
                        {
                            store.clear();
                        }

                        store.push.apply(store, value);
                    }
                    else
                    {
                        this[name] = new Store(value, this);
                    }
                }
                else if (store && store.length > 0)
                {
                    store.clear();
                }
            }
        };
    }
    


    // 定义属性
    property = yaxi.__extend_properties(function (name) {

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

    }, function (name, convertor) {

        var watches = watchKeys;

        return function (value) {

            var any = this.$storage;

            if (convertor)
            {
                value = convertor(value);
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

            return this;
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

    

    // 编译绑定
    function compileBinding(model, observe, name, expression) {
    
        var index = expression.indexOf('|'),
            tokens,
            pipe;

        if (index > 0)
        {
            pipe = expression.substring(index);
            expression = expression.substring(0, index);
        }

        if (tokens = expression.match(/\w+/g))
        {
            var binding = bindingTarget = { observe: observe },
                index = 0,
                value;

            binding.name = tokens.pop(); // 最后一个是绑定的字段

            while (value = tokens[index++])
            {
                if ((model = model[value]) && model.__model_type === 1)
                {
                    continue;
                }

                throw 'binding expression is invalid! "' + value + '" is not a model!';
            }

            binding.model = model;

            if (pipe)
            {
                binding.pipe = pipe = compile(pipe);
            }

            value = model[binding.name];
            observe[binding.property = name] = pipe ? pipe(value) : value;
    
            return binding;
        }

        throw 'binding expression is invalid! no binding name!';
    }


    // 编译推送
    function compilePush(model, expression) {
    
        var index = expression.indexOf('|'),
            tokens,
            pipe;

        if (index > 0)
        {
            pipe = expression.substring(index);
            expression = expression.substring(0, index);
        }

        if (tokens = expression.match(/\w+/g))
        {
            var binding = {},
                index = 0,
                value;

            binding.name = tokens.pop(); // 最后一个是绑定的字段

            while (value = tokens[index++])
            {
                if ((model = model[value]) && model.__model_type === 1)
                {
                    continue;
                }

                throw 'binding expression is invalid! "' + value + '" is not a model!';
            }

            binding.model = model;

            if (pipe)
            {
                binding.pipe = pipe = compile(pipe);
            }

            return binding;
        }

        throw 'binding expression is invalid! no binding name!';
    }



    // 绑定
    this.$bind = function (observe, bindings) {

        try
        {
            var keys = observe.__bindings || (observe.__bindings = {}),
                any;

            for (var name in bindings)
            {
                if (any = bindings[name])
                {
                    if (name === 'change')
                    {
                        observe.__binding_push = compilePush(this, any);
                    }
                    else
                    {
                        keys[name] = compileBinding(this, observe, name, any);
                    }
                }
            }
        }
        finally
        {
            bindingTarget = null;
        }
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
    }


    // 推送绑定
    this.$push = function (observe, value) {

        var binding = observe.__binding_push,
            pipe;

        if (binding)
        {
            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            this[binding.name] = value;
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



    // 保存状态
    this.$save = function () {

    }


    // 恢复到上次保存的状态
    this.$restore = function () {

    }


    // 获取变化
    this.$changes = function () {

    }



    // 加载数据
    this.$load = function (data) {

        if (data)
        {
            var storage = this.$storage || (this.$storage = {});

            for (var name in data)
            {
                if (convert = this['__convert_' + name])
                {
                    storage[name] = convert[1].call(this, data[name]);
                }
                else
                {
                    this[name] = data[name];
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
