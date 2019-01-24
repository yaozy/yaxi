yaxi.impl.observe = function () {



    var create = Object.create;



    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$converter = create(null);



    // 当前模型
    this.model = null;



    // 不转换Class
    this.$converter.Class = false;


    // 转换bindings
    this.$converter.bindings = {

        fn: function (values) {

            var model;

            if (values && (model = this.model || (this.model = this.__find_model())))
            {
                yaxi.__bind_model.call(model, this, values);
            }
        }
    };


    
    // 赋值
    this.assign = function (values) {

        var converters = this.$converter,
            converter,
            changes,
            key;

        for (var name in values)
        {
            if (converter = converters[name])
            {
                // 需要处理变化
                if (converter.change)
                {
                    (changes || (changes = this.__changes = {}))[converter.name] = converter.fn.call(this, values[name]);
                }
                else if (key = converter.name) // 默认转换器
                {
                    this.$storage[key] = converter.fn.call(this, values[name]);
                }
                else // 自定义转换器
                {
                    converter.fn.call(this, values[name]);
                }
            }
            else if (converter !== false)
            {
                this[name] = values[name];
            }
        }

        return this;
    }
    

    
    // 推送绑定
    this.$push = function (value) {

        var binding = this.__binding_push,
            pipe;

        if (binding)
        {
            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            binding.model[binding.name] = value;
        }
    }


    // 查找关联的模型
    this.__find_model = function () {
    
        var target = this,
            model;

        while (target)
        {
            if (model = target.model)
            {
                return typeof model === 'object' ? model : nulll
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

            if (model && typeof model === 'object')
            {
                return model;
            }
        }

        throw 'can not find model "' + name + '"!';
    }


    this.__class_init = function () {

        this.$defaults = create(this.$defaults);
        this.$converter = create(this.$converter);
    }


}
