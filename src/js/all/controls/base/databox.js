/*
 * DataBox是一个通过数据集合(data)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
 * 对于只读渲染比ModelBox具有更好的性能
*/
yaxi.ModelBox = yaxi.Control.extend(function (Class, base) {



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
                throw 'the template of databox must be a required template or a function!';
            }
        }
    });



    // 数据集合
    this.$property('data', null, {

        change: false,

        get: function () {

            return this.__data || null;
        },

        set: function () {

            if (value && value instanceof A && value.length > 0)
            {
                loadData(this, this.__data = value);
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

        throw 'DataBox doesn\'t supports children, please use data and template!';
    }



    this.__load_content = function (value) {

        this.template = value;
    }



    var message = 'control load error: ';



    function loadData(databox, data) {

        var template = databox.__template;

        if (!template)
        {
            throw message + 'databox control does not specify a template!';
        }

        var children = this.__children;

        if (children.length > 0)
        {
            children.clear();
        }

        this.load(template.call(this, data));
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);




}, function ModelBox() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('ModelBox');
