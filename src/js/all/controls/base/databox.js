/*
 * DataBox是一个通过数据集合(data)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.Control.extend('DataBox', function (Class, base, yaxi) {




    var Control = yaxi.Control;

    var build = Control.build;



    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });


    // 模板
    this.$('template', null, {
     
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



    // 数据集合
    // 可以是数组模型也可以是普通的数组, 如果是普通数组不能实现双向绑定
    this.$('data', null, {

        change: false,

        get: function () {

            return this.__data || null;
        },

        set: function (value) {

            var any;

            if ((any = this.__model) && any !== value)
            {
                unbind(this, any);
            }

            if (value)
            {
                if (value.__model_type === 2)
                {
                    bind(this, value);
                }

                if (value.length > 0)
                {
                    this.__data = value;

                    if (any = this.__template)
                    {
                        loadData(this, value, any);
                    }

                    return;
                }
            }

            this.__data = null;

            if (this.__loaded)
            {
                showEmpty(this);
            }
        }
    });



    // 加载中配置, 取值范围: false或null或控件对象
    // false表示不显示loading
    // null表示显示默认的loading控件
    // 指定控件时表示使用自定义的loading控件来展示
    this.$('loading', null, {

        change: false,
        convert: convert('loading')
    });



    // 无数据时配置, 取值范围: false或null或控件对象
    // false表示无数据时不显示任何信息
    // null表示显示默认的无数据控件
    // 指定控件时表示使用自定义的控件来展示无数据时的内容
    this.$('empty', null, {

        change: false,
        convert: convert('empty')
    });



    function convert(text) {

        return function (value) {

            if (value)
            {
                if (value instanceof Control)
                {
                    return value;
                }
    
                throw new Error('databox ' + text + ' can only null or false or a control!');
            }
            
            return value === false ? false : null;
        }
    }


    

    // 子控件集合
    this.$('children', null, {

        get: nochildren,
        set: nochildren
    });


    function nochildren () {

        throw new Error('BataBox control doesn\'t supports children, please use data and template!');
    }



    this.__load_children = function (value, scope) {

        var data;

        if (this.template = value)
        {
            if (data = this.__data)
            {
                loadData(this, data, value, scope);
            }
            else
            {
                this.showLoading();
            }
        }
        
        // 标记子项已经加载过
        this.__loaded = true;
    }



    this.showLoading = function () {

        var children = this.__children;
        var loading = this.loading;

        children.clear();

        if (loading !== false)
        {
            children.append(loading || new yaxi.Loading());
        }
    }


    this.closeLoading = function () {

        var loading;

        if (loading = this.loading || this.find('>>loading'))
        {
            this.__children.remove(loading);
        }
    }


    function showEmpty(databox) {

        var children = databox.__children;
        var empty = databox.empty;

        children.clear();

        if (empty !== false)
        {
            children.append(empty || new yaxi.DataEmpty());
        }
    }
    

    function loadTemplate(controls, scope, index, item, template) {

        var control;

        scope = scope.concat(index, item);

        if (control = build(this, template, scope))
        {
            control.__scope = scope;
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
            if (stack = control.__scope)
            {
                return stack;
            }

            control = control.parent;
        }

        return [];
    }


    function loadData(databox, data, template, scope) {

        var children = databox.__children;
        var controls = createControls(databox, data, template, scope);

        children.clear();
        
        if (controls.length > 0)
        {
            children.load(controls);
        }
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

        databox.__model = arrayModel;
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

        databox.__model = null;
    }




    this.__on_load = function (list) {

        var template;
        
        if (list.length > 0 && (template = this.__template))
        {
            var children = this.__children;

            if (children.__length > 0)
            {
                children.clear();
            }

            list = createControls(this, list, template);
            this.__children.__insert(-1, list);
        }
        else
        {
            showEmpty(this);
        }
    }


    this.__on_set = function (index, model) {

        var template, controls;

        if (template = this.__template)
        {
            controls = createControls(this, [model], template);

            if (controls.length > 0)
            {
                this.__children.__set(index, controls[0]);
            }
        }
    }


    this.__on_insert = function (index, list) {

        var template;

        if (template = this.__template)
        {
            list = createControls(this, list, template);
            this.__children.__insert(index, list);
        }
    }


    this.__on_removeAt = function (index, length) {

        this.__children.removeAt(index, length);
    }


    this.__on_clear = function () {

        this.__children.clear();
    }


    this.__on_sort = function () {

        this.__children.sort(sort);
    }

    
    this.__on_reverse = function () {

        this.__children.reverse();
    }


    function sort(a, b) {

        var index;

        a = a.__scope;
        b = b.__scope;

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

        if (any = this.__model)
        {
            unbind(this, any);
        }

        base.destroy.call(this);
    }




}, function DataBox() {

    var init;
    
    this.__fields = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});
