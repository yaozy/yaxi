yaxi.GroupView = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-groupview">' +
            '<div class="yx-groupview-body"></div>' + 
            '<div class="yx-groupview-nav"></div>' + 
            '<div class="yx-groupview-show"></div>' + 
        '</div>');

    

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
                update.call(this);
            }
        }

    }, false);



    // 数据集合
    this.$property('store', {

        defaultValue: null,

        converter: function (store) {

            if (store)
            {
                if (typeof store === 'string')
                {
                    store = this.__find_store(store);
                }
            }
            else
            {
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
                this.update();
            }
        }

    }, false);



    // 分组设置
    this.$property('groups', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    


    this.assign = function (values) {

        base.assign.call(this, values);
        
        if (values.template && (values = this.store))
        {
            update.call(this);
        }
    }


    this.update = function () {

        var children = this.__children,
            template,
            store;

        if (children.length > 0)
        {
            children.clear();
        }

        if ((template = this.template) && (store = this.store) && store.length > 0)
        {
            // 
        }
    }



    this.group = function (data) {


    }



    this.__update_patch = function () {

        var changes;

        if (changes = this.__changes)
        {
            base.__update_patch.call(this);

            if (changes.template || changes.store)
            {
                update.call(this);
            }
        }
    }



    this.$converter.groups = function (dom, value) {

        
    }



}, function GroupView() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.ControlCollection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('GroupView');
