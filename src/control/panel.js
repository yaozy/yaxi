yaxi.Panel = yaxi.Control.extend(function (Class, base) {

    

    yaxi.template(this, '<div class="yx-control yx-panel"></div>');



    // 布局类型
    this.$property('layout', '');


    // 组件间隙
    this.$property('gap', '');


    // 子组件充满
    this.$property('full', '');

    
    // 去掉子组件外边距
    this.$property('nomargin', '');


    // url基础路径(没置了此路径点击时将打开子项绑定的url)
    this.$property('base', '', false, 'baseURL');



    // 子控件集合
    Object.defineProperty(this, 'children', {

        get: function () {

            return this.__children;
        },
        set: function (value) {

            var children = this.__children;

            if (children.length > 0)
            {
                children.clear();
            }

            if (value && value.length > 0)
            {
                children.push.apply(children, value);
            }
        }
    });


    this.$converter.children = {
        
        fn: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.assign(values);
            }
        }
    };


    // 子控件类型
    this.__child_class = yaxi.Control;




    // 扩展容器功能
    yaxi.impl.container.call(this, base);


    // 扩展下拉刷新功能
    yaxi.impl.pulldown.call(this);




}, function Panel() {
 
    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.ControlCollection(this);
    
    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Panel');

