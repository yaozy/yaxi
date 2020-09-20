/*
 * ModelBox是一个通过数组模型和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.ModelBox = yaxi.Control.extend(function (Class, base) {



    var A = Array;

    
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
    this.$property('submodel', '', false);

    

    // 子控件集合
    this.$property('children', null, {

        get: no_children,
        set: no_children
    });



    function no_children () {

        throw new Error('ModelBox doesn\'t supports children, please use model and template!');
    }



    this.__load_content = function (value) {

        this.template = value;
    }



    var message = 'control load error: ';


    this.__load = function (values, model) {

        var storage = this.$storage;
        var name;

        if (!model)
        {
            throw new Error(message + 'modelbox control must bind a model!');
        }

        base.__load.call(this, values, model);
        
        if (name = storage.submodel)
        {
            model = this.findSubmodel(name, model);
        }

        reload(this, model);
    }


    function reload(modelbox, array) {

        if (!array || array.__model_type !== 2)
        {
            throw new Error(message + 'modelbox control must bind a array model!');
        }

        var template = modelbox.template;

        if (!template)
        {
            throw new Error(message + 'modelbox control does not specify a template!');
        }

        var children = modelbox.__children;
        var old;

        if (children.length > 0)
        {
            children.clear();
        }

        if (old = modelbox.__array_model)
        {
            if (old !== array)
            {
                unbind(modelbox, old);
                bind(modelbox, array);
            }
        }
        else
        {
            bind(modelbox, array);
        }

        if (array.length > 0)
        {
            children.__insert(-1, createControls(modelbox, array, template));
        }
    }


    function bind(modelbox, array) {

        var bindings;

        if (bindings = array.__bindings)
        {
            bindings.push(modelbox.uuid);
        }
        else
        {
            array.__bindings = [modelbox.uuid];
        }

        modelbox.__array_model = array;
    }


    function unbind(modelbox, array) {

        var bindings;

        if (bindings = array.__bindings)
        {
            var index = bindings.indexOf(modelbox.uuid);

            if (index >= 0)
            {
                bindings.splice(index, 1);
            }
        }

        modelbox.__array_model = null;
    }


    function createControls(parent, array, template) {

        var length = array.length;
        var list, control, model;

        // [['xxx', ...]]形式为多子控件模板
        if (template[0] instanceof A)
        {
            var template_length = template.length;
            var index = 0;
            
            list = new A(length * template_length);

            for (var i = 0; i < length; i++)
            {
                model = array[i];
    
                for (var j = 0; j < template_length; j++)
                {
                    control = parent.$createSubControl(template[j], model);
                    list[index++] = control;
                }
            }
        }
        else // ['xxx', ...]为单个子控件
        {
            list = new A(length);

            for (var i = 0; i < length; i++)
            {
                model = array[i];

                control = parent.$createSubControl(template, model);
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

        if (any = this.__array_model)
        {
            unbind(this, any);
        }

        base.destroy.call(this);
    }



}, function ModelBox() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('ModelBox');
