;(function () {



    var create = Object.create;

    var A = Array;

    var array = A.prototype;



    var base = this;


    // 所有控件集合
    var controls = yaxi.$controls;




    // 定义数组模型
    yaxi.arrayModel = function (properties) {
    
        var prototype = create(base);

        properties || (properties = {});

        function ArrayModel(parent) {

            this.$parent = parent || null;
        }

        prototype.$Model = yaxi.model(properties);

        ArrayModel.model = prototype.__model_type = 2;
        ArrayModel.prototype = prototype;

        return ArrayModel;
    }



    function createModels(arrayModel, list, start) {

        var Model = arrayModel.$Model;
        var parent = arrayModel.$parent;
        var length = list.length;
        var outputs;

        if (start != null)
        {
            outputs = new A(length + 2);
            outputs[0] = start;
            outputs[1] = 0;
            start = 2;
        }
        else
        {
            outputs = new A(length);
            start = 0;
        }

        for (var i = 0; i < length; i++)
        {
            outputs[start + i] = createModel(parent, Model, list[i]);
        }

        return outputs;
    }


    function createModel(parent, Model, data) {

        var model;

        if (data instanceof Model)
        {
            model = data;
            model.$parent = parent;
        }
        else
        {
            model = new Model(parent);
            model.$assign(data);    
        }

        return model;
    }


    function reindex(arrayModel, index) {

        var model;

        index |= 0;

        while (model = arrayModel[index])
        {
            var old = model.__index;

            if (old == null)
            {
                model.__index = index;
            }
            else if (old !== index)
            {
                model.$index = index;
            }

            index++;
        }
    }


    function notify(arrayModel, type, arg1, arg2) {

        var bindings, databox;

        if (bindings = arrayModel.__bindings)
        {
            for (var i = 0, l = bindings.length; i < l; i++)
            {
                if (databox = controls[bindings[i]])
                {
                    databox[type](arg1, arg2);
                }
            }
        }
    }


    function destroyItem(item) {

        var bindings;

        if (bindings = item.__bindings)
        {
            item.__bindings = null;

            for (var name in bindings)
            {
                var list = bindings[name];

                for (var i = list.length; i--;)
                {
                    // 清除绑定关联的模型
                    list[i].model = null;
                }
            }
        }

        item.$parent = item.__bindings = null;
    }




    var released = false;


    this.__length = 0;


    // 获取数组模型长度(只读)
    Object.defineProperty(this, 'length', {

        get: function () {

            return this.__length;
        },

        set: function (value) {

            if (released)
            {
                this.__length = value;
                released = false;
            }
            else
            {
                throw new Error('length is readonly!');
            }
        }
    });



    this.indexOf = function (item) {

        return array.indexOf.call(this, item);
    }

    
    this.lastIndexOf = function (item) {

        return array.lastIndexOf.call(this, item);
    }


    this.forEach = function (fn) {

        return array.forEach.apply(this, arguments);
    }


    this.filter = function (fn) {

        return array.filter.apply(this, arguments);
    }


    this.map = function (fn) {

        return array.map.apply(this, arguments);
    }


    this.reduce = function (fn, initialValue) {

        return array.reduce.apply(this, arguments);
    }


    this.reduceRight = function (fn, initialValue) {

        return array.reduceRight.apply(this, arguments);
    }



    // 创建一个临时的模型
    this.create = function (data) {

        var model = new this.$Model();

        if (data)
        {
            model.$assign(data);
        }

        return model;
    }


    // 复制一个临时的模型
    this.copy = function (index) {

        var model = new this.$Model();
        var data;

        if (data = this[index])
        {
            model.$assign(data.__fields);
        }

        return model;
    }



    this.load = function (values) {

        var length = this.__length;

        if (length > 0)
        {
            while (length--)
            {
                destroyItem(this[length]);
            }

            released = true;
            array.splice.call(this, 0);
        }

        if (values.length > 0)
        {
            values = createModels(this, values);

            released = true;
            array.push.apply(this, values);
            
            for (var i = values.length; i--;)
            {
                values[i].__index = i;
            }
        }

        notify(this, '__on_load', values);
    }


    this.set = function (index, data) {

        var model;

        if ((index |= 0) < 0)
        {
            index += this.__length;
        }

        if (model = this[index])
        {
            destroyItem(model);

            model = this[index] = createModel(this.$parent, this.$Model, data);
            notify(this, '__on_set', index, model);
        }
        else
        {
            return false;
        }
    }


    this.append = function () {

        if (arguments.length > 0)
        {
            var index = this.__length;
            var models, model;
    
            models = createModels(this, arguments);

            released = true;
            array.push.apply(this, models);
    
            while (model = this[index])
            {
                model.__index = index++;
            }
            
            notify(this, '__on_insert', -1, models);
        }
    }


    this.insert = function (index) {

        if (arguments.length > 1)
        {
            var length = this.__length;
            var values = array.slice.call(arguments, 1);

            if ((index |= 0) < 0 && (index += length) < 0)
            {
                index = 0;
            }
            else if (index > length)
            {
                index = length;
            }
    
            values = createModels(this, values, index);
    
            released = true;
            array.splice.apply(this, values);

            reindex(this, index);
            notify(this, '__on_insert', index, values.slice(2));
        }
    }


    this.removeAt = function (index, count) {

        var length = this.__length;
        var removed;

        if ((index |= 0) < 0 && (index += length) < 0)
        {
            index = 0;
        }
        else if (index >= length)
        {
            return false;
        }

        released = true;
        removed = array.splice.call(this, index, count || 1);
        
        if ((length = removed.length) > 0)
        {
            for (var i = length; i--;)
            {
                destroyItem(removed[i]);
            }

            reindex(this, index);
            notify(this, '__on_removeAt', index, length);
        }
        else
        {
            return false;
        }
    }


    this.remove = function (item) {

        var index = this.indexOf(item);

        if (index >= 0)
        {
            this.removeAt(index, 1);
        }
    }


    this.clear = function () {

        if (this.__length > 0)
        {
            for (var i = this.__length; i--;)
            {
                destroyItem(this[i]);
            }

            released = true;
            array.splice.call(this, 0);

            notify(this, '__on_clear');
        }
    }



    this.sort = function (sortFn) {

        array.sort.call(this, sortFn);

        reindex(this, 0);
        notify(this, '__on_sort');
    }


    this.reverse = function () {

        array.reverse.call(this);
        
        reindex(this, 0);
        notify(this, '__on_reverse');
    }


    
}).call(Object.create(null));
