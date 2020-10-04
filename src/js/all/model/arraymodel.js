;(function () {



    var create = Object.create;

    var array = Array.prototype;

    var push = array.push;

    var splice = array.splice;

    var released = false;


    var base = this;


    // 所有控件集合
    var controls;




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
                throw new Error('the length of array mode is readonly!');
            }
        }
    });


    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;




    function createModels(arrayModel, list, index) {

        var outputs = [],
            Model = arrayModel.$Model,
            parent = arrayModel.$parent,
            length = list.length,
            model,
            data;

        while (index < length)
        {
            data = list[index++];

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

            outputs.push(model);
        }

        return outputs;
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

        var databoxs = controls || (controls = yaxi.$controls);
        var bindings, databox;

        if (bindings = arrayModel.__bindings)
        {
            for (var i = 0, l = bindings.length; i < l; i++)
            {
                if (databox = databoxs[bindings[i]])
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
            model.$assign(data.$storage);
        }

        return model;
    }



    this.load = function (values) {

        var list;

        if (this.__length > 0)
        {
            this.clear(false);
        }

        if (values.length > 0)
        {
            list = createModels(this, values, 0);

            released = true;
            push.apply(this, list);
            
            for (var i = list.length; i--;)
            {
                list[i].__index = i;
            }
        }

        notify(this, '__on_load', list);
    }


    this.set = function (index, data) {

        var Model = this.$Model;
        var model;

        if ((index |= 0) >= 0 && this[index])
        {
            if (data instanceof Model)
            {
                model = data;
                model.$parent = this.$parent;
            }
            else
            {
                model = new Model(this.$parent);
                data && model.$assign(data);
            }

            this[index] = model;
            notify(this, '__on_set', index, model);
        }
    }


    this.push = function () {

        var length = arguments.length;

        if (length > 0)
        {
            var list = createModels(this, arguments, 0);

            released = true;
            push.apply(this, list);

            reindex(this, this.__length - length);
            notify(this, '__on_insert', -1, list);
        }

        return this.__length;
    }


    this.pop = function () {

        var item;

        if (this.__length > 0)
        {
            released = true;

            if (item = array.pop.call(this))
            {
                destroyItem(item);
                notify(this, '__on_remove', -1, 1);
            }
        }

        return item;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var list = createModels(this, arguments, 0);

            released = true;
            array.unshift.apply(this, list);

            reindex(this, 0);
            notify(this, '__on_insert', 0, list);
        }

        return this.__length;
    }


    this.shift = function () {

        var item;

        if (this.__length > 0)
        {
            released = true;

            if (item = array.shift.call(this))
            {
                destroyItem(item);

                notify(this, '__on_remove', 0, 1);
                reindex(this, 0);
            }
        }

        return item;
    }


    this.splice = function (index, length) {

        var removed, inserted;

        if ((index |= 0) < 0 && (index += this.length) < 0)
        {
            index = 0;
        }

        if (arguments.length > 2)
        {
            inserted = createModels(this, arguments, 2);

            released = true;
            removed = splice.apply(this, [index, length].concat(inserted));
        }
        else
        {
            released = true;
            removed = splice.apply(this, arguments);
        }
        
        if (removed.length > 0)
        {
            for (var i = removed.length; i--;)
            {
                destroyItem(removed[i]);
            }

            notify(this, '__on_remove', index, removed.length);
        }

        if (inserted)
        {
            notify(this, '__on_insert', index, inserted);
        }

        reindex(this, index);
        return removed;
    }


    this.clear = function () {

        var list;

        if (this.__length > 0)
        {
            released = true;
            list = splice.call(this, 0);
    
            for (var i = list.length; i--;)
            {
                destroyItem(list[i]);
            }

            if (arguments[0] !== false)
            {
                notify(this, '__on_clear');
            }
        }
    }


    this.sort = function (sortFn) {

        array.sort.call(this, sortFn);

        reindex(this, 0);
        notify(this, '__on_sort', 0);
    }


    this.reverse = function () {

        array.reverse.call(this);
        
        reindex(this, 0);
        notify(this, '__on_sort', 1);
    }


    
}).call(Object.create(null));
