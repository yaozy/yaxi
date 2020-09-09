/*
 * Repeater是一个通过模型(arrayModel)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.Repeater = yaxi.Control.extend(function (Class, base) {



    var assign = Object.assign;


    
    // 标记不能被继承
    Class.sealed = true;



    // 模板
    this.$property('template', {
     
        defaultValue: null,

        converter: function (value) {

            var storage = this.$storage;
            var arrayModel = storage.arrayModel;

            if (value && typeof value !== 'object')
            {
                value = null;
            }
            else if (arrayModel && value !== storage.template)
            {
                rebuild(this, arrayModel, value);
            }

            return value;
        }

    }, false);



    // 数组模型
    this.$property('arrayModel', {

        defaultValue: null,

        converter: function (value) {

            if (value)
            {
                var arrayModel, template;

                if (typeof value !== 'object')
                {
                    arrayModel = this.__find_arrayModel(value = '' + value);
                }
                else if (value.__model_type === 2)
                {
                    arrayModel = value;
                }
                else
                {
                    return null;
                }

                if (arrayModel !== this.__arrayModel)
                {
                    arrayModel.$bind(this);
                    this.__arrayModel = arrayModel;

                    if (template = this.$storage.template)
                    {
                        rebuild(this, value, template);
                    }
                }
            }
            else
            {
                value = null;
            }

            return value;
        }

    }, false);

    

    // 子项名称
    this.$property('item', 'item', false);


    // 索引名称
    this.$property('index', 'index', false);


    // 子控件集合
    this.$property('children', {

        get: no_children,
        set: no_children
    });



    function no_children () {

        throw 'Repeater doesn\'t supports children property, please use template and arrayModel!';
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);


    

    function rebuild(repeater, arrayModel, template) {

        var children = repeater.__children;

        if (children[0])
        {
            children.clear();
        }

        if (arrayModel && arrayModel[0])
        {
            children.push.apply(children, createItems(arrayModel, template));
        }
    }



    function createItems(arrayModel, template) {

        var length = arrayModel.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = assign({ __model: arrayModel[i] }, template);
        }

        return list;
    }


    this.__on_set = function (index, item) {

        var template;

        if (template = this.template)
        {
            this.__children.set(index, assign({ __model: item }, template))
        }
    }


    this.__on_insert = function (index, list) {

        var template, children;

        if (template = this.template)
        {
            children = this.__children;
            list = createItems(list, template);

            if (index < 0)
            {
                children.push.apply(children, list);
            }
            else
            {
                list.unshift(index, 0);
                children.splice.apply(children, list);
            }
        }
    }


    this.__on_remove = function (index, length) {

        this.__children.splice(index, length);
    }


    this.__on_clear = function () {

        this.__children.clear();
    }


    this.__on_sort = function () {

        this.__children.sort(sort);
    }


    function sort(a, b) {

        a = a.__model.__index;
        b = b.__model.__index;

        return a > b ? 1 : (a < b ? -1 : 0);
    }



    this.destroy = function () {

        var any = this.__children;

        for (var i = any.length; i--;)
        {
            any[i].destroy();
        }

        if (any = this.arrayModel)
        {
            any.$unbind(this);
        }

        base.destroy.call(this);
    }



}, function Repeater() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Repeater');
