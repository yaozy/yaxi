;(function () {



    var create = Object.create;

    var array = Array.prototype;

    var push = array.push;

    var splice = array.splice;


    var base = this;




    // 定义存储器
    yaxi.store = function (properties) {
    
        var prototype = create(base);

        function Store(parent) {

            this.$parent = parent || null;
        }

        prototype.$Model = yaxi.model(properties);

        Store.model = prototype.__model_type = 2;
        Store.prototype = prototype;

        return Store;
    }


    

    this.length = 0;


    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;




    this.$bind = function (repeater) {

        (this.__bindings || (this.__bindings = [])).push(repeater);
    }


    this.$unbind = function (repeater) {

        var bindings = this.__bindings;

        if (bindings)
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i] === repeater)
                {
                    bindings.splice(i, 1);

                    if (!bindings[0])
                    {
                        this.__bindings = null;
                    }
                    break;
                }
            }
        }
    }




    function createModels(store, list, index) {

        var outputs = [],
            Model = store.$Model,
            parent = store.$parent,
            length = list.length,
            model;

        while (index < length)
        {
            model = new Model(parent);
            model.$assign(list[index++]);
            outputs.push(model);
        }

        return outputs;
    }


    function notify(store, type, arg1, arg2) {

        var bindings;

        if (bindings = store.__bindings)
        {
            for (var i = 0, l = bindings.length; i < l; i++)
            {
                bindings[i][type](arg1, arg2);
            }
        }
    }



    this.push = function () {

        if (arguments.length > 0)
        {
            var list = createModels(this, arguments, 0);

            push.apply(this, list);
            notify(this, '__model_insert', -1, list);
        }

        return this.length;
    }


    this.pop = function () {

        var item = array.pop.call(this);

        if (item)
        {
            item.$parent = item.__bindings = null;
            notify(this, '__model_remove', -1, 1);
        }

        return item;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var list = createModels(this, arguments, 0);

            array.unshift.apply(this, list);
            notify(this, '__model_insert', 0, list);
        }

        return this.length;
    }


    this.shift = function () {

        var item = array.shift.call(this);

        if (item)
        {
            item.$parent = item.__bindings = null;
            notify(this, '__model_remove', 0, 1);
        }

        return item;
    }


    this.splice = function (index, length) {

        var deleted, inserted;

        if ((index |= 0) < 0 && (index += this.length) < 0)
        {
            index = 0;
        }

        if (arguments.length > 2)
        {
            inserted = createModels(this, arguments, 2);
            deleted = splice.apply(this, [index, length].concat(inserted));
        }
        else
        {
            deleted = splice.apply(this, arguments);
        }

        if (deleted.length > 0)
        {
            for (var i = deleted.length; i--;)
            {
                deleted[i].$parent = deleted[i].__bindings = null;
            }

            notify(this, '__model_remove', index, deleted.length);
        }

        if (inserted)
        {
            notify(this, '__model_insert', index, inserted);
        }

        return deleted;
    }


    this.clear = function () {

        var list = splice.call(this, 0);

        if (list.length > 0)
        {
            for (var i = list.length; i--;)
            {
                list[i].$parent = list[i].__bindings = null;
            }

            notify(this, '__model_clear');
        }

        return list;
    }


    this.sort = function (sortFn) {

        array.sort.call(this, sortFn);

        for (var i = this.length; i--;)
        {
            this[i].__index = i;
        }

        notify(this, '__model_sort', 0);
    }


    this.reverse = function () {

        array.reverse.call(this);
        
        for (var i = this.length; i--;)
        {
            this[i].__index = i;
        }

        notify(this, '__model_sort', 1);
    }


    
}).call(Object.create(null));
