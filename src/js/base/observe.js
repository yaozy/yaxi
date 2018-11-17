yaxi.Observe = Object.extend.call({}, function (Class) {



    var create = Object.create;
    


    Class.ctor = function (data) {

        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }
    }



    // 初始化数据
    this.__init = function (data) {

        var changes = this.__changes = {},
            convert,
            any;

        for (var name in data)
        {
            if (convert = this['__convert_' + name])
            {
                // 默认转换器
                if (any = convert[0])
                {
                    changes[any] = (any = convert[1]) ? any(data[name]) : data[name];
                }
                else // 自定义转换器
                {
                    convert[1].call(this, data[name]);
                }
            }
            else if (convert !== false)
            {
                this[name] = data[name];
            }
        }
    }



    
    this.__defaults = Object.create(null);

    this.__properties = Object.create(null);


    // 定义多个属性方法
    this.$properties = function (properties) {

        for (var name in properties)
        {
            this.$property(name, properties[name]);
        }
    }

    
    // 定义属性
    this.$property = yaxi.__extend_properties(function (name, alias) {

        return function () {

            var value = this.__changes;
            return value && (value = value[alias]) !== void 0 ? value : this.$storage[alias];
        }

    }, function (name, convertor, alias) {

        return function (value) {

            var changes = this.__changes;

            if (convertor)
            {
                value = convertor(value);
            }

            if (changes)
            {
                if (value === changes[alias])
                {
                    return;
                }

                if (value !== this.$storage[alias])
                {
                    changes[alias] = value;
                }
                else
                {
                    delete changes[alias];
                }
            }
            else if (value !== this.$storage[alias])
            {
                patch(this)[alias] = value;
            }
        }

    });



    // 不处理Class属性
    this.__convert_Class = false;



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




    // 转换bindings
    this.__convert_bindings = [0, function (data) {

        var model;

        if (data && (model = this.model = this.__find_model()))
        {
            this.__bindings = model.$bind(this, data);
        }
    }];





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
            item;

        for (var i = 0, l = list.length; i < l; i++)
        {
            if (item = list[i])
            {
                item.__update_patch();
            }
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

    

});
