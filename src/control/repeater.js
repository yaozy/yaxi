yaxi.Repeater = yaxi.Control.extend(function (Class, base) {




    yaxi.template(this, '<div class="yx-control yx-repeater"></div>');

    

    
    // 布局类型
    this.$property('layout', '');


    // 布局间隙(仅对layout === row || column有效)
    this.$property('gap', 0);


    // 子组件充满
    this.$property('full', '');


    // 去掉子组件外边距
    this.$property('nomargin', '');


    // url基础路径(没置了此路径点击时将打开子项绑定的url)
    this.$property('base', '', false, 'baseURL');


    // 模板
    this.$property('template', {
     
        defaultValue: null,

        set: function (template) {

            var storage = this.$storage;

            if (template && typeof template !== 'object')
            {
                template = null;
            }

            if (storage.template !== template)
            {
                storage.template = template;

                this.__children.clear();

                if (storage.store)
                {
                    this.__model_insert(-1, storage.store);
                }
            }
        }

    }, false);



    // 存储器
    this.$property('store', {

        defaultValue: null,

        converter: function (store) {

            if (store)
            {
                if (typeof store === 'string')
                {
                    store = this.__find_store(store);
                }

                if (store.$bind)
                {
                    store.$bind(this);
                }
            }
            else
            {
                if ((store = this.store) && store.$bind)
                {
                    store.$unbind(this);
                }

                store = null;
            }

            return store;
        },

        set: function (store) {

            var storage = this.$storage;

            store = this.$converter.store.fn.call(this, store);

            if (storage.store !== store)
            {
                storage.store = store;

                this.__children.clear();

                if (store && storage.template)
                {
                    this.__model_insert(-1, store);
                }
            }
        }

    }, false);

    

    // 子模型名称
    this.$property('submodel', 'item', false);



    this.assign = function (values) {

        base.assign.call(this, values);
        
        if (values.template && (values = this.store))
        {
            this.__model_insert(-1, values);
        }
    }




    this.__patch = function (dom) {

        var changes = base.__patch.call(this, dom);

        if (changes && (changes.template || changes.store))
        {
            this.__children.clear();

            if ((changes = this.store) && changes.length > 0)
            {
                this.__model_insert(0, changes);
            }
        }
    }



    this.__model_insert = function (index, list) {

        var template = this.template;

        if (template)
        {
            var subtype = template.Class || yaxi.Panel,
                children = this.__children,
                controls = [],
                any;

            for (var i = 0, l = controls.length = list.length; i < l; i++)
            {
                any = controls[i] = new subtype();
                any.parent = this;
                any.model = list[i];

                any.assign(template);
            }

            // 先直接插件到子控件集合(不使用children的push及splice以提升性能)
            if (index < 0)
            {
                controls.push.apply(children, controls);
            }
            else
            {
                controls.splice.apply(children, [index, 0].concat(controls));
            }

            // 处理子控件补丁
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
                
                if (!this.__dirty)
                {
                    this.$patch();
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
    yaxi.impl.container.call(this, base);


    // 扩展下拉刷新功能
    yaxi.impl.pulldown.call(this);


    

}, function Repeater() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.ControlCollection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Repeater');
