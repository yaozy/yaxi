yaxi.impl.binding = function () {



    // 当前模型
    this.model = null;


    
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
            if (model = target.model)
            {
                return typeof model === 'object' ? model : nulll
            }

            target = target.parent;
        }
    }


    // 查找关联的数据集
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


}
