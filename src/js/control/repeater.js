yaxi.Repeater = yaxi.Control.extend(function (Class, base) {



    var create = Object.create;




    yaxi.template(this, '<div class="yx-control yx-repeater"></div>');

    

    Class.ctor = function (data) {

        this.$storage = create(this.__defaults);

        this.__children = new yaxi.ControlCollection(this);

        if (data)
        {
            this.__init(data);
        }
    }




    // 模板
    this.template = null;


    this.__convert_template = [0, function (template) {

        this.template = template;
    }];



    // 存储
    this.store = null


    this.__convert_store = [0, function (value) {

        var store = null;

        if (value)
        {
            if (value && value.__model_type === 2)
            {
                store = value;
            }
            else
            {
                store = this.__find_model(value);
            }

            if (store)
            {
                store.bind(this);
            }
        }

        this.store = store;

    }];


    
    // 模板
    this.template = null;


    this.__convert_template = [0, function (template) {

        if (this.template = template)
        {
            var store = this.store;

            if (this.__subtype = template.Class)
            {
                delete template.Class;
            }
            else
            {
                this.__subtype = yaxi.Panel;
            }

            if (store && store.length > 0)
            {
                this.__model_insert(0, store);
            }
        }
    }];



    // 存储
    this.store = null


    this.__convert_store = [0, function (value) {

        var store = null;

        if (value)
        {
            if (value && value.__model_type === 2)
            {
                store = value;
            }
            else
            {
                store = this.__find_store(value);
            }
        }
        
        if (store)
        {
            store.$bind(this);

            if (store.length > 0)
            {
                this.__model_insert(0, store);
            }
        }
        else if (this.store)
        {
            store.$unbind(this);
        }

        this.store = store;
    }];




    var patch = yaxi.__add_patch;


    this.__model_insert = function (index, models) {

        var template = this.template;

        if (template)
        {
            var subtype = this.__subtype,
                children = this.__children,
                controls = [],
                any;

            for (var i = 0, l = controls.length = models.length; i < l; i++)
            {
                any = controls[i] = new subtype();
                any.parent = this;
                any.model = models[i];

                any.__init(template);
            }

            if (index < 0)
            {
                controls.push.apply(children, controls);
            }
            else
            {
                controls.splice.apply(children, [index, 0].concat(controls));
            }

            if (children.__patch)
            {
                if (any = children.__changes)
                {
                    if (index >= 0)
                    {
                        any[0] = 1;
                    }

                    any.push.apply(any[1], controls);
                }
                else
                {
                    children.__changes = index < 0 ? [0, controls] : [1, controls];
                    patch(children);
                }
            }
        }
    }


    this.__model_remove = function (index, length) {

        this.__children.splice(index, length);
    }


    this.__model_clear = function () {

        this.__children.clear();
    }


    this.__model_sort = function () {

        this.__children.sort(sort);
    }


    function sort(a, b) {

        return a.model.__index - b.model.__index || 0;
    }



    // 扩展容器功能
    yaxi.container.call(this, base);




}).register('Repeater');
