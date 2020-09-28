yaxi.Control.extend(function (Class, base, yaxi) {


    
    var create = Object.create;

    var assign = Object.assign;


    var A = Array;
    
    var build = yaxi.Control.build;
    

    // 管道编译器
    var compile = yaxi.pipe.compile;

    // 控件对象集合
    var controls = yaxi.$controls || (yaxi.$controls = create(null));



    this.__build_get = function (name) {

        var yx = yaxi;
        var create = Object.create;

        return function () {

            var target, observes, any;

            if (target = yx.__bindingTarget)
            {
                // 添加观察对象
                if (observes = this.__observes)
                {
                    if (any = observes[name])
                    {
                        any.push(target);
                    }
                    else
                    {
                        observes[name] = [target];
                    }
                }
                else
                {
                    (this.__observes = create(null))[name] = [target];
                }
    
                // 给控件记录依赖关系以便控件销毁时自动解除绑定
                if (bindings = control.__bindings)
                {
                    bindings.push(name, this);
                }
                else
                {
                    control.__bindings = [name, this];
                }
            }

            return (this.__changes || this.$storage)[name];
        }
    }


    this.__build_set = function (name, convert) {

        var init = create;

        return function (value) {

            var changes;

            value = convert ? convert.call(this, value) : value;

            if (changes = this.__changes)
            {
                if (value !== changes[name])
                {
                    onchange.call(this, name);

                    changes[name] = value;
                    this.__dirty || patch(this);
                }
            }
            else if (value !== this.$storage[name])
            {
                onchange.call(this, name);

                (this.__changes = init(this.$storage))[name] = value;
                this.__dirty || patch(this);
            }
        }
    }


    function onchange(name) {

        var observes, observe, control, index;
        
        if ((observes = this.__observes) && (observes = observes[name]))
        {
            index = 0;

            while (observe = observes[index++])
            {
                if (control = controls[observe.control])
                {
                    if (fn = observe.fn)
                    {
                        control[observe.property] = fn(compile);
                    }
                }
                else
                {
                    observes.splice(--index, 1);
                }
            }
        }
    }




    this.load = function (options) {

        this.__template = options;
        return this;
    }


    this.loadTemplate = function (template, data, model) {

        this.__template = template.call(this, data, model);
        return this;
    }


    this.__load = function (options, scope) {

        var template = this.__template || [];
        var shadow, values;

        if (shadow = this.__shadow)
        {
            for (var i = shadow.length; i--;)
            {
                shadow[i].destroy();
                shadow[i].__own = null;
            }
        }

        if (values = template[0])
        {
            if (options[1])
            {
                assign(values, options[1]);
            }
        }
        else
        {
            values = options[1];
        }

        if (values)
        {
            this.__load_attributes(values);
        }

        if (values = template[1])
        {
            this.__shadow = createControls(this, values);
        }
    }


    function parseSlot(values, slots) {

        for (var i = values.length; i--;)
        {
            // if (value)
        }
    }


    function createControls(parent, values) {

        var length = values.length;
        var list = new A(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = build(parent, values[i], false);
        }

        return list;
    }



    // 观测属性变化
    this.$watch = function (name, listener) {

        var watches, items;

        if (name && typeof listener === 'function')
        {
            if (watches = this.__watches)
            {
                if (items = watches[name])
                {
                    items.push(listener);
                }
                else
                {
                    watches[name] = [listener];
                }
            }
            else
            {
                (this.__watches || (this.__watches = create(null)))[name] = [listener];
            }
        }
    }


    // 取消观测属性变化
    this.$unwatch = function (name, listener) {

        var watches, items;

        if (watches = this.__watches)
        {
            if (typeof listener === 'function')
            {
                if (items = watches[name])
                {
                    for (var i = items.length; i--;)
                    {
                        if (items[i] === listener)
                        {
                            items.splice(i, 1);
                            return;
                        }
                    }
                }
            }
            else if (name)
            {
                if ((items = watches[name]) && items.length > 0)
                {
                    items.length = 0;
                    delete watches[name];
                }
            }
            else
            {
                for (name in watches)
                {
                    watches[name].length = 0;
                }
    
                this.__watches = null;
            }
        }
    }


    // 通知属性变化
    this.$notify = function (name, value) {

        var watches, items, index, fn;

        if ((watches = this.__watches) && (items = watches[name]))
        {
            index = 0;

            while (fn = items[index++])
            {
                if (fn.call(target, this, value) === false)
                {
                    return false;
                }
            }
        }
    }



    // 解除绑定
    this.$unbind = function (name, uuid) {

        var observes = this.__observes;

        if (observes && (observes = observes[name]))
        {
            for (var i = observes.length; i--;)
            {
                if (observes[i].control === uuid)
                {
                    observes.splice(i, 1);
                    break;
                }
            }
        }
    }



    this.__load_children = function (values, scope) {

        
    }



    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].destroy();
            children[i].__own = null;
        }

        base.destroy.call(this);
    }



    yaxi.component = function (name, fn) {

        if (typeof name === 'function')
        {
            fn = name;
            name = '';
        }

        return Class.extend(fn).register(name);
    }
    


}, function Component () {

    var init;

    this.$storage = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});






yaxi.component('Header', function (Class, base) {



    var template = function ($owner, $data, $model) {

        var $property = $owner.$property;

        return (
            [
                "box",
                null,
                [
                    [
                        "icon",
                        {
                            "icon": "icon-common-back",
                            "hidden": "true",
                            "bindings": {
                                "text": function () {

                                    return this.text;
                                }
                            }
                        }
                    ],
                    [
                        "slot",
                        null
                    ]
                ]
            ]
        )
    }



    this.init = function () {

        this.loadTemplate(template);
    }



    this.property('text', '')


});
