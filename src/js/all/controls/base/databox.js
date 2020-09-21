/*
 * DataBox是一个通过数据集合(data)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.DataBox = yaxi.Control.extend(function (Class, base) {


    
    // 布局
    this.$property('layout', '', {

        class: 'yx-layout-'
    });


    // 模板
    this.$property('template', null, {
     
        change: false,

        get: function () {

            return this.__template || null;
        },

        set: function (value) {

            if (typeof value === 'function')
            {
                this.__template = value;
            }
            else
            {
                throw new Error('databox template must be a template function!');
            }
        }
    });



    // 数据容器类型, 只支持data和model
    // data:    直接数据绑定, 只能通过修改data重新渲染子控件, 不能直接对渲染好的控件进行修改, 性能好, 适合渲染后不需要太多变化的场景
    // model:   模型数据绑定, 可通过操作模型对子控件进行操控
    this.$property('type', 'data', false);



    // 数据集合
    this.$property('data', null, {

        change: false,

        get: function () {

            return this.__data || null;
        },

        set: function (value) {

            var template;

            if (value && value.length > 0)
            {
                this.__data = value;

                if (template = this.__template)
                {
                    load(this, value, template);
                }
            }
            else
            {
                this.__data = null;
                this.__children.clear();
            }
        }
    });

    

    // 子控件集合
    this.$property('children', null, {

        get: no_children,
        set: no_children
    });


    function no_children () {

        throw new Error('databox doesn\'t supports children, please use data and template!');
    }



    this.__load_content = function (value, scope) {

        var data;

        if ((this.template = value) && (data = this.__data))
        {
            load(this, data, value, scope);
        }
    }




    function throwError(text) {

        throw new Error('databox load fault: ' + text);
    }
 


    function load(databox, data, template, scope) {

        switch (databox.type)
        {
            case 'data':
                loadData(databox, data, template, scope);
                break;

            case 'model':
                if (data.__model_type !== 2)
                {
                    throwError('data must be a array model when model type!');    
                }

                loadModel(databox, data, template, scope);
                break;

            default:
                throwError('only support data or model type!');
        }
    }

    


    function loadTemplate(controls, scope, index, item, template) {

        var control;

        scope = scope.concat(index, item);

        if (control = this.$createSubControl(template, scope))
        {
            control.__d_scope = scope;
            controls.push(control);
        }
    }

    
    function createControls(databox, data, template, scope) {

        var controls = [];
        var fn;

        scope || (scope = findScope(databox));
        fn = loadTemplate.bind(databox, controls, scope);

        template(fn, data, scope);

        return controls;
    }


    function findScope(control) {

        var stack;

        while (control)
        {
            if (stack = control.__d_scope)
            {
                return stack;
            }

            control = control.parent;
        }

        return [];
    }


    function loadData(databox, data, template, scope) {

        var children = databox.__children;
   
        if (children.length > 0)
        {
            children.clear();
        }

        var controls = createControls(databox, data, template, scope);

        if (controls.length > 0)
        {
            children.push.apply(children, controls);
        }
    }



    function loadModel(databox, arrayModel, template, scope) {

        var old;

        if (old = databox.__array_model)
        {
            if (old !== arrayModel)
            {
                unbind(databox, old);
                bind(databox, arrayModel);
            }
        }
        else
        {
            bind(databox, arrayModel);
        }

        loadData(databox, arrayModel, template, scope);
    }


    function bind(databox, arrayModel) {

        var bindings;

        if (bindings = arrayModel.__bindings)
        {
            bindings.push(databox.uuid);
        }
        else
        {
            arrayModel.__bindings = [databox.uuid];
        }

        databox.__array_model = arrayModel;
    }


    function unbind(databox, arrayModel) {

        var bindings;

        if (bindings = arrayModel.__bindings)
        {
            var index = bindings.indexOf(databox.uuid);

            if (index >= 0)
            {
                bindings.splice(index, 1);
            }
        }

        databox.__array_model = null;
    }




    this.__on_set = function (index, model) {

        var template, controls;

        if (template = this.__template)
        {
            controls = createControls(this, [model], template);

            if (controls.length > 0)
            {
                this.__children.set(index, control);
            }
        }
    }


    this.__on_insert = function (index, list) {

        var template;

        if (template = this.__template)
        {
            list = createControls(this, list, template);

            if (list.length > 0)
            {
                this.__children.__insert(index, list);
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

        var index;

        a = a.__d_scope;
        b = b.__d_scope;

        index = a.length - 1;

        a = a[index].__index;
        b = b[index].__index;

        return a > b ? 1 : (a < b ? -1 : 0);
    }





    // 扩展查询实现
    yaxi.impl.query.call(this);



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




}, function DataBox() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('DataBox');
