var yaxi = Object.create(null);



// rem自适应计算（按照375px的宽度，1rem = 100px的比例）
document.documentElement.style.fontSize = (yaxi.rem = window.innerWidth * 100 / 375) + 'px';


// 当前语言
yaxi.language = navigator.language || navigator.userLanguage || 'en-US';




Object.extend = function (fn) {
	
    var base = this.prototype || null,
        prototype = Object.create(base),
        ctor;

    function Class() {

		if (ctor)
		{
			ctor.apply(this, arguments);
		}
	}
	
    prototype.constructor = Class;

    Class.ctor = this.ctor;
    Class.superclass = this;
    Class.register = this.register;
    Class.extend = this.extend || Object.extend;
    Class.prototype = prototype;

    // 类初始化
    if (prototype.__class_init)
    {
        prototype.__class_init(Class, base);
    }

    if (fn)
    {
        fn.call(prototype, Class, base);
        ctor = Class.ctor;
    }

	return Class;
}




Function.prototype.bind || (Function.prototype.bind = function (context) {

    var fn = this;

    if (arguments.length > 1)
    {
        var list = [].slice.call(arguments, 1),
            push = list.push;

        return function () {

            var data = list.slice(0);

            if (arguments.length > 0)
            {
                push.apply(data, arguments);
            }

            return fn.apply(context || this, data);
        };
    }

    return function () {

        return fn.apply(context || this, arguments);
    };
});




(function () {
    

    var regex = /([yMdhmsSq]+)/g;
    
    var keys1 = {
    
        'GMT': 'toGMTString',
        'ISO': 'toISOString',
        'UTC': 'toUTCString',
        'date': 'toDateString',
        'time': 'toTimeString',
        'locale': 'toLocaleString',
        'locale-date': 'toLocaleDateString',
        'locale-time': 'toLocaleTimeString'
    };

    var keys2 = {

        'y': 'getFullYear',
        'd': 'getDate',
        'h': 'getHours',
        'm': 'getMinutes',
        's': 'getSeconds',
        'S': 'getMilliseconds'
    };


    this.format = function (format) {

        var any;

        if (format)
        {
            if (any = keys1[format])
            {
                return this[any]();
            }

            any = this;

            return format.replace(regex, function (_, text) {

                var length = text.length;

                switch (text = text.charAt(0))
                {
                    case 'M':
                        text = any.getMonth() + 1;
                        break;

                    case 'q':
                        text = (any.getMonth() + 3) / 3 | 0;
                        break;

                    default:
                        text = any[keys2[text]]();
                        break;
                }

                text = '' + text;

                if (length === 1 || (length -= text.length) <= 0)
                {
                    return text;
                }

                //substr负索引有IE7下有问题
                return '0000'.substring(0, length) + text;
            });
        }
        
        return this.toString();
    };



    this.addHour = function (value) {

        if (value |= 0)
        {
            this.setTime(this.getTime() + value * 3600000);
        }

        return this;
    }


    this.addMinute = function (value) {

        if (value |= 0)
        {
            this.setTime(this.getTime() + value * 60000);
        }

        return this;
    }


    this.addSecond = function (value) {

        if (value |= 0)
        {
            this.setTime(this.getTime() + value * 1000);
        }

        return this;
    }


    //解决不同浏览器对字符串解析不同的问题(不同浏览器之间存在很多差别)
    //比如IE不支持new Date('2017-1-1 1:1:1')
    Date.create = function (value) {

        if (value)
        {
            var date = new Date(value),
                any = date.valueOf();

            if (any === any)
            {
                return date;
            }

            if (typeof value === 'string' && (value = value.match(/\d+/g)))
            {
                any = value[1] | 0;
                return new Date(value[0], any > 0 ? any - 1 : 0, value[2] | 0, value[3] | 0, value[4] | 0, value[5] | 0);
            }
        }

        return null;
    };



}).call(Date.prototype);




;(function (html) {


    var encode = Object.create(null);

    var decode = Object.create(null);


    encode['&'] = '&amp;';
    encode['<'] = '&lt;';
    encode['>'] = '&gt;';
    encode['\''] = '&apos;';
    encode['"'] = '&quot;';

    decode['amp'] = '&';
    decode['lt'] = '<';
    decode['gt'] = '>';
    decode['apos'] = '\'';
    decode['quot'] = '"';



    //html编码函数
    html.encode = function (text) {

        if (text && typeof text === 'string')
        {
            var keys = encode;

            return text.replace(/([&<>'"])/g, function (_, key) {

                return keys[key];
            });
        }

        return '' + text;
    };


    //html解码函数
    html.decode = function (text) {

        var keys = decode;

        return text && text.replace(/&(\w+);/g, function (_, key) {

            return keys[key] || key;
        });
    };



})(yaxi.html = Object.create(null));




;(function (Math) {



    var round = Math.round;

    var toFixed = (0).toFixed;

    var cache = new Decimal(0);




    // 小数处理类
    function Decimal(value) {

        var v, d;

        if (value)
        {
            if (value instanceof Decimal)
            {
                d = value.d;
                v = value.v;
            }
            else if ((value = +value) === value)
            {
                if (value === (value | 0))
                {
                    v = value;
                }
                else if (d = (v = ('' + value).split('.'))[1])
                {
                    d = d.length;
                    v = +(v[0] + v[1]);
                }
                else
                {
                    d = 0;
                    v = value;
                }
            }
        }

        this.v = v || 0;
        this.d = d || 0;

        return this;
    }
    


    Decimal.singleton = Decimal.bind(new Decimal(0));




    var prototype = (window.Decimal = Decimal).prototype;



    prototype.clone = function () {

        var result = Object.create(prototype);

        result.v = this.v;
        result.d = this.d;

        return result;
    }


    prototype.plus = function (value) {

        var d1, d2;

        if (!value)
        {
            return this;
        }
        
        if (value instanceof Decimal)
        {
            d2 = value.d;
            value = value.v;
        }
        else if ((value = +value) !== value)
        {
            return this;
        }
        else if (value === (value | 0))
        {
            d2 = 0;
        }
        else if (d2 = (value = ('' + value).split('.'))[1])
        {
            d2 = d2.length;
            value = +(value[0] + value[1]);
        }
        else
        {
            d2 = 0;
        }
        
        if ((d1 = this.d) > d2)
        {
            this.v += value * ('1e' + d1) / ('1e' + d2);
        }
        else if (d1 < d2)
        {
            this.d = d2;
            this.v = this.v * ('1e' + d2) / ('1e' + d1) + value;
        }
        else
        {
            this.v += value;
        }

        return this;
    }


    prototype.minus = function (value) {

        return this.plus(-value);
    }


    prototype.mul = function (value) {

        var d;

        if (!value)
        {
            this.v = this.d = 0;
            return this;
        }

        if (!this.v)
        {
            return this;
        }

        if (value instanceof Decimal)
        {
            d = value.d;
            value = value.v;
        }
        else if ((value = +value) !== value)
        {
            return this;
        }
        else if (value === (value | 0))
        {
            d = 0;
        }
        else if (d = (value = ('' + value).split('.'))[1])
        {
            d = d.length;
            value = +(value[0] + value[1]);
        }
        else
        {
            d = 0;
        }

        if (value)
        {
            this.v *= value;
        }
        else
        {
            this.v = this.d = 0;
            return this;
        }

        this.d += d;

        return this;
    }


    prototype.div = function (value) {

        var d1, d2;
        
        if (!value)
        {
            this.v = this.d = 0;
            return this;
        }

        if (!this.v)
        {
            return this;
        }

        if (value instanceof Decimal)
        {
            d2 = value.d;
            value = this.v / value.v;
        }
        else if ((value = +value) !== value)
        {
            this.v = this.d = 0;
            return this;
        }
        else if (value === (value | 0))
        {
            d2 = 0;
        }
        else if (d2 = (value = ('' + value).split('.'))[1])
        {
            d2 = d2.length;
            value = +(value[0] + value[1]);
        }
        else
        {
            d2 = 0;
        }

        if (!value)
        {
            this.v = this.d = 0;
            return this;
        }

        if ((d1 = this.d) !== d2)
        {
            if (d1 > d2)
            {
                value = this.v / (value * ('1e' + (d1 - d2)));
            }
            else
            {
                value = this.v * ('1e' + (d2 - d1)) / value;
            }
        }
        else
        {
            value = this.v / value;
        }

        value = Decimal.call(cache, value);

        this.v = value.v;
        this.d = value.d;

        return this;
    }


    prototype.pow = function (value) {

        if (value |= 0)
        {
            var v = this.v;

            if (!v)
            {
                return this;
            }

            if (value > 0)
            {
                var d = this.d;

                if (value > d)
                {
                    this.d = 0;
                    this.v *= '1e' + (value - d);
                }
                else if (value === d)
                {
                    this.d = 0;
                }
                else
                {
                    this.d -= value;
                }
            }
            else
            {
                this.d -= value;
            }
        }

        return this;
    }


    prototype.round = function (digits) {

        var d = this.d;

        if ((digits |= 0) < d)
        {
            this.v = round(this.v * ('1e' + digits) / ('1e' + d));
            this.d = digits;
        }

        return this;
    }


    prototype.toFixed = function (digits) {

        var d = this.d;

        if ((digits |= 0) > 0)
        {
            if (d)
            {
                if (d > digits)
                {
                    return toFixed.call(round(this.v * ('1e' + digits) / ('1e' + d)) / ('1e' + digits), digits);
                }

                return toFixed.call(this.v / ('1e' + d), digits);
            }

            return toFixed.call(this.v, digits);
        }
        
        return d ? '' + round(this.v / ('1e' + d)) : '' + this.v;
    }


    prototype.valueOf = function () {
        
        var d = this.d;
        return d ? this.v / ('1e' + d) : this.v;
    }


    prototype.toString = function (k) {

        var d = this.d;
        return (d ? this.v / ('1e' + d) : this.v).toString(k);
    }




    Object.defineProperty(prototype, 'value', {

        get: function () {

            var d = this.d;
            return d ? this.v / ('1e' + d) : this.v;
        }
    });




    // 扩展数字方法
    var number = Number.prototype;


    // 注: 不同浏览器toFixed有差异, chrome使用的是银行家舍入规则
    // 银行家舍入: 所谓银行家舍入法, 其实质是一种四舍六入五取偶(又称四舍六入五留双)法
    // 简单来说就是: 四舍六入五考虑, 五后非零就进一, 五后为零看奇偶, 五前为奇应舍去, 五前为偶要进一
    // 此处统一处理为四舍五入
    if ((1.115).toFixed(2) === '1.11')
    {
        number.toFixed = function (digits) {

            return Decimal.call(cache, this).toFixed(digits);
        }
    }


    number.round = function (digits) {

        var value = +this;

        if (value !== value)
        {
            return 0;
        }

        if (value === (value | 0))
        {
            return value;
        }

        if ((digits |= 0) > 0)
        {
            var items = ('' + value).split('.'),
                d = items[1];

            if (!d || d.length <= digits)
            {
                return value;
            }

            return round(items[0] + d.slice(0, digits) + '.' + d[digits]) / ('1e' + digits);
        }
        
        return round(value);
    }



    // 重载四舍五入方法增加指定小数位数
    Math.round = function (value, digits) {

        return (+value).round(digits);
    }



})(Math);




yaxi.__extend_properties = function (get, set) {



    var define = Object.defineProperty;




    function to_boolean(value) {
        
        return !!value;
    }


    function to_integer(value) {

        return value | 0;
    }


    function to_number(value) {

        return +value || 0;
    }


    function to_string(value) {

        return '' + value;
    }


    function to_date(value) {

        return Date.create(value);
    }


    function to_object(value) {

        return value;
    }


    
    // 定义属性方法
    return function (name, options, change) {

        var defaultValue, converter, key;

        if (/\W/.test(name))
        {
            throw '"' + name + '" not a valid property name!'; 
        }

        if (options && typeof options === 'object')
        {
            key = options.name || name;
            defaultValue = options.defaultValue;
            converter = options.converter;

            if (defaultValue === void 0)
            {
                defaultValue = null;
            }
        }
        else
        {
            key = name;
            defaultValue = options == null ? null : options;
            options = {};
        }

        if (!converter)
        {
            switch (options.type || typeof defaultValue)
            {
                case 'boolean':
                    converter = to_boolean;
                    break;
    
                case 'int':
                case 'integer':
                    converter = to_integer;
                    break;
    
                case 'number':
                    converter = to_number;
                    break;
    
                case 'string':
                    converter = to_string;
                    break;
    
                case 'date':
                    converter = to_date;
                    break;
    
                default:
                    converter = to_object;
                    break;
            }
        }
 
        options.get || (options.get = get(key, change = change !== false));
        options.set || (options.set = set(key, converter, change));

        this.$defaults[name] = defaultValue;

        this.$converters[name] = {
            name: key,
            change: change,
            fn: converter
        };

        define(this, name, options);
    }


}





yaxi.Event = Object.extend(function (Class) {


    
    this.type = '';


    this.target = null;


    this.cancelBubble = false;

    
    this.defaultPrevented = false;



    this.stop = function () {

        this.cancelBubble = true;
    }


    this.prevent = function () {

        this.defaultPrevented = true;
    }

    
});



yaxi.EventTarget = Object.extend(function (Class) {

    
    var Event = yaxi.Event;

    var prototype = this;

    

    // 注册事件
    this.on = yaxi.on = function (type, listener) {
        
        if (type && typeof listener === 'function')
        {
            var events = this.__event_keys,
                items;

            if (events)
            {
                if (items = events[type])
                {
                    items.push(listener);
                }
                else
                {
                    items = events[type] = [listener];
                }
            }
            else
            {
                events = this.__event_keys = {};
                items = events[type] = [listener];
            }
            
            if (listener = this.__event_change)
            {
                this.__event_change(type, items, true);
            }
        }
    }


    // 注册只执行一次的事件
    this.once = yaxi.once = function (type, listener) {

        if (typeof listener === 'function')
        {
            function callback(event) {

                listener.call(this, event);
                this.off(type, callback);
            }

            this.on(type, callback);
        }
    }


    // 注销事件
    this.off = yaxi.off = function (type, listener) {
        
        var events = this.__event_keys,
            items;

        if (!events)
        {
            return;
        }

        if (!type)
        {
            for (type in events)
            {
                this.off(type);
            }
        }
        else if (items = events[type])
        {
            if (listener)
            {
                for (var i = items.length; i--;)
                {
                    if (items[i] === listener)
                    {
                        items.splice(i, 1);
                    }
                }

                if (!items[0])
                {
                    events[type] = null;
                }
            }
            else
            {
                items.length = 0;
                events[type] = null;
            }

            if (listener = this.__event_change)
            {
                listener.call(this, type, items, false);
            }
        }
    }


    // 触发事件
    this.trigger = yaxi.trigger = function (type, payload) {
        
        var target = this,
            events,
            index,
            event,
            fn;

        if (type && typeof type !== 'string')
        {
            event = type;
            event.target = this;
            
            type = event.type;
        }

        do
        {
            if ((events = target.__event_keys) && (events = events[type]))
            {
                index = 0;

                while (fn = events[index++])
                {
                    if (!event)
                    {
                        event = new Event();
                        event.target = this;

                        if (payload)
                        {
                            for (var name in payload)
                            {
                                event[name] = payload[name];
                            }
                        }
                    }

                    if (fn.call(target, event) === false)
                    {
                        event.defaultPrevented = true;
                    }
    
                    if (event.cancelBubble)
                    {
                        return !event.defaultPrevented;
                    }
                }
            }
        }
        while (target = target.parent);

        return !event || !event.defaultPrevented;
    }


    // 检测是否注册了指定的事件
    this.hasEvent = yaxi.hasEvent = function (type, listener) {

        var events = this.__event_keys,
            items;

        if (events && (items = events[type]) && items[0])
        {
            if (!listener)
            {
                return true;
            }

            for (var i = items.length; i--;)
            {
                if (items[i] === listener)
                {
                    return true;
                }
            }
        }

        return false;
    }



    Class.mixin = function (target) {

        target.on = prototype.on;
        target.once = prototype.once;
        target.off = prototype.off;
        target.trigger = prototype.trigger;
        target.hasEvent = prototype.hasEvent;
    }


});




(function () {



    var Event = yaxi.Event;

	
	var stack = yaxi.__layer_stack = [];

    
    // 滑动事件按下时的状态
    var start = Object.create(null);


    // longTap定时器
    var delay = 0;


    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();

 


    function findControl(dom) {

        var control;

        while (dom)
        {
            if (control = dom.$control)
            {
                while (control.disabled)
                {
                    control = control.parent;
                }

                return control;
            }

            dom = dom.parentNode;
        }
    }


	function longTapDelay() {
        
        var control = start.control;

        delay = 0;

        start.control = null;
        start.tap = false;

		if (control && start.longTap)
		{
            var e = new Event();

            e.type = 'longTap';
            e.dom = start.dom;

            return control.trigger(e);
        }
    }


    function cancelTap() {

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        start.tap = start.longTap = false;
    }

    

    function touchEvent(event, touch) {

        var e = new Event();

        touch = touch || event.changedTouches[0];

        e.type = event.type;
        e.dom = event.target;
        e.start = start;
        e.original = event;
        e.touches = event.changedTouches;
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        e.distanceX = (e.screenX = touch.screenX) - start.screenX;
        e.distanceY = (e.screenY = touch.screenY) - start.screenY;

        return e;
    }



    function closeLayer(layer, dom) {

        var host = layer.$dom;

        while (dom)
        {
            if (dom === host)
            {
                return false;
            }

            dom = dom.parentNode;
        }

        layer.close();
        return true;
    }
    


	document.addEventListener('touchstart', function (event) {
		
        var control;

        if ((control = stack[0]) && closeLayer(stack[stack.length - 1], event.target))
        {
            event.stopPropagation();
            return false;
        }
    
        if (control = findControl(event.target))
        {
            var touch = event.changedTouches[0];

            start.tap = start.longTap = true;

            start.dom = event.target;
            start.control = control;
            start.screenX = touch.screenX;
            start.screenY = touch.screenY;

            if (control.trigger(touchEvent(event, touch)) === false)
            {
                cancelTap();
                return false;
            }

            delay = setTimeout(longTapDelay, 600);
        }
        
	}, true);


	document.addEventListener('touchmove', function (event) {
        
        var control;

        if (control = start.control)
        {
            event = touchEvent(event);

            if (control.trigger(event) === false)
            {
                start.tap && cancelTap();
                return false;
            }

            if (start.tap)
            {
                var x = event.distanceX,
                    y = event.distanceY;

                // 如果移动了指定
                if (x < -8 || x > 8 || y < -8 || y > 8)
                {
                    cancelTap();
                }
            }
        }

	}, true);


	document.addEventListener('touchend', function (event) {
        
        var control = start.control,
            any;

        start.control = null;

        if (delay)
        {
			clearTimeout(delay);
		    delay = 0;
        }

        if (control)
        {
            event = touchEvent(event);

            if (control.trigger(event) === false)
            {
                return false;
            }

            // 500ms内不重复触发tap事件
            if (start.tap && (((any = new Date()) - tapTime > 500) || tapControl !== control))
            {
                tapControl = control;
                tapTime = any;

                if ((any = control.__on_tap) && any.call(control, event) === false)
                {
                    return false;
                }
                
                event.type = 'tap';

                if (control.trigger(event) === false)
                {
                    return false;
                }
            }
        }

	}, true);


	document.addEventListener('touchcancel', function (event) {
        
        var control;

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (control = start.control)
        {
            start.control = null;
            return control.trigger(touchEvent(event));
        }

    }, true);



    document.addEventListener('input', function (event) {

        var control, e;

        if (control = findControl(event.target))
        {
            e = new Event();
            e.type = 'input';
            e.dom = event.target;
            e.original = event;
            e.value = e.dom.value;

            return control.trigger(e);
        }

    }, true);


    document.addEventListener('change', function () {

        var control, fn, e;

        if (control = findControl(event.target))
        {
            if (fn = control.__on_change)
            {
                fn.call(control);
            }

            e = new Event();
            e.type = 'change';
            e.dom = event.target;
            e.value = e.dom.value;

            return control.trigger(e);
        }

    }, true);



    
    document.addEventListener('keydown', listener, true);

    document.addEventListener('keypress', listener, true);

    document.addEventListener('keyup', listener, true);


    document.addEventListener('focus', listener, true);

    document.addEventListener('blur', listener, true);


    document.addEventListener('scroll', listener, true);



    function listener(event) {

        var control, e;

        if (control = findControl(event.target))
        {
            e = new Event();
            e.type = event.type;
            e.dom = event.target;
            e.original = event;

            return control.trigger(e);
        }
    }

    
    

})();




(function () {



    var pipes = Object.create(null);

    var caches = Object.create(null);


    var decimal = Decimal.singleton;




    pipes.round = function (value, digits) {

        return decimal(value).round(digits);
    }


    pipes.fixed = function (value, digits) {

        return decimal(value).toFixed(digits);
    }




    yaxi.pipe = function (name, fn) {

        if (name && typeof fn === 'function')
        {
            pipes[name] = fn;
        }
    }



    function parse(text) {

        var tokens = text.split('|'),
            items = [],
            list,
            text,
            fn;

        for (var i = 0, l = tokens.length; i < l; i++)
        {
            if (tokens[i] && (list = tokens[i].match(/"(?:[^"]|\\")"|[^:\s]+/g)) && (fn = list[0]))
            {
                if (fn = pipes[fn])
                {
                    list[0] = null;

                    for (var j = list.length - 1; j > 0; j--)
                    {
                        text = list[j];

                        if (text[0] === '"' && text[text.length - 1] === '"')
                        {
                            list[j] = text.slice(1, -1).replace(/\\"/g, '"');
                        }
                    }

                    items.push(fn, list);
                }
                else
                {
                    throw 'not exist pipe function "' + list[0] + '"!';
                }
            }
        }

        return items;
    }


    function pipe(value) {

        var index = 0,
            fn,
            args;

        while (fn = this[index++])
        {
            args = this[index++];
            args[0] = value;

            value = fn.apply(this, args);
        }

        return value;
    }


    function compile(text) {

        var items = text && parse(text);
        return caches[text] = items && items[0] ? pipe.bind(items) : null;
    }


    yaxi.pipe.compile = function (text) {

        var fn = caches[text];
        return fn !== void 0 ? fn : compile(text);
    }


})();




yaxi.Observe = Object.extend.call({}, function (Class) {



    var create = Object.create;
    


    Class.ctor = function (data) {

        this.$storage = create(this.$defaults);

        if (data)
        {
            this.__init(data);
        }
    }



    // 初始化数据
    this.__init = function (data) {

        var converters = this.$converters,
            converter,
            changes,
            key;

        for (var name in data)
        {
            if (converter = converters[name])
            {
                // 需要处理变化
                if (converter.change)
                {
                    (changes || (changes = this.__changes = {}))[name] = converter.fn.call(this, data[name]);
                }
                else if (key = converter.name) // 默认转换器
                {
                    this.$storage[key] = converter.fn.call(this, data[name]);
                }
                else // 自定义转换器
                {
                    converter.fn.call(this, data[name]);
                }
            }
            else if (converter !== false)
            {
                this[name] = data[name];
            }
        }
    }



    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$converters = create(null);


    
    // 定义属性
    this.$property = yaxi.__extend_properties(function (name, change) {

        return change ? function () {

            var value = this.__changes;
            return value && (value = value[name]) !== void 0 ? value : this.$storage[name];

        } : function () {

            return this.$storage[name];
        }

    }, function (name, converter, change) {

        return change ? function (value) {

            var changes = this.__changes;

            value = converter.call(this, value);

            if (changes)
            {
                if (value === changes[name])
                {
                    return;
                }

                if (value !== this.$storage[name])
                {
                    changes[name] = value;
                }
                else
                {
                    delete changes[name];
                }
            }
            else if (value !== this.$storage[name])
            {
                patch(this)[name] = value;
            }

        } : function (value) {

            this.$storage[name] = converter.call(this, value);
        }

    });




    // 合并参数
    this.$combine = function (data, defaults) {

        if (data)
        {
            return defaults ? Object.assign({}, defaults, data) : data;
        }
        
        return defaults;
    }




    // 当前模型
    this.model = null;


    // 查找关联的模型
    this.__find_model = function () {
    
        var target = this;

        while (target)
        {
            if (target.model)
            {
                return target.model;
            }

            target = target.parent;
        }
    }


    this.__find_store = function (name) {

        var model;

        if (model = this.__find_model())
        {
            var keys = name.split('.'),
                index = 0,
                key;

            while (model && (key = keys[index++]))
            {
                model = model[key];
            }

            if (model && model.__model_type === 2)
            {
                return model;
            }

            throw '"' + name + '" is not a store!';
        }

        throw 'can not find any model!';
    }



    // 不转换Class
    this.$converters.Class = false;


    // 转换bindings
    this.$converters.bindings = {

        fn: function (data) {

            var model;

            if (data && (model = this.model = this.__find_model()))
            {
                model.$bind(this, data);
            }
        }
    };




    var patches = yaxi.__patches = [];

    var delay = 0;


    yaxi.__add_patch = function (target) {

        if (!delay)
        {
            delay = setTimeout(update);
        }

        patches.push(target);
    }


    function update() {

        var list = patches,
            index = 0,
            item;

        while (item = list[index++])
        {
            item.__update_patch();
        }

        list.length = delay = 0;
    }


    function patch(target) {

        if (!delay)
        {
            delay = setTimeout(update);
        }

        patches.push(target);

        return target.__changes = {};
    }


    
    this.__update_patch = function () {

        var changes;

        if (changes = this.__changes)
        {
            var storage = this.$storage;

            this.__changes = null;

            for (var name in changes)
            {
                storage[name] = changes[name];
            }
        }
    }



    // 更新变更
    yaxi.__patch_update = update;

    



    this.__class_init = function (Class, base) {

        this.$defaults = create(base.$defaults);
        this.$converters = create(base.$converters);
    }



});




yaxi.Style = yaxi.Observe.extend(function (Class, base) {
    
    

    var create = Object.create;

    var cache = create(null);

    var defaults = this.$defaults = create(null);

    var map;
    


    Class.ctor = function (parent, data) {

        this.$parent = parent;
        this.$storage = create(defaults);

        if (data)
        {
            this.__init(data);
        }
    }
    


    ;(function () {

        var keys = map = Object.create(null),
            properties = {},
            style = document.createElement('div').style,
            regex1 = /^(?:webkit|ms|moz|o)([A-Z])/,
            regex2 = /([A-Z])/g,
            key;

        function replace(_, key) {

            return key.toLowerCase();
        }

        function css(_, key) {

            return '-' + key.toLowerCase();
        }

        for (var name in style)
        {
            switch (name)
            {
                case 'cssFloat':
                case 'styleFloat':
                    properties.float = { name: name, defaultValue: '' };
                    keys.float = 'float';
                    break;

                case 'cssText':
                    break;

                default:
                    properties[key = name.replace(regex1, replace)] = { name: name, defaultValue: '' };
                    keys[key.replace(regex2, css)] = key;
                    break;
            }
        }

        for (var name in properties)
        {
            this.$property(name, properties[name]);
        }

    }).call(this);




    function parse(text, map, color) {

        var style = create(null),
            regex1 = /\s*:\s*/g,
            regex2 = /^\s+/,
            regex3 = /\s+$/,
            tokens = text.split(';'),
            token,
            list,
            name;

        for (var i = 0, l = tokens.length; i < l; i++)
        {
            if ((token = tokens[i]) && (list = token.split(regex1, 2)))
            {
                if (token = list[1])
                {
                    name =  list[0].replace(regex2, '');
                    name = map[name] || name;

                    token = token.replace(regex3, '');

                    switch (token[0])
                    {
                        case '@':
                            if (token.length > 1 && (token = color[token.substring(1)]))
                            {
                                style[name] = token;
                            }
                            break;

                        case '%':
                            if (token.length > 1)
                            {
                                (style.bindings || (style.bindings = {}))[name] = token.substring(1);
                            }
                            break;

                        default:
                            style[name] = token;
                            break;
                    }
                }
            }
        }

        return cache[text] = style;
    }



    
    this.__init = function (data) {

        if (typeof data === 'string')
        {
            data = cache[data] || parse(data, map, yaxi.color);
        }

        base.__init.call(this, data);
    }



    this.__update_patch = function () {

        var dom, changes;

        if ((dom = this.$parent) && (dom = dom.$dom) && (changes = this.__changes))
        {
            var storage = this.$storage,
                style = dom.style;

            for (var name in changes)
            {
                storage[name] = style[name] = changes[name];
            }

            this.__changes = null;
        }
    }


});




;(function () {



    var create = Object.create;

    var define = Object.defineProperty;


    var compile = yaxi.pipe.compile;


    // 绑定的目标
    var bindingTarget = null;

    // 注册的观测变化数量
    var watchKeys = create(null);


    // 模型原型
    var base = this;

    // 定义属性方法
    var property;




    // 定义模型
    yaxi.model = function (properties) {

        var extend = create,
            prototype = extend(base),
            subkeys = prototype.$subkeys = extend(null),
            defaults = prototype.$defaults = extend(null),
            options,
            type;

        function Model(data, parent) {

            this.$parent = parent || null;
            this.$storage = extend(defaults);

            if (data)
            {
                this.$load(data);
            }
        }
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;

        prototype.$converters = extend(null);
        
        for (var name in properties)
        {
            if ((options = properties[name]) && typeof options === 'function')
            {
                if (type = options.model)
                {
                    subkeys[name] = type;
                    define(prototype, name, (type === 1 ? submodel : substore)(name, options));
                }
                else
                {
                    define(prototype, name, { get: options });
                }
            }
            else
            {
                property.call(prototype, name, options);
            }
        }

        return Model;
    }



    function submodel(name, Model) {
    
        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Model(null, this));
            },
            set: function (value) {

                var model = this[name];

                if (value && typeof value === 'object')
                {
                    if (model)
                    {
                        for (var key in value)
                        {
                            model[key] = value[key];
                        }
                    }
                    else
                    {
                        this[name] = new Model(value, this);
                    }
                }
                else if (model)
                {
                    model.$clear();
                }
            }
        };
    }


    function substore(name, Store) {

        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Store(null, this));
            },
            set: function (value) {

                var store = this[name];

                if (value && value.length > 0)
                {
                    if (store)
                    {
                        if (store && store.length > 0)
                        {
                            store.clear();
                        }

                        store.push.apply(store, value);
                    }
                    else
                    {
                        this[name] = new Store(value, this);
                    }
                }
                else if (store && store.length > 0)
                {
                    store.clear();
                }
            }
        };
    }
    


    // 定义属性
    property = yaxi.__extend_properties(function (name) {

        return function () {

            var bindings, any;

            if (bindingTarget)
            {
                if (bindings = this.__bindings)
                {
                    if (any = bindings[name])
                    {
                        any.push(bindingTarget);
                    }
                    else
                    {
                        bindings[name] = [bindingTarget];
                    }
                }
                else
                {
                    (this.__bindings = {})[name] = [bindingTarget];
                }
            }

            return this.$storage[name];
        }

    }, function (name, converter) {

        var watches = watchKeys;

        return function (value) {

            var any = this.$storage;

            if (converter)
            {
                value = converter(value);
            }

            if (value === any[name] || watches[name] && this.$notify(name, value) === false)
            {
                return this;
            }

            any[name] = value;

            if ((any = this.__bindings) && (any = any[name]))
            {
                pushBindings(this, any);
            }

            return this;
        }

    });



    function pushBindings(model, bindings) {

        var binding, value, pipe;

        for (var name in bindings)
        {
            binding = bindings[name];
            value = model[binding.name];

            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            binding.observe[binding.property] = value;
        }
    }

    

    // 编译绑定
    function compileBinding(model, observe, name, expression) {
    
        var index = expression.indexOf('|'),
            tokens,
            pipe;

        if (index > 0)
        {
            pipe = expression.substring(index);
            expression = expression.substring(0, index);
        }

        if (tokens = expression.match(/\w+/g))
        {
            var binding = bindingTarget = { observe: observe },
                index = 0,
                value;

            binding.name = tokens.pop(); // 最后一个是绑定的字段

            while (value = tokens[index++])
            {
                if ((model = model[value]) && model.__model_type === 1)
                {
                    continue;
                }

                throw 'binding expression is invalid! "' + value + '" is not a model!';
            }

            binding.model = model;

            if (pipe)
            {
                binding.pipe = pipe = compile(pipe);
            }

            value = model[binding.name];
            observe[binding.property = name] = pipe ? pipe(value) : value;
    
            return binding;
        }

        throw 'binding expression is invalid! no binding name!';
    }


    // 编译推送
    function compilePush(model, expression) {
    
        var index = expression.indexOf('|'),
            tokens,
            pipe;

        if (index > 0)
        {
            pipe = expression.substring(index);
            expression = expression.substring(0, index);
        }

        if (tokens = expression.match(/\w+/g))
        {
            var binding = {},
                index = 0,
                value;

            binding.name = tokens.pop(); // 最后一个是绑定的字段

            while (value = tokens[index++])
            {
                if ((model = model[value]) && model.__model_type === 1)
                {
                    continue;
                }

                throw 'binding expression is invalid! "' + value + '" is not a model!';
            }

            binding.model = model;

            if (pipe)
            {
                binding.pipe = pipe = compile(pipe);
            }

            return binding;
        }

        throw 'binding expression is invalid! no binding name!';
    }



    // 绑定
    this.$bind = function (observe, bindings) {

        try
        {
            var keys = observe.__bindings || (observe.__bindings = {}),
                any;

            for (var name in bindings)
            {
                if (any = bindings[name])
                {
                    if (name === 'change')
                    {
                        observe.__binding_push = compilePush(this, any);
                    }
                    else
                    {
                        keys[name] = compileBinding(this, observe, name, any);
                    }
                }
            }
        }
        finally
        {
            bindingTarget = null;
        }
    }


    // 解除绑定
    this.$unbind = function (binding) {

        var bindings = this.__bindings;

        if (bindings && (bindings = bindings[binding.name]))
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i] === binding)
                {
                    bindings.splice(i, 1);
                    break;
                }
            }
        }
    }


    // 推送绑定
    this.$push = function (observe, value) {

        var binding = observe.__binding_push,
            pipe;

        if (binding)
        {
            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            this[binding.name] = value;
        }
    }


    
    
    // 观测属性变化
    this.$watch = function (name, listener) {

        if (name && typeof listener === 'function')
        {
            if (!++watchKeys[name])
            {
                watchKeys[name] = 1;
            }
            
            var watches = this.__watches,
                items;

            if (watches)
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
                (this.__watches || (this.__watches = {}))[name] = [listener];
            }
        }
    }


    // 取消观测属性变化
    this.$unwatch = function (name, listener) {

        var watches = this.__watches,
            items;

        if (!watches)
        {
            return;
        }

        if (typeof listener === 'function')
        {
            if (watches && (items = watches[name]))
            {
                for (var i = items.length; i--;)
                {
                    if (items[i] === listener)
                    {
                        items.splice(i, 1);
                        watchKeys[name]--;
                        return;
                    }
                }
            }
        }
        else if (name)
        {
            if ((items = watches[name]) && items.length > 0)
            {
                watchKeys[name] -= items.length;
                items.length = 0;

                delete watches[name];
            }
        }
        else
        {
            for (name in watches)
            {
                if ((items = watches[name]) && items.length > 0)
                {
                    watchKeys[name] -= items.length;
                    items.length = 0;
                }
            }

            this.__watches = null;
        }
    }


    // 通知属性变化
    this.$notify = function (name, value) {

        var target = this,
            watches,
            items,
            index,
            fn;

        while (target)
        {
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

            target = target.$parent;
        }
    }



    // 保存状态
    this.$save = function () {

    }


    // 恢复到上次保存的状态
    this.$restore = function () {

    }


    // 获取变化
    this.$changes = function () {

    }



    // 加载数据
    this.$load = function (data) {

        if (data)
        {
            var converter = this.$converters,
                storage = this.$storage || (this.$storage = {});

            for (var name in data)
            {
                if (convert = converter[name])
                {
                    storage[name] = convert.fn.call(this, data[name]);
                }
                else
                {
                    this[name] = data[name];
                }
            }
        }
    }


    // 清除属性
    this.$clear = function (deep) {

        var subkeys, sub;

        this.$storage = create(this.$defaults);

        if (deep && (subkeys = this.$subkeys))
        {
            for (var name in subkeys)
            {
                if (sub = this['__sub_' + name])
                {
                    if (subkeys[name] === 1)
                    {
                        sub.$clear();
                    }
                    else
                    {
                        sub.clear();
                    }
                }
            }
        }
    }



}).call(Object.create(null));




;(function () {



    var create = Object.create;

    var array = Array.prototype;

    var push = array.push;

    var splice = array.splice;


    var base = this;




    // 定义存储器
    yaxi.store = function (properties) {
    
        var prototype = create(base);

        function Store(data, parent) {

            this.$parent = parent || null;

            if (data && data.length > 0)
            {
                push.apply(this, createModels(this, data, 0, [], 'push'));
            }
        }

        prototype.$Model = yaxi.model(properties);

        Store.model = prototype.__model_type = 2;
        Store.prototype = prototype;

        return Store;
    }


    

    this.length = 0;


    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;




    this.$bind = function (repeater) {

        (this.__bindings || (this.__bindings = [])).push(repeater);
    }


    this.$unbind = function (repeater) {

        var bindings = this.__bindings;

        if (bindings)
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i] === repeater)
                {
                    bindings.splice(i, 1);

                    if (!bindings[0])
                    {
                        this.__bindings = null;
                    }
                    break;
                }
            }
        }
    }




    function createModels(store, list, index) {

        var outputs = [],
            Model = store.$Model,
            parent = store.$parent,
            length = list.length;

        while (index < length)
        {
            item = new Model(list[index++]);
            item.$parent = parent;

            outputs.push(item);
        }

        return outputs;
    }


    function notify(store, type, arg1, arg2) {

        var bindings;

        if (bindings = store.__bindings)
        {
            for (var i = 0, l = bindings.length; i < l; i++)
            {
                bindings[i][type](arg1, arg2);
            }
        }
    }



    this.push = function () {

        if (arguments.length > 0)
        {
            var list = createModels(this, arguments, 0);

            push.apply(this, list);
            notify(this, '__model_insert', -1, list);
        }

        return this.length;
    }


    this.pop = function () {

        var item = array.pop.call(this);

        if (item)
        {
            item.$parent = item.__bindings = null;
            notify(this, '__model_remove', -1, 1);
        }

        return item;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var list = createModels(this, arguments, 0);

            array.unshift.apply(this, list);
            notify(this, '__model_insert', 0, list);
        }

        return this.length;
    }


    this.shift = function () {

        var item = array.shift.call(this);

        if (item)
        {
            item.$parent = item.__bindings = null;
            notify(this, '__model_remove', 0, 1);
        }

        return item;
    }


    this.splice = function (index, length) {

        var controls;

        if ((index |= 0) < 0 && (index += this.length) < 0)
        {
            index = 0;
        }

        if (arguments.length > 2)
        {
            controls = createModels(this, arguments, 2);
            controls = splice.apply(this,  [index, length].concat(controls));

            notify(this, '__model_insert', index, controls);
        }
        else
        {
            controls = splice.apply(this, arguments);
        }

        if (controls.length > 0)
        {
            for (var i = controls.length; i--;)
            {
                controls[i].$parent = controls[i].__bindings = null;
            }

            notify(this, '__model_remove', index, controls.length);
        }

        return controls;
    }


    this.clear = function () {

        var list = splice.call(this, 0);

        if (list.length > 0)
        {
            for (var i = list.length; i--;)
            {
                list[i].$parent = list[i].__bindings = null;
            }

            notify(this, '__model_clear');
        }

        return list;
    }


    this.sort = function (sortFn) {

        array.sort.call(this, sortFn);

        for (var i = this.length; i--;)
        {
            this[i].__index = i;
        }

        notify(this, '__model_sort', 0);
    }


    this.reverse = function () {

        array.reverse.call(this);
        
        for (var i = this.length; i--;)
        {
            this[i].__index = i;
        }

        notify(this, '__model_sort', 1);
    }


    
}).call(Object.create(null));




/**
 * 本部分代码从flyingon或yaxi框架中相关代码修改而来
 */

yaxi.Stream = Object.extend(function (Class) {



    Class.fromPromise = function (promise) {

        var instance = new Class();

        if (typeof promise === 'function')
        {
            promise = promise();
        }

        promise
            .then(function (value) {

                instance.resolve(value);
            })
            .catch(function (reason) {

                instance.reject(reason);
            });

        return instance;
    }


    Class.fromEvent = function (dom, type, capture) {

        var instance = new Class();

        dom.addEventListener(type, function (event) {

            instance.resolve(event);

        }, capture || false);

        return instance;
    }


    Class.interval = function (period) {

        var instance = new Class();
        var value = 0;

        function interval() {

            setTimeout(function () {

                instance.resolve(value++);
                interval();

            }, period | 0);
        }

        interval();

        return instance;
    }


    Class.all = function () {

        var instance = new Class(),
            cache = [],
            index = 0,
            length = 0,
            item;

        while (item = arguments[index])
        {
            length++;

            (function (item, index) {

                item
                    .then(function (value) {

                        cache[index] = value;

                        if (!--length)
                        {
                            instance.resolve(cache);
                        }
                    })
                    .catch(function (reason) {
                        
                        instance.reject(reason);
                    });

            })(item, index++);
        }

        return instance;
    }



    Class.ctor = function (value) {

        if (arguments.length > 0)
        {
            if (typeof value === 'function')
            {
                value(this);
            }
            else
            {
                this.__cache = [value];
            }
        }
    }



    this.registry = function (fn) {

        var next = this.__next = new Class();
        var cache = this.__cache;

        this.__fn = fn;

        if (cache)
        {
            while (cache.length > 0)
            {
                try
                {
                    fn.call(this, cache.shift(), next);
                }
                catch (e)
                {
                    this.reject(e);
                }
            }

            this.__cache = null;
        }

        return next;
    }



    this.resolve = function (value) {

        var next = this.__next,
            any;

        if (next)
        {
            if (any = this.__fn)
            {
                try
                {
                    any.call(this, value, next);
                }
                catch (e)
                {
                    this.reject(e);
                }
            }
            else
            {
                next.resolve(value);
            }
        }
        else if (any = this.__cache)
        {
            any.push(value);
        }
        else
        {
            this.__cache = [value];
        }
    }


    this.reject = function (reason) {

        var fn = this.__fail,
            next = this.__next;

        if (fn)
        {
            try
            {
                if (fn.call(this, reason, next) === false)
                {
                    return false;
                }
            }
            catch (e)
            {
                reason = e;
            }
        }

        if (next)
        {
            next.reject(reason);
        }
        else
        {
            throw reason;
        }
    }


    this.then = function (fn) {

        return this.registry(function (value, next) {

            if (fn)
            {
                var result = fn(value);

                if (result !== void 0)
                {
                    value = result;
                }
            }

            next.resolve(value);
        });
    }


    this.combine = function (stream) {

        return this.registry(function (value1, next) {

            stream
                .then(function (value2) {

                    var array = value1;

                    if (array instanceof Array)
                    {
                        array.push(value2);
                    }
                    else
                    {
                        array = [value1, value2];
                    }

                    next.resolve(array);
                })
                .catch(function (reason) {

                    next.reject(reason);
                });
        });
    }


    this.map = function (fn) {

        return this.registry(function (value, next) {

            next.resolve(fn(value));
        });
    }


    this.json = function (fn) {

        return this.registry(function (value, next) {

            if (typeof value === 'string')
            {
                value = JSON.parse(value);
            }

            if (fn)
            {
                value = fn(value);
            }

            next.resolve(value);
        });
    }


    this.catch = function (fail) {

        this.__fail = fail;
        return this.__next = new Class();
    }


    this.wait = function (time) {

        var cache = [];
        var timeout;

        return this.registry(function (value, next) {

            if (timeout)
            {
                cache.push(value);
            }
            else
            {
                timeout = setTimeout(function () {

                    next.resolve(cache);
                    timeout = 0;
                    cache = [];

                }, time | 0);
            }
        });
    }


    this.delay = function (time) {

        return this.registry(function (value, next) {

            setTimeout(function () {

                next.resolve(value);

            }, time | 0);
        });
    }


    this.debounce = function (time) {

        var timeout;

        return this.registry(function (value, next) {

            if (timeout)
            {
                clearTimeout(timeout);
            }

            timeout = setTimeout(function () {

                next.resolve(value);
                timeout = 0;

            }, time | 0);
        });
    }


    this.throttle = function (time) {

        var timeout;

        return this.registry(function (value, next) {

            if (!timeout)
            {
                next.resolve(value);

                timeout = setTimeout(function () {

                    timeout = 0;

                }, time | 0);
            }
        });
    }

    
});




// http
yaxi.HTTP = yaxi.http = Object.extend.call({}, function (Class) {



    // 编码方式
    var enctype = 'application/x-www-form-urlencoded';

    

    // 重定向状态码
    this.redirectStatus = 299;


    // 重定向
    this.redirect = function () {
        
        location.href = 'index.html';
    }



    this.send = function (options) {

        var self = this,
            stream = new yaxi.Stream(),
            ajax = new XMLHttpRequest(),
            any;
        
        // CORS
        if (options.CORS)
        {
            // withCredentials是XMLHTTPRequest2中独有的
            if ('withCredentials' in ajax)
            {
                ajax.withCredentials = true;
            }
            else if (any = window.XDomainRequest)
            {
                ajax = new any();
            }
        }

        ajax.onreadystatechange = function () {

            if (this.readyState === 4)
            {
                this.onreadystatechange = null;

                if (self)
                {
                    clearTimeout(this.__timeout);
                    self.receive(this, stream, options);
                }
            }
        }

        ajax.open(options.method, options.url, options.async !== false);

        if (options.contentType)
        {
            ajax.setRequestHeader('Content-Type', options.contentType);

            // if (any = options.data)
            // {
            //     ajax.setRequestHeader('Content-Length', any.length);
            // }
        }

        if (any = options.header)
        {
            for (var name in any)
            {
                ajax.setRequestHeader(name, any[name]);
            }
        }

        ajax.__timeout = setTimeout(function () {

            self = null;
            ajax.abort();

            stream.reject({
                url: options.url,
                status: 'timeout'
            });

        }, options.timeout || 30000);

        ajax.send(options.data);

        return stream;
    }


    this.receive = function (ajax, stream, options) {

        if (ajax.status >= 100 && ajax.status < 300)
        {
            this.response(ajax, stream, options);
        }
        else
        {
            stream.reject({
                url: options.url,
                status: ajax.status,
                message: ajax.statusText || ajax.responseText,
                options: options
            });
        }
    }


    this.response = function (ajax, stream, options) {

        if (ajax.status === this.redirectStatus)
        {
            this.redirect();
        }
        else
        {
            stream.resolve(ajax.responseText || ajax.responseXML);
        }
    }



    
    function encodeData(data) {

        if (!data)
        {
            return '';
        }

        var list = [],
            encode = encodeURIComponent,
            value,
            any;

        for (var name in data)
        {
            value = data[name];
            name = encode(name);

            if (value === null)
            {
                list.push(name, '=null', '&');
                continue;
            }

            switch (typeof value)
            {
                case 'undefined':
                    list.push(name, '=&');
                    break;

                case 'boolean':
                case 'number':
                    list.push(name, '=', value, '&');
                    break;

                case 'string':
                case 'function':
                    list.push(name, '=', encode(value), '&');
                    break;

                default:
                    if (value instanceof Array)
                    {
                        for (var i = 0, l = value.length; i < l; i++)
                        {
                            if ((any = value[i]) === void 0)
                            {
                                list.push(name, '=&');
                            }
                            else
                            {
                                list.push(name, '=', encode(any), '&'); //数组不支持嵌套
                            }
                        }
                    }
                    else
                    {
                        list.push(name, '=', encodeData(value), '&');
                    }
                    break;
            }
        }

        list.pop();

        return list.join('');
    }


    function parseOptions(method, url, data, options, flag) {

        if (flag || /GET|HEAD|OPTIONS/i.test(method))
        {
            if (data)
            {
                url = url + (url.indexOf('?') >= 0 ? '&' : '?') + encodeData(data);
                data = null;
            }
        }
        else if (options.contentType === enctype)
        {
            data = encodeData(data);
        }
        else if (data && typeof data !== 'string')
        {
            if (!options.contentType)
            {
                options.contentType = 'application/json';
            }
            
            data = JSON.stringify(data);
        }

        options.method = method;
        options.url = url;
        options.data = data;

        return options;
    }



    this.__class_init = function (Class) {


        var parse = parseOptions;


        Class.send = function (method, url, data, options) {

            options = parse(method ? method.toUpperCase() : 'GET', url, data, options || {}); 
            return new Class().send(options);
        }
    
    
        Class.head = function (url, data, options) {
    
            options = parse('HEAD', url, data, options || {}, true);
            return new Class().send(options);
        }
    
    
        Class.get = function (url, data, options) {
    
            options = parse('GET', url, data, options || {}, true);
            return new Class().send(options);
        }
    
    
        Class.post = function (url, data, options) {
    
            options = parse('POST', url, data, options || {});
            return new Class().send(options);
        }
    
    
        Class.put = function (url, data, options) {
    
            options = parse('PUT', url, data, options || {});
            return new Class().send(options);
        }
        
    
        Class.del = function (url, data, options) {
    
            options = parse('DELETE', url, data, options || {});
            return new Class().send(options);
        }
    }



});





window.require || (function () {



	// 已加载缓存集合
	var modules = Object.create(null);

    // 已加载的多语言资源
    var languages = Object.create(null);

    // 内联的模块集合
    var inlines = Object.create(null);


    // 全局require
    var global;




    function factory(base) {

        var last = base.length - 1;

        function require(url, cmd) {

            return execute(require.baseURL, url, cmd);
        }

        if (base[last] === '/')
        {
            base = base.substring(0, last);
        }

        require.baseURL = base;

        return require;
    }



    function execute(base, url, cmd) {

        var ext = url.match(/\.\w+$/),
            any;

        if (ext)
        {
            ext = ext[0].toLowerCase();
        }
        else
        {
            url += '.js';
            ext = '.js';
        }

        url = url[0] === '/' ? global.baseURL + url : absouteUrl(base, url);

        if (any = modules[url])
        {
            return any.exports;
        }

        if (url.indexOf('{{language}}') >= 0)
        {
            languages[url] = ext;
            return load(url, ext, cmd, url.replace('{{language}}', yaxi.language));
        }
        
        return load(url, ext, cmd);
    }

    
	function absouteUrl(base, url) {
		
		var base;
		
		url = base + '/' + url;
		
		while (true)
		{
			base = url.replace(/[^/]*\/\.\.\//, '');
			
			if (base === url)
			{
				break;
			}
			
			url = base;
		}
		
		return url.replace(/[.]+\//g, '');
	}


    function load(url, ext, cmd, path) {

        var text = inlines[path || url] || ajax(path || url);
		
		switch (ext)
		{
			case '.css':
                modules[url] = loadCss(text);
                return true;

			case '.js':
                return (modules[url] = loadJs(text, path || url, cmd)).exports;

            case '.json':
                text = text ? JSON.parse(text) : null;
                modules[url] = { exports: text };
                return text;

			default:
                modules[url] = { exports: text };
                return text;
		}
    }


    function ajax(url) {

        var xhr = new XMLHttpRequest(),
            text;
						
		xhr.open('GET', url, false);

        xhr.onreadystatechange = function () {

            if (this.readyState === 4)
            {
                if (this.status < 300)
                {
                    text = this.responseText;
                }
                else
                {
                    throw this.statusText;
                }
                
                this.onreadystatechange = null;
            }
        }

        xhr.send(null);

        return text;
    }


	function loadCss(text) {

        var dom = document.createElement('style');  
			
        dom.setAttribute('type', 'text/css');  
    
        if (dom.styleSheet) // IE  
        {
            dom.styleSheet.cssText = text;  
        }
        else // w3c  
        {
            dom.appendChild(document.createTextNode(text));  
        }
    
        document.head.appendChild(dom);

        return { exports: true };
	}


	function loadJs(text, url, cmd) {

        var module = { exports: {} };

        if (text)
        {
            text = text + '\r\n//# sourceURL=' + url;

            if (cmd === false)
            {
                eval.call(window, text);
            }
            else
            {
                new Function(['require', 'exports', 'module'], text)(
                    factory(url.substring(0, url.lastIndexOf('/') + 1)),
                    module.exports,
                    module);
            }
        }

		return module;
    }
    


    function mixin(target, source) {

        var value;

        for (var key in source)
        {
            if ((value = source[key]) && typeof value === 'object')
            {
                mixin(target[key] || (target[key] = {}), value);
            }
            else
            {
                target[key] = value;
            }
        }
    }




    global = window.require = factory(location.href.substring(0, location.href.lastIndexOf('/')));
    

    global.execute = execute;


    global.switchLanguage = function (language) {

        yaxi.language = language;

        for (var key in languages)
        {
            var url = key.replace('{{language}}', language),
                data = ajax(url);

            switch (languages[key])
            {
                case '.js':
                    data = loadJs(data, url).exports;
                    break;

                case '.json':
                    data = data ? JSON.parse(text) : null;
                    break;
            }

            mixin(modules[key].exports, data);
        }
    }

    
    
    // 定义window模块
    global.define = function (name, text) {

        
    }



})();




!function(h){var c,o='<svg><symbol id="icon-yaxi-pulldown" viewBox="0 0 1024 1024"><path d="M512 960C264.96 960 64 759.04 64 512S264.96 64 512 64s448 200.96 448 448S759.04 960 512 960zM512 128C300.256 128 128 300.256 128 512c0 211.744 172.256 384 384 384 211.744 0 384-172.256 384-384C896 300.256 723.744 128 512 128z"  ></path><path d="M694.56 522.144c-12.544-12.608-33.376-12.64-45.952-0.064L544 625.984 544 319.328c0-17.76-14.208-32.16-32-32.16-17.76 0-32 14.4-32 32.16l0 308.32-105.216-106.688c-12.48-12.608-32.704-12.736-45.312-0.256C316.832 533.216 316.8 553.6 329.28 566.208l159.36 161.056c6.272 6.336 14.592 9.568 22.88 9.568 8.16 0 16.384-3.168 22.624-9.312 0.032-0.064 0.032-0.064 0.064-0.128 0.032 0 0.064 0 0.096-0.064l160.192-159.68C707.072 555.104 707.104 534.72 694.56 522.144z"  ></path></symbol><symbol id="icon-yaxi-back" viewBox="0 0 1024 1024"><path d="M395.21518 513.604544l323.135538-312.373427c19.052938-18.416442 19.052938-48.273447 0-66.660212-19.053961-18.416442-49.910737-18.416442-68.964698 0L291.75176 480.290811c-19.052938 18.416442-19.052938 48.273447 0 66.660212l357.633237 345.688183c9.525957 9.207709 22.01234 13.796214 34.497699 13.796214 12.485359 0 24.971741-4.588505 34.466999-13.82896 19.052938-18.416442 19.052938-48.242747 0-66.660212L395.21518 513.604544z"  ></path></symbol><symbol id="icon-yaxi-radio-checked" viewBox="0 0 1024 1024"><path d="M512 259.56503703c-138.83922963 0-252.43496297 113.59573333-252.43496297 252.43496297s113.59573333 252.43496297 252.43496297 252.43496297 252.43496297-113.59573333 252.43496297-252.43496297S650.83922963 259.56503703 512 259.56503703zM512 7.13007408C234.323968 7.13007408 7.13007408 234.323968 7.13007408 512s227.19389392 504.86992592 504.86992592 504.86992592 504.86992592-227.19389392 504.86992592-504.86992592S789.676032 7.13007408 512 7.13007408zM512 915.89594075c-222.13791289 0-403.89594075-181.76045511-403.89594075-403.89594075S289.86208711 108.10405925 512 108.10405925 915.89594075 289.86208711 915.89594075 512 734.13791289 915.89594075 512 915.89594075z"  ></path></symbol><symbol id="icon-yaxi-checkbox-unchecked" viewBox="0 0 1024 1024"><path d="M892.24735231 1012.51492048l-760.49638045 0c-66.35446257 0-120.26589234-53.91310559-120.26589234-120.26589234l0-760.56676528c0-66.35446257 53.91310559-120.26589234 120.26589234-120.26589236l760.49638045 0c66.35446257 0 120.26589234 53.91310559 120.26589235 120.26589236l0 760.56676528c0 66.35446257-53.91310559 120.26589234-120.26589235 120.26589234zM131.75264769 82.98768981c-26.88533005 0-48.76495786 21.95168848-48.76495788 48.76495788l0 760.56676528c0 26.81326939 21.87962782 48.76495786 48.76495788 48.76495787l760.49638045 0c26.81326939 0 48.76495786-21.95168848 48.76495787-48.76495787l0-760.56676528c0-26.81326939-21.95168848-48.76495786-48.76495787-48.76495788l-760.49638045 0z"  ></path></symbol><symbol id="icon-yaxi-checkbox-checked" viewBox="0 0 1024 1024"><path d="M892.24735231 1012.51492048l-760.49638045 0c-66.35446257 0-120.26589234-53.91310559-120.26589234-120.26589234l0-760.56676528c0-66.35446257 53.91310559-120.26589234 120.26589234-120.26589236l760.49638045 0c66.35446257 0 120.26589234 53.91310559 120.26589235 120.26589236l0 760.56676528c0 66.35446257-53.91310559 120.26589234-120.26589235 120.26589234zM131.75264769 82.98768981c-26.88533005 0-48.76495786 21.95168848-48.76495788 48.76495788l0 760.56676528c0 26.81326939 21.87962782 48.76495786 48.76495788 48.76495787l760.49638045 0c26.81326939 0 48.76495786-21.95168848 48.76495787-48.76495787l0-760.56676528c0-26.81326939-21.95168848-48.76495786-48.76495787-48.76495788l-760.49638045 0z"  ></path><path d="M449.57870885 836.76231882l-274.13886619-274.21092687 101.10445971-101.10445972 154.87344396 154.80138332 308.38779037-431.80089021 116.40478156 83.08594269z"  ></path></symbol><symbol id="icon-yaxi-circle" viewBox="0 0 1024 1024"><path d="M32 512c0 265.09653333 214.90346667 480 480 480s480-214.90346667 480-480c0-265.09653333-214.90346667-480-480-480-265.09653333 0-480 214.90346667-480 480z"  ></path></symbol><symbol id="icon-yaxi-number-plus" viewBox="0 0 1024 1024"><path d="M740.828151 485.179145 538.820344 485.179145 538.820344 283.185664c0-14.81645-11.989055-26.820855-26.820855-26.820855-14.769378 0-26.790156 12.004405-26.790156 26.820855l-0.013303 201.99348L283.200502 485.179145c-14.801101 0-26.820855 12.019755-26.820855 26.820855 0 14.81645 12.019755 26.819832 26.820855 26.819832l201.991434 0-0.013303 201.994504c0 14.800078 12.051477 26.821879 26.820855 26.821879 14.8318 0 26.820855-12.021801 26.820855-26.821879L538.820344 538.819832l201.979154 0c14.8318 0 26.820855-12.003382 26.820855-26.819832S755.631298 485.179145 740.828151 485.179145z"  ></path></symbol><symbol id="icon-yaxi-number-minus" viewBox="0 0 1024 1024"><path d="M768.440022 485.814618c0 14.475689-11.743462 26.185382-26.200732 26.185382l-460.467323 0c-14.458293 0-26.167986-11.70867-26.167986-26.185382l0 0c0-14.458293 11.70867-26.183336 26.167986-26.183336l460.467323 0C756.697583 459.631282 768.440022 471.356324 768.440022 485.814618L768.440022 485.814618z"  ></path></symbol><symbol id="icon-yaxi-ring" viewBox="0 0 1024 1024"><path d="M512.00582201 1020.25554034C231.74603093 1020.25554034 3.74329458 792.25396907 3.74329458 511.99301405c0-280.24698311 228.00273635-508.24971947 508.26252629-508.24971947 280.24698311 0 508.24971947 228.00273635 508.24971947 508.24971947C1020.25554034 792.25396907 792.25396907 1020.25554034 512.00582201 1020.25554034zM512.00582201 122.55727616c-214.7425792 0-389.44970979 174.7001435-389.4497098 389.43573789 0 214.7425792 174.70712946 389.44970979 389.4497098 389.44970979 214.73675833 0 389.43690183-174.70712946 389.43690183-389.44970979C901.44272384 297.2574208 726.7425792 122.55727616 512.00582201 122.55727616z"  ></path></symbol><symbol id="icon-yaxi-radio-unchecked" viewBox="0 0 1024 1024"><path d="M512 7.13007408C234.323968 7.13007408 7.13007408 234.323968 7.13007408 512s227.19389392 504.86992592 504.86992592 504.86992592 504.86992592-227.19389392 504.86992592-504.86992592S789.676032 7.13007408 512 7.13007408zM512 915.89351348c-222.13791287 0-403.89351348-181.75802787-403.89351348-403.89351348S289.86208713 108.10405925 512 108.10405925 915.89594075 289.86208713 915.89594075 512 734.13791287 915.89351348 512 915.89351348z"  ></path></symbol><symbol id="icon-yaxi-eye-open" viewBox="0 0 1024 1024"><path d="M515.2 224C208 224 22.4 537.6 22.4 537.6s214.4 304 492.8 304 492.8-304 492.8-304S822.4 224 515.2 224zM832 652.8c-102.4 86.4-211.2 140.8-320 140.8s-217.6-51.2-320-140.8c-35.2-32-70.4-64-99.2-99.2-6.4-6.4-9.6-12.8-16-19.2 3.2-6.4 9.6-12.8 12.8-19.2 25.6-35.2 57.6-70.4 92.8-102.4 99.2-89.6 208-144 329.6-144s230.4 54.4 329.6 144c35.2 32 64 67.2 92.8 102.4 3.2 6.4 9.6 12.8 12.8 19.2-3.2 6.4-9.6 12.8-16 19.2-28.8 32-60.8 67.2-99.2 99.2z" fill="" ></path><path d="M512 345.6c-96 0-169.6 76.8-169.6 169.6 0 96 76.8 169.6 169.6 169.6 96 0 169.6-76.8 169.6-169.6S604.8 345.6 512 345.6z m0 294.4c-67.2 0-121.6-54.4-121.6-121.6 0-67.2 54.4-121.6 121.6-121.6 67.2 0 121.6 54.4 121.6 121.6 0 64-54.4 121.6-121.6 121.6z" fill="" ></path></symbol><symbol id="icon-yaxi-bankcard" viewBox="0 0 1024 1024"><path d="M823.5 598.4L237.8 864.6c-14.5 6.6-31.6 0.2-38.2-14.3L19.2 453.4c-6.6-14.5-0.2-31.6 14.3-38.2L597.2 159c14.5-6.6 31.6-0.2 38.2 14.3l190.4 418.9c1.1 2.4 0 5.1-2.3 6.2z" fill="#FFD858" ></path><path d="M823.5 598.4L519.6 736.5 315.3 287.1 619.2 149c2.4-1.1 5.1 0 6.2 2.3l200.4 440.9c1.1 2.4 0 5.1-2.3 6.2z" fill="#FDC223" ></path><path d="M58.317 539.506l616.25-280.102 42.828 94.227-616.25 280.101zM231.012 640.378l163.143-74.153 16.47 36.234-163.144 74.153zM260.634 705.552L487.87 602.268l16.47 36.234-227.237 103.284z" fill="#1A7FC0" ></path><path d="M981.1 805.3H362c-15.9 0-28.9-12.9-28.9-28.9v-436c0-15.9 12.9-28.9 28.9-28.9h619.1c15.9 0 28.9 12.9 28.9 28.9v436c0 16-12.9 28.9-28.9 28.9z" fill="#83C6EF" ></path><path d="M1005.3 805.3H671.6V311.6h333.7c2.6 0 4.7 2.1 4.7 4.7v484.3c0 2.6-2.1 4.7-4.7 4.7z" fill="#429BCF" ></path><path d="M333.1 435H1010v103.5H333.1zM448.6 598.2h179.2V638H448.6zM448.6 669.9h249.6v39.8H448.6z" fill="#1A7FC0" ></path><path d="M942.9 638.1h-35.1c-10.9 0-19.9-9-19.9-19.9 0-10.9 9-19.9 19.9-19.9h35.1c10.9 0 19.9 9 19.9 19.9 0 10.9-9 19.9-19.9 19.9z" fill="#FFD858" ></path></symbol><symbol id="icon-yaxi-eye-close" viewBox="0 0 1024 1024"><path d="M515.49297778 629.18428445c-203.28106667 0-392.82460445-109.44284445-494.81500445-285.59587556-14.90261333-25.73084445-6.05297778-58.56256 19.55953778-73.46631111 25.73084445-14.90147555 58.67975111-6.05297778 73.46631111 19.56067555C196.48284445 432.65592889 350.39914667 521.48906667 515.37692445 521.48906667S834.26986667 432.65479111 917.04888889 289.56672c14.90261333-25.73084445 47.73546667-34.57934222 73.46631111-19.67672889s34.46215111 47.73546667 19.67559111 73.46631111C908.31758222 519.74144 718.77404445 629.18314667 515.49297778 629.18314667z m-278.72597333 53.5552c-9.43104 0-19.09418667-2.44394667-27.70944-7.68341334-25.4976-15.36796445-33.64750222-48.43406222-18.27953778-73.81447111l59.37720888-98.26417778c15.36910222-25.4976 48.4352-33.53144889 73.8156089-18.27953777 25.4976 15.36796445 33.64750222 48.43406222 18.2784 73.8144711l-59.3772089 98.26417778c-10.12963555 16.64910222-27.82663111 25.96408889-46.1050311 25.96408889z m554.5415111 0c-18.16234667 0-35.97653333-9.19665778-46.1050311-25.96295112l-59.37834667-98.26417778c-15.36796445-25.4976-7.21806222-58.44650667 18.16234667-73.8144711 25.4976-15.36796445 58.44764445-7.21806222 73.81560888 18.16234666l59.37720889 98.26417778c15.36796445 25.4976 7.21806222 58.44764445-18.16234667 73.81560889-8.61525333 5.23832889-18.27953778 7.80060445-27.70944 7.80060444z m-275.81553777 69.97333333c-29.68917333 0-53.78958222-24.10040889-53.78958223-53.78958223v-123.52853333c0-29.68917333 24.10040889-53.78958222 53.78958223-53.78958222 29.68917333 0 53.78958222 24.10040889 53.78958222 53.78958222v123.52853333c0 29.68917333-24.10040889 53.78958222-53.78958222 53.78958223z" fill="#707070" ></path></symbol><symbol id="icon-yaxi-checkbox-three" viewBox="0 0 1024 1024"><path d="M1012.51436242 941.01231019V82.98768981a71.50205225 71.50205225 0 0 0-71.50205223-71.50205223H82.98768981a71.50205225 71.50205225 0 0 0-71.50205223 71.50205223v858.02462038a71.50205225 71.50205225 0 0 0 71.50205223 71.50205223h858.02462038a71.50205225 71.50205225 0 0 0 71.50205223-71.50205223z m-143.00410448-71.50205225H154.48974206V154.48974206h715.02051588v715.02051588z"  ></path><path d="M297.49384493 297.49384493h429.01231014v429.01231014H297.49384493z"  ></path></symbol><symbol id="icon-yaxi-copy" viewBox="0 0 1024 1024"><path d="M733.86666667 170.66666667h-580.26666667A85.43573333 85.43573333 0 0 0 68.26666667 256v648.53333333C68.26666667 951.6032 106.56426667 989.86666667 153.6 989.86666667h580.26666667c47.06986667 0 85.33333333-38.26346667 85.33333333-85.33333334v-648.53333333C819.2 208.96426667 780.93653333 170.66666667 733.86666667 170.66666667z m17.06666666 733.86666666c0 9.38666667-7.68 17.06666667-17.06666666 17.06666667h-580.26666667a17.06666667 17.06666667 0 0 1-17.06666667-17.06666667v-648.53333333a17.06666667 17.06666667 0 0 1 17.06666667-17.06666667h580.26666667a17.06666667 17.06666667 0 0 1 17.06666666 17.06666667v648.53333333z"  ></path><path d="M870.4 34.13333333h-580.26666667a34.13333333 34.13333333 0 0 0 0 68.26666667h580.26666667a17.06666667 17.06666667 0 0 1 17.06666667 17.06666667v648.53333333a34.13333333 34.13333333 0 1 0 68.26666666 0v-648.53333333C955.73333333 72.43093333 917.46986667 34.13333333 870.4 34.13333333z"  ></path><path d="M614.4 349.86666667H273.06666667a34.13333333 34.13333333 0 0 0 0 68.26666666h341.33333333a34.13333333 34.13333333 0 1 0 0-68.26666666zM614.4 520.53333333H273.06666667a34.13333333 34.13333333 0 1 0 0 68.26666667h341.33333333a34.13333333 34.13333333 0 1 0 0-68.26666667zM477.86666667 689.7664H273.06666667a34.13333333 34.13333333 0 1 0 0 68.26666667h204.8a34.13333333 34.13333333 0 1 0 0-68.26666667z"  ></path></symbol><symbol id="icon-yaxi-alipay" viewBox="0 0 1325 1024"><path d="M171.9595514 512c0 265.57071929 214.16993451 479.74065379 479.7406538 479.74065379s479.74065379-214.16993451 479.74065378-479.74065379S917.27092449 32.25934621 651.7002052 32.25934621 171.9595514 246.42928071 171.9595514 512z" fill="#5A9EF7" ></path><path d="M752.78841455 571.9675813s17.13359531-23.98703275 34.26718948-71.96109711c18.84695438-47.97406549 20.56031346-75.38781753 20.56031345-75.38781752l-137.0687579-1.71335908v-46.26070642l166.195869-1.71335907v-34.26718948H668.83380051v-75.38781753h-82.24125499V340.66405262H428.96347303v34.26718948l155.91571343-1.71336021v51.40078478h-123.36188303v27.41375203h257.00392164c-1.71335907 17.13359531-6.85343744 32.5538304-11.9935158 47.97406549-10.28015673 25.70039182-20.56031346 49.68742457-20.5603146 49.68742458s-119.93516373-42.83398713-185.0428234-42.83398714c-63.39430059 0-140.49547719 25.70039182-149.0622737 99.37484914-6.85343744 73.67445731 35.98054855 114.79508537 97.66149005 128.50196139 59.9675813 13.70687602 116.50844445 0 166.19586903-23.98703275 49.68742457-23.98703275 97.66149006-78.81453568 97.66149006-78.81453568l255.29056256 125.07524096s15.42023509-23.98703275 27.41375091-46.26070528c8.56679765-15.42023509 15.42023509-32.5538304 22.27367365-47.97406549l-265.57071928-90.80805262z m-263.85735908 121.64852281c-90.80805262 0-107.94164679-44.54734621-107.94164678-75.3878164 0-30.84047019 18.84695438-66.82101987 95.94812984-71.96109824 75.38781753-5.14007837 179.90274503 54.82750293 179.90274502 54.82750294s-77.10117661 92.5214117-167.90922808 92.5214117z" fill="#FFFFFF" ></path></symbol><symbol id="icon-yaxi-weixin" viewBox="0 0 1024 1024"><path d="M1010.8 628c0-141.2-141.3-256.2-299.9-256.2-168 0-300.3 115.1-300.3 256.2 0 141.4 132.3 256.2 300.3 256.2 35.2 0 70.7-8.9 106-17.7l96.8 53-26.6-88.2c70.9-53.2 123.7-123.7 123.7-203.3zM618 588.8c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40c0 22-17.9 40-40 40z m194.3-0.3c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z" fill="#00C800" ></path><path d="M366.3 106.9c-194.1 0-353.1 132.3-353.1 300.3 0 97 52.9 176.6 141.3 238.4l-35.3 106.2 123.4-61.9c44.2 8.7 79.6 17.7 123.7 17.7 11.1 0 22.1-0.5 33-1.4-6.9-23.6-10.9-48.3-10.9-74 0-154.3 132.5-279.5 300.2-279.5 11.5 0 22.8 0.8 34 2.1C692 212.6 539.9 106.9 366.3 106.9zM247.7 349.2c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z m246.6 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" fill="#00C800" ></path></symbol></svg>',t=(c=document.getElementsByTagName("script"))[c.length-1].getAttribute("data-injectcss");if(t&&!h.__iconfont__svg__cssinject__){h.__iconfont__svg__cssinject__=!0;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(c){console&&console.log(c)}}!function(c){if(document.addEventListener)if(~["complete","loaded","interactive"].indexOf(document.readyState))setTimeout(c,0);else{var t=function(){document.removeEventListener("DOMContentLoaded",t,!1),c()};document.addEventListener("DOMContentLoaded",t,!1)}else document.attachEvent&&(l=c,e=h.document,i=!1,a=function(){i||(i=!0,l())},(o=function(){try{e.documentElement.doScroll("left")}catch(c){return void setTimeout(o,50)}a()})(),e.onreadystatechange=function(){"complete"==e.readyState&&(e.onreadystatechange=null,a())});var l,e,i,a,o}(function(){var c,t,l,e,i,a;(c=document.createElement("div")).innerHTML=o,o=null,(t=c.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",l=t,(e=document.body).firstChild?(i=l,(a=e.firstChild).parentNode.insertBefore(i,a)):e.appendChild(l))})}(window);



(function (color) {


    color.back = '#ffffff';


    color.default1 = "#000000";
    color.default2 = "#606266";
    color.default3 = "#c0c4cc";
    color.default4 = "#e0e0e0";
    color.default5 = "#f8f8f8";
    
    
    color.primary1 = "#ff6a48";
    color.primary2 = "#df6a48";
    color.primary3 = "#ff6a48";
    color.primary4 = "#df6a48";
    color.primary5 = "#ff6a48";
    
    
    color.second1 = "#66b1ff";
    color.second2 = "#8cc5ff";
    color.second3 = "#b3d8ff";
    color.second4 = "#d9ecff";
    color.second5 = "#e9fcff";
    
    
    color.success1 = "#5daf34";
    color.success2 = "#85ce61";
    color.success3 = "#a4da89";
    color.success4 = "#c2e7b0";
    color.success5 = "#f0f9eb";
    
    
    color.warning1 = "#cf9236";
    color.warning2 = "#ebb563";
    color.warning3 = "#f0c78a";
    color.warning4 = "#f5dab1";
    color.warning5 = "#fdf6ec";
    
    
    color.danger1 = "#dd6161";
    color.danger2 = "#f78989";
    color.danger3 = "#f9a7a7";
    color.danger4 = "#fbc4c4";
    color.danger5 = "#fef0f0";
    
    
    color.disabled1 = "#72747a";
    color.disabled2 = "#82848a";
    color.disabled3 = "#a6a9ad";
    color.disabled4 = "#bcbec2";
    color.disabled5 = "#d3d4d6";
    
    
    color.icon1 = '#000000';
    color.icon2 = '#ff6a48';
    color.icon3 = '#66b1ff';
    color.icon4 = '#5daf34';
    color.icon5 = '#cf9236';
    color.icon6 = '#dd6161';
    color.icon7 = '#82848a';
    

    color.headerBack = '#202833';
    color.headerFont = '#ffffff';
    color.headerBorder = '#202833';

    

    (yaxi.colors || (yaxi.colors = Object.create(null))).default = color;
    
    

})(yaxi.color = Object.create(null));




yaxi.Control = yaxi.Observe.extend(function (Class, base) {



    var create = Object.create;

    
    var eventTarget = yaxi.EventTarget.prototype;

    // 注册的控件类集合
    var Controls = yaxi.Controls = create(null);



    
    Class.register = function (name) {

        if (name)
        {
            Controls[this.typeName = this.prototype.typeName = name] = this;
        }

        return this;
    }


    

    // id
    this.$property('id', '');

    
    // 风格
    this.$property('theme', '');
    

    // class
    this.$property('className', '');


    // 是否禁用
    this.$property('disabled', false);
    

    // 语言
    this.$property('lang', '');
    

    // title
    this.$property('title', '');
    

    // accessKey
    this.$property('accessKey', '');
    

    // alt
    this.$property('alt', '');


    // 绑定的url
    this.$property('url', '', false);


    // 打开url时的参数
    this.$property('args', null, false);
    

    // 自定义key
    this.$property('key', '', false);
    

    // 自定义tag
    this.$property('tag', null, false);




    // 样式集
    Object.defineProperty(this, 'style', {

        get: function () {

            return this.__style || (this.__style = new yaxi.Style(this));
        }
    });

    
    this.$converters.style = {
        
        fn: function (data) {
     
            this.__style = new yaxi.Style(this, data);
        }
    };




    // 父控件
    this.parent = null;


    // 顶级控件
    Object.defineProperty(this, 'root', {

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



    Object.defineProperty(this, 'offsetTop', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetTop: 0;
        }
    });


    Object.defineProperty(this, 'offsetLeft', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetLeft: 0;
        }
    });


    Object.defineProperty(this, 'offsetWidth', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetWidth: 0;
        }
    });


    Object.defineProperty(this, 'offsetHeight', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.offsetHeight: 0;
        }
    });




    this.hasClass = function (name) {

        if (name)
        {
            var className = this.className;
            return className ? className.indexOf(name) >= 0 : false;
        }
        
        return false;
    }


    this.addClass = function (name) {

        if (name)
        {
            var className = this.className;

            if (!className)
            {
                this.className = name;
            }
            else if (className.indexOf(name) < 0)
            {
                this.className = className + ' ' + name;
            }
        }
    }


    this.removeClass = function (name) {

        if (name)
        {
            var className = this.className;

            if (className)
            {
                this.className = className.replace(name, '').replace(/(?:^|\s)\s+|\s$/, '');
            }
        }
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var className = this.className;

            if (className && className.indexOf(name) < 0)
            {
                this.className = className.replace(name, '').replace(/(?:^|\s)\s+|\s$/, '');
            }
            else
            {
                this.className = className + ' ' + name;
            }
        }
    }


    
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




    this.$converters.events = {
        
        fn: function (events) {

            for (var name in events)
            {
                this.on(name, events[name]);
            }
        }
    };




    this.find = function (selector) {

        var tokens = selector && yaxi.Query.parse(selector);
        return tokens ? this.__find(tokens, 0) : null;
    }


    this.__find = function (tokens, index) {
    
        var control;

        switch (tokens[index++])
        {
            case '<':
                control = this.__find_up(tokens[index++], tokens[index++], false);
                break;

            case '<<':
                control = this.__find_up(tokens[index++], tokens[index++], true);
                break;

            case '>':
                control = this.__find_down(tokens[index++], tokens[index++], false);
                break;

            case '>>':
                control = this.__find_down(tokens[index++], tokens[index++], true);
                break;
        }

        if (control)
        {
            return tokens[index] ? control.__find(tokens, index) : control;
        }

        return null;
    }


    this.__find_value = function (key, value) {

        switch (key)
        {
            case '@':
                return this.key === value;

            case '&':
                return this instanceof (Controls[value] || Boolean);

            case '#':
                return this.id === value;

            case '.':
                return (this.$className + (this.$storage.className || '') + ' ').indexOf(value + ' ') >= 0;
        }

        return false;
    }


    this.__find_up = function (key, value, deep) {

        var parent = this.parent;

        if (parent)
        {
            if (deep)
            {
                do
                {
                    if (parent.__find_value(key, value))
                    {
                        return parent;
                    }
                }
                while (parent = parent.parent);
            }
            else if (parent.__find_value(key, value))
            {
                return parent;
            }
        }
    }


    this.__find_down = function () {

        return null;
    }



    // 查找存在指定属性值的控件
    this.exists = function (name, to) {

        var target = this;

        while (target && target !== to)
        {
            if (target[name])
            {
                return target;
            }

            target = target.parent;
        }
    }


    // 从当前控件开始往上查找key属性
    this.findKey = function (to) {

        var target = this,
            key;

        while (target && target !== to)
        {
            if (key = target.key)
            {
                return key;
            }

            target = target.parent;
        }

        return '';
    }


    // 从当前控件开始往上查找url属性
    this.findURL = function (to) {

        var target = this,
            url;

        while (target && target !== to)
        {
            if (url = target.url)
            {
                return url;
            }

            target = target.parent;
        }

        return '';
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




    var div = document.createElement('div');



    yaxi.template = function (target, html) {

        var dom;

        if (target && html)
        {
            div.innerHTML = html;

            target.$template = dom = div.firstChild;
            target.$className = dom.className || 'yx-control';

            div.removeChild(dom);
        }
    }


    this.$className = 'yx-control';


	yaxi.template(this, '<div class="yx-control"></div>');



    // 渲染控件
    this.render = function () {

        var dom = this.$dom || (this.$dom = this.$template.cloneNode(true)),
            any;

        dom.$control = this;

        if (this.__changes)
        {
            this.__update_patch();
        }

        if (any = this.__style)
        {
            any.__update_patch();
        }

        if (any = this.__events)
        {
            any.__update_patch();
        }

        return dom;
    }



    this.__update_patch = function () {

        var changes, dom;

        if ((changes = this.__changes) && (dom = this.$dom))
        {
            var storage = this.$storage,
                renderer = this.renderer,
                value,
                fn;

            for (var name in changes)
            {
                storage[name] = value = changes[name];

                if (fn = renderer[name])
                {
                    fn.call(this, dom, value);
                }
                else
                {
                    (renderer[name] = updateDom(name, value)).call(this, dom, value);
                }
            }

            this.__changes = null;
        }
    }

    


    // 更新补丁
    var renderer = this.renderer = create(null);


    renderer.className = function (dom, value) {

        dom.className = value ? this.$className + ' ' + value : this.$className;
    }


    renderer.theme = function (dom, value) {

        dom.setAttribute('theme', value);
    }



    function updateDom(name, value) {

        return typeof value === 'boolean'
        
            ? function (dom, value) {

                if (value)
                {
                    dom.setAttribute(name, name);
                }
                else
                {
                    dom.removeAttribute(name);
                }

            }
            
            : function (dom, value) {

                dom.setAttribute(name, value);
            }
    }



    
    this.destroy = function () {

        var bindings, any;

        if (any = this.$dom)
        {
            any.$control = this.$dom = null;
        }

        if (bindings = this.__bindings)
        {
            for (var name in bindings)
            {
                if ((any = bindings[name]) && (any = any.model) && any.__bindings)
                {
                    any.$unbind(bindings[name]);
                }
            }

            this.__bindings = this.__binding_push = null;
        }

        if (any = this.__style)
        {
            any.parent = null;

            if (bindings = any.__bindings)
            {
                for (var name in bindings)
                {
                    if ((any = bindings[name]) && (any = any.model))
                    {
                        any.$unbind(name, this);
                    }
                }
            }

            this.__style = null;
        }

        if (this.__event_keys)
        {
            this.off();
        }
        
        if (this.ondestroy)
        {
            this.ondestroy();
        }

        this.parent = this.$storage = this.__loading = this.__pulldown = null;
        this.destroyed = true;
    }



    
    this.__class_init = function (Class, base) {

        this.$defaults = create(base.$defaults);
        this.$converters = create(base.$converters);
        this.renderer = create(base.renderer);
    }



}).register('Control');




yaxi.container = function (base) {



    // 布局类型
    this.$property('layout', '');


    // url基础路径
    this.$property('baseURL', '', false);


    // 是否在点击时打开子项绑定的url
    this.$property('openURL', {
    
        defaultValue: false,

        converter: function (value) {

            value = !!value;

            if (value !== this.openURL)
            {
                if (value)
                {
                    this.on('tap', openURL);
                }
                else
                {
                    this.off('tap', openURL);
                }
            }
            
            return value;
        }

    }, false);



    function openURL(event) {

        var control = event.target,
            url;

        while (control && control !== this)
        {
            if (url = control.url)
            {
                var Class = require.execute(this.baseURL, url),
                    args = control.args;

                if (args && args.length > 0)
                {
                    control = Object.create(Class.prototype);

                    Class.apply(control, args);
                    control.open();
                }
                else
                {
                    new Class().open();
                }
                
                event.stop();
                return false;
            }

            control = control.parent;
        }
    }




    // 查找具有指定属性值的子控件
    this.locate = function (name, value) {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            if (children[i][name] === value)
            {
                return children[i];
            }
        }
    }



    // 查找符合指定选择器的子对象
    this.query = function (selector) {

        var Query = yaxi.Query,
            outputs = new Query(),
            list = this.__children,
            tokens;

        if (list.length > 0)
        {
            if (selector && (tokens = Query.parse(selector)))
            {
                list = query([this], tokens, 0);

                if (list.length > 0)
                {
                    list.push.apply(outputs, list);
                }
            }
            else if (selector === false)
            {
                outputs.push.apply(outputs, list);
            }
            else
            {
                query_all(list, outputs);
            }
        }

        return outputs;
    }

    
    function query(inputs, tokens, index) {

        var list = [],
            i = 0,
            control;

        switch (tokens[index++])
        {
            case '<':
                while (control = inputs[i++])
                {
                    if (control = control.__find_up(tokens[index++], tokens[index++], false))
                    {
                        list.push(control);
                    }
                }
                break;

            case '<<':
                while (control = inputs[i++])
                {
                    if (control = control.__find_up(tokens[index++], tokens[index++], true))
                    {
                        list.push(control);
                    }
                }
                break;

            case '>':
                while (control = inputs[i++])
                {
                    if (control.__query)
                    {
                        control.__query(list, tokens[index++], tokens[index++], false);
                    }
                }
                break;

            case '>>':
                while (control = inputs[i++])
                {
                    if (control.__query)
                    {
                        control.__query(list, tokens[index++], tokens[index++], true);
                    }
                }
                break;
        }

        if (list.length > 0 && tokens[index])
        {
            return query(list, tokens, index);
        }

        return list;
    }


    function query_all(inputs, outputs) {

        var index = 0,
            control;

        while (control = inputs[index++])
        {
            var children = control.__children;

            outputs.push(control);

            if (children && children.length > 0)
            {
                query_all(children, outputs);
            }
        }
    }


    this.__query = function (outputs, key, value, deep) {

        var children = this.__children,
            index = 0,
            control;

        while (control = children[index++])
        {
            if (control.__find_value(key, value))
            {
                outputs.push(control);
            }

            if (deep && control.__query)
            {
                control.__query(outputs, key, value, true);
            }
        }
    }


    this.__find_down = function (key, value, deep) {
    
        var children = this.__children,
            index = 0,
            control;

        while (control = children[index++])
        {
            if (control.__find_value(key, value))
            {
                return control;
            }

            if (deep && control.__children && (control = control.__find_down(key, value, true)))
            {
                return control;
            }
        }
    }



    this.renderer.layout = function (dom, value) {

        dom.setAttribute('layout', value);
    }



    this.render = function () {

        var dom = base.render.call(this),
            children = this.__children,
            index = 0,
            control;

        children.__patch = 1;

        while (control = children[index++])
        {
            dom.appendChild(control.render());
        }

        if ((control = this.__loading) && control.status === 'loading')
        {
            control.show();
            control.onload.call(this, control, true);
        }

        return dom;
    }


    
    this.destroy = function () {

        var any = this.__children;

        for (var i = any.length; i--;)
        {
            any[i].destroy();
        }

        if (any = this.__loading)
        {
            any.destroy();
        }

        if (any = this.__pulldown)
        {
            any.destroy();
        }

        base.destroy.call(this);
    }

}




yaxi.__extend_pulldown = function () {

    
    var pulldown, loading, overflowY;



    // loading设置
    Object.defineProperty(this, 'loading', {
    
        get: function () {

            return this.__loading;
        },
        set: function (value) {

            if (value)
            {
                var loading = yaxi.Loading;

                if (typeof value === 'function')
                {
                    loading = new loading();
                    loading.onload = value;
                }
                else
                {
                    if (typeof value.onload !== 'function')
                    {
                        throw 'loading onload must be a function!'
                    }
                    
                    loading = value instanceof loading ? value : new loading(value);
                }

                loading.parent = this;
                loading.on('tap', reload);

                this.__loading = loading;
                this.on('scroll', scroll);
            }
            else
            {
                this.off('scroll', scroll);
            }
        }
    });

    
    // 下拉设置
    Object.defineProperty(this, 'pulldown', {

        get: function () {

            return this.__pulldown;
        },
        set: function (value) {

            if (value)
            {
                var pulldown = yaxi.Pulldown;

                if (typeof value === 'function')
                {
                    pulldown = new pulldown();
                    pulldown.onload = value;
                }
                else
                {
                    if (typeof value.onload !== 'function')
                    {
                        throw 'pulldown onload must be a function!'
                    }

                    pulldown = value instanceof pulldown ? value : new pulldown(value);
                }

                this.__pulldown = pulldown;

                this.on('touchmove', touchmove);
                this.on('touchend', touchend);
                this.on('touchcancel', touchend);
            }
            else
            {
                this.off('touchmove', touchmove);
                this.off('touchend', touchend);
                this.off('touchcancel', touchend);
            }
        }
    });


    function scroll() {

        var loading;

        if (!pulldown && (loading = this.__loading) && loading.status !== 'completed')
        {
            // 延时处理以避免加载太快
            var time = new Date().getTime();

            if (time - (loading.__time || 0) < 100)
            {
                return;
            }

            var dom = this.$dom;

            if (loading.before)
            {
                if (dom.scrollTop > dom.offsetHeight)
                {
                    return;
                }
            }
            else if (dom.scrollTop + (dom.offsetHeight << 1) < dom.scrollHeight)
            {
                return;
            }

            loading.index++;
            loading.__time = time;
            loading.onload.call(this, loading);
        }
    }


    function reload() {

        if (this.status === 'failed')
        {
            // 显示loading
            this.load();

            // 最少显示500msloading
            setTimeout(function () {

                this.onload.call(this.parent, this);

            }.bind(this), 500);
        }
    }



    function touchmove(event) {

        if (pulldown)
        {
            if (pulldown.$dom)
            {
                pulldown.move(event.distanceY);

                event.stop();
                return false;
            }
            else
            {
                pulldown = null;
            }
        }

        if (!this.pulldown || (loading = this.__loading) && loading.shown && loading.status === 'loading')
        {
            loading = null;
            return;
        }

        if (this.$dom.scrollTop < 1 && (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var start = event.start,
                style = this.$dom.style;

            if (loading)
            {
                if (loading.shown)
                {
                    loading.hide();
                }
                else
                {
                    loading = null;
                }
            }

            // 以当前控件和位置开始滑动
            start.control = this;
            start.screenX = event.screenX;
            start.screenY = event.screenY;
    
            overflowY = style.overflowY;
            style.overflowY = 'hidden';

            pulldown = this.pulldown;
            pulldown.start(this);

            event.stop();
            return false;
        }
    }


    function touchend(event) {

        if (pulldown)
        {
            this.$dom.style.overflowY = overflowY || '';

            if (pulldown.$dom)
            {
                pulldown.stop(this, loading);
                pulldown = null;

                event.stop();
                return false;
            }

            pulldown = loading = null;
        }
    }



}




yaxi.Panel = yaxi.Control.extend(function (Class, base) {

    
    
    var create = Object.create;

    

    yaxi.template(this, '<div class="yx-control yx-panel"></div>');



    
    Class.ctor = function (data) {
 
        this.$storage = create(this.$defaults);

        this.__children = new yaxi.ControlCollection(this);

        if (data)
        {
            this.__init(data);
        }
    }



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


    this.$converters.children = {
        
        fn: function (value) {
      
            if (value && value.length > 0)
            {
                this.__children.__init(this, value);
            }
        }
    };


    // 子控件类型
    this.__child_class = yaxi.Control;




    // 扩展容器功能
    yaxi.container.call(this, base);


    // 扩展下拉刷新功能
    yaxi.__extend_pulldown.call(this);




}).register('Panel');





yaxi.Button = yaxi.Control.extend(function (Class, base) {


    Class['en-US'] = {
        OK: 'OK',
        Cancel: 'Cancel',
        Yes: 'Yes',
        No: 'No'
    };


    Class['zh-CN'] = {
        OK: '确定',
        Cancel: '取消',
        Yes: '是',
        No: '否'
    };


    Class['zh-TW'] = {
        OK: '確定',
        Cancel: '取消',
        Yes: '是',
        No: '否'
    };



    yaxi.template(this, '<button type="button" class="yx-control yx-button"></button>');



    this.$property('text', '');
    


    this.renderer.text = function (dom, value) {

        dom.textContent = value;
    }



}).register('Button');




yaxi.Canvas = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<canvas class="yx-control"></canvas>');



    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);

        this.on('touchstart', touchstart.bind(this));
        this.on('touchmove', touchmove.bind(this));
    }

    

    this.$property('width', 300);


    this.$property('height', 300);



    function touchstart(event) {

        debugger
    }


    function touchmove(event) {

        debugger
    }



});




yaxi.ControlCollection = Object.extend.call({}, function (Class) {


    
    var array = Array.prototype;

    var push = array.push;

    var splice = array.splice;


    var patch = yaxi.__add_patch;




    Class.ctor = function (owner, data) {

        this.owner = owner;

        if (data && data.length > 0)
        {
            this.__init(owner, data);
        }
    }




    this.length = 0;


    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;



    this.__init = function (owner, data) {

        var childClass = owner.__child_class,
            subtype = owner.subtype || yaxi.Control,
            index = 0,
            control;

        for (var i = 0, l = data.length; i < l; i++)
        {
            if (control = createControl(owner, childClass, subtype, data[i]))
            {
                this[index++] = control;
            }
        }

        this.length = index;
    }




    function createControl(owner, childClass, subtype, data) {

        var control;

        if (data)
        {
            if (data.$storage)
            {
                if (data instanceof childClass)
                {
                    if (data.destroyed)
                    {
                        console.error('对象已经被销毁,不能够再使用!');
                        return;
                    }

                    if ((control = data.parent) && control !== owner)
                    {
                        data.remove();
                    }

                    data.parent = owner;
                    data.__last_index = null;

                    return data;
                }
            }
            else
            {
                control = new (data.Class || subtype)();
                control.parent = owner;
                control.__init(data);
            }
        }
        else
        {
            control = new subtype();
            control.parent = owner;
        }

        if (control && control instanceof childClass)
        {
            return control;
        }

        throw 'not a valid subtype "' + childClass.typeName + '"!';
    }


    function createControls(self, list, index, outputs) {

        var owner = self.owner,
            childClass = owner.__child_class,
            subtype = owner.subtype || yaxi.Control,
            length = list.length,
            control;

        while (index < length)
        {
            if (control = createControl(owner, childClass, subtype, list[index++]))
            {
                outputs.push(control);
            }
        }

        return outputs;
    }
    


    this.push = function () {

        if (arguments.length > 0)
        {
            var controls = createControls(this, arguments, 0, []),
                changes;

            if (this.__patch)
            {
                if (changes = this.__changes)
                {
                    changes.push.apply(changes[1], controls);
                }
                else
                {
                    this.__changes = [0, controls];
                    patch(this);
                }
            }

            return push.apply(this, controls);
        }

        return this.length;
    }


    this.pop = function () {

        var control = array.pop.call(this),
            changes;

        if (control)
        {
            control.parent = null;

            if (this.__patch)
            {
                if (changes = this.__changes)
                {
                    changes.push(control);
                }
                else
                {
                    this.__changes = [0, [], control];
                    patch(this);
                }
            }
        }

        return control;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var controls = createControls(this, arguments, 0, []),
                changes;

            if (this.__patch)
            {
                if (changes = this.__changes)
                {
                    changes[0] = 1;
                    changes.push.apply(changes[1], controls);
                }
                else
                {
                    this.__changes = [1, controls];
                    patch(this);
                }
            }

            return array.unshift.apply(this, controls);
        }

        return this.length;
    }


    this.shift = function () {

        var control = array.shift.call(this),
            changes;

        if (control)
        {
            control.parent = null;

            if (this.__patch)
            {
                if (changes = this.__changes)
                {
                    changes[0] = 1;
                    changes.push(control);
                }
                else
                {
                    this.__changes = [1, [], control];
                    patch(this);
                }
            }
        }

        return control;
    }


    this.splice = function (index, length) {

        var flag = this.__patch,
            changes = flag && this.__changes,
            controls;

        if (arguments.length > 2)
        {
            controls = createControls(this, arguments, 2, [index, length]);
            
            if (flag)
            {
                if (changes)
                {
                    changes[0] = 1;
                    changes.push.apply(changes[1], controls.slice(2));
                }
                else
                {
                    this.__changes = changes = [1, controls.slice(2)];
                    patch(this);
                }
            }

            controls = splice.apply(this, controls);
        }
        else
        {
            controls = splice.apply(this, arguments);
        }

        if (controls.length > 0)
        {
            for (var i = controls.length; i--;)
            {
                controls[i].parent = null;
            }

            if (flag)
            {
                if (changes)
                {
                    changes[0] = 1;
                    changes.push.apply(changes, controls);
                }
                else
                {
                    this.__changes = [1, []].concat(controls);
                    patch(this);
                }
            }
        }

        return controls;
    }


    this.clear = function () {

        var controls = splice.call(this, 0),
            changes;

        if (controls.length > 0)
        {
            for (var i = controls.length; i--;)
            {
                controls[i].parent = null;
            }

            if (this.__patch)
            {
                if (changes = this.__changes)
                {
                    changes[0] = 0;
                    changes.push.apply(changes, controls);
                }
                else
                {
                    this.__changes = [0, []].concat(controls);
                    patch(this);
                }
            }
        }

        return controls;
    }


    this.sort = function (sortby) {

        var changes;

        if (this.length > 0)
        {
            array.sort.call(this, sortby);

            if (this.__patch)
            {
                if (changes = this.__changes)
                {
                    changes[0] = 1;
                }
                else
                {
                    this.__changes = [1, []];
                    patch(this);
                }
            }
        }

        return this;
    }


    this.reverse = function () {

        var changes;

        if (this.length > 0)
        {
            array.reverse.call(this);

            if (this.__patch)
            {
                if (changes = this.__changes)
                {
                    changes[0] = 1;
                }
                else
                {
                    this.__changes = [1, []];
                    patch(this);
                }
            }
        }

        return this;
    }




    this.__update_patch = function () {

        var changes, owner, any;

        if (changes = this.__changes)
        {
            owner = this.owner;

            // 第二个以后是要移除节点
            if (changes.length > 2)
            {
                this.__remove_patch(owner, changes);
            }

            if (any = owner.$dom)
            {
                // 第二个参数是增加的子控件集合
                if (changes[1].length > 0)
                {
                    this.__insert_patch(owner, changes[1], any);
                }

                // 第一个参数是否排序
                if (changes[0])
                {
                    this.__sort_patch(any);
                }
            }

            this.__changes = null;

            if (any = this.onchange)
            {
                any.call(this, owner);
            }
        }
    }


    this.__insert_patch = function (owner, controls, dom) {

        var last = dom.lastChild;

        for (var i = 0, l = controls.length; i < l; i++)
        {
            var control = controls[i];

            if (control.parent === owner)
            {
                dom.appendChild(control.$dom || control.render());
            }
        }

        // 把loading放到最后
        if (last && last.$loading === 2)
        {
            dom.appendChild(last);
        }
    }


    this.__remove_patch = function (owner, changes) {

        var control, dom, parent;

        for (var i = 2, l = changes.length; i < l; i++)
        {
            if ((control = changes[i]).parent === owner)
            {
                continue;
            }

            if ((dom = control.$dom) && (parent = dom.parentNode))
            {
                parent.removeChild(dom);
            }

            // 如果没有父节点且不缓存则销毁组件
            if (!control.parent && !control.cached && !control.destroyed)
            {
                control.destroy();
            }
        }
    }


    this.__sort_patch = function (dom) {

        var node, item, control;

        if (node = dom.firstChild)
        {
            var index = 0;

            // 第一个是loading则路过
            if (node.$loading === 1)
            {
                node = node.nextSibling;
            }

            while (control = this[index++])
            {
                if ((item = control.$dom) === node)
                {
                    node = item.nextSibling;
                }
                else
                {
                    dom.insertBefore(item, node);
                }
            }
        }
    }


});




yaxi.HtmlControl = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-htmlcontrol"></div>');



    // html
    this.$property('html', '');



    this.renderer.html = function (dom, value) {

        dom.innerHTML = value;
    }



}).register('HtmlControl');




yaxi.Icon = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-icon"></span>');
    
    

    // 图标类名
    this.$property('icon', '');


    // svg图标
    this.$property('svg', '');

    
    // svg图标颜色
    this.$property('fill', '');


    // svg图标大小
    this.$property('size', '');




    var renderer = this.renderer;


    renderer.icon = function (dom, value) {

        var classList = dom.classList,
            icon = this.__icon;

        if (icon)
        {
            classList.remove(icon);
        }

        if (this.__icon = value)
        {
            classList.add(value);
        }
    }


    renderer.svg = function (dom, value) {

        if (value)
        {
            dom.innerHTML = '<svg class="yx-icon-svg" aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>';

            if (value = this.fill)
            {
                dom.firstChild.style.fill = value;
            }

            if (value = this.size)
            {
                dom.firstChild.style.fontSize = value;
            }
        }
        else
        {
            dom.innerHTML = '';
        }
    }


    renderer.fill = function (dom, value) {

        if (dom = dom.firstChild)
        {
            dom.style.fill = value;
        }
    }


    renderer.size = function (dom, value) {

        if (dom = dom.firstChild)
        {
            dom.style.fontSize = value;
        }
    }



}).register('Icon');





yaxi.IconButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-iconbutton"><span><span></span><span></span></span></span>');



    // 文本内容
    this.$property('text', '');


    // 图标类名
    this.$property('icon', '');


    // svg图标
    this.$property('svg', '');


    // svg图标颜色
    this.$property('fill', '');

    
    // svg图标大小
    this.$property('size', '');


    // 是否竖排图标
    this.$property('vertical', false);
    



    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.firstChild.lastChild.textContent = value;
    }


    renderer.icon = function (dom, value) {

        dom.firstChild.firstChild.className = value;
    }


    renderer.svg = function (dom, value) {

        dom = dom.firstChild.firstChild;

        if (value)
        {
            dom.innerHTML = '<svg class="yx-icon-svg" aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>';

            if (value = this.fill)
            {
                dom.firstChild.style.fill = value;
            }

            if (value = this.size)
            {
                dom.firstChild.style.fontSize = value;
            }
        }
        else
        {
            dom.innerHTML = '';
        }
    }


    renderer.fill = function (dom, value) {

        if (dom = dom.firstChild.firstChild.firstChild)
        {
            dom.style.fill = value;
        }
    }


    renderer.size = function (dom, value) {

        if (dom = dom.firstChild.firstChild.firstChild)
        {
            dom.style.fontSize = value;
        }
    }


    renderer.vertical = function (dom, value) {

        dom.firstChild.setAttribute('layout', value ? 'column-center' : 'row-center');
    }



}).register('IconButton');




yaxi.Image = yaxi.Control.extend(function () {



    yaxi.template(this, '<img class="yx-control yx-image"></img>');
    
    

    // 图标路径
    this.$property('src', '');



}).register('Image');




yaxi.Loading = yaxi.Control.extend(function (Class, base) {


    Class['en-US'] = {
        loading: 'loading, please wait...',
        empty: 'no data',
        completed: 'no more data',
        failed: 'load fail, please click to retry'
    };


    Class['zh-CN'] = {
        loading: '正在加载, 请稍候...',
        empty: '无数据',
        completed: '没有更多数据了',
        failed: '加载失败, 请点击重试'
    };


    Class['zh-TW'] = {
        loading: '正在加載, 請稍候...',
        empty: '無數據',
        completed: '沒有更多數據了',
        failed: '加載失敗, 請點擊重試'
    };


    

    yaxi.template(this, '<div class="yx-loading"><span class="yx-loading-img"></span><span></span></div>');


    

    this.$property('loadingText', '', false);

    this.$property('emptyText', '', false);

    this.$property('completedText', '', false);
    
    this.$property('failedText', '', false);


    this.$property('empty', false, false);

    this.$property('before', false, false);



    // 状态
    // loading: 正在加载
    // completed: 已完成
    // failed: 失败
    this.$property('status', 'loading', false);




    // 是否显示
    Object.defineProperty(this, 'shown', {

        get: function () {

            var dom = this.$dom;
            return dom && dom.parentNode ? true : false;
        }
    });



    // 当前索引
    this.index = 0;


    // 显示loading
    this.show = function () {

        var parent = this.parent;

        if (parent && (parent = parent.$dom))
        {
            var i18n = Class[yaxi.language] || Class['en-US'],
                dom = this.$dom || (this.$dom = this.render()),
                display = 'none',
                text;

            switch (this.status || 'loading')
            {
                case 'loading':
                    display = '';
                    text = this.loadingText || i18n.loading;
                    break;

                case 'completed':
                    text = this.empty ? this.emptyText || i18n.empty : this.completedText || i18n.completed;
                    break;

                case 'failed':
                    text = this.failedText || i18n.failed;
                    break;
            }

            dom.firstChild.style.display = display;
            dom.lastChild.innerHTML = text;
            
            if (this.before)
            {
                dom.$loading = 1;
                parent.insertBefore(dom, parent.firstChild || null);
            }
            else
            {
                dom.$loading = 2;
                parent.appendChild(dom);
            }
        }
    }




    // 正在加载
    this.load = function (show) {

        this.stop();
        
        if (this.$storage)
        {
            this.status = 'loading';

            if (show !== false)
            {
                this.__delay = setTimeout(this.show.bind(this), show || 0);
            }
        }
    }


    // 加载完毕
    this.complete = function (empty, show) {

        this.stop();
        
        if (this.$storage)
        {
            this.empty = empty;
            this.status = 'completed';

            if (show !== false)
            {
                this.__delay = setTimeout(this.show.bind(this), show || 0);
            }
        }
    }


    // 加载失败
    this.fail = function (show) {

        this.stop();

        if (this.$storage)
        {
            this.status = 'failed';

            if (show !== false)
            {
                this.__delay = setTimeout(this.show.bind(this), show || 0);
            }
        }
    }


    // 停止定时更新
    this.stop = function () {
    
        if (this.__delay)
        {
            clearTimeout(this.__delay);
            this.__delay = 0;
        }
    }


    // 隐藏loading
    this.hide = function () {

        var parent, dom;

        if ((dom = this.$dom) && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
        }
    }




}).register('Loading');




yaxi.Multiline = yaxi.Control.extend(function () {



    yaxi.template(this, '<div class="yx-control yx-multiline"></div>');



    this.$property('text', '');



    this.renderer.text = function (dom, value) {

        if (value)
        {
            var list = yaxi.html.encode(value).split('\n');

            for (var i = list.length; i--;)
            {
                list[i] = '<div>' + list[i] + '</div>';
            }

            dom.innerHTML = list.join('');
        }
        else
        {
            dom.innerHTML = '';
        }
    }



}).register('Multiline');




yaxi.ProgressBar = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-progressbar"><div></div></div>');



    this.$property('value', 0);



    this.renderer.value = function (dom, value) {

        dom.firstChild.style.width = value + '%';
    }



}).register('ProgressBar');




yaxi.Pulldown = yaxi.Control.extend(function (Class, base) {



    var delay;



    Class['en-US'] = {
        pulldown: 'pulldown to refresh',
        release: 'release refresh',
        loading: 'loading, please wait...',
        success: 'refresh success',
        fail: 'refresh fail' 
    };


    Class['zh-CN'] = {
        pulldown: '下拉刷新',
        release: '放开刷新',
        loading: '正在加载, 请稍候...',
        success: '刷新成功',
        fail: '刷新失败'
    };


    Class['zh-TW'] = {
        pulldown: '下拉重繪',
        release: '放開重繪',
        loading: '正在加載, 請稍候...',
        success: '重繪成功',
        fail: '重繪失敗'
    };


    function i18n(key) {
    
        return (Class[yaxi.language] || Class['en-US'])[key];
    }



    yaxi.template(this, '<div class="yx-control yx-pulldown" style="height:0;">' +
            '<span class="yx-pulldown-body">' +
                '<svg aria-hidden="true"><use xlink:href="#icon-yaxi-pulldown"></use></svg>' +
                '<span class="yx-loading-img" style="display:none;"></span>' +
                '<span></span>' +
            '</span>' +
        '</div>');




    this.$property('pulldownText', '', false);

    this.$property('releaseText', '', false);
    
    this.$property('loadingText', '', false);



    function done(container) {

        var dom = this.$dom;

        if (dom)
        {
            dom = dom.firstChild.firstChild;
            dom.style.display = 'none';

            dom = dom.nextSibling;
            dom.style.display = '';

            dom = dom.nextSibling;
            dom.innerHTML = this.loadingText || i18n('loading');

            // 最少显示500ms的loading
            setTimeout(function () {

                this.onload.call(container, this);

            }.bind(this), 500);
        }
    }


    function hide(loading) {

        var dom = this.$dom;

        if (dom)
        {
            dom.style.transition = 'height 600ms ease';
            dom.style.height = 0;

            delay = setTimeout(remove.bind(this, loading), 600);
        }
    }
    

    function remove(loading) {

        var dom = this.$dom,
            parent;

        if (dom && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
        }

        loading && loading.show();
    }



    this.start = function (host) {

        var dom = this.$dom || this.render(),
            style = dom.style;

        host = host.$dom || host;
        host.insertBefore(dom, host.firstChild);

        dom = dom.firstChild.firstChild;
        dom.style.display = '';
        dom.nextSibling.style.display = 'none';

        style.transition = '';
        style.height = 0;
    }


    this.move = function (offset) {

        var dom = this.$dom,
            style = dom.style,
            transform,
            text;

        if (offset <= 0)
        {
            this.ready = false;
            style.height = 0;
        }
        else
        {
            if (this.ready = offset >= yaxi.rem * .8)
            {
                transform = 'rotateZ(180deg)';
                text = this.releaseText || i18n('release');
            }
            else
            {
                transform = '';
                text = this.pulldownText || i18n('pulldown');
            }

            dom = dom.firstChild;
            dom.firstChild.style.transform = transform;
            dom.lastChild.innerHTML = text;

            style.height = offset + 'px';
        }
    }


    this.stop = function (container, loading) {

        var style = this.$dom.style;

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        style.transition = 'height 600ms ease';

        if (this.ready)
        {
            style.height = '.5rem';
            delay = setTimeout(done.bind(this, container), 600);

            return true;
        }

        style.height = 0;
        delay = setTimeout(remove.bind(this, loading), 600);
    }


    this.hide = function (fail, loading) {

        var dom = this.$dom,
            parent;

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (dom && (parent = dom.parentNode))
        {
            if (this.ready)
            {
                var node = dom.firstChild.lastChild;

                node.innerHTML = i18n(fail ? 'fail' : 'success');
                node.previousSibling.style.display = 'none';

                if (loading)
                {
                    loading.stop();
                    loading.status = fail ? 'failed' : 'completed';
                }

                delay = setTimeout(hide.bind(this, loading), 1000);
            }
            else
            {
                parent.removeChild(dom);
                loading && loading.show();
            }
        }
    }



}).register('Pulldown');





yaxi.Query = Object.extend.call(Array, function (Class, base) {



    var cache = Object.create(null);



    function parse(selector) {

        var tokens = selector.match(/\"[^"]*\"|\<{1,2}|\>{1,2}|[#.@=\[\]]|[^<>#.@=\[\]\s]+/g),
            index = 0,
            token,
            any;

        while (token = tokens[index++])
        {
            switch (token)
            {
                case '<':
                case '<<':
                case '>':
                case '>>':
                    if (token = tokens[index++])
                    {
                        if ('#.@'.indexOf(token[0]) < 0)
                        {
                            tokens.splice(index - 1, 0, '&');
                        }
                        
                        if (token = tokens[index++])
                        {
                            if (/\W/.test(token[0]))
                            {
                                raise(tokens, index);
                            }
                        }
                        else
                        {
                            raise(tokens, index);
                        }
                    }
                    else
                    {
                        raise(tokens, index);
                    }
                    break;

                default:
                    raise(tokens, index);
                    break;
            }
        }

        return cache[selector] = tokens;
    }


    function raise(tokens, index) {

        throw 'selector is invalid! at "' + tokens.slice(0, index).join('') + '"';
    }


    Class.parse = function (selector) {

        return selector ? cache[selector] || parse(selector) : null;
    }



    
    this.find = function (selector) {
    
        var key = selector[0];

        switch (key)
        {
            case '@':
            case '#':
            case '.':
                selector = selector.substring(1);
                break;
        }
        
        for (var i = this.length; i--;)
        {
            if (!this[i].__find_value(key, selector))
            {
                this.splice(i, 1);
            }
        }

        return this;
    }



    this.get = function (name) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            if ((item = item[name]) !== void 0)
            {
                return item;
            }
        }
    }


    this.set = function (name, value) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item[name] = value;
        }

        return this;
    }


    this.call = function (name, args) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            var fn = item[name];

            if (fn)
            {
                if (args)
                {
                    fn.call(item);
                }
                else
                {
                    fn.apply(item, args);
                }
            }
        }

        return this;
    }



    this.hasClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.hasClass(name))
                {
                    return true;
                }
            }
        }
        
        return false;
    }


    this.addClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.addClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }


    this.removeClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.removeClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.toggleClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }



    this.style = function (name, value) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.style[name] = value;
        }

        return this;
    }


    this.on = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.on(type, listener);
        }

        return this;
    }


    this.off = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.off(type, listener);
        }

        return this;
    }


    this.trigger = function (type, payload) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.trigger(type, payload);
        }

        return this;
    }


    this.remove = function () {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.remove();
        }

        return this;
    }


});




yaxi.Repeater = yaxi.Control.extend(function (Class, base) {



    var create = Object.create;




    yaxi.template(this, '<div class="yx-control yx-repeater"></div>');

    

    Class.ctor = function (data) {

        this.$storage = create(this.$defaults);

        this.__children = new yaxi.ControlCollection(this);

        if (data)
        {
            this.__init(data);
        }
    }




    // 模板
    this.$property('template', {
     
        defaultValue: null,

        set: function (value) {

            var storage = this.$storage;

            if (value && typeof value !== 'object')
            {
                value = null;
            }

            if (storage.template !== value)
            {
                storage.template = value;

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

        converter: function (value) {

            if (value)
            {
                if (value.__model_type !== 2)
                {
                    value = this.__find_store('' + value);
                }

                value.$bind(this);;
            }
            else
            {
                if (value = this.store)
                {
                    value.$unbind(this);
                }

                value = null;
            }

            return value;
        },

        set: function (value) {

            var storage = this.$storage;

            value = this.$converters.store.fn.call(this, value);

            if (storage.store !== value)
            {
                storage.store = value;

                this.__children.clear();

                if (value && storage.template)
                {
                    this.__model_insert(-1, value);
                }
            }
        }

    }, false);




    this.__init = function (data) {

        base.__init.call(this, data);
        
        if (data.template && (data = this.store))
        {
            this.__model_insert(-1, data);
        }
    }




    var patch = yaxi.__add_patch;



    this.__update_patch = function () {

        var changes;

        if (changes = this.__changes)
        {
            base.__update_patch.call(this);

            if ((changes.template || changes.store) && (changes = this.store) && changes.length > 0)
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

                any.__init(template);
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


    // 扩展下拉刷新功能
    yaxi.__extend_pulldown.call(this);


    

}).register('Repeater');




yaxi.Tab = yaxi.Panel.extend(function (Class, base) {


    
    yaxi.template(this, '<div class="yx-control yx-panel yx-tab"></div>');


    
    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);
        this.on('tap', handleTap);
    }




    this.$property('selectedIndex', {

        type: 'int',
        defaultValue: -1
    });



    // 容器宿主
    this.$property('host', '', false);



    this.$converters.openURL = false;



    // 选中的页头
    Object.defineProperty(this, 'selectedItem', {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.__children[index] || null;
        }
    });


    // 选中的页签容器
    Object.defineProperty(this, 'selectedHost', {

        get: function () {

            var index = this.selectedIndex,
                item;

            if (index >= 0 && (item = this.__children[index]))
            {
                return item.host || null;
            }

            return null;
        }
    });



    function handleTap(event) {

        var target = event.target,
            parent;

        while (target && target !== this)
        {
            parent = target.parent;

            if (parent === this)
            {
                this.selectedIndex = this.__children.indexOf(target);
                break;
            }

            target = parent;
        }
    }



    function createControl(base, url, args) {

        var Class = require.execute(base, url),
            control,
            style;

        if (args && args.length > 0)
        {
            control = Object.create(Class.prototype);
            Class.apply(control, args);
        }
        else
        {
            control = new Class();
        }

        style = control.style;
        style.position = 'absolute';
        style.top = style.left = style.right = style.bottom = 0;

        return control;
    }



    this.renderer.selectedIndex = function (dom, value) {

        var children = this.__children,
            last,
            item,
            host;

        if (last = children[this.__index])
        {
            last.theme = '';

            if (host = last.host)
            {
                host.style.display = 'none';
                host.onhide && host.onhide();
            }
        }

        if (item = children[value])
        {
            item.theme = 'primary';

            if (host = item.host)
            {
                host.style.display = 'block';
                host.onshow && host.onshow();
            }
            else if (item.url && (host = this.host && this.find(this.host)) && (children = host.children)) // 打开指定url
            {
                host = createControl(this.baseURL, item.url, item.args);

                children.push(item.host = host);
                host.onshow && host.onshow();
            }
        }
        else if (last)
        {
            value = -1;
        }

        this.__index = value;

        this.trigger('change', {
            last: last,
            selected: item
        });
    }



    this.onshow = function () {

        var host = this.selectedHost;

        if (host && host.onshow)
        {
            host.onshow();
        }
    }


    this.onhide = function () {

        var host = this.selectedHost;

        if (host && host.onhide)
        {
            host.onhide();
        }
    }



    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].host = null;
        }

        base.destroy.call(this);
    }

    


}).register('Tab');




yaxi.Text = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-text"></span>');



    this.$property('text', '');


    this.$property('format', {
    
        defaultValue: null,
        converter: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    }, false);



    this.renderer.text = function (dom, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        dom.textContent = value;
    }



}).register('Text');




yaxi.Upload = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<input type="file" class="yx-control yx-upload" />');



}).register('Upload');




yaxi.TextBox = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox"><input type="text" /></span>');



    this.$property('value', '');



    Object.defineProperty(this, 'text', {

        get: function () {
        
            var any;

            if (any = this.$dom)
            {
                return any.firstChild.value;
            }

            return (any = this.__format) ? any(this.value) : this.value;
        },
        set: function (value) {

            var dom;

            if (dom = this.$dom)
            {
                dom.firstChild.value = value;
            }
        }
    });

    
    this.$property('placeholder', '');


    this.$property('align', 'left');


    this.$property('maxLength', 0);


    this.$property('pattern', '');


    this.$property('format', {
    
        defaultValue: null,

        converter: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    }, false);




    this.focus = function () {

        var dom;

        if (dom = this.$dom)
        {
            dom.focus();
        }
    }

    
    this.blur = function () {

        var dom;

        if (dom = this.$dom)
        {
            dom.blur();
        }
    }




    var renderer = this.renderer;


    renderer.value = function (dom, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        dom.firstChild.value = value;
    }



    renderer.placeholder = function (dom, value) {

        dom.firstChild.placeholder = value;
    }


    renderer.maxLength = function (dom, value) {

        dom.firstChild.maxLength = value;
    }


    renderer.pattern = function (dom, value) {

        dom.firstChild.setAttribute('pattern', value);
    }


    
    this.__on_change = function () {

        var value = this.$dom.firstChild.value,
            binding;

        this.value = value;

        if (this.value !== value)
        {
            if (binding = this.__binding_push)
            {
                binding.model.$push(this, this.value);
            }
        }
        else
        {
            this.renderer.value(this.$dom, value);
        }
    }



}).register('TextBox');




yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-checkbox"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-checkbox-unchecked"></use></svg><span></span></span>');




    this.$property('text', '');
    

    this.$property('fill', '');

    
    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-checkbox-checked');


    this.$property('uncheckedIcon', 'icon-yaxi-checkbox-unchecked');

    


    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    renderer.checked = function (dom, value) {

        dom.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    renderer.checkedIcon = function (dom, value) {

        if (value && this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    renderer.uncheckedIcon = function (dom, value) {

        if (value && !this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    renderer.fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }



    this.__on_tap = function () {

        var binding = this.__binding_push;

        this.checked = !this.checked;

        if (binding)
        {
            binding.model.$push(this, this.checked);
        }
        
        this.trigger('change');
    }



}).register('CheckBox');




yaxi.Memo = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-memo"><textarea></textarea></span>');




    this.$property('value', '');

    
    this.$property('placeholder', '');




    Object.defineProperty(this, 'text', {

        get: function () {
        
            var any;

            if (any = this.$dom)
            {
                return any.firstChild.value;
            }

            return (any = this.__format) ? any(this.value) : this.value;
        },
        set: function (value) {

            var dom;

            if (dom = this.$dom)
            {
                dom.firstChild.value = value;
            }
        }
    });



    this.focus = function () {

        var dom;

        if (dom = this.$dom)
        {
            dom.focus();
        }
    }

    
    this.blur = function () {

        var dom;

        if (dom = this.$dom)
        {
            dom.blur();
        }
    }

    


    var renderer = this.renderer;


    renderer.value = function (dom, value) {

        dom.firstChild.value = value;
    }


    renderer.placeholder = function (dom, value) {

        dom.firstChild.placeholder = value;
    }



    this.__on_change = function () {

        var binding = this.__binding_push;

        this.text = this.$dom.firstChild.value;
        
        if (binding)
        {
            binding.model.$push(this, this.checked);
        }
    }



}).register('Memo');




yaxi.Number = yaxi.TextBox.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox yx-number">'
            + '<input type="number" />'
            + '<span class="yx-number-minus">-</span>'
            + '<span class="yx-number-plus">＋</span>'
        + '</span>');



    // 是否显示button
    this.$property('button', false);


    // 当前值
    this.$property('value', {
    
        defaultValue: 0,
        converter: function (value) {

            var any;

            value = +value || 0;

            if (value < (any = this.min))
            {
                return any;
            }

            if (value > (any = this.max))
            {
                return any;
            }

            return value;
        }
    });


    // 最小值
    this.$property('min', -Infinity, false);


    // 最大值
    this.$property('max', Infinity, false);


    // 加减步进
    this.$property('step', 1);




    var renderer = this.renderer;


    renderer.button = function (dom, value) {

        if (value)
        {
            dom.setAttribute('button', true);
        }
        else
        {
            dom.removeAttribute('button');
        }
    }



    renderer.value = function (dom, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        dom = dom.firstChild;
        dom.value = value ? value : (dom.value ? 0 : '');

        dom = dom.nextSibling;

        if (value === this.min)
        {
            dom.setAttribute('disabled', true);
        }
        else
        {
            dom.removeAttribute('disabled');
        }

        dom = dom.nextSibling;

        if (value === this.max)
        {
            dom.setAttribute('disabled', true);
        }
        else
        {
            dom.removeAttribute('disabled');
        }
    }


    this.__on_tap = function (event) {

        var dom = this.$dom,
            target = event.dom,
            keys;

        while (target && target !== dom)
        {
            if (keys = target.classList)
            {
                if (keys.contains('yx-number-minus'))
                {
                    change(this, (+dom.firstChild.value || 0) - this.step);

                    event.stop();
                    return false;
                }
                
                if (keys.contains('yx-number-plus'))
                {
                    change(this, (+dom.firstChild.value || 0) + this.step);

                    event.stop();
                    return false;
                }
            }

            target = target.parentNode;
        }
    }



    function change(control, value) {

        var any;

        any = control.value;
        control.value = value;

        if ((value = control.value) !== any)
        {
            if (binding = control.__binding_push)
            {
                binding.model.$push(control, value);
            }

            any = new yaxi.Event();
            any.type = 'change';
            any.dom = control.$dom.firstChild;
            any.value = value;

            return control.trigger(any);
        }
        
        control.renderer.value(control.$dom, value);
    }



    this.__on_change = function () {

        var value = this.value,
            binding;

        this.value = +this.$dom.firstChild.value || 0;

        if (this.value !== value)
        {
            if (binding = this.__binding_push)
            {
                binding.model.$push(this, this.value);
            }
        }
        else
        {
            this.renderer.value(this.$dom, value);
        }
    }



}).register('Number');




yaxi.Password = yaxi.TextBox.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox yx-password"><input type="password" /><span><svg aria-hidden="true"><use xlink:href="#icon-yaxi-eye-close"></use></svg></span></span>');




    this.$property('type', '');




    this.renderer.type = function (dom, value) {

        dom.lastChild.className = value ? 'yx-password-' + value : '';
    }


    this.__on_tap = function (event) {

        var dom = this.$dom,
            target = event.dom,
            icon;

        while (target && target !== dom)
        {
            if (target.tagName === 'SPAN')
            {
                dom = dom.firstChild;
                
                if (dom.type === 'text')
                {
                    dom.type = 'password';
                    icon = 'yaxi-eye-close';
                }
                else
                {
                    dom.type = 'text';
                    icon = 'yaxi-eye-open';
                }

                target.firstChild.firstChild.setAttribute('xlink:href', '#icon-' + icon);
                return;
            }

            target = target.parentNode;
        }
    }




}).register('Password');




yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-radiobutton"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-radio-unchecked"></use></svg><span></span></span>');



    this.$property('text', '');


    this.$property('fill', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-radio-checked');


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked');


    // 互斥容器级别
    this.$property('host', 1);

    


    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    renderer.checked = function (dom, value) {

        dom.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    renderer.checkedIcon = function (dom, value) {

        if (value && this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    renderer.uncheckedIcon = function (dom, value) {

        if (value && !this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }

    renderer.fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }

    

    this.__on_tap = function () {

        if (!this.checked)
        {
            var binding = this.__binding_push;

            this.checked = true;
    
            if (binding)
            {
                binding.model.$push(this, true);
            }
    
            this.trigger('change');

            // 同一容器内的组件互斥
            this.mutex(this.host)
        }
    }



    this.mutex = function (host) {

        var parent = this.parent;

        host |= 0;

        while (--host)
        {
            parent = parent.parent;
        }

        if (parent)
        {
            var list = parent.query('>>RadioButton');

            for (var i = list.length; i--;)
            {
                var item = list[i];
    
                if (item instanceof Class && item !== this && item.checked)
                {
                    item.checked = false;
                }
            }
        }
    }



}).register('RadioButton');




yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-switchbutton"><span class="yx-switchbutton-bar"></span><span class="yx-switchbutton-button"></span></span>');




    this.$property('checked', false);
    



    this.renderer.checked = function (dom, value) {

        var classList = dom.classList;

        if (value)
        {
            classList.add('yx-switchbutton-checked');
        }
        else
        {
            classList.remove('yx-switchbutton-checked');
        }
    }



    this.__on_tap = function () {

        var binding = this.__binding_push;

        this.checked = !this.checked;

        if (binding)
        {
            binding.model.$push(this, this.checked);
        }

        this.trigger('change');
    }



}).register('SwitchButton');




yaxi.Page = yaxi.Control.extend(function (Class, base) {



	var create = Object.create;



	Class.all = function () {

		var list = [],
			page = Class.current;

		while (page)
		{
			list.push(page);
			page = page.opener;
		}

		return list.reverse();
	}


	Class.close = function (amount, closeType) {

		var page;

		if (typeof amount === 'string')
		{
			closeType = amount;
			amount = 1;
		}
		else
		{
			amount = amount || 1;
		}

		while (amount > 0 && (page = Class.current))
		{
			page.close(closeType);
			amount--;
		}

		return Class.current;
	}


	Class.closeTo = function (level, closeType) {

		var list = Class.all();

		level |= 0;

		for (var i = list.length - 1; i > level; i--)
		{
			list[i].close(closeType || 'OK');
		}

		return list[level];
	}


	Class.closeAll = function (closeType) {

		var page;

		while (page = Class.current)
		{
			page.close(closeType || 'OK');
		}
	}




	yaxi.template(this, '<div class="yx-control yx-page"></div>');



	Class.ctor = function (data) {

		this.$storage = create(this.$defaults);

		this.key = 'page';
		this.__children = [];

		if (data)
		{
			this.__init(data);
		}
	}

	


	// 页头
	this.header = null;


	// 页体
	this.content = null;


	// 页脚
	this.footer = null;



	// 是否自动销毁
	this.$property('autoDestroy', true, false);

		


	this.$converters.header = {
		
		fn: function (data) {
		
			var control;

			if (!data || typeof data !== 'object')
			{
				data = this.__template_header(data);
			}
			
			data.key = data.key || 'page-header';
			data.className = 'yx-header ' + (data.className || '');

			control = new (data.Class || yaxi.Panel)();
			control.parent = this;

			control.__init(data);

			this.__children.push(this.header = control);
		}
	};


	this.__template_header = function (text) {
	
		return {
			children: [
				{
					Class: yaxi.BackButton
				},
				{
					Class: yaxi.Title,
					text: text
				}
			]
		};
	}
	
	
	this.$converters.content = {
		
		fn: function (data) {
		
			var control;
			
			if (!data || typeof data !== 'object')
			{
				data = {
					Class: yaxi.Text,
					text: data
				};
			}

			data.key = data.key || 'page-content';
			data.className = 'yx-content ' + (data.className || '');

			control = new (data.Class || yaxi.Panel)();
			control.parent = this;
			control.__init(data);

			this.__children.push(this.content = control);
		}
	};
	
	
	this.$converters.footer = {
		
		fn: function (data) {
	
			var control;

			if (!data || typeof data !== 'object')
			{
				data = {
					Class: yaxi.Text,
					text: data
				};
			}

			data.key = data.key || 'page-footer';
			data.className = 'yx-footer ' + (data.className || '');

			control = new (data.Class || yaxi.Panel)();
			control.parent = this;

			control.__init(data);

			this.__children.push(this.footer = control);
		}
	};




	this.__find_up = function () {
	
		return null;
	}

	
	// 扩展容器功能
	yaxi.container.call(this, base);




	this.open = function () {
				
		var opener = Class.current || null;
		
		if (this.onopening() !== false)
		{
			var body = document.body,
				dom = this.$dom || this.render();

			body.focus();
			body.appendChild(dom);
			
			Class.current = this;
			
		    this.opener = opener;

			this.onopened();
			this.onshow();

			if (opener)
			{
				opener.$dom.style.display = 'none';
				opener.onhide();
			}
			
			this.trigger('opened');
		}

		return this;
	}
	
	
	this.close = function (closeType) {
		
		if (this.onclosing(closeType || (closeType = 'OK')) !== false)
		{
			var opener = this.opener || null,
				dom = this.$dom;
			
			this.onhide();
			this.onclosed(closeType);
			this.opener = null;
			
			if (dom.parentNode)
			{
				dom.parentNode.removeChild(dom);
			}
			
			if (opener)
			{
				opener.$dom.style.display = '';
				opener.onshow();
			}

			Class.current = opener;
			
			this.trigger('closed', { closeType: closeType });

			yaxi.toast.hide();
			
			if (this.autoDestroy)
			{
				// 延时销毁以加快页面切换速度
				setTimeout(this.destroy.bind(this), 100);
			}
		}
	}
	
	
	this.onopening = function (options) {
		
	}
	
	
	this.onopened = function (options) {
		
	}
	
	
	this.onclosing = function (closeType) {
		
	}
	
	
	this.onclosed = function (closeType) {
		
	}


	this.onshow = function () {

	}


	this.onhide = function () {

	}



	
    this.render = function () {

        var dom = base.render.call(this),
            any;

        if (any = this.header)
        {
			any = any.render();
			any.classList.add('yx-header');

            dom.appendChild(any);
        }

        if (any = this.content)
        {
			any = any.render();
			any.classList.add('yx-content');

            dom.appendChild(any);
        }

        if (any = this.footer)
        {
			any = any.render();
			any.classList.add('yx-footer');

            dom.appendChild(any);
        }

        return dom;
    }
	
	
	
	this.destroy = function () {

		var any;

		if (any = this.footer)
		{
			any.destroy();
		}

		if (any = this.content)
		{
			this.content.destroy();
		}
		
		if (any = this.header)
		{
			any.destroy();
		}

		base.destroy.call(this);
	}
	

    
}).register('Page');




yaxi.BackButton = yaxi.Control.extend(function (Class, base) {

    
    
    var create = Object.create;
    


    yaxi.template(this, '<span class="yx-control yx-backbutton"><svg class="yx-icon-svg" aria-hidden="true"><use xlink:href="#icon-yaxi-back"></use></svg><span></span></span>');



    Class.ctor = function (data) {

        this.$storage = create(this.$defaults);

        if (data)
        {
            this.__init(data);
        }

        this.on('tap', handleTap.bind(this));
    }




    this.$property('text', '');



    function handleTap(event) {

        var target = this,
            parent;

        while (parent = target.parent)
        {
            target = parent;
        }

        target.close('BACK');
    }



    this.renderer.text = function (dom, value) {

        dom.lastChild.innerHTML = value;
        dom.style.width = value ? 'auto' : '';
    }



    
}).register('BackButton');




yaxi.Dialog = yaxi.Page.extend(function (Class) {
	
	
	
	var stack = Class.stack = [];
	
	var eventName = 'ontouchstart' ? 'touchstart' : 'mousedown';

    var mask = document.createElement('div');


	mask.className = 'yx-mask';
	


    yaxi.template(this, '<div class="yx-control yx-dialog"></div>');
	



	// 水平对齐方式
	// left: 左对齐
	// center: 居中对齐
	// right: 右对齐
	// custom: 自定义
	this.$property('alignX', 'center');


	// 竖直对齐方式
	// top: 上对齐
	// middle: 居中对齐
	// bottom: 下对齐
	// custom: 自定义
	this.$property('alignY', 'middle');


	// 是否自动关闭
	this.$property('autoClose', false, false);




	this.__template_header = function (text) {

		return {

			Class: yaxi.Title,
			text: text
		};
	}

	

	function checkTap(event) {
		
		var dialog = stack[stack.length - 1];
		
		if (dialog)
		{
			var dom = dialog.$dom,
				node = event.target;
				
			while (node)
			{
				if (node === dom)
				{
					return;
				}
				
				node = node.parentNode;
			}

			if (dialog.autoClose)
			{
				dialog.close();
			}

			event.stopImmediatePropagation();
			return false;
		}
	}



	function computePosition() {

		var dialog = stack[stack.length - 1],
			dom;

		if (dialog && (dom = dialog.$dom))
		{
			var style = dom.style;

			switch (dialog.alignY)
			{
				case 'top':
					style.top = 0;
					style.bottom = '';
					break;

				case 'middle':
					style.top = (window.innerHeight - dom.offsetHeight >> 1) + 'px';
					style.bottom = '';
					break;

				case 'bottom':
					style.top = '';
					style.bottom = 0;
					break;
			}

			switch (dialog.alignX)
			{
				case 'left':
					style.left = 0;
					style.right = '';
					break;

				case 'center':
					style.left = (window.innerWidth - dom.offsetWidth >> 1) + 'px';
					style.right = '';
					break;
				
				case 'right':
					style.left = '';
					style.right = 0;
					break;
			}
		}
	}


	
	this.open = function () {
		
		if (stack.indexOf(this) >= 0 || this.onopening() === false)
		{
			return false;
		}

		document.body.appendChild(mask);
		document.body.appendChild(this.$dom || this.render());

		// 打开弹出窗口时让出焦点
		var dom = document.activeElement;

		if (dom)
		{
			dom.blur();
		}

		this.onopened();
		this.onshow();

		this.trigger('opened');

		stack.push(this);
		computePosition.call(this);

		if (!stack[1])
		{
			document.addEventListener(eventName, checkTap, true);
			window.addEventListener('resize', computePosition, true);
		}

		return this;
	}
	
	
	
	this.close = function (closeType) {
		
		var index = stack.indexOf(this);

		if (index < 0 || this.onclosing(closeType) === false)
		{
			return false;
		}

		var dom = this.$dom;

		if (dom && dom.parentNode)
		{
			dom.parentNode.removeChild(dom);
		}

		if (dom = mask.parentNode)
		{
			dom.removeChild(mask);
		}

		stack.splice(index, 1);

		if (stack[0])
		{
			computePosition();
		}
		else
		{
			document.removeEventListener(eventName, checkTap, true);
			window.removeEventListener('resize', computePosition, true);
		}

		this.onhide();
		this.onclosed(closeType);

		this.trigger('closed', {

			closeType: closeType
		});

		if (this.autoDestroy)
		{
			this.destroy();
		}
	}
	


}).register('Dialog');




yaxi.FloatLayer = yaxi.Panel.extend(function (Class, base) {
	


	var stack = yaxi.__layer_stack;



	yaxi.template(this, '<div class="yx-control yx-floatlayer"></div>');


	
	
	this.show = function (reference, offset) {
		
		var rect = reference.getBoundingClientRect(),
			offsetX = offset ? (offset.x | 0) : 0,
			offsetY = offset ? (offset.y | 0) : 0;
		
		this.showAt(rect.left + offsetX, rect.top + reference.offsetHeight + offsetY);
		return this;
	}
	
	
	
	this.showAt = function (x, y) {
		
		if (stack.indexOf(this) < 0)
		{
			var dom = this.$dom || (this.$dom = this.render());
			
			style = dom.style;
			style.left = x > 0 ? x + 'px' : x;
			style.top = y > 0 ? y + 'px' : y;
			
			document.body.appendChild(dom);
			
			stack.push(this);
		}

		return this;
	}
	
	
	
	this.close = function () {
		
		var parent, dom;

		if (stack[stack.length - 1] === this)
		{
            stack.pop();

            if ((dom = this.$dom) && (parent = dom.parentNode))
            {
                parent.removeChild(dom);
			}

			this.trigger('closed');

			if (this.autoDestroy !== false)
            {
				this.destroy();
			}
		}
	}

	
	
}).register('FloatLayer');




yaxi.showMessage = function (options) {

    var Button = yaxi.Button,
        i18n = Button[yaxi.language] || Button['en-US'],
        buttons,
        callback;

    if (!options || typeof options !== 'object')
    {
        options = {
            header: yaxi.showMessage.header || '',
            content: {
                layout: 'row',
                style: {
                    alignItems: 'center',
                    wordBreak: 'break-word'
                },
                children: [
                    {
                        Class: yaxi.Text,
                        text: options
                    }
                ]
            }
        };
    }
    else
    {
        options.header || (options.header = yaxi.showMessage.header || '');
        
        if (typeof options.content === 'string')
        {
            options.content = {
                layout: 'row',
                style: {
                    alignItems: 'center',
                    wordBreak: 'break-word'
                },
                children: [
                    {
                        Class: yaxi.Multiline,
                        text: options.content
                    }
                ]
            };
        }

        if (buttons = options.buttons)
        {
            for (var i = buttons.length; i--;)
            {
                var item = buttons[i];

                if (item && typeof item === 'object')
                {
                    if (!item.text)
                    {
                        item.text = i18n[item.key] || item.key;
                    }
                }
                else
                {
                    buttons[i] = {
                        key: item,
                        text: i18n[item] || item
                    }
                }
            }
        }
        
        callback = options.callback;
    }
 
    options.className = 'yx-messagebox';

    options.footer = {
        subtype: Button,
        children: options.buttons || [
            {
                key: 'OK',
                text: i18n.OK
            }
        ],
        events: {
            tap: function (event) {

                var dialog = this.parent,
                    target = event.target;

                if (target !== this && target.key && (!callback || callback.call(dialog, target) !== false))
                {
                    dialog.close();
                }
            }
        }
    };
    
    return new yaxi.Dialog(options).open();
}


yaxi.prompt = function (options) {

    var callback = options && options.callback;

    options = options || {};

    callback && (options.callback = function (button) {

        return callback.call(this, this.content.find('>>@input').text, button);
    });

    options.content = {
        layout: 'row',
        style: {
            alignItems: 'center',
            wordBreak: 'break-word'
        },
        children: [
            {
                Class: options.control || (options.password ? yaxi.Password : yaxi.TextBox),
                key: 'input',
                value: options.value || '',
                style: {
                    width: '100%',
                    margin: '.3rem 0.1rem .2rem',
                    borderStyle: 'none none solid none'
                }
            }
        ]
    };

    options.buttons || (options.buttons = [
        {
            theme: 'primary',
            key: 'OK'
        },
        'Cancel'
    ]);

    return yaxi.showMessage(options);
}




yaxi.Title = yaxi.Control.extend(function (Class) {
    
    

    yaxi.template(this, '<div class="yx-control yx-title"></div>');
    
    


    this.$property('text', '');




    this.renderer.text = function (dom, value) {

        dom.textContent = value;
    }
	
	
	
}).register('Title');




(function () {


    var dom = document.createElement('div');

    var mask = document.createElement('div');

    var delay;



    dom.className = 'yx-toast';
    mask.className = 'yx-mask';



    function show(options) {

        var style = dom.style;

        close();

        dom.innerHTML = (options.loading ? '<span class="yx-toast-loading"></span>' : '')
            + '<span>' + options.text + '</span>';
    
        if (options.mask || options.loading && options.mask !== false)
        {
            mask.style.backgroundColor = '';
            document.body.appendChild(mask);
        }

        document.body.appendChild(dom);

        style.cssText = options.style || '';
        style.left = (window.innerWidth - dom.offsetWidth >> 1) + 'px';

        switch (options.position)
        {
            case 'top':
                style.top = options.offset == null ? '.8rem' : options.offset;
                break;

            case 'bottom':
                style.bottom = options.offset == null ? '.8rem' : options.offset;
                break;

            default:
                style.top = (window.innerHeight - dom.offsetHeight >> 1) + 'px';
                break;
        }

        if (options.time >= 0)
        {
            delay = setTimeout(close, options.time || 2500);
        }
    }


    function close() {

        var any;
        
        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (any = dom.parentNode)
        {
            any.removeChild(dom);
        }

        if (any = mask.parentNode)
        {
            any.removeChild(mask);
        }
    }


    this.toast = function (options) {

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (!options)
        {
            return;
        }

        if (typeof options === 'string')
        {
            options = { text: options, time: 2500 };
        }
        else if (!options.time)
        {
            options.time = 2500;
        }
    
        if (options.delay > 0)
        {
            if (!mask.parentNode)
            {
                mask.style.backgroundColor = 'rgba(255,255,255,0)';
                document.body.appendChild(mask);
            }

            delay = setTimeout(function () {

                show(options);

            }, options.delay);
        }
        else
        {
            show(options);
        }
    }


    this.toast.hide = function () {

        close();
    }

    

}).call(yaxi);




yaxi.Control.extend(function (Class, base) {



    var stack = yaxi.__layer_stack;



    Class['en-US'] = 'Cancel';


    Class['zh-CN'] = '取消';


    Class['zh-TW'] = '取消';

    


	yaxi.template(this, '<div class="yx-control yx-actionsheet"></div>');




	// header
	this.header = null;


	// 页体
	this.content = null;


	// 取消
	this.cancel = true;



    this.$converters.header = {
        
        fn: function (data) {

            if (data !== false)
            {
                var control;

                if (!data || typeof data !== 'object')
                {
                    data = {
                        Class: yaxi.Text,
                        text: data
                    };
                }

                data.className = 'yx-actionsheet-header ' + (data.className || '');

                control = this.header = new (data.Class || yaxi.Text)();
                control.parent = this;
                control.__init(data);
            }
        }
    };

	
	this.$converters.content = {
        
        fn: function (data) {
		
            if (data)
            {
                var control;

                if (data instanceof Array)
                {
                    data = {
                        Class: yaxi.Panel,
                        children: data
                    }
                }

                data.className = 'yx-actionsheet-content ' + (data.className || '');
                
                control = this.content = new (data.Class || yaxi.Panel)();
                control.parent = this;
                control.__init(data);
                control.on('tap', selected);
            }
        }
	};
	
	
	this.$converters.cancel = {
        
        fn: function (data) {
	
            if (data !== false)
            {
                var control;

                if (!data || typeof data !== 'object')
                {
                    data = {
                        Class: yaxi.Text,
                        text: data
                    };
                }

                data.className = 'yx-actionsheet-cancel ' + (data.className || '');

                control = this.cancel = new (data.Class || yaxi.Text)();
                control.parent = this;
                control.__init(data);
                control.on('tap', close);
            }
        }
	};



    function selected(event) {

        var control = event.target,
            parent;

        while (control && (parent = control.parent))
        {
            if (parent === this)
            {
                this.parent.close(control);
                return;
            }

            control = parent;
        }
    }


    function close() {

        this.parent.close();
    }

	
	
	this.show = function () {
		
        if (stack.indexOf(this) < 0)
        {
            var dom = this.$dom,
                any;
            
            if (!dom)
            {
                dom = this.render();

                if (any = this.header)
                {
                    dom.appendChild(any.$dom || any.render());
                }

                if (any = this.content)
                {
                    dom.appendChild(any.$dom || any.render());
                }

                if (any = this.cancel)
                {
                    dom.appendChild(any.$dom || any.render());
                }
            }

            document.body.appendChild(dom);
            stack.push(this);
        }

        return this;
	}
	
	
	
	this.close = function (selected) {
		
		var parent, dom;

		if (stack[stack.length - 1] === this)
		{
            stack.pop();

            if ((dom = this.$dom) && (parent = dom.parentNode))
            {
                parent.removeChild(dom);
            }

            this.trigger('closed', { selected: selected || this.cancel });
            
            if (this.autoDestroy !== false)
            {
                this.destroy();
            }
		}
    }
    

    this.destroy = function () {

        var control;

        if (control = this.header)
        {
            this.header = null;
            control.destroy();
        }

        if (control = this.content)
        {
            this.content = null;
            control.destroy();
        }

        if (control = this.cancel)
        {
            this.cancel = null;
            control.destroy();
        }

        base.destroy.call(this);
    }



    yaxi.actionsheet = function (data) {

        if (!data || !data.content)
        {
            throw 'actionsheet must input a object and content not allow empty!'
        }

        if (data.cancel === void 0)
        {
            data.cancel = {
                Class: yaxi.Text,
                text: Class[yaxi.language]
            };
        }

        return new Class(data).show();
    }
    

});




yaxi.Carousel = yaxi.Control.extend(function (Class, base) {



    
    var create = Object.create;


    
    yaxi.template(this, '<div class="yx-control yx-carousel"><div class="yx-carousel-host"></div><div class="yx-carousel-pagination"></div></div>');



    Class.ctor = function (data) {

        this.$storage = create(this.$defaults);
        this.__children = new yaxi.ControlCollection(this);

        if (data)
        {
            this.__init(data);
        }

        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchend);

        this.__auto = auto.bind(this);
    }



    // 当前索引
    this.$property('index', {

        defaultValue: 0,

        converter: function (value) {

            if ((value |= 0) < 0)
            {
                return 0;
            }
            
            if (value >= this.children.length)
            {
                return this.children.length - 1;
            }

            return value;
        }
    });


    // 间隔时间
    this.$property('time', {
    
        defaultValue: 0,

        converter: function (value) {

            value |= 0;
            return value < 0 ? 0 : value;
        }
    });


    // 页码
    this.$property('pagination', 'dot');



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



    this.$converters.children = {
        
        fn: function (value) {
      
            if (value && value.length > 0)
            {
                this.__children.__init(this, value);
            }
        }
    };



    // 子控件类型
    this.__child_class = yaxi.Control;




    // 扩展容器功能
    yaxi.container.call(this, base);




    this.render = function () {

        var dom = base.render.call(this),
            host = dom.firstChild,
            children = this.__children,
            index = 0,
            any;

        children.__patch = 1;

        while (any = children[index++])
        {
            host.appendChild(any.render());
        }

        if ((any = this.pagination) && children.length > 0)
        {
            dom.lastChild.innerHTML = renderPagination(children, any, this.index);
        }

        if (any = this.time)
        {
            this.renderer.time(dom, any);
        }

        children.onchange = onchange;

        return dom;
    }




    var last = 0;

    var position = 0;


    function touchstart() {

        var dom = this.$dom,
            width = dom.clientWidth;

        if (this.__delay)
        {
            clearTimeout(this.__delay);
            this.__delay = 0;
        }

        last = -(this.__children.length - 1) * width;
        position = -this.index * width;

        dom.firstChild.style.transition = '';
    }


    function touchmove(event) {

        var offset = position + event.distanceX;

        if (offset > 0)
        {
            offset = 0;
        }
        else if (offset < last)
        {
            offset = last;
        }

        this.$dom.firstChild.style.transform = 'translateX(' + offset + 'px)';

        event.stop();
        return false;
    }


    function touchend(event) {

        var index = this.index,
            offset = event.distanceX,
            value = yaxi.rem;

        if (offset < -value && index < this.__children.length - 1)
        {
            this.index++;
        }
        else if (offset > value && index > 0)
        {
            this.index--;
        }
        else
        {
            this.renderer.index(this.$dom, index | 0);
        }

        if (value = this.time)
        {
            this.renderer.time(this.$dom, value + 1000);
        }
    }




    var renderer = this.renderer;

    
    renderer.index = function (dom, value) {

        var name = 'yx-carousel-selected',
            style1 = dom.firstChild.style,
            style2,
            any;

        if (value > 0 || position)
        {
            style1.transform = 'translateX(-' + value + '00%)';
        }
        else // 回到第一页动画特殊处理
        {
            if (any = +style1.transform.match(/\d+/) | 0)
            {
                any += 100;
            }

            style2 = dom.firstChild.firstChild.style;
            style2.transform = 'translateX(' + any + '%)';

            style1.transform = 'translateX(-' + any + '%)';

            setTimeout(function () {

                style1.transform = style1.transition = style2.transform = '';

            }, 600);
        }

        style1.transition = 'transform 600ms ease';

        if (any = dom.lastChild.querySelector('.' + name))
        {
            any.classList.remove(name);
        }

        if (any = dom.lastChild.children[value])
        {
            any.classList.add(name);
        }
    }


    renderer.time = function (dom, value) {

        if (this.__delay)
        {
            clearTimeout(this.__delay);
        }

        if (value > 0)
        {
            this.__delay = setTimeout(this.__auto, value);
        }
    }


    renderer.pagination = function (dom, value) {

        dom.lastChild.innerHTML = renderPagination(this.__children, value, this.index);
    }


    function onchange(carousel) {
    
        var dom;

        if (dom = carousel.$dom)
        {
            dom.lastChild.innerHTML = renderPagination(this, carousel.pagination, carousel.index);
        }
    }


    function renderPagination(children, pagination, index) {

        if (pagination && children.length > 0)
        {
            switch (pagination)
            {
                default:
                    return renderDot(children, index);
            }
        }

        return '';
    }


    function renderDot(children, index) {

        var array = [];

        for (var i = 0, l = children.length; i < l; i++)
        {
            array.push('<div class="yx-carousel-dot', 
                index === i ? ' yx-carousel-selected' : '',
                '"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg></div>');
        }

        return array.join('');
    }


    
    function auto() {

        var children = this.children,
            index = this.index + 1;

        if (index >= children.length)
        {
            index = 0;
        }

        this.index = index;

        this.__delay = setTimeout(this.__auto, this.time);
    }




}).register('Carousel');




yaxi.CircleText = yaxi.Control.extend(function () {




    yaxi.template(this, '<svg class="yx-control yx-circletext" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /><text x="50%" y="50%" dy="20" text-anchor="middle" style="font-size:60;" /></svg>');



    this.$property('text', '');

    
    this.$property('stroke', '');


    this.$property('strokeWidth', 0);


    this.$property('fill', '');


    this.$property('color', '');


    this.$property('textSize', 60);


    


    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    renderer.stroke = function (dom, value) {

        dom.firstChild.style.stroke = value;
    }


    renderer.strokeWidth = function (dom, value) {

        dom.firstChild.style.strokeWidth = value;
    }


    renderer.fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }


    renderer.color = function (dom, value) {

        dom.lastChild.style.fill = value;
    }


    renderer.textSize = function (dom, value) {

        dom = dom.lastChild;
        dom.style.fontSize = value;
        dom.setAttribute('dy', 100 - value >> 1);
    }



}).register('CircleText');




yaxi.GestureInput = yaxi.Control.extend(function (Class, base) {



    // 节点贯穿检查
    var throughs = [null,

        // 1
        {
            3: 2,
            7: 4,
            9: 5
        },

        // 2
        {
            8: 5
        },

        // 3
        {
            1: 2,
            7: 5,
            9: 6
        },

        // 4
        {
            6: 5
        },

        // 5
        {},

        //6
        {
            4: 5
        },

        // 7
        {
            1: 4,
            3: 5,
            9: 8
        },

        // 8
        {
            2: 5
        },

        // 9
        {
            1: 5,
            3: 6,
            7: 8
        }
    ];



    yaxi.template(this, '<div class="yx-control yx-gestureinput"><div><canvas></canvas><div></div></div></div>');



    
    this.$property('border', '1px solid silver');


    this.$property('color', 'silver');


    this.$property('size', .2);


    this.$property('lineColor', 'silver');


    this.$property('lineWidth', 5);


    this.$property('value', '');




    this.render = function () {

        var dom = this.$dom;
        
        if (!dom)
        {
            dom = this.$dom = this.$template.cloneNode(true);
            dom.$control = this;
            
            dom.firstChild.lastChild.innerHTML = points(this);
        }

        base.render.call(this);

        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);

        return dom;
    }


    function points(self) {

        var array = [''],
            size = self.size,
            half = Decimal.singleton(size).div(2).value + 'rem;',
            style = ' style="width:' + (size += 'rem;')
                + 'height:' + size 
                + 'margin-top:-' + half 
                + 'margin-left:-' + half 
                + 'background-color:' + self.color 
                + ';border:' + self.border
                + ';border-radius:' + half,
            top,
            left;

        for (var i = 0; i < 3; i++)
        {
            top = i > 0 ? (i === 1 ? 'top:50%;' : 'bottom:' + half) : 'top:' + size;
            
            for (var j = 1; j < 4; j++)
            {
                left = j > 1 ? (j === 2 ? 'left:50%;' : 'right:' + half) : 'left:' + size;
                array.push('<div class="yx-gestureinput-point"', style, top, left, '"></div>');
            }
        }

        return array.join('');
    }




    var state = {};


    function touchstart(event) {

        var dom = this.$dom.firstChild,
            rect = dom.getBoundingClientRect(),
            index;

        state.x = rect.left;
        state.y = rect.top;
        state.width = dom.offsetWidth;
        state.height = dom.offsetHeight;
        state.size = state.width / 6 | 0;

        this.value = '';

        if (index = hitTest(event.clientX - state.x, event.clientY - state.y))
        {
            change.call(this, index, false);
        }

        event.stop();
        return false;
    }


    function touchmove(event) {

        var index = hitTest(event.clientX - state.x, event.clientY - state.y);

        if (!index || !change.call(this, index))
        {
            draw.call(this, {

                x: event.clientX - state.x, 
                y: event.clientY - state.y
            });
        }

        event.stop();
        return false;
    }


    function touchend() {

        draw.call(this);
        this.trigger('change', { value: this.value });
    }


    function change(index, through) {

        var children = this.$dom.firstChild.lastChild.children,
            value = this.value;

        if (through !== false)
        {
            through = throughs[index][value[value.length - 1]];

            if (through && value.indexOf(through) < 0)
            {
                value += through;
                children[through - 1].setAttribute('choose', 1);
            }
            else
            {
                through = '';
            }
        }

        if (value.indexOf(index) < 0)
        {
            children[index - 1].setAttribute('choose', 1);
            this.value = value + index;

            return true;
        }

        if (through)
        {
            this.value = value;
            return true;
        }

        return false;
    }


    function hitTest(x, y) {

        var width = state.width,
            height = state.height,
            size = state.size,
            half = size / 2 | 0,
            column,
            row;

        if (x < 0 || x > width || y < 0 || y > height)
        {
            return 0;
        }

        if (y <= size)
        {
            row = 0;
        }
        else if (y >= height - size)
        {
            row = 2;
        }
        else if ((y = y - (height / 2 | 0)) < -half || y > half)
        {
            return 0;
        }
        else
        {
            row = 1;
        }

        if (x <= size)
        {
            column = 1;
        }
        else if (x >= width - size)
        {
            column = 3;
        }
        else if ((x = x - (width / 2 | 0)) < -half || x > half)
        {
            return 0;
        }
        else
        {
            column = 2;
        }

        return row * 3 + column;
    }


    function draw(point) {

        var dom = this.$dom,
            value = this.value,
            canvas = dom.firstChild.firstChild,
            context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width = canvas.offsetWidth, canvas.height = canvas.offsetHeight);

        if (value)
        {
            var children = dom.firstChild.lastChild.children,
                index = 1;

            dom = children[value[0] - 1];

            context.moveTo(dom.offsetLeft + dom.offsetWidth / 2, dom.offsetTop + dom.offsetHeight / 2);

            while (dom = children[value[index++] - 1])
            {
                context.lineTo(dom.offsetLeft + dom.offsetWidth / 2, dom.offsetTop + dom.offsetHeight / 2);
            }

            if (point)
            {
                context.lineTo(point.x, point.y);
            }

            context.strokeStyle = this.lineColor;
            context.lineWidth = this.lineWidth;
            context.lineJoin = 'bevel';
            context.stroke();
        }
    }



    this.renderer.value = function (dom, value) {

        if (value)
        {
            if (dom.offsetWidth > 0)
            {
                draw.call(this);
            }
            else if (this.parent)
            {
                this.root.once('opened', draw.bind(this));
            }
        }
        else
        {
            draw.call(this);
            
            dom = dom.firstChild.lastChild.firstChild;
            
            while (dom)
            {
                dom.removeAttribute('choose');
                dom = dom.nextSibling;
            }
        }
    }



}).register('GestureInput');




yaxi.Segment = yaxi.Control.extend(function (Class, base) {



	var create = Object.create;

    var thumb = '<svg class="yx-segment-thumb" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>'


    yaxi.template(this, '<div class="yx-control yx-segment"><div class="yx-segment-line"></div><div class="yx-segment-body">' + thumb + '</div>');




    Class.ctor = function (data) {

        // 初始化存储值
        this.$storage = create(this.$defaults);

        if (data)
        {
            this.__init(data);
        }

        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchcancel);
    }




    // 当前值
    this.$property('value', 0);


    // 步进(为零时只能落在分段上)
    this.$property('step', 0, false);


    // 分段数
    this.$property('segments', {
    
        defaultValue: null,

        converter: function (value) {

            if (value)
            {
                if (value > 0)
                {
                    var array = [0],
                        decimal = Decimal.singleton,
                        split = decimal(100).div(value);

                    array[value] = 100;

                    for (var i = value; i--;)
                    {
                        array[i] = decimal(split).mul(i).value;
                    }
                    
                    value = array;
                }
                else if (!(value instanceof Array) || !value.length)
                {
                    value = null;
                }
            }

            this.__segments = value;
            return value;
        }
    });

    
    // 空间
    this.$property('space', '');



    // 获取当前索引
    Object.defineProperty(this, 'index', {
        
        get: function () {

            var segments = this.__segments;

            if (segments)
            {
                var value = this.value;

                for (var i = segments.length; i--;)
                {
                    if (i === 0 || value >= segments[i] - (segments[i] - segments[i - 1] >> 1))
                    {
                        return i;
                    }
                }
            }

            return -1;
        }
    });




    var renderer = this.renderer;


    renderer.value = function (dom, value) {

        dom.lastChild.lastChild.style.left = value + '%';
    }


    renderer.segments = function (dom, value) {

        value = value ? render.call(this, value) : '';

        dom.lastChild.innerHTML = value + thumb;
        dom.lastChild.lastChild.style.left = this.value + '%';
    }


    renderer.space = function (dom, value) {

        dom = dom.firstChild;

        while (dom)
        {
            dom.style.left = dom.style.right = value;
            dom = dom.nextSibling;
        }
    }



    function render(segments) {

        var array = [];

        this.__segments = segments;

        for (var i = 0, l = segments.length; i < l; i++)
        {
            array.push('<svg class="yx-segment-node" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="left:',
                segments[i],
                '%;"><circle cx="50" cy="50" r="50" /><circle cx="50" cy="50" r="40" /></svg>');
        }

        return array.join('');
    }




    var state = {};


    function touchstart(event) {

        var target = event.dom,
            dom = this.$dom.lastChild;

        state.left = dom.getBoundingClientRect().left;
        state.width = dom.offsetWidth;

        while (target && target !== dom)
        {
            if (target.classList && target.classList.contains('yx-segment-thumb'))
            {
                state.thumb = target;
                event.stop();

                return false;
            }

            target = target.parentNode;
        }
    }


    function touchmove(event) {

        var thumb = state.thumb;

        if (thumb)
        {
            thumb.style.left = (event.clientX - state.left) * 100 / state.width + '%';
            event.stop();

            return false;
        }
    }


    function touchend(event) {

        var value = Decimal.singleton(event.clientX).plus(-state.left).pow(2).div(state.width),
            any;

        state.thumb = null;

        if (value <= 0)
        {
            value = 0;
        }
        else if (value >= 100)
        {
            value = 100;
        }
        else if (any = this.step) // 指定步进
        {
            value = Decimal(any).mul(Math.round(value / any));
        }
        else if (any = this.__segments) // 强制到最新的节点
        {
            for (var i = any.length; i--;)
            {
                if (i === 0 || value >= any[i] - (any[i] - any[i - 1] >> 1))
                {
                    value = any[i];
                    break;
                }
            }
        }

        if (this.$storage.value !== value)
        {
            this.value = value;

            this.trigger('change', {
                index: this.index,
                value: value
            });
        }
        else
        {
            this.renderer.value(this.$dom, value);
        }

        event.stop();
        return false;
    }


    function touchcancel() {

        this.renderer.value(this.$dom, this.value);
    }



}).register('Segment');
