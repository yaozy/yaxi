/*
 * Repeater是一个通过模型(arrayModel)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.Repeater = yaxi.Control.extend(function (Class, base) {



    var A = Array;

    
    // 标记不能被继承
    Class.sealed = true;


    
    // 布局
    this.$property('layout', '', {

        class: 'yx-layout-'
    });


    // 模板
    this.$property('template', null, {
     
        change: false,

        convert: function (value) {

            if (value != null)
            {
                if (value instanceof A)
                {
                    // 只有一个子控件直接设置成单个控件
                    if (value.length === 1 && value[0] instanceof A)
                    {
                        value = value[0];
                    }
                }
                else
                {
                    value = ['text', null, '' + value];
                }
            }

            return value;
        }
    });



    // 子模型名称
    this.$property('submodel', '', {

        change: false
    });

    

    // 子控件集合
    this.$property('children', null, {

        get: no_children,
        set: no_children
    });



    function no_children () {

        throw 'Repeater doesn\'t supports children, please use model and template!';
    }



    this.__load_content = function (value) {

        this.template = value;
    }


    this.load = function (values, model) {

        var storage = this.$storage;
        var name;

        if (!model)
        {
            throw 'repeater does not specify a model!';
        }

        base.load.call(this, values, model);
        
        if (name = storage.submodel)
        {
            model = model[name];

            if (!model)
            {
                throw 'can not find repeater submodel "' + name + '"!';
            }

            if (model.__model_type !== 2)
            {
                throw 'repeater model "' + name + '" not a valid array model!';
            }
        }

        this.reload(model);
    }


    this.reload = function (arrayModel) {

        if (!arrayModel || arrayModel.__model_type !== 2)
        {
            throw 'repeater reload method need a array model!';
        }

        var template = this.template;
        var any;

        if (!template)
        {
            throw 'repeater does not specify a template!';
        }

        var children = this.__children;

        if (children.length > 0)
        {
            children.clear();
        }

        if (any = this.__arrayModel)
        {
            if (any !== arrayModel)
            {
                unbind(this, any);
                bind(this, arrayModel);
            }
        }
        else
        {
            bind(this, arrayModel);
        }

        if (arrayModel.length > 0)
        {
            any = createControls(this, arrayModel, template);
            children.__insert(-1, any);
        }
    }


    function bind(repeater, arrayModel) {

        var bindings;

        if (bindings = arrayModel.__bindings)
        {
            bindings.push(repeater.uuid);
        }
        else
        {
            arrayModel.__bindings = [repeater.uuid];
        }

        repeater.__arrayModel = arrayModel;
    }


    function unbind(repeater, arrayModel) {

        var bindings;

        if (bindings = arrayModel.__bindings)
        {
            var index = bindings.indexOf(repeater.uuid);

            if (index >= 0)
            {
                bindings.splice(index, 1);
            }
        }

        repeater.__arrayModel = null;
    }


    function createControls(parent, arrayModel, template) {

        var length = arrayModel.length;
        var list, control, model;

        // [['xxx', ...]]形式为多子控件模板
        if (template[0] instanceof A)
        {
            var template_length = template.length;
            var index = 0;
            
            list = new A(length * template_length);

            for (var i = 0; i < length; i++)
            {
                model = arrayModel[i];
    
                for (var j = 0; j < template_length; j++)
                {
                    control = parent.$createSubControl(template, model);
                    control.__model = model;

                    list[index++] = control;
                }
            }
        }
        else // ['xxx', ...]为单个子控件
        {
            list = new A(length);

            for (var i = 0; i < length; i++)
            {
                model = arrayModel[i];

                control = parent.$createSubControl(template, model);
                control.__model = model;

                list[i] = control;
            }
        }

        return list;
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);



    this.__on_set = function (index, model) {

        var template;

        if (template = this.template)
        {
            var control = this.$createSubControl(template, model);

            control.__model = model;
            this.__children.set(index, control);
        }
    }


    this.__on_insert = function (index, list) {

        var template;

        if (template = this.template)
        {
            list = createControls(this, list, template);
            this.__children.__insert(index, list);
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

        if (any = this.__arrayModel)
        {
            unbind(this, any);
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
