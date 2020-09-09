yaxi.impl.binding = function () {



    this.__model = null;


    // 不转换model
    this.$converter.model = false;


    // 当前模型
    Object.defineProperty(this, 'model', {

        get: function () {

            return this.__model;
        },
        set: function (value) {

            if (value)
            {
                if (!value.__model_type)
                {
                    value = this.__find_model('' + value);
                }
            }
            else
            {
                value = null;
            }

            this.__model = value;
        }
    })

    
    // 处理绑定
    this.__set_bindings = function (values) {

        var model;

        if (values && (model = this.__find_model()))
        {
            yaxi.__bind_model.call(model, this, values);
        }
    }



    // 查找关联的模型
    this.__find_model = function () {
    
        var target = this,
            model;

        while (target)
        {
            if (model = target.__model)
            {
                return model;
            }

            target = target.parent;
        }
    }



    // 模型名称缓存
    var cache = Object.create(null);


    // 查找关联的数组模型
    this.__find_arrayModel = function (name) {

        var model;

        if (model = this.__find_model())
        {
            var keys = cache[name] || (cache[name] = name.split('.')),
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
        }

        throw 'can not find array model "' + name + '"!';
    }


}
