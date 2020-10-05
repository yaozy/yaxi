Object.extend.call({}, 'Control', function (Class, base, yaxi) {




    var create = Object.create;

    var own = Object.getOwnPropertyNames;



    // 注册的控件类集合
    var classes = yaxi.classes;


    
    // 补丁集合
    var patches = yaxi.__patches = [];


    // 调度器
    var schedule = 0;


    

    // 默认允许任意类型父控件
    Class.allowParent = true;

    // 渲染器扩展
    Class.renderer = renderer;




    // 注册补丁
    var patch = yaxi.patch = function (control) {

        var parent;

        control.__dirty = true;

        while (parent = control.parent)
        {
            if (parent.__dirty)
            {
                return;
            }

            parent.__dirty = true;
            control = parent;
        }

        patches.push(control);

        if (!schedule)
        {
            schedule = setTimeout(update, 0);
        }
    }


    // 更新补丁
    function update() {

        yaxi.__on_page_patch(patches);
        schedule = patches.length = 0;
    }


    function throwError(text) {

        throw new Error('create control error: ' + text);
    }



    // 检查父控件
    function checkParent(Class, parent) {

        var check;

        if (!Class)
        {
            throwError('type can not be null!');
        }

        if (check = Class.allowParent)
        {
            if (check !== true && !check(parent || (parent = yaxi.Box.prototype)))
            {
                throwError(Class.typeName + ' can not be a sub type of ' + parent.typeName + '!');
            }
        }
        else if (check = Class.typeName)
        {
            throwError(check + ' can not be a sub type!');
        }
        else
        {
            throwError(JSON.stringify(Class).substring(0, 20) + '... not a valid type!');
        }
    }

    
    
    Class.build = function (parent, options, scope) {

        var type, control;

        if (options)
        {
            // 本来就是控件
            if (options instanceof Class)
            {
                // 插槽控件不处理, 插槽控件的父控件直接指向component组件对象
                if (options.__slot)
                {
                    return options;
                }

                control = options;
                checkParent(control.constructor, parent);

                if (control.parent && control.parent !== parent)
                {
                    control.remove();
                }

                control.parent = parent;

                return control;
            }

            if (type = options[0])
            {
                if (typeof type === 'string' && !(type = classes[type]))
                {
                    if (options[0] === 'slot')
                    {
                        throwError('can only use slot in component!');
                    }

                    throwError('"' + options[0] + '" doesn\'t register!');
                }
                
                checkParent(type, parent);

                control = new type();

                control.parent = parent;
                control.__load(options, scope);

                return control;
            }
        }

        throwError('no options, eg: ["box", { theme: "text-primary" }, [[...], ...]]');
    }



    
    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$properties = create(null);


    // 渲染器
    this.$renderer = create(null);



    // 标记是否已发生变化
    this.__dirty = true;




    // 扩展属性实现
    this.$ = this.property = yaxi.impl.property();




    // 构建触发变更通知的属性
    function build_set_change(name, convert) {

        var init = create;
        var key = '__set_' + name;

        return function (value) {

            var changes, any;

            if (convert)
            {
                value = convert.call(this, value);
            }

            if (changes = this.__changes)
            {
                if (value !== (any = changes[name]))
                {
                    changes[name] = value;

                    if (this[key] && this[key](value, any) === false)
                    {
                        if (this.__fields[name] === any)
                        {
                            delete changes[name];
                        }
                        else
                        {
                            changes[name] = any;
                        }
                    }
                }
            }
            else if (value !== (any = this.__fields)[name])
            {
                (this.__changes = init(any))[name] = value;

                if (this[key] && this[key](value, any[name]) === false)
                {
                    this.__changes = null;
                }
                else
                {
                    this.__dirty || patch(this);
                }
            }
        }
    }


    // 构建不触发变更通知的属性
    function build_set_unchange(name, convert) {

        var key = '__set_' + name;

        return function (value) {

            var fields = this.__fields;
            var oldValue = fields[name];

            if (convert)
            {
                value = convert.call(this, value);
            }

            if (value !== oldValue)
            {
                fields[name] = value;

                if (this[key] && this[key](value, oldValue) === false)
                {
                    fields[name] = oldValue;
                }
            }
        }
    }


    
    this.__build_get = function (name, options) {

        return options.change ? function () {

            return (this.__changes || this.__fields)[name];

        } : function () {

            return this.__fields[name];
        }
    }


    this.__build_set = function (name, options) {

        return (options.change ? build_set_change : build_set_unchange)(name, options.convert);
    }




    // 直接设置属性值
    this.$set = function (name, value) {

        var fields, changes;

        if (changes = this.__changes)
        {
            if (value !== changes[name])
            {
                changes[name] = value;
                this.__dirty || patch(this);
            }
        }
        else if (value !== (fields = this.__fields)[name])
        {
            (this.__changes = create(fields))[name] = value;
            this.__dirty || patch(this);
        }
    }



    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls;


    // 控件唯一id
    this.$('uuid', 0, {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });


    // 收缩uuid
    this.__shrink_uuid = function () {

        var list = controls;
        var count = 0;

        for (var i = uuid; i--;)
        {
            if (list[i])
            {
                uuid -= count;
                return;
            }
            
            count++;
        }
    }



    // id 控件id仅做为内部属性用, 不会同步到dom节点上
    this.$('id', '', false);


    
    // 控件风格
    this.$('theme', '', {

        kind: 'class',
        data: 'yx-theme-'
    });
    


    // 插槽名
    this.$('slot', '', false);


    // 是否隐藏
    this.$('hidden', false, {

        kind: 'attribute'
    });


    // 是否选中
    this.$('selected', false, {

        change: false,

        get: function () {

            return this.__selected || false;
        },

        set: function (value) {

            if ((value = !!value) !== this.__selected)
            {
                // 从不选中状态切换到选中有选中状态值时则切换状态
                if ((this.__selected = value) && (value = this.__selected_status))
                {
                    changeSelectedStatus(this, value);
                }
                else if (this.__save_status) // 有保存的状态时清空
                {
                    changeSelectedStatus(this);
                }
            }
        }
    });


    // 选中时状态
    this.$('selectedStatus', null, {
        
        change: false,

        alias: 'selected-status',

        get: function () {

            return this.__selected_status || null;
        },

        set: function (value) {

            this.__selected_status = value;

            if (this.__selected)
            {
                changeSelectedStatus(this, value);
            }
        }
    });



    // 变更选中状态
    function changeSelectedStatus(control, selectedStatus) {

        var status;

        // 有缓存状态时需先恢复
        if (status = control.__save_status)
        {
            for (var name in status)
            {
                var values = status[name];

                // 等于选中值才恢复
                if (control[name] === values[1])
                {
                    control[name] = values[0];
                }
            }

            status = null;
        }

        // 处理选中状态
        if (selectedStatus)
        {
            status = {};

            for (var name in selectedStatus)
            {
                var value1 = control[name];

                control[name] = selectedStatus[name];;
                status[name] = [value1, control[name]];
            }
        }

        // 记录保存状态
        control.__save_status = status;
    }

    

    // 自定义key
    this.$('key', '', false);
    

    // 自定义tag
    this.$('tag', null, false);



    // 父控件
    this.parent = null;


    // 顶级控件
    this.$('root', null, {

        get: function () {

            var target = this;
            var parent;

            while (parent = target.parent)
            {
                target = parent;
            }

            return target;
        }
    });



    // 绝对定位
    // 本系统不支持 display, position, float等布局相关的属性
    // 布局使用flex, 在容器上设置layout实现
    // 绝对定位使用absolute, 设置了absolute的情况下top, left, right, bottom属性才生效
    // 这么限制的目的是为了让系统能够更容易的跨平台, 使用上述布局体系也能很方便的实现业务布局需求
    this.$('absolute', '', {

        kind: 'class',
        data: 'yx-absolute-',
        layout: false
    });



    // 是否使用静态定位(默认使用相对定位)
    this.$('static', false, {

        kind: 'class',
        data: 'yx-static',
        layout: false
    });




    var style = function (name, layout, data) {

        this.$(name, '', {

            alias: name.replace(/-(\w)/g, function (_, x) {
        
                return x.toUpperCase();
            }),

            kind: 'style',
            data: data | 0,
            layout: layout
        });

    }.bind(this);



    style('overflow', 1);


    style('overflow-x', 1);


    style('overflow-y', 1);


    style('top', 0, 1);

    style('right', 0, 1);

    style('bottom', 0, 1);

    style('left', 0, 1);


    style('width', 0, 1);


    style('height', 0, 1);


    style('min-width', 0, 1);


    style('max-width', 0, 1);


    style('min-height', 0, 1);


    style('max-height', 0, 1);


    style('margin', 0, 1);

    style('margin-top', 0, 1);

    style('margin-right', 0, 1);

    style('margin-bottom', 0, 1);

    style('margin-left', 0, 1);


    style('border', 0, 3);

    style('border-top', 0, 3);

    style('border-right', 0, 3);

    style('border-bottom', 0, 3);

    style('border-left', 0, 3);


    style('padding', 1, 1);

    style('padding-top', 1, 1);

    style('padding-right', 1, 1);

    style('padding-bottom', 1, 1);

    style('padding-left', 1);



    style('flex-direction', 1);


    style('flex-wrap', 1);


    style('flex-flow', 1);


    style('justify-content', 1);


    style('align-items', 1);


    style('align-content', 1);



    style('order', 0);


    style('flex-grow', 0);


    style('flex-shrink', 0);


    style('flex-basis', 0);


    style('flex', 0);


    style('align-self', 0);


    style('justify-self', 0);
    


    //控件层叠顺序
    style('z-index', 0);


    //控件内容横向对齐样式
    //left      左边对齐
    //center    横向居中对齐
    //right     右边对齐
    style('text-align', 1);



    style('outline', 0, 3);

    style('outline-color', 0, 2);

    style('outline-style', 0);

    style('outline-offset', 0, 1);

    style('outline-width', 0, 1);



    style('box-shadow', 0, 3);



    //控件上右下左边框宽度
    style('border-width', 0, 1);

    style('border-top-width', 0, 1);

    style('border-right-width', 0, 1);

    style('border-bottom-width', 0, 1);

    style('border-left-width', 0, 1);


    //控件上右下左边框样式
    style('border-style', 0);

    style('border-top-style', 0);

    style('border-right-style', 0);

    style('border-bottom-style', 0);

    style('border-left-style', 0);


    //控件上右下左边框颜色
    style('border-color', 0, 2);

    style('border-top-color', 0, 2);

    style('border-right-color', 0, 2);

    style('border-bottom-color', 0, 2);

    style('border-left-color', 0, 2);


    //控件上右下左边框圆角
    style('border-radius', 0, 1);

    style('border-top-left-radius', 0, 1);

    style('border-top-right-radius', 0, 1);

    style('border-bottom-left-radius', 0, 1);

    style('border-bottom-right-radius', 0, 1);


    //阅读方向
    //ltr	    从左到右 
    //rtl	    从右到左 
    style('direction', 0);

    
    //控件透明度
    //number	0(完全透明)到1(完全不透明)之间数值
    style('opacity', 0);


    // 控件背景
    style('background', 0, 2);


    //控件背景颜色
    //color_name	规定颜色值为颜色名称的背景颜色(比如 red)  transparent:透明 
    //hex_number	规定颜色值为十六进制值的背景颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的背景颜色(比如 rgb(255,0,0)) 
    style('background-color', 0, 2);

    //控件背景图片
    //string        图像名(空字符串则表示无背景)
    //url('URL')	指向图像的路径
    style('background-image', 0);

    //控件背景重复方式
    //repeat	背景图像将在垂直方向和水平方向重复 
    //repeat-x	背景图像将在水平方向重复 
    //repeat-y	背景图像将在垂直方向重复 
    //no-repeat	背景图像将仅显示一次 
    style('background-repeat', 0);

    //控件背景颜色对齐方式
    //top left
    //top center
    //top right
    //center left
    //center center
    //center right
    //bottom left
    //bottom center
    //bottom right  如果您仅规定了一个关键词, 那么第二个值将是'center'     默认值：0% 0% 
    //x% y%	        第一个值是水平位置, 第二个值是垂直位置     左上角是 0% 0% 右下角是 100% 100%     如果您仅规定了一个值, 另一个值将是 50% 
    //xpos ypos	    第一个值是水平位置, 第二个值是垂直位置     左上角是 0 0 单位是像素 (0px 0px) 或任何其他的 CSS 单位     如果您仅规定了一个值, 另一个值将是50%     您可以混合使用 % 和 position 值 
    style('background-position', 0, 1);


    //控件颜色
    //color_name	规定颜色值为颜色名称的颜色(比如 red) 
    //hex_number	规定颜色值为十六进制值的颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的颜色(比如 rgb(255,0,0)) 
    style('color', 1, 2);


    // 字体
    style('font', 1, 3);


    //控件字体样式
    //normal	浏览器显示一个标准的字体样式 
    //italic	浏览器会显示一个斜体的字体样式 
    //oblique	浏览器会显示一个倾斜的字体样式 
    style('font-style', 1);

    //控件字体变体
    //normal	    浏览器会显示一个标准的字体 
    //small-caps	浏览器会显示小型大写字母的字体 
    style('font-variant', 1);

    //控件字体粗细
    //normal	定义标准的字符 
    //bold	    定义粗体字符 
    //bolder	定义更粗的字符 
    //lighter	定义更细的字符 
    //100-900   定义由粗到细的字符 400 等同于 normal, 而 700 等同于 bold 
    style('font-weight', 1);

    //控件字体大小
    style('font-size', 1, 1);

    //控件文字行高
    style('line-height', 1, 1);

    //控件字体族 family-name generic-family  用于某个元素的字体族名称或/及类族名称的一个优先表
    style('font-family', 1);


    //
    style('white-space', 1, 1);


    //控件文字词间距(以空格为准)
    style('word-spacing', 1, 1);

    //控件文字字间距
    style('letter-spacing', 1, 1);

    //控件文字缩进
    style('text-indent', 1);

    //控件文字装饰
    //none	        默认 定义标准的文本 
    //underline	    定义文本下的一条线 
    //overline	    定义文本上的一条线 
    //line-through	定义穿过文本下的一条线 
    //blink	        定义闪烁的文本 
    style('text-decoration', 1);

    //控件文字溢出处理方式
    //clip	    修剪文本
    //ellipsis	显示省略符号来代表被修剪的文本 	
    //string	使用给定的字符串来代表被修剪的文本 
    style('text-overflow', 1);


    style('text-shadow', 1, 3);



    //转换
    style('transform', 0, 1);


    style('transform-origin', 0, 1);


    style('transform-style', 0);


    style('transform-box', 0)



    //过渡
    style('transition', 0);


    style('transition-delay', 0);


    style('transition-duration', 0);


    style('transition-property', 0);


    style('transition-timing-function', 0);



    //动画
    style('animation', 0);


    style('animation-delay', 0);


    style('animation-direction', 0);


    style('animation-duration', 0);


    style('animation-fill-mode', 0);


    style('animation-iteration-count', 0);


    style('animation-name', 0);


    style('animation-play-state', 0);

    
    style('animation-timing-function', 0);




    // 变更缓存
    var A = Array;
    var changesCache = [0, new A(20), new A(20), 0, new A(200), new A(200), 0, new A(100), new A(100)];


    // 颜色转换函数, 把@color颜色变量转换成实际的颜色
    var convertColor = function (translateFn, value) {

        return value ? ('' + value).replace(this, translateFn) : '';

    }.bind(/@([\w-]+)/g, function (_, key) {

        return this[key];

    }.bind(yaxi.color));


    var replaceClass = /\s+/g;

    

    // 获取变更数据
    this.__get_changes = function (changes, fields) {

        var properties = this.$properties;
        var names = own(changes || (changes = this.__changes));
        var cache = changesCache;
        var index = 0;
        var property, name, value, any;

        // 置空
        cache[0] = cache[3] = cache[6] = 0;

        while (name = names[index++])
        {
            property = properties[name];
            value = changes[name];
            fields && (fields[name] = value);

            switch (property && property.kind)
            {
                case 'class': // class属性
                    if (value)
                    {
                        any = ' ' + property.data;
                        value = property.type === 'string' ? any + value.replace(replaceClass, any) : any;
                    }
                    else
                    {
                        value = '';
                    }

                    any = cache[0]++;
                    cache[1][any] = property;
                    cache[2][any] = value;
                    break;

                case 'style': // 样式属性
                    // 处理颜色值
                    if ((property.data) & 2 === 2)
                    {
                        value = convertColor(value);
                    }

                    any = cache[3]++;
                    cache[4][any] = property;
                    cache[5][any] = value;
                    break;

                default:
                    any = cache[6]++;
                    cache[7][any] = property;
                    cache[8][any] = value;
                    break;
            }
        }

        return cache;
    }
    



    // 从json结构加载组件
    /*
     * [
     *   'box',
     *   null,
     *   [
     *       ['text', null, 'test1'],
     *       ['text', null, 'test2'],
     *   ]
     * ]
    */
    this.__load = function (options, scope) {

        var data, fn;

        if (data = options[1])
        {
            this.__load_attributes(data);
        }

        if ((data = options[2]) && (fn = this.__load_children))
        {
            fn.call(this, data, scope);
        }

        return this;
    }


    this.__load_attributes = function (attributes) {

        var properties = this.$properties;
        var property, changes, fn, value;

        for (var name in attributes)
        {
            value = attributes[name];

            if (property = properties[name])
            {
                // 从转换器中获取存储名以解决别名存储的问题
                name = property.name;

                if (fn = property.convert)
                {
                    value = fn.call(this, value);

                    // 有属性值才处理, 像events, bindings等纯转换器不处理
                    if (name)
                    {
                        if (property.change) // 需要处理变化
                        {
                            (changes || (changes = this.__changes = create(this.__fields)))[name] = value;
                        }
                        else
                        {
                            (property.force ? this : this.__fields)[name] = value;
                        }
                    }
                }
                else if (fn !== false)
                {
                    this[name] = value;
                }
            }
            else
            {
                this[name] = value;
            }
        }
    }



    this.load = function (options) {

        this.__load(options);
    }


    this.loadTemplate = function (template, data, model) {

        this.__load(template.call(this, data, model));
    }
    


    this.$properties.bindings = {
        
        convert: yaxi.$bind
    };



    // 推送绑定
    this.$push = function (value) {

        var change;

        if (change = this.__onchange)
        {
            change(value);
        }
    }


    
    // 开放管道函数给模板用
    this.pipe = yaxi.pipe.compile;



    // 扩展查找实现
    yaxi.impl.find.call(this);
    

    // 向上查找存在非空key值的控件
    this.lookupHasKey = function () {

        var control = this;

        do
        {
            if (control.key)
            {
                return control;
            }
        }
        while (control = control.parent);
    }


    // 向上查找存在非空tag值的控件
    this.lookupHasTag = function () {

        var control = this;

        do
        {
            if (control.tag != null)
            {
                return control;
            }
        }
        while (control = control.parent);
    }



    
    // 扩展事件支持
    yaxi.EventTarget.mixin(this);

    
    this.$properties.events = {
        
        convert: function (events) {

            for (var name in events)
            {
                this.on(name, events[name]);
            }
        }
    };




    this.remove = function () {

        var parent = this.parent;
        var children;
        var index;

        if (parent && (children = parent.__children) && (index = children.indexOf(this)) >= 0)
        {
            // 插槽控件被移除后就不再是插槽控件了
            if (this.__slot)
            {
                this.__slot = false;
            }

            children.splice(index, 1);
        }
    }

    
    this.destroy = function () {

        var bindings, uuid;

        if (uuid = this.__uuid)
        {
            controls[uuid] = null;

            if (bindings = this.__bindings)
            {
                for (var i = bindings.length; i--;)
                {
                    bindings[i--].$unbind(bindings[i], uuid);
                }
                
                this.__bindings = null;
            }
        }

        if (this.__event_keys)
        {
            this.off();
        }

        this.$view = null;
        this.ondestroy && this.ondestroy();

        this.parent = this.__onchange = this.__scope = null;
    }


    this.destroyChildren = function (children) {

        var control;

        for (var i = children.length; i--;)
        {
            // 无父窗口的控件则销毁
            if ((control = children[i]) && !control.parent)
            {
                control.destroy();
            }
        }
    }



    
    this.__class_init = function (Class) {

        Class.allowParent = true;
        Class.renderer = renderer;

        this.$defaults = create(this.$defaults);
        this.$properties = create(this.$properties);
        this.$renderer = create(this.$renderer);
    }



    function renderer(fn) {

        var prototype = this.prototype;
        var base = this.superclass;

        if (base && (base = base.prototype))
        {
            base = base.$renderer;
        }
        
        fn.call(prototype.$renderer, base || null, yaxi);
    }




}, function Control() {
 
    var init;

    this.__fields = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});
