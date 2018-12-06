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

        var changes, convert, any;

        for (var name in data)
        {
            if (convert = this['__convert_' + name])
            {
                // 默认转换器
                if (any = convert[0])
                {
                    // 需要处理变化
                    if (convert[2])
                    {
                        (changes || (changes = this.__changes = {}))[name] = convert[1].call(this, data[name]);
                    }
                    else
                    {
                        this.$storage[any] = convert[1].call(this, data[name]);
                    }
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



    // 默认值集合
    this.$defaults = Object.create(null);


    
    // 定义属性
    this.$property = yaxi.__extend_properties(function (name, change) {

        return change ? function () {

            var value = this.__changes;
            return value && (value = value[name]) !== void 0 ? value : this.$storage[name];

        } : function () {

            return this.$storage[name];
        }

    }, function (name, convertor, change) {

        return change ? function (value) {

            var changes = this.__changes;

            value = convertor.call(this, value);

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

            this.$storage[name] = convertor.call(this, value);
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
            model.$bind(this, data);
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

    

});
