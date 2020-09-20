/*
 * DataBox是一个通过数据集合(data)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
 * 不支持对子项进行修改, 对于不需要修改子项的渲染比ModelBox具有更好的性能
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
                throw new Error('the template of databox must be a required template or a function!');
            }
        }
    });



    // 子模型名称
    this.$property('submodel', '', false);


    // 数据集合
    this.$property('data', null, {

        change: false,

        get: function () {

            return this.__data || null;
        },

        set: function (value) {

            if (value && value.length > 0)
            {
                this.__data = value;

                if (this.__template)
                {
                    loadData(this, value);
                }
            }
            else
            {
                this.__data = null;
                this.__children.clear();
            }
        }
    });

    

    this.$property('scope', '', {

        change: false,

        convert: function (value) {

            value = '' + value;
            this.__scope = value ? value.split(',') : null;
        }
    });

    

    // 子控件集合
    this.$property('children', null, {

        get: no_children,
        set: no_children
    });


    function no_children () {

        throw new Error('DataBox doesn\'t supports children, please use data and template!');
    }



    this.__load_content = function (value) {

        var data;

        if (this.template = value)
        {
            if (data = this.__data)
            {
                loadData(this, data);
            }
            else if ((data = this.submodel) && (data = this.findSubmodel(data)))
            {
                loadData(this, data);
            }
        }
    }



    // 当前作用域
    var scopeStack = null;



    this.loadTemplate = function (controls, scope, item, index, template) {

        var length = template.length;

        if (length > 0)
        {
            try
            {
                scopeStack = scope = scope.concat(item, index);

                for (var i = length; i--;)
                {
                    var item = template[i];
                    var attributes = item[1];
    
                    if (attributes)
                    {
                        attributes.__data_stack = scope;
                    }
                    else
                    {
                        item[1] = { __data_stack: scope };
                    }
    
                    controls.push(this.$createSubControl(item));
                }
            }
            finally
            {
                scopeStack = scope;
            }
        }
    }


    function loadData(databox, data) {

        var template = databox.__template;
 
        if (!template)
        {
            throw new Error('control load error: databox control does not specify a template!');
        }

        var children = databox.__children;
        var controls = [];

        if (children.length > 0)
        {
            children.clear();
        }

        template.call(databox, controls, data, scopeStack || initScopeStack(databox));
        children.push.apply(children, controls);
    }


    function initScopeStack(control) {

        var stack;

        while (control)
        {
            if (stack = control.__data_stack)
            {
                return scopeStack = stack;
            }

            control = control.parent;
        }

        return scopeStack = [];
    }


    // 扩展查询实现
    yaxi.impl.query.call(this);




}, function DataBox() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('DataBox');
