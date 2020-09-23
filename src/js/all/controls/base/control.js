yaxi.Control = Object.extend.call({}, function (Class, base, yaxi) {



    var create = Object.create;


    var eventTarget = yaxi.EventTarget.prototype;



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



    classes[Class.typeName = this.typeName = 'Control'] = classes.control = Class;




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

        if (!parent)
        {
            throwError('parent can not be null!');
        }

        if (check = Class.allowParent)
        {
            if (check !== true && !check(parent))
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

        var Class, control;

        if (options)
        {
            if (options.$storage && (Class = options.constructor))
            {
                checkParent(Class, parent);

                control = options;

                if (control.parent && control.parent !== parent)
                {
                    control.remove();
                }

                control.parent = parent;
                return control;
            }

            if (Class = options[0])
            {
                if (typeof Class === 'string' && !(Class = classes[Class]))
                {
                    throwError('"' + options[0] + '" doesn\'t register!');
                }
                
                checkParent(Class, parent);

                control = new Class();
                control.parent = parent;
                control.load(options, scope);

                return control;
            }
        }

        throwError('no options, eg: ["box", { theme: "primary" }, [[...], ...]]');
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
    this.$property = yaxi.impl.property();




    // 构建触发变更通知的属性
    function build_set_change(name, convert) {

        var init = create;

        return function (value) {

            var storage, changes;

            value = convert ? convert.call(this, value) : value;

            if (changes = this.__changes)
            {
                if (value !== changes[name])
                {
                    changes[name] = value;
                    this.__dirty || patch(this);
                }
            }
            else if (value !== (storage = this.$storage)[name])
            {
                (this.__changes = init(storage))[name] = value;
                this.__dirty || patch(this);
            }
        }
    }


    // 构建不触发变更通知的属性
    function build_set_unchange(name, convert) {

        return convert ? function (value) {

            this.$storage[name] = convert.call(this, value);

        } : function (value) {

            this.$storage[name] = value;
        }
    }

    
    this.__build_get = function (name, options) {

        return options.change ? function () {

            return (this.__changes || this.$storage)[name];

        } : function () {

            return this.$storage[name];
        }
    }


    this.__build_set = function (name, options) {

        return (options.change ? build_set_change : build_set_unchange)(name, options.convert);
    }




    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls || (yaxi.$controls = create(null));


    // 控件唯一id
    this.$property('uuid', 0, {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });



    // id 控件id仅做为内部属性用, 不会同步到dom节点上
    this.$property('id', '', false);


    // 默认class
    this.$class = 'yx-control';



    
    // 控件风格
    this.$property('theme', '', {

        kind: 'class',
        data: 'yx-theme-'
    });
    


    // 是否隐藏
    this.$property('hidden', false);


    // 是否禁用
    this.$property('disabled', false);


    // 是否选中
    this.$property('selected', false, {

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
    this.$property('selectedStatus', null, {
        
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
    this.$property('key', '', false);
    

    // 自定义tag
    this.$property('tag', null, false);



    // 父控件
    this.parent = null;


    // 顶级控件
    this.$property('root', null, {

        get: function () {

            var target = this,
                parent;

            while (parent = target.parent)
            {
                target = parent;
            }

            return target;
        }
    });



    var style = function (name, data) {

        this.$property(name, '', {

            alias: name.replace(/-(\w)/g, function (_, x) {
        
                return x.toUpperCase();
            }),

            kind: 'style',
            data: data | 0,
            style: true
        });

    }.bind(this);



    style('position');


    style('overflow');


    style('overflow-x');


    style('overflow-y');


    style('top', 1);

    style('right', 1);

    style('bottom', 1);

    style('left', 1);


    style('width', 1);


    style('height', 1);


    style('min-width', 1);


    style('max-width', 1);


    style('min-height', 1);


    style('max-height', 1);


    style('margin', 1);

    style('margin-top', 1);

    style('margin-right', 1);

    style('margin-bottom', 1);

    style('margin-left', 1);


    style('border', 3);

    style('border-top', 3);

    style('border-right', 3);

    style('border-bottom', 3);

    style('border-left', 3);


    style('padding', 1);

    style('padding-top', 1);

    style('padding-right', 1);

    style('padding-bottom', 1);

    style('padding-left', 1);



    style('flex-direction');


    style('flex-wrap');


    style('flex-flow');


    style('justify-content');


    style('align-items');


    style('align-content');



    style('order');


    style('flex-grow');


    style('flex-shrink');


    style('flex-basis');


    style('flex');


    style('align-self');


    style('justify-self');
    


    //控件层叠顺序
    style('z-index');


    //控件内容横向对齐样式
    //left      左边对齐
    //center    横向居中对齐
    //right     右边对齐
    style('text-align');



    style('outline', 3);

    style('outline-color', 2);

    style('outline-style');

    style('outline-offset', 1);

    style('outline-width', 1);



    style('box-shadow', 3);



    //控件上右下左边框宽度
    style('border-width', 1);

    style('border-top-width', 1);

    style('border-right-width', 1);

    style('border-bottom-width', 1);

    style('border-left-width', 1);


    //控件上右下左边框样式
    style('border-style');

    style('border-top-style');

    style('border-right-style');

    style('border-bottom-style');

    style('border-left-style');


    //控件上右下左边框颜色
    style('border-color', 2);

    style('border-top-color', 2);

    style('border-right-color', 2);

    style('border-bottom-color', 2);

    style('border-left-color', 2);


    //控件上右下左边框圆角
    style('border-radius', 1);

    style('border-top-left-radius', 1);

    style('border-top-right-radius', 1);

    style('border-bottom-left-radius', 1);

    style('border-bottom-right-radius', 1);


    //阅读方向
    //ltr	    从左到右 
    //rtl	    从右到左 
    style('direction');

    
    //控件透明度
    //number	0(完全透明)到1(完全不透明)之间数值
    style('opacity');


    // 控件背景
    style('background', 2);


    //控件背景颜色
    //color_name	规定颜色值为颜色名称的背景颜色(比如 red)  transparent:透明 
    //hex_number	规定颜色值为十六进制值的背景颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的背景颜色(比如 rgb(255,0,0)) 
    style('background-color', 2);

    //控件背景图片
    //string        图像名(空字符串则表示无背景)
    //url('URL')	指向图像的路径
    style('background-image');

    //控件背景重复方式
    //repeat	背景图像将在垂直方向和水平方向重复 
    //repeat-x	背景图像将在水平方向重复 
    //repeat-y	背景图像将在垂直方向重复 
    //no-repeat	背景图像将仅显示一次 
    style('background-repeat');

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
    style('background-position', 1);


    //控件颜色
    //color_name	规定颜色值为颜色名称的颜色(比如 red) 
    //hex_number	规定颜色值为十六进制值的颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的颜色(比如 rgb(255,0,0)) 
    style('color', 2);


    // 字体
    style('font', 3);


    //控件字体样式
    //normal	浏览器显示一个标准的字体样式 
    //italic	浏览器会显示一个斜体的字体样式 
    //oblique	浏览器会显示一个倾斜的字体样式 
    style('font-style');

    //控件字体变体
    //normal	    浏览器会显示一个标准的字体 
    //small-caps	浏览器会显示小型大写字母的字体 
    style('font-variant');

    //控件字体粗细
    //normal	定义标准的字符 
    //bold	    定义粗体字符 
    //bolder	定义更粗的字符 
    //lighter	定义更细的字符 
    //100-900   定义由粗到细的字符 400 等同于 normal, 而 700 等同于 bold 
    style('font-weight');

    //控件字体大小
    style('font-size', 1);

    //控件文字行高
    style('line-height', 1);

    //控件字体族 family-name generic-family  用于某个元素的字体族名称或/及类族名称的一个优先表
    style('font-family');


    //
    style('white-space', 1);


    //控件文字词间距(以空格为准)
    style('word-spacing', 1);

    //控件文字字间距
    style('letter-spacing', 1);

    //控件文字缩进
    style('text-indent');

    //控件文字装饰
    //none	        默认 定义标准的文本 
    //underline	    定义文本下的一条线 
    //overline	    定义文本上的一条线 
    //line-through	定义穿过文本下的一条线 
    //blink	        定义闪烁的文本 
    style('text-decoration');

    //控件文字溢出处理方式
    //clip	    修剪文本
    //ellipsis	显示省略符号来代表被修剪的文本 	
    //string	使用给定的字符串来代表被修剪的文本 
    style('text-overflow');


    style('text-shadow', 3);



    //转换
    style('transform', 1);


    style('transform-origin', 1);


    style('transform-style');


    style('transform-box')



    //过渡
    style('transition');


    style('transition-delay');


    style('transition-duration');


    style('transition-property');


    style('transition-timing-function');



    //动画
    style('animation');


    style('animation-delay');


    style('animation-direction');


    style('animation-duration');


    style('animation-fill-mode');


    style('animation-iteration-count');


    style('animation-name');


    style('animation-play-state');

    
    style('animation-timing-function');
    



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
    this.load = function (options, scope) {

        var attributes, properties, property, changes, fn, value;

        if (attributes = options[1])
        {
            properties = this.$properties;

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
                                (changes || (changes = this.__changes = create(this.$storage)))[name] = value;
                            }
                            else
                            {
                                this.$storage[name] = value;
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

        if ((value = options[2]) && (fn = this.__load_subdata))
        {
            fn.call(this, value, scope);
        }

        return this;
    }
    


    this.$properties.bindings = {
        
        convert: yaxi.$bind
    };



    // 推送绑定
    this.$push = function (value) {

        var change;

        if (change = this.__b_onchange)
        {
            change(value);
        }
    }


    
    // 开放管道函数给模板用
    this.pipe = yaxi.pipe.compile;




    // 扩展查找实现
    yaxi.impl.find.call(this);
    


    
    // 绑定事件
    this.on = eventTarget.on;

    
    // 绑定只执行一次的事件
    this.once = eventTarget.once;


    // 注销事件
    this.off = eventTarget.off;


    // 触发事件
    this.trigger = eventTarget.trigger;


    // 检测是否注册了指定的事件
    this.hasEvent = eventTarget.hasEvent;



    // content控件加载计数器, 如果大于0表示正在加载content控件内部子控件
    yaxi.__content_count = 0;


    this.$properties.events = {
        
        convert: function (events) {

            // 容器控件内部不允许绑定事件
            if (yaxi.__content_count > 0)
            {
                throw new Error('register event error: no support event inside the content control!');
            }

            for (var name in events)
            {
                this.on(name, events[name]);
            }
        }
    };




    // 查找存在非空key值的控件
    this.findHasKey = function () {

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


    // 查找存在非空tag值的控件
    this.findHasTag = function () {

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


    // 查找事件触发目标, disabled的控件不能触发, content control会接管所有子控件事件
    this.findEventTarget = function () {

        var target = this;
        var parent = target;

        while (parent)
        {
            if (parent.disabled)
            {
                target = parent.parent;
            }
            else if (parent.__is_content) // 记录下content控件, 仅最外层的content control触发事件
            {
                target = parent;
            }

            parent = parent.parent;
        }

        return target;
    }



    this.remove = function () {

        var parent = this.parent,
            children,
            index;

        if (parent && (children = parent.__children) && (index = children.indexOf(this)) >= 0)
        {
            children.splice(index, 1);
        }
    }



    
    this.destroy = function () {

        var bindings, uuid;

        if (uuid = this.__uuid)
        {
            delete controls[uuid];
        }

        if (bindings = this.__bindings)
        {
            for (var i = bindings.length; i--;)
            {
                bindings[i--].$unbind(bindings[i], uuid);
            }
            
            this.__bindings = null;
        }

        if (this.__event_keys)
        {
            this.off();
        }

        this.$view = null;
        this.ondestroy && this.ondestroy();

        this.parent = this.__model = this.__b_onchange = this.__d_scope = null;
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
        
        Class.register = register;
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


    function register(name) {

        if (name)
        {
            var prototype = this.prototype;

            classes[this.typeName = prototype.typeName = name] = this;
            classes[name = name.toLowerCase()] = this;

            prototype.$class = prototype.$class + ' yx-' + name;
        }

        return this;
    }



}, function Control() {
 
    var init;

    this.$storage = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});
