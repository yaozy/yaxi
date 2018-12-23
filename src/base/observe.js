yaxi.Observe = Object.extend.call({}, function (Class) {



    var create = Object.create;
    


    Class.ctor = function (data) {

        this.$storage = create(this.$defaults);

        if (data)
        {
            this.__init(data);
        }
    }



    // 初始化数据
    this.__init = function (data) {

        var converters = this.$converter,
            converter,
            changes,
            key;

        for (var name in data)
        {
            if (converter = converters[name])
            {
                // 需要处理变化
                if (converter.change)
                {
                    (changes || (changes = this.__changes = {}))[name] = converter.fn.call(this, data[name]);
                }
                else if (key = converter.name) // 默认转换器
                {
                    this.$storage[key] = converter.fn.call(this, data[name]);
                }
                else // 自定义转换器
                {
                    converter.fn.call(this, data[name]);
                }
            }
            else if (converter !== false)
            {
                this[name] = data[name];
            }
        }
    }



    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$converter = create(null);


    
    // 定义属性
    this.$property = yaxi.__extend_properties(function (name, change) {

        return change ? function () {

            var value = this.__changes;
            return value && (value = value[name]) !== void 0 ? value : this.$storage[name];

        } : function () {

            return this.$storage[name];
        }

    }, function (name, converter, change) {

        return change ? function (value) {

            var changes = this.__changes;

            value = converter.call(this, value);

            if (changes)
            {
                if (value === changes[name])
                {
                    return;
                }

                if (value !== this.$storage[name])
                {
                    changes[name] = value;
                }
                else
                {
                    delete changes[name];
                }
            }
            else if (value !== this.$storage[name])
            {
                patch(this)[name] = value;
            }

        } : function (value) {

            this.$storage[name] = converter.call(this, value);
        }

    });




    // 合并参数
    this.$combine = function (data, defaults) {

        if (data)
        {
            return defaults ? Object.assign({}, defaults, data) : data;
        }
        
        return defaults;
    }




    // 当前模型
    this.model = null;


    // 查找关联的模型
    this.__find_model = function () {
    
        var target = this;

        while (target)
        {
            if (target.model)
            {
                return target.model;
            }

            target = target.parent;
        }
    }


    this.__find_store = function (name) {

        var model;

        if (model = this.__find_model())
        {
            var keys = name.split('.'),
                index = 0,
                key;

            while (model && (key = keys[index++]))
            {
                model = model[key];
            }

            if (model && model.__model_type === 2)
            {
                return model;
            }

            throw '"' + name + '" is not a store!';
        }

        throw 'can not find any model!';
    }



    // 不转换Class
    this.$converter.Class = false;


    // 转换bindings
    this.$converter.bindings = {

        fn: function (data) {

            var model;

            if (data && (model = this.model = this.__find_model()))
            {
                model.$bind(this, data);
            }
        }
    };




    var patches = yaxi.__patches = [];

    var delay = 0;


    yaxi.__add_patch = function (target) {

        if (!delay)
        {
            delay = setTimeout(update);
        }

        patches.push(target);
    }


    function update() {

        var list = patches,
            index = 0,
            item;

        while (item = list[index++])
        {
            item.__update_patch();
        }

        list.length = delay = 0;
    }


    function patch(target) {

        if (!delay)
        {
            delay = setTimeout(update);
        }

        patches.push(target);

        return target.__changes = {};
    }


    
    this.__update_patch = function () {

        var changes;

        if (changes = this.__changes)
        {
            var storage = this.$storage;

            this.__changes = null;

            for (var name in changes)
            {
                storage[name] = changes[name];
            }
        }
    }



    // 更新变更
    yaxi.__patch_update = update;

    



    this.__class_init = function (Class, base) {

        this.$defaults = create(base.$defaults);
        this.$converter = create(base.$converter);
    }



});
