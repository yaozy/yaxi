// yaxi全局变量
var yaxi = Object.create(null);


// 输出至AMD或CMD
if (typeof module !== 'undefined')
{
    module.exports = yaxi;

    // 在有window对象时输出至全局变量
    if (typeof window !== 'undefined')
    {
        window.yaxi = yaxi;
    }
}



// 接口实现
yaxi.impl = Object.create(null);




// 对象继承实现
Object.extend = function (fn, Class) {
	
    var base = this.prototype || null,
        prototype = Object.create(base),
        ctor;

    if (base && this.sealed)
    {
        throw new Error(this.typeName + ' is sealed, can not be extended!');
    }

    if (Class)
    {
        Class.ctor = Class;
    }
    else
    {
        Class = function Class() {

            if (ctor)
            {
                ctor.apply(this, arguments);
            }
        }

        Class.ctor = this.ctor;
    }
	
    Class.superclass = base ? this : null;
    Class.extend = this.extend || Object.extend;
    Class.prototype = prototype;

    prototype.constructor = Class;

    // 类扩展前处理
    if (prototype.__class_init)
    {
        prototype.__class_init(Class);
    }

    if (fn)
    {
        fn.call(prototype, Class, base, yaxi);
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
    }


    //html解码函数
    html.decode = function (text) {

        var keys = decode;

        return text && text.replace(/&(\w+);/g, function (_, key) {

            return keys[key] || key;
        });
    }



})(yaxi.html = Object.create(null));







(function (buffer) {


    buffer.fromString = function (value, callback) {

        var data = new Blob([value], { type: 'text/plain' });
        var file = new FileReader();

        file.onload = function () {
            
            callback(this.result);
        }

        file.readAsArrayBuffer(data);
    }


    buffer.toString = function (buffer, callback) {

        var reader = new FileReader();
        
        buffer = new Blob([buffer]);

        reader.onload = function () {

            callback(this.result)
        };

        reader.readAsText(buffer, 'utf-8');
    }


    buffer.fromBase64 = function (value) {

        var data = window.atob(value);
        var length = data.length;
        var array = new Uint8Array(length);
 
        for (var i = 0; i < length; ++i)
        {
            array[i] = data.charCodeAt(i);
        }

        return array.buffer;
    }


    buffer.toBase64 = function (buffer) {

        var bytes = new Uint8Array(buffer);
        var length = bytes.byteLength;
        var result = new Array(length);

        for (var i = 0; i < length; i++)
        {
            result[i] = String.fromCharCode(bytes[i]);
        }

        return window.btoa(result.join(''));
    }


})(yaxi.buffer = Object.create(null));





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



    yaxi.Decimal = Decimal;
    

    var prototype = Decimal.prototype;



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


    prototype.pow10 = function (value) {

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
            this.v = round(this.v / ('1e' + (d - digits)));
            this.d = digits;
        }

        return this;
    }


    prototype.toFixed = function (digits) {

        var d = this.d,
            v = this.v;

        if (d > 0)
        {
            v = v / ('1e' + d);
        }

        return v.toFixed(digits);
    }


    prototype.toString = function (k) {

        var d = this.d,
            v = this.v;

        if (d > 0)
        {
            v = v / ('1e' + d);
        }

        return v.toString(k);
    }



    Object.defineProperty(prototype, 'value', {

        get: prototype.valueOf = function () {

            var d = this.d,
                v = this.v;

            if (d > 0)
            {
                v = v / ('1e' + d);
            }

            return v;
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

            return toFixed.call(roundFix(+this, digits |= 0), digits);
        }
    }


    number.round = function (digits) {

        return roundFix(+this, digits);
    }



    // 重载四舍五入方法增加指定小数位数
    function roundFix(value, digits) {

        if (value !== value)
        {
            return 0;
        }

        if ((digits |= 0) > 0)
        {
            digits = '1e' + digits;
            return round(value * digits) / digits;
        }

        return round(value);
    }



    Math.round = roundFix;



})(Math);




// 扩展创建属性方法
yaxi.impl.property = function (target) {



    var define = Object.defineProperty;

    var cache = Object.create(null);



    cache.boolean = function (value) {
        
        return !!value && value !== 'false';
    }


    cache.integer = function (value) {

        return value | 0;
    }


    cache.number = function (value) {

        return +value || 0;
    }


    cache.string = function (value) {

        return '' + value;
    }


    cache.date = function (value) {

        return Date.create(value);
    }


    
    // 定义属性方法
    return function (name, defaultValue, options) {

        if (/[^\w-]/.test(name))
        {
            throw new Error('define property error: "' + name + '" not a valid property name!'); 
        }

        var properties = this.$properties;
        var alias;

        this.$defaults[name] = defaultValue = defaultValue != null ? defaultValue : null;

        if (!options || typeof options !== 'object')
        {
            options = {
                name: name,
                type: typeof defaultValue,
                kind: 'field',
                change: options !== false
            };
        }
        else
        {
            options.name = name;
            options.type || (options.type = typeof defaultValue);
            options.kind || (options.kind = 'field');
            options.change = options.change !== false;
        }

        options.defaultValue = defaultValue;

        // 指定了get如果需要支持set则必须自己实现
        if (options.get)
        {
            options.convert || (options.convert = null);
            options.set || (options.set = function () {

                var type = this.typeName;
                throw new Error('property "' + name + '"' + (type ? ' of ' + type : '') + ' is readonly!');
            });
        }
        else
        {
            options.convert || (options.convert = cache[options.type]);
            options.get = this.__build_get(name, options);
            options.set || (options.set = this.__build_set(name, options));
        }

        define(this, name, properties[name] = options);

        if ((alias = options.alias) && alias !== name)
        {
            define(this, alias, properties[alias] = options);
        }
    }


}






yaxi.Event = Object.extend.call({}, function (Class) {


    
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

    
}, function Event(type, detail) {

    this.type = type;

    if (detail)
    {
        this.detail = detail;
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
    this.trigger = yaxi.trigger = function (event, detail) {
        
        var target = this,
            events,
            index,
            type,
            fn;

        if (!event)
        {
            return false;
        }

        if (typeof event === 'object')
        {
            type = event.type;
        }
        else
        {
            event = new Event(type = '' + event);
        }

        event.target = this;

        if (detail)
        {
            event.detail = detail;
        }

        do
        {
            if ((events = target.__event_keys) && (events = events[type]))
            {
                index = 0;

                while (fn = events[index++])
                {
                    if (fn.call(event.source = target, event) === false)
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

    
}, function Stream(value) {
 
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
});




yaxi.http = Object.extend.call({}, function (Class) {



    // 默认超时时间
    Class.timeout = 10000;



    function ajax_mock(method, url, data) {

        var stream = new yaxi.Stream();
    
        setTimeout(function () {
    
            try
            {
                var response = require('../../mock/' + url);
    
                if (typeof response === 'function')
                {
                    stream.resolve(response(method, data));
                }
                else
                {
                    stream.resolve(response);
                }
            }
            catch (e)
            {
                console.error(e);
                stream.reject(url + '\n' + e);
            }
    
        }, 500);

        return stream;
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


    function send(method, url, data, options, flag) {

        if (Class.mock)
        {
            return ajax_mock(method, url, data);
        }

        if (data && !(data instanceof FormData))
        {
            if (flag || /GET|HEAD|OPTIONS/i.test(method))
            {
                url = url + (url.indexOf('?') >= 0 ? '&' : '?') + encodeData(data);
                data = null;
            }
            else if (options.contentType === 'application/x-www-form-urlencoded')
            {
                data = encodeData(data);
            }
            else if (typeof data !== 'string')
            {
                if (!options.contentType)
                {
                    options.contentType = 'application/json';
                }
                
                data = JSON.stringify(data);
            }
        }

        options.method = method;
        options.url = url;
        options.data = data;
        options.timeout = options.timeout || Class.timeout;

        return yaxi.__ajax_send(options);
    }



    Class.send = function (method, url, data, options) {

        return send(method ? method.toUpperCase() : 'GET', url, data, options || {}); 
    }



    Class.options = function (url, data, options) {

        return send('OPTIONS', url, data, options || {}, true);
    }


    Class.head = function (url, data, options) {

        return send('HEAD', url, data, options || {}, true);
    }


    Class.get = function (url, data, options) {

        return send('GET', url, data, options || {}, true);
    }


    Class.post = function (url, data, options) {

        return send('POST', url, data, options || {});
    }


    Class.put = function (url, data, options) {

        return send('PUT', url, data, options || {});
    }
    

    Class.delete = function (url, data, options) {

        return send('DELETE', url, data, options || {});
    }


    Class.trace = function (url, data, options) {

        return send('TRACE', url, data, options || {});
    }


    Class.connect = function (url, data, options) {

        return send('CONNECT', url, data, options || {});
    }


});





(function (yaxi) {



    var pipes = Object.create(null);

    var caches = Object.create(null);


    var decimal = yaxi.Decimal.singleton;




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
                    throw new Error('compile pipe error: not exist pipe function "' + list[0] + '"!');
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


    function empty(value) {

        return value;
    }


    function compile(text) {

        var items = text && parse(text);
        return caches[text] = items && items[0] ? pipe.bind(items) : empty;
    }


    yaxi.pipe.compile = function (text) {

        return caches[text] || compile(text);
    }


})(yaxi);




;(function () {



    var create = Object.create;

    var define = Object.defineProperty;


    // 管理编译器
    var compile = yaxi.pipe.compile;


    // 控件对象集合
    var controls = yaxi.$controls || (yaxi.$controls = create(null));


    // 绑定的目标
    var bindingTarget = null;

    // 注册的观测变化数量
    var watchKeys = create(null);


    // 模型原型
    var base = this;


    // 定义属性方法
    var property = yaxi.impl.property();




    // 定义模型
    yaxi.model = function (properties) {

        var extend = create;
        var prototype = extend(base);
        var subkeys = prototype.$subkeys = extend(null);
        var defaults = prototype.$defaults = extend(null);

        function Model(parent) {

            this.$parent = parent || null;
            this.$storage = extend(defaults);
        }
        
        prototype.$properties = extend(null);
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;

        defineProperties(prototype, properties, subkeys);

        return Model;
    }



    
    this.__build_get = function (name) {

        return function () {

            var control, target;

            // 找到控件才收集依赖
            if ((target = bindingTarget) && (control = controls[target.control]))
            {
                addDep(this, name, target, control);
            }

            return this.$storage[name];
        }
    }
    
    
    this.__build_set = function (name, options) {

        var watches = watchKeys;
        var convert = options.convert;

        return function (value) {

            var storage = this.$storage;
            var bindings;

            if (convert)
            {
                value = convert(value);
            }

            if (value === storage[name] || watches[name] && this.$notify(name, value) === false)
            {
                return this;
            }

            storage[name] = value;

            if ((bindings = this.__bindings) && (bindings = bindings[name]))
            {
                syncBindings(bindings);
            }
        }
    }



    this.__index = -1;


    // 添加索引属性
    define(this, '$index', {

        get: function () {

            var control, target;

            // 找到控件才收集依赖
            if ((target = bindingTarget) && (control = controls[target.control]))
            {
                addDep(this, '$index', target, control);
            }

            return this.__index;
        },

        set: function (value) {

            var bindings;

            if (this.__index !== (value |= 0))
            {
                this.__index = value;

                if ((bindings = this.__bindings) && (bindings = bindings.$index))
                {
                    syncBindings(bindings);
                }
            }
        }
    });


    // 顶层模型对象
    define(this, '$top', {
        
        get: function () {

            var target = this;
            var parent;

            while (parent = target.$parent)
            {
                target = parent;
            }

            return target;
        }
    });



    // 添加依赖
    function addDep(model, name, target, control) {

        var bindings, control, any;

        // 给模型添加绑定关系
        if (bindings = model.__bindings)
        {
            if (any = bindings[name])
            {
                any.push(target);
            }
            else
            {
                bindings[name] = [target];
            }
        }
        else
        {
            (model.__bindings = create(null))[name] = [target];
        }

        // 给控件记录依赖关系以便控件销毁时自动解除绑定
        if (bindings = control.__bindings)
        {
            bindings.push(name, model);
        }
        else
        {
            control.__bindings = [name, model];
        }
    }


    // 同步绑定
    function syncBindings(bindings) {

        var index = 0;
        var binding, control, fn;

        while (binding = bindings[index++])
        {
            if (control = controls[binding.control])
            {
                if (fn = binding.fn)
                {
                    control[binding.property] = fn(compile);
                }
            }
            else
            {
                bindings.splice(--index, 1);
            }
        }
    }




    function defineProperties(prototype, properties, subkeys) {

        var options, type;

        for (var name in properties)
        {
            if (name[0] === '$' || name[0] === '_' && name[1] === '_')
            {
                throw new Error('define model error: model field can not use "$" or "__" to begin!');
            }

            if (options = properties[name])
            {
                switch (typeof options)
                {
                    case 'function':
                        // 子模型
                        if (type = options.model)
                        {
                            define(prototype, name, (type === 1 ? defineSubModel : defineSubArrayModel)(name, options));
                            subkeys[name] = type;
                        }
                        else // 计算字段
                        {
                            define(prototype, name, { get: options });
                        }
                        break;
                    
                    case 'object': // 对象
                        if (options instanceof Array) // 子数组模型
                        {
                            define(prototype, name, defineSubArrayModel(name, type = checkSubArrayModel(options)));
                        }
                        else // 子模型
                        {
                            define(prototype, name, defineSubModel(name, type = yaxi.model(options)));
                        }

                        subkeys[name] = type;
                        break;

                    default:
                        property.call(prototype, name, options);
                        break; 
                }
            }
            else
            {
                property.call(prototype, name, options);
            }
        }
    }


    function checkSubArrayModel(options) {

        var message = 'define model error: ';
        var properties = options[0];
        var itemName = options[1];
        var itemIndex = options[2];

        if (!properties || typeof properties !== 'object')
        {
            throw new Error(message + 'the first item of sub array model must be a none empty object!');
        }

        if (itemName != null && typeof itemName !== 'string')
        {
            throw new Error(message + 'the second item for sub array model must be a string or null!');
        }

        if (itemIndex != null && typeof itemIndex !== 'string')
        {
            throw new Error(message + 'the third item for sub array model must be a string or null!');
        }

        return yaxi.arrayModel(properties, itemName, itemIndex);
    }



    function defineSubModel(name, Model) {
    
        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Model(this));
            },
            set: function (values) {

                var model = this[name];

                if (values)
                {
                    values = values.$storage || values;

                    if (model)
                    {
                        for (var key in values)
                        {
                            model[key] = values[key];
                        }
                    }
                    else
                    {
                        (this[name] = new Model(this)).$load(values);
                    }
                }
                else if (model)
                {
                    model.$clear();
                }
            }
        };
    }


    function defineSubArrayModel(name, ArrayModel) {

        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new ArrayModel(this));
            },
            set: function (value) {

                var arrayModel = this[name];

                if (arrayModel)
                {
                    if (arrayModel.length > 0)
                    {
                        arrayModel.clear();
                    }
                }
                else
                {
                    arrayModel = this[name] = new ArrayModel(this);
                }

                if (value && value.length > 0)
                {
                    arrayModel.push.apply(arrayModel, value);
                }
            }
        };
    }
    
    


    // 绑定
    yaxi.$bind = function (bindings) {

        try
        {
            var uuid = this.uuid;
            var fn;

            for (var name in bindings)
            {
                if (fn = bindings[name])
                {
                    // 字段绑定
                    if (typeof fn !== 'function')
                    {
                        throw new Error('bind error: binding expression "' + fn + '" is not a function!');
                    }
                    else if (name === 'onchange')
                    {
                        this.__binding_change = fn;
                    }
                    else // 表达式绑定
                    {
                        bindingTarget = {
                            control: uuid,
                            property: name,
                            fn: fn
                        }

                        this[name] = fn(compile);
                    }
                }
            }
        }
        finally
        {
            // 终止收集依赖
            bindingTarget = null;
        }
    }


    // 解除绑定
    this.$unbind = function (name, uuid) {

        var bindings = this.__bindings;

        if (bindings && (bindings = bindings[name]))
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i].control === uuid)
                {
                    bindings.splice(i, 1);
                    break;
                }
            }
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



    // 手动同步绑定
    this.$sync = function (name) {

        var bindings = this.__bindings;

        if (bindings && (bindings = bindings[name]))
        {
            syncBindings(bindings);
        }
    }



    // 加载
    this.$load = function (values) {

        if (values)
        {
            var storage = this.$storage || (this.$storage = {}),
                properties = this.$properties,
                convert;

            for (var name in values)
            {
                if ((convert = properties[name]) && (convert = convert.convert))
                {
                    storage[name] = convert.call(this, values[name]);
                }
                else
                {
                    this[name] = values[name];
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

    var released = false;


    var base = this;


    // 所有控件集合
    var controls;




    // 定义数组模型
    yaxi.arrayModel = function (properties) {
    
        var prototype = create(base);

        properties || (properties = {});

        function ArrayModel(parent) {

            this.$parent = parent || null;
        }

        prototype.$Model = yaxi.model(properties);

        ArrayModel.model = prototype.__model_type = 2;
        ArrayModel.prototype = prototype;

        return ArrayModel;
    }


    

    this.__length = 0;


    // 获取数组模型长度(只读)
    Object.defineProperty(this, 'length', {

        get: function () {

            return this.__length;
        },
        set: function (value) {

            if (released)
            {
                this.__length = value;
                released = false;
            }
            else
            {
                throw new Error('the length of array mode is readonly!');
            }
        }
    });


    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;




    function createModels(arrayModel, list, index) {

        var outputs = [],
            Model = arrayModel.$Model,
            parent = arrayModel.$parent,
            length = list.length,
            model,
            data;

        while (index < length)
        {
            data = list[index++];

            if (data instanceof Model)
            {
                data.$parent = parent;
            }
            else
            {
                model = new Model(parent);
                model.$load(data);    
            }

            outputs.push(model);
        }

        return outputs;
    }


    function reindex(arrayModel, index) {

        var model;

        index |= 0;

        while (model = arrayModel[index])
        {
            var old = model.__index;

            if (old == null)
            {
                model.__index = index;
            }
            else if (old !== index)
            {
                model.$index = index;
            }

            index++;
        }
    }


    function notify(arrayModel, type, arg1, arg2) {

        var databoxs = controls || (controls = yaxi.$controls);
        var bindings, databox;

        if (bindings = arrayModel.__bindings)
        {
            for (var i = 0, l = bindings.length; i < l; i++)
            {
                if (databox = databoxs[bindings[i]])
                {
                    databox[type](arg1, arg2);
                }
            }
        }
    }


    function destroyItem(item) {

        var bindings;

        if (bindings = item.__bindings)
        {
            item.__bindings = null;

            for (var name in bindings)
            {
                var list = bindings[name];

                for (var i = list.length; i--;)
                {
                    // 清除绑定关联的模型
                    list[i].model = null;
                }
            }
        }

        item.$parent = item.__bindings = null;
    }



    // 创建一个临时的模型
    this.create = function (data) {

        var model = new this.$Model();

        if (data)
        {
            model.$load(data);
        }

        return model;
    }


    // 复制一个临时的模型
    this.copy = function (index) {

        var model = new this.$Model();
        var data;

        if (data = this[index])
        {
            model.$load(data.$storage);
        }

        return model;
    }



    this.set = function (index, data) {

        var Model = this.$Model;
        var model;

        if ((index |= 0) >= 0 && this[index])
        {
            if (data instanceof Model)
            {
                model = data;
                model.$parent = this.$parent;
            }
            else
            {
                model = new Model(this.$parent);
                data && model.$load(data);
            }

            this[index] = model;
            notify(this, '__on_set', index, model);
        }
    }



    this.load = function (values) {

        if (this.__length > 0)
        {
            this.clear();
        }

        this.push.apply(this, values);
    }



    this.push = function () {

        var length = arguments.length;

        if (length > 0)
        {
            var list = createModels(this, arguments, 0);

            released = true;
            push.apply(this, list);

            reindex(this, this.__length - length);
            notify(this, '__on_insert', -1, list);
        }

        return this.__length;
    }


    this.pop = function () {

        var item;

        if (this.__length > 0)
        {
            released = true;

            if (item = array.pop.call(this))
            {
                destroyItem(item);
                notify(this, '__on_remove', -1, 1);
            }
        }

        return item;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var list = createModels(this, arguments, 0);

            released = true;
            array.unshift.apply(this, list);

            reindex(this, 0);
            notify(this, '__on_insert', 0, list);
        }

        return this.__length;
    }


    this.shift = function () {

        var item;

        if (this.__length > 0)
        {
            released = true;

            if (item = array.shift.call(this))
            {
                destroyItem(item);

                notify(this, '__on_remove', 0, 1);
                reindex(this, 0);
            }
        }

        return item;
    }


    this.splice = function (index, length) {

        var removed, inserted;

        if ((index |= 0) < 0 && (index += this.length) < 0)
        {
            index = 0;
        }

        if (arguments.length > 2)
        {
            inserted = createModels(this, arguments, 2);

            released = true;
            removed = splice.apply(this, [index, length].concat(inserted));
        }
        else
        {
            released = true;
            removed = splice.apply(this, arguments);
        }
        
        if (removed.length > 0)
        {
            for (var i = removed.length; i--;)
            {
                destroyItem(removed[i]);
            }

            notify(this, '__on_remove', index, removed.length);
        }

        if (inserted)
        {
            notify(this, '__on_insert', index, inserted);
        }

        reindex(this, index);
        return removed;
    }


    this.clear = function () {

        var list;

        if (this.__length > 0)
        {
            released = true;
            list = splice.call(this, 0);
    
            for (var i = list.length; i--;)
            {
                destroyItem(list[i]);
            }

            notify(this, '__on_clear');
        }

        return list;
    }


    this.sort = function (sortFn) {

        array.sort.call(this, sortFn);

        reindex(this, 0);
        notify(this, '__on_sort', 0);
    }


    this.reverse = function () {

        array.reverse.call(this);
        
        reindex(this, 0);
        notify(this, '__on_sort', 1);
    }


    
}).call(Object.create(null));




(function (yaxi) {


    var create = Object.create;

    var colors = yaxi.colors || (yaxi.colors = create(null));

    var color = yaxi.color = colors.default = create(null);


    var bg = color.bg = create(null);

    var font = color.font = create(null);

    var border = color.border = create(null);

 

    bg.level1 = '#ffffff';
    bg.level2 = '#f7f7f7';
    bg.level3 = '#cccccc';
    bg.level4 = '#888888';
    bg.level5 = '#555555';

    bg.important = '#c40606';
    bg.primary = '#1c86ee';
    bg.secondary = '#5eaadd';
    bg.success = '#71c04a';
    bg.warning = '#e89518';
    bg.danger = '#ff6c6c';
    bg.disabled = '#eeeeee';


    font.level1 = '#31313d';
    font.level2 = '#6c768b';
    font.level3 = '#b8c0de';
    font.level4 = '#cccccc';
    font.level5 = '#f7f7f7';

    font.important = '#c40606';
    font.primary = '#1c86ee';
    font.secondary = '#5eaadd';
    font.success = '#71c04a';
    font.warning = '#e89518';
    font.danger = '#ff6c6c';
    font.disabled = '#999999';


    border.level1 = '#31313d';
    border.level2 = '#6c768b';
    border.level3 = '#b8c0de';
    border.level4 = '#cccccc';
    border.level5 = '#ffffff';

    border.important = '#c40606';
    border.primary = '#1c86ee';
    border.secondary = '#5eaadd';
    border.success = '#71c04a';
    border.warning = '#e89518';
    border.danger = '#ff6c6c';
    border.disabled = '#999999';


    color.mask = '#000000';
    
    color.shadow = '#888888';



    (function combine(prefix, value) {

        if (typeof value !== 'object')
        {
            if (prefix)
            {
                color[prefix] = value; 
            }
        }
        else
        {
            if (prefix)
            {
                prefix += '-';
            }

            for (var name in value)
            {
                combine(prefix + name, value[name]);
            }
        }

    })('', color);



})(yaxi);





Object.extend.call(Array, function (Class, base) {



    var create = Object.create;


    var classes = yaxi.classes = create(null);

    var cache = create(null);
    


    if (typeof jiac !== 'undefined')
    {
        jiac.classes = classes;
    }

    

    // 实现查找单个控件
    yaxi.impl.find = function () {


        // 查找符合指定选择器规则的第一个控件
        /*
         * *            任意控件选择器
         * xxx          控件类型选择器
         * @xxx         key值选择器
         * #xxx         id选择器
         * .xxx         class选择器
         * [xxx==?]     属性选择器, 仅支持"==", "!=", "===", "!=="运算符
         * <            从上一级查找控件
         * <<           从任意上级查找控件
         * >            从下级子控件中查找控件
         * >>           从所有下级控件中(含下级控件中的下级控件)中查找控件
        */
        this.find = function (selector) {

            return find(this, selector);
        }

    }



    // 查找多个控件实现
    yaxi.impl.query = function () {


        // 从指定的控件向上搜索至当前控件的子控件
        this.parentToThis = function (control) {

            var parent;

            if (!control || control === this)
            {
                return null;
            }

            while ((parent = control.parent) && parent !== this)
            {
                control = parent;
            }

            return control || null;
        }


        // 查找符合指定选择器规则的所有控件
        /*
         * *            任意控件选择器
         * xxx          控件类型选择器
         * @xxx         key值选择器
         * #xxx         id选择器
         * .xxx         class选择器
         * [xxx==?]     属性选择器, 仅支持"==", "!=", "===", "!=="运算符
         * <            从上一级查找控件
         * <<           从任意上级查找控件
         * >            从下级子控件中查找控件
         * >>           从所有下级控件中(含下级控件中的下级控件)中查找控件
        */
        this.query = function (selector) {

            return query(this, selector);
        }
    

    }



    function parse(selector) {

        var tokens = selector.match(/("[^"]*"|'[^']*'|>>|<<|[<>#.@*\[\]]|[!=]==?|[\w-]+)/g),
            outputs = [],
            index = 0,
            token,
            key;

        while (token = tokens[index++])
        {
            if ((key = token[0]) === '<' || key === '>')
            {
                outputs.push(token);

                if (key = tokens[index++])
                {
                    switch (key)
                    {
                        case '@':
                        case '#':
                        case '.':
                            if ((token = tokens[index++])[0] < '0' || token[0] > 'z')
                            {
                                raise(key, index - 2, ' , ' + key + ' must be followed alphabet or number or "_"');
                            }

                            outputs.push([key, token]);
                            break;

                        case '*':
                            outputs.push(key);
                            break;

                        case '[':
                            token = tokens[index + 1];

                            if (token !== '==' && token !== '!=' && token !== '===' && token !== '!==')
                            {
                                raise(key, index, ' [] only support "==" or "!=" or "===" or "!=="');
                            }
                            else if (tokens[index + 3] !== ']')
                            {
                                raise(key, index, ' [] not properly closed');
                            }

                            outputs.push(['[]', token, parseValue(tokens[index + 2])]);
                            index += 4;
                            break;

                        default:
                            if (key[0] < 'A' || key[0] > 'z')
                            {
                                raise(token, index, token + ' must be followed "@" or "#" or "." or "[x==y]" or "*" or a type name');
                            }
                            else
                            {
                                outputs.push(['', key]);
                            }
                            break;
                    }
                }
                else
                {
                    raise(token, index, ' ');
                }
            }
            else
            {
                raise(token, index, 'must use "<<" or "<" or ">>" or ">" as relation symbol');
            }
        }

        return cache[selector] = outputs;
    }


    function parseValue(value) {

        var n;

        switch (value)
        {
            case 'undefined':
                return void 0;

            case 'null':
                return null;

            case 'true':
                return true;

            case 'false':
                return false;
        }

        if (value[0] === '\'' || value[0] === '"')
        {
            return value.substring(0, value.length - 1);
        }
        
        return (n = +value) === n ? n : value;
    }


    function raise(token, index, message) {

        throw new Error('selector is invalid, ' + token + ' at ' + index + ', ' + message + '!');
    }



    function find(control, selector) {

        var tokens;

        if (selector && (tokens = cache[selector] || parse(selector)) && tokens[0])
        {
            return findControl(control, tokens, 0);
        }

        return null;
    }


    function findControl(control, tokens, index) {
    
        var rule = tokens[index + 1];
        var down;

        switch (tokens[index])
        {
            case '<':
                control = findUp(control, rule, false);
                break;

            case '<<':
                control = findUp(control, rule, true);
                break;

            case '>':
                control = (down = control.__children) && down[0] && findDown(down, rule, false) || null;
                break;

            case '>>':
                control = (down = control.__children) && down[0] && findDown(down, rule, true) || null;
                break;
        }

        if (control && tokens[index += 2])
        {
            return findControl(control, tokens, index);
        }

        return control || null;
    }


    function checkValue(control, rule) {

        switch (rule[0])
        {
            case '@':
                return control.$storage.key === rule[1];

            case '':
                return control instanceof (classes[rule[1]] || Boolean);

            case '#':
                return control.$storage.id === rule[1];

            case '[':
                return checkProperty(control, rule);

            case '*':
                return true;
        }
    }


    function checkProperty(control, rule) {

        var value1 = control[rule[0]];
        var value2 = rule[2];

        switch (rule[1])
        {
            case '==':
                return value1 == value2;

            case '!=':
                return value1 != value2;

            case '===':
                return value1 === value2;

            case '!==':
                return value1 !== value2;

            default:
                return false;
        }
    }


    function findUp(control, rule, deep) {

        if (control = control.parent)
        {
            if (deep)
            {
                do
                {
                    if (checkValue(control, rule))
                    {
                        return control;
                    }
                }
                while (control = control.parent);
            }
            else if (checkValue(control, rule))
            {
                return control;
            }
        }
    }


    function findDown(children, rule, deep) {

        var index = 0;
        var control, down;

        while (control = children[index++])
        {
            if (checkValue(control, rule))
            {
                return control;
            }

            if (deep && (down = control.__children) && down[0] && (control = findDown(down, rule, true)))
            {
                return control;
            }
        }
    }


    function query(control, selector) {

        var outputs = new Class(),
            tokens,
            any;

        if (selector && (any = control.__children) && any[0] && 
            (tokens = cache[selector] || parse(selector)) && tokens[0])
        {
            any = queryControls([control], tokens, 0);

            if (any.length > 0)
            {
                outputs.push.apply(outputs, any);
            }
        }

        return outputs;
    }


    function queryControls(inputs, tokens, index) {

        var exists = create(null);
        var outputs = [];
        var rule = tokens[index + 1];
        var i = 0;
        var control, any;

        switch (tokens[index])
        {
            case '<':
                while (control = inputs[i++])
                {
                    if ((control = findUp(control, rule, false)) && !exists[any = control.uuid])
                    {
                        exists[any] = true;  // 去重
                        outputs.push(control);
                    }
                }
                break;

            case '<<':
                while (control = inputs[i++])
                {
                    if ((control = findUp(control, rule, true)) && !exists[any = control.uuid])
                    {
                        exists[any] = true;  // 去重
                        outputs.push(control);
                    }
                }
                break;

            case '>':
                while (control = inputs[i++])
                {
                    if ((any = control.__children) && any[0])
                    {
                        queryDown(any, outputs, rule, false, exists);
                    }
                }
                break;

            case '>>':
                while (control = inputs[i++])
                {
                    if ((any = control.__children) && any[0])
                    {
                        queryDown(any, outputs, rule, true, exists);
                    }
                }
                break;
        }

        if (outputs.length > 0 && tokens[index += 2])
        {
            return queryControls(outputs, tokens, index);
        }
        
        return outputs;
    }


    function queryDown(children, outputs, rule, deep, exists) {
    
        var index = 0;
        var control, any;

        while (control = children[index++])
        {
            if (checkValue(control, rule) && !exists[any = control.uuid])
            {
                exists[any] = true;   // 去重
                outputs.push(control);
            }

            if (deep && (any = control.__children) && any[0])
            {
                queryDown(any, outputs, rule, true, exists);
            }
        }
    }



    
    this.filter = function (selector) {
    
        if (typeof selector === 'function')
        {
            for (var i = this.length; i--;)
            {
                if (!selector(this[i]))
                {
                    this.splice(i, 1);
                }
            }
        }
        else if (selector = cache[selector] || parse(selector))
        {
            for (var i = this.length; i--;)
            {
                if (!this[i].__find(selector, 0))
                {
                    this.splice(i, 1);
                }
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
            item,
            fn;

        while (item = this[index++])
        {
            if (fn = item[name])
            {
                fn.apply(item, args);
            }
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


    this.once = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.once(type, listener);
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


    this.trigger = function (event) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.trigger(event);
        }

        return this;
    }



});




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




yaxi.Collection = Object.extend.call({}, function (Class) {


    
    var array = Array.prototype;

    var push = array.push;

    var slice = array.slice;

    var splice = array.splice;


    var $patch = yaxi.patch;


    var controls = yaxi.$controls;

    var build = yaxi.Control.build;


    var released = false;



    this.__length = 0;


    // 获取集合长度(只读)
    Object.defineProperty(this, 'length', {

        get: function () {

            return this.__length;
        },
        set: function (value) {

            if (released)
            {
                released = false;
                this.__length = value;
            }
            else
            {
                throw new Error('the length of collection is readonly!');
            }
        }
    });



    function patch(target) {

        target.__last = slice.call(target, 0);

        if (target = controls[target.$uuid])
        {
            target.__dirty || $patch(target);
        }
    }


    function createControls(parent, list, index, outputs) {

        var length = list.length,
            control;

        if ((index |= 0) < 0)
        {
            index = 0;
        }

        outputs || (outputs = []);

        while (index < length)
        {
            if (control = build(parent, list[index++]))
            {
                outputs.push(control);
            }
        }

        return outputs;
    }


    
    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;



    this.load = function (values, scope) {

        var parent = controls[this.$uuid];
        var length = values.length;

        if (this.__length > 0)
        {
            this.clear();
        }

        for (var i = 0; i < length; i++)
        {
            this[i] = build(parent, values[i], scope);
        }
        
        this.__last || patch(this);
        this.__length = length;
    }



    this.set = function (index, value) {

        if ((index |= 0) >= 0 && this.__length > index)
        {
            value = build(controls[this.$uuid], value);

            this.__last || patch();
            this[index] = value;
        }
    }


    this.push = function () {

        if (arguments.length > 0)
        {
            var list = createControls(controls[this.$uuid], arguments, 0, []);

            this.__last || patch(this);

            released = true;
            return push.apply(this, list);
        }

        return this.__length;
    }


    this.pop = function () {

        var control;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;

            if (control = array.pop.call(this))
            {
                control.parent = null;
            }
        }

        return control;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var list = createControls(controls[this.$uuid], arguments, 0, []);

            this.__last || patch(this);

            released = true;
            return array.unshift.apply(this, list);
        }

        return this.__length;
    }


    this.shift = function () {

        var control;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;

            if (control = array.shift.call(this))
            {
                control.parent = null;
            }
        }

        return control;
    }


    this.splice = function (index, length) {

        var list;

        this.__last || patch(this);

        released = true;

        if (arguments.length > 2)
        {
            list = createControls(controls[this.$uuid], arguments, 2, [index, length]);
            list = splice.apply(this, list);
        }
        else
        {
            list = splice.apply(this, arguments);
        }

        if (list.length > 0)
        {
            for (var i = list.length; i--;)
            {
                list[i].parent = null;
            }
        }

        return list;
    }


    this.clear = function () {

        var list;

        if (this.__length > 0)
        {
            this.__last || patch(this);
            this.__last.clear = true;

            released = true;
            list = splice.call(this, 0)

            for (var i = list.length; i--;)
            {
                list[i].parent = null;
            }
        }

        return list || [];
    }


    this.sort = function (sortby) {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.sort.call(this, sortby);
        }

        return this;
    }



    this.reverse = function () {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.reverse.call(this);
        }

        return this;
    }



    // 直接插入控件(给databox控件用)
    this.__insert = function (index, controls) {

        this.__last || patch(this);

        released = true;

        if (index < 0)
        {
            controls.push.apply(this, controls);
        }
        else
        {
            controls.unshift(index, 0);
            controls.splice.apply(this, controls);
        }
    }



}, function Collection(control) {

    this.$uuid = control.uuid;
    
});




/*
 * ContentControl主要作为自定义内容展示用, 子控件不支持绑定事件
 * 不支持对子控件进行操作
*/
yaxi.ContentControl = yaxi.Control.extend(function (Class, base, yaxi) {



    var A = Array;
    
    var build = yaxi.Control.build;
    



    // 标记当前控件为content控件(事件检测用)
    this.__is_content = true;


    
    
    // 内容
    this.$property('content', null, {

        convert: function (value) {

            var content = this.__content;

            if (content)
            {
                this.__content = null;

                if (typeof content === 'object')
                {
                    for (var i = content.length; i--;)
                    {
                        content[i].destroy();
                    }
                }
            }

            return value;
        }
    });



    function createControls(parent, values) {

        var length = values.length;
        var list = new A(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = build(parent, values[i]);
        }

        return list;
    }



    this.__load_subdata = function (values) {

        this.content = values;
    }



    // 初始化内容
    this.__init_content = function () {

        var content = this.__content;

        if (content)
        {
            return content;
        }

        content = this.content;

        if (content instanceof A)
        {
            try
            {
                yaxi.__content_count++;

                if (content[0] instanceof A)
                {
                    content = createControls(this, content);
                }
                else
                {
                    content = [build(this, content)];
                }
            }
            finally
            {
                yaxi.__content_count--;
            }
        }
        else
        {
            content = '' + content; 
        }

        return this.__content = content;
    }



    this.destroy = function () {

        var content = this.__content;

        if (content && typeof content !== 'string')
        {
            for (var i = content.length; i--;)
            {
                content[i].destroy();
            }
        }

        base.destroy.call(this);
    }


});




/*
 * Box是一个自由的容器控件
 * 不仅可以通过children属性访问子控件集合, 也可以通过find及query方法对子控件进行处理
*/
yaxi.Box = yaxi.Control.extend(function (Class, base) {




    // 布局
    this.$property('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });

    

    // 子控件集合
    this.$property('children', null, {

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


    this.$properties.children = {
        
        convert: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.load(values);
            }
        }
    };


    this.__load_subdata = function (values, scope) {

        this.__children.load(values, scope);
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);
    

    
    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].destroy();
        }

        base.destroy.call(this);
    }

    

}, function Box() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);
    
    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Box');





yaxi.Button = yaxi.ContentControl.extend(function (Class, base) {



    this.__no_content = 'content is empty';
    

    
    // 布局
    this.$property('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });



}, function Button() {

    yaxi.Control.apply(this, arguments);

}).register('Button');




/*
 * DataBox是一个通过数据集合(data)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.DataBox = yaxi.Control.extend(function (Class, base) {




    var build = yaxi.Control.build;



    
    // 布局
    this.$property('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
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
                throw new Error('databox template must be a template function!');
            }
        }
    });



    // 数据容器类型, 只支持data和model
    // data:    直接数据绑定, 只能通过修改data重新渲染子控件, 不能直接对渲染好的控件进行修改, 性能好, 适合渲染后不需要太多变化的场景
    // model:   模型数据绑定, 可通过操作模型对子控件进行操控
    this.$property('type', 'data', false);



    // 数据集合
    this.$property('data', null, {

        change: false,

        get: function () {

            return this.__data || null;
        },

        set: function (value) {

            var template;

            if (value)
            {
                if (value.__model_type === 2)
                {
                    bind(this, value);
                }

                if (value.length > 0)
                {
                    this.__data = value;

                    if (template = this.__template)
                    {
                        loadData(this, value, template);
                    }

                    return;
                }
            }

            this.__data = null;
            this.__children.clear();
        }
    });

    

    // 子控件集合
    this.$property('children', null, {

        get: nochildren,
        set: nochildren
    });


    function nochildren () {

        throw new Error('BataBox control doesn\'t supports children, please use data and template!');
    }



    this.__load_subdata = function (value, scope) {

        var data;

        if ((this.template = value) && (data = this.__data))
        {
            loadData(this, data, value, scope);
        }
    }



    function loadTemplate(controls, scope, index, item, template) {

        var control;

        scope = scope.concat(index, item);

        if (control = build(this, template, scope))
        {
            control.__d_scope = scope;
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
            if (stack = control.__d_scope)
            {
                return stack;
            }

            control = control.parent;
        }

        return [];
    }


    function loadData(databox, data, template, scope) {

        var controls = createControls(databox, data, template, scope);

        if (controls.length > 0)
        {
            databox.__children.load(controls);
        }
    }


    function bind(databox, arrayModel) {

        var bindings, old;

        if (old = databox.__array_model)
        {
            if (old !== arrayModel)
            {
                unbind(databox, old);
            }
            else
            {
                return;
            }
        }

        if (bindings = arrayModel.__bindings)
        {
            bindings.push(databox.uuid);
        }
        else
        {
            arrayModel.__bindings = [databox.uuid];
        }

        databox.__array_model = arrayModel;
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

        databox.__array_model = null;
    }




    this.__on_set = function (index, model) {

        var template, controls;

        if (template = this.__template)
        {
            controls = createControls(this, [model], template);

            if (controls.length > 0)
            {
                this.__children.set(index, control);
            }
        }
    }


    this.__on_insert = function (index, list) {

        var template;

        if (template = this.__template)
        {
            list = createControls(this, list, template);

            if (list.length > 0)
            {
                this.__children.__insert(index, list);
            }
        }
    }


    this.__on_remove = function (index, length) {

        this.__children.splice(index, length);
    }


    this.__on_clear = function () {

        this.__children.clear();
    }


    this.__on_sort = function () {

        this.__children.sort(sort);
    }


    function sort(a, b) {

        var index;

        a = a.__d_scope;
        b = b.__d_scope;

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

        if (any = this.__array_model)
        {
            unbind(this, any);
        }

        base.destroy.call(this);
    }




}, function DataBox() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('DataBox');




yaxi.Icon = yaxi.Control.extend(function (Class, base) {


    
    // 图标名
    this.$property('icon', '', {

        kind: 'class',
        data: 'icon-'
    });



}, function Icon() {

    yaxi.Control.apply(this, arguments);

}).register('Icon');




yaxi.IconButton = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$property('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图标名
    this.$property('icon', '');


    // 图标大小
    this.$property('size', '');



}, function IconButton() {

    yaxi.Control.apply(this, arguments);

}).register('IconButton');




yaxi.Image = yaxi.Control.extend(function (Class, base) {


    // 图片资源地址
    this.$property('src', '');


    // 图片裁剪、缩放的模式
    /*
     *  scaleToFill	缩放模式, 不保持纵横比缩放图片, 使图片的宽高完全拉伸至填满 image 元素	
     *  aspectFit	缩放模式, 保持纵横比缩放图片, 使图片的长边能完全显示出来。也就是说, 可以完整地将图片显示出来。	
     *  aspectFill	缩放模式, 保持纵横比缩放图片, 只保证图片的短边能完全显示出来。也就是说, 图片通常只在水平或垂直方向是完整的, 另一个方向将会发生截取。	
     *  widthFix	缩放模式, 宽度不变, 高度自动变化, 保持原图宽高比不变	
     *  heightFix	缩放模式, 高度不变, 宽度自动变化, 保持原图宽高比不变	2.10.3
     *  top	裁剪模式, 不缩放图片, 只显示图片的顶部区域	
     *  bottom	裁剪模式, 不缩放图片, 只显示图片的底部区域	
     *  center	裁剪模式, 不缩放图片, 只显示图片的中间区域	
     *  left	裁剪模式, 不缩放图片, 只显示图片的左边区域	
     *  right	裁剪模式, 不缩放图片, 只显示图片的右边区域	
     *  top left	裁剪模式, 不缩放图片, 只显示图片的左上边区域	
     *  top right	裁剪模式, 不缩放图片, 只显示图片的右上边区域	
     *  bottom left	裁剪模式, 不缩放图片, 只显示图片的左下边区域	
     *  bottom right	裁剪模式, 不缩放图片, 只显示图片的右下边区域
    */
    this.$property('mode', '');


    // 图片懒加载，在即将进入一定范围（上下三屏）时才开始加载
    this.$property('lazyLoad', false, {

        alias: 'lazy-load'
    });



}, function Image() {

    yaxi.Control.apply(this, arguments);

}).register('Image');




yaxi.ImageButton = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$property('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图像路径
    this.$property('src', '');


    // 图像大小
    this.$property('size', '');



}, function ImageButton() {

    yaxi.Control.apply(this, arguments);

}).register('ImageButton');




yaxi.Line = yaxi.Control.extend(function (Class, base) {



    this.$property('size', '5rem');


    this.$property('color', 'text-level1');



}, function Line() {

    yaxi.Control.apply(this, arguments);

}).register('Line');




yaxi.Vline = yaxi.Control.extend(function (Class, base) {



    this.$property('size', '5rem');


    this.$property('color', 'text-level1');



}, function Vline() {

    yaxi.Control.apply(this, arguments);

}).register('Vline');




yaxi.Marquee = yaxi.Control.extend(function (Class, base) {



    this.$property('text', '');


    // 速度, 每32字显示的秒数
    this.$property('speed', 10);


    
}, function Marquee() {

    yaxi.Control.apply(this, arguments);

}).register('Marquee');




yaxi.MaskLayer = yaxi.Control.extend(function (Class, base) {


    



}, function MaskLayer() {


    yaxi.Control.apply(this, arguments);


}).register('MaskLayer');




yaxi.Popup = yaxi.Box.extend(function (Class, base) {
	


	
	
}, function Popup() {

	yaxi.Box.call(this);

}).register('Popup');




yaxi.ScrollBox = yaxi.Box.extend(function () {


}, function ScrollBox() {

    yaxi.Box.call(this);

}).register('ScrollBox');




yaxi.StackBox = yaxi.Box.extend(function (Class, base) {



    this.$property('layout', {

        get: nolayout,
        set: nolayout
    });


    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout! can only use full!');
    }



    // 子项是否充满容器
    this.$property('full', false);




}, function StackBox() {

    yaxi.Box.apply(this, arguments);

}).register('StackBox');




yaxi.Swiper = yaxi.Box.extend(function (Class, base) {



    // 是否显示面板指示点
    this.$property('dots', true);


    // 指示点样式
    this.$property('dotStyle', '', {

        alias: 'dot-style'
    });


    // 活动指示点颜色
    this.$property('activeDotStyle', '', {

        alias: 'dot-active-style'
    });


    // 是否自动切换
    this.$property('autoplay', true);


    // 当前所在滑块的 index
    this.$property('current', 0);


    // 自动切换时间间隔
    this.$property('interval', 5000);


    // 滑动动画时长
    this.$property('duration', 500);


    // 是否采用衔接滑动
    this.$property('circular', 500);


    // 滑动方向是否为纵向
    this.$property('vertical', false);


    // 前边距, 可用于露出前一项的一小部分, 接受px和rem值
    this.$property('before', '');


    // 后边距, 可用于露出后一项的一小部分, 接受px和rem值
    this.$property('after', '');



    this.__on_change = function (event) {

        this.current = event.value;
    }



}, function Swiper() {

    yaxi.Box.apply(this, arguments);

}).register("Swiper");




yaxi.TabBar = yaxi.Box.extend(function (Class, base) {



    // 页面容器
    this.$property('host', '', false);



    // 获取或设置当前页索引
    this.$property('selectedIndex', -1, {

        change: false,

        alias: 'selected-index',

        convert: function (value) {

            value = (value |= 0) < 0 ? -1 : value;

            // 第一次设置选中索引时在渲染前再处理,否则host可能没有初始化好
            if (value >= 0)
            {
                yaxi.bindBeforeRender(initIndex, this, [value]);
            }

            return value;
        },

        set: function (value) {

            var lastIndex = this.$storage.selectedIndex;

            if ((value |= 0) < 0)
            {
                value = -1;
            }

            if (lastIndex !== value)
            {
                changeIndex(this, value, lastIndex);
            }
        }

    });



    // 选中的页头
    this.$property('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.children[index] || null;
        }
    });


    // 选中的页签容器
    this.$property('selectedHost', null, {

        get: function () {

            var host = this.host;

            if (!host)
            {
                host = '<* >StackBox';
            }
            else if (host[0] !== '<')
            {
                throwError('use "<" or "<<" to begin!');
            }

            if (host = this.find(host))
            {
                if (host instanceof yaxi.StackBox)
                {
                    return host;
                }

                throwError('be a StackBox!');
            }

            return null;
        }
    });


    function throwError(text) {

        throw new Error('the host of TabBar must ' + text);
    }



    function initIndex(index) {

        changeIndex(this, index, -1);
    }


    function changeIndex(tabbar, index, lastIndex) {

        var children = tabbar.children;
        var event = new yaxi.Event('changing');
        var item;

        event.lastIndex = lastIndex;
        event.lastPage = tabbar.findPage(event.lastItem = children[lastIndex] || null);

        event.index = index;
        event.page = tabbar.findPage(event.item = children[index] || null);

        if (tabbar.trigger(event) !== false)
        {
            tabbar.$storage.selectedIndex = index;

            if (item = event.lastPage)
            {
                item.hidden = true;
            }

            if (item = event.lastItem)
            {
                item.selected = false;
            }

            if (item = event.item)
            {
                item.selected = true;
                checkPage(tabbar, event);
            }

            event.type = 'changed';
            tabbar.trigger(event);
        }
    }


    function checkPage(tabbar, event) {

        var page = event.page;
        var item = event.item;
        var host;

        if (!page)
        {
            if ((page = item.module) && (host = tabbar.selectedHost))
            {
                page = event.page = new page(item.data);
                host.children.push(page);
            }
            else
            {
                return;
            }
        }

        page.tabbar = item.uuid;
        page.hidden = false;
    }



    this.findPage = function (item) {

        var host;

        if (item && (host = this.selectedHost))
        {
            var children = host.children;
            var uuid = item.uuid;
    
            for (var i = children.length; i--;)
            {
                if (children[i].tabbar === uuid)
                {
                    return children[i];
                }
            }
        }

        return null;
    }



    this.__on_touchend = function (event) {

        var control = this.parentToThis(event.target);

        if (control && !control.selected)
        {
            this.selectedIndex = this.children.indexOf(control);
        }
    }
    


}, function TabBar() {


    yaxi.Box.apply(this, arguments);


}).register('TabBar');




yaxi.Text = yaxi.Control.extend(function (Class, base) {


    this.$property('text', '');


    this.$property('security', '');


    this.$property('format', null, {
    
        change: false,

        convert: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    });


    this.__load_subdata = function (value) {

        this.text = value;
    }



}, function Text() {

    yaxi.Control.apply(this, arguments);

}).register('Text');




yaxi.TextBox = yaxi.Control.extend(function () {




    this.$property('value', '');


    this.$property('text', {

        get: function () {

            var format = this.__format;
            return format ? format(this.value) : this.value;
        }
    });

    
    this.$property('placeholder', '');


    this.$property('maxlength', -1);


    this.$property('pattern', '');


    this.$property('format', null, {
    
        change: false,

        convert: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    });


    
    this.$property('focus', false);



    this.$property('selectionStart', 0, {

        alias: 'selection-start'
    });


    
    this.$property('selectionEnd', 0, {

        alias: 'selection-end'
    });



}, function TextBox() {

    yaxi.Control.apply(this, arguments);
    
}).register('TextBox');




yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {


    this.$property('text', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-checkbox-checked', {
        
        alias: 'checked-icon'
    });


    this.$property('uncheckedIcon', 'icon-yaxi-checkbox-unchecked', {
        
        alias: 'unchecked-icon'
    });

    
}, function CheckBox() {

    yaxi.Control.apply(this, arguments);

}).register('CheckBox');




yaxi.Memo = yaxi.Control.extend(function () {


    this.$property('value', '');

    
    this.$property('placeholder', '');


    this.$property('text', '');


    
}, function Memo() {

    yaxi.Control.apply(this, arguments);

}).register('Memo');




yaxi.NumberBox = yaxi.TextBox.extend(function () {


    // 是否显示button
    this.$property('button', false);


    // 当前值
    this.$property('value', 0, {
    
        convert: function (value) {

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


}, function NumberBox() {

    yaxi.Control.apply(this, arguments);

}).register('NumberBox');




yaxi.PasswordBox = yaxi.TextBox.extend(function () {



    this.$property('type', '');



}).register('PasswordBox');




yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    this.$property('text', '');


    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-radio-checked', {

        alias: 'checked-icon'
    });


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked', {

        alias: 'unchecked-icon'
    });


    // 互斥容器级别
    this.$property('host', 1);


}, function RadioButton() {

    yaxi.Control.apply(this, arguments);

}).register('RadioButton');




yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {


    this.$property('checked', false);
    

}, function SwitchButton() {

    yaxi.Control.apply(this, arguments);

}).register('SwitchButton');




yaxi.Page = yaxi.Box.extend(function (Class, base) {


	
	// 禁止作为子控件
	Class.allowParent = false;



	this.__find_up = function () {
	
		return null;
	}

	
	
	// 页面加载前处理
	this.onloading = function (options) {
	}
	
	

	// 页面加载后处理
	this.onload = function (options) {
	}
	

	// 页面卸载后处理
	this.onunload = function () {
	}



	function open(options) {

		yaxi.openPage(this, options);
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


    
}, function Page() {

    yaxi.Box.apply(this, arguments);

}).register('Page');




yaxi.Header = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;


    Class.allowParent = function (parent) {

        if (parent instanceof yaxi.Page)
        {
            return true;
        }

        throw new Error('Header component can only add to Page!');
    }



    // 图标
    this.$property('icon', '');


    this.__on_tap = function (event) {

        if (event.flag === 'back')
        {
            yaxi.closePage();
        }
    }


}, function Header() {

    yaxi.Control.apply(this, arguments);

}).register('Header');




yaxi.Dialog = yaxi.Page.extend(function (Class) {
	
	
	



}, function Dialog() {

	yaxi.Box.call(this);

}).register('Dialog');




;(function (yaxi) {
    
    

    yaxi.platform = 'wx';



    yaxi.wx = Object.create(null);



    // 获取系统信息
    yaxi.getSystemInfo = function (callback) {

        callback && wx.getSystemInfo({

            success: function (res) {
                
                callback(res);
            }
        });
    }


})(yaxi);





;(function (wx) {



    var create = Object.create;


    var Event = yaxi.Event;

    
    var controls = yaxi.$controls;

    var translates = create(null);



    // 是否检查点击
    var tap = false;

    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();

    // 开始触摸时的控件及时间
    var touchControl, touchTime, touchFlag, touches;

    


    wx.translateEvent = function (event) {

        var control, any;

        if (any = translates[event.type])
        {
            any(event);
        }
        else if (any !== false && (any = event.target.dataset) &&
            (control = any.id) && (control = findControl(control)))
        {
            event = new Event(event.type, event.detail);
            event.flag = any.flag;

            control.trigger(event);
        }

    }.bind(wx);
    


    function findControl(uuid) {

        var control = controls[uuid];
        return control ? control.findEventTarget() : null;
    }
    
    
    function touchEvent(event) {
    
        var e = new Event(event.type);
    
        e.target = touchControl;
        e.flag = touchFlag;
        e.changedTouches = event.changedTouches;
        e.touches = event.touches;
    
        return e;
    }
    
    
    function touchendEvent(event) {

        var touch1 = event.changedTouches;
        var touch2 = touches;
        var e = touchEvent(event);

        if (touch1 && (touch1 = touch1[0]) && touch2 && (touch2 = touch2[0]))
        {
            var x = touch2.clientX - touch1.clientX;
            var y = touch2.clientY - touch1.clientY;

            e.distanceX = x;
            e.distanceY = y;
            e.move = x < -10 || x > 10 || y < -10 || y > 10;
        }

        return e;
    }

    
    function call(control, name, event) {
    
        var fn;
    
        while (control)
        {
            if ((fn = control[name]) && fn.call(control, event) === false)
            {
                return false;
            }
    
            control = control.parent;
        }
    }
    
    
    
    translates.touchstart = function (event) {
            
        var control, dataset;

        // 阻止冒泡事件(触摸没有弹起时不处理)
        if (touchControl)
        {
            return;
        }

        dataset = event.target.dataset;

        if (control = findControl(dataset.id))
        {
            touchControl = control;
            touchFlag = dataset.flag;
            touchTime = new Date();
            tap = true;

            event = touchEvent(event);
            touches = event.changedTouches;

            if (call(control, '__on_touchstart', event) === false || 
                control.trigger(event) === false)
            {
                return tap = false;
            }
        }
    }
    
    
    translates.touchmove = function (event) {
        
        var control;
    
        if (control = touchControl)
        {
            event = touchEvent(event);

            if (call(control, '__on_touchmove', event) === false || 
                control.trigger(event) === false)
            {
                return tap = false;
            }
        }
    }
    
    
    translates.touchend = function (event) {
        
        var control, time;
    
        if (control = touchControl)
        {
            event = touchendEvent(event);
            touchControl = null;

            if (call(control, '__on_touchend', event) === false || 
                control.trigger(event) === false ||
                event.move)  // 检测滑动距离
            {
                return false;
            }

            // 按下大于350毫秒则触发longpress事件
            if ((time = new Date()) - touchTime > 350)
            {
                event.type = 'longpress';

                if (control.trigger(event) === false)
                {
                    return false;
                }
            }

            // 200ms内不重复触发tap事件
            if (tap && (time - tapTime > 200 || tapControl !== control))
            {
                // 延时触发tap事件解决input先触发change事件的问题
                setTimeout(function () {

                    tapControl = control;
                    tapTime = time;
    
                    event.type = 'tap';
    
                    if (call(control, '__on_tap', event) === false ||
                        control.trigger(event) === false)
                    {
                        return false;
                    }

                }, 0);
            }
        }
    }
    
    
    translates.touchcancel = function (event) {
        
        var control;
    
        if (control = touchControl)
        {
            event = touchEvent(event);
            touchControl = null;

            if (call(control, '__on_touchcancel', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }



    // 不支持以下原生事件, 用touch模拟
    translates.tap = translates.longpress = false;



    translates.input = translates.change = function (event) {

        var dataset = event.target.dataset;
        var control, detail;

        if (control = findControl(dataset.id))
        {
            detail = event.detail;

            event = new Event(event.type);
            event.target = control;
            event.flag = dataset.flag;

            if (detail)
            {
                event.value = detail.value || detail.current;
            }

            return control.trigger(event);
        }
    }

    

})(yaxi.wx);





yaxi.Control.renderer(function (base, yaxi) {



    var create = Object.create;

    var assign = Object.assign;

    var own = Object.getOwnPropertyNames; 



    // 颜色转换函数, 把@color颜色变量转换成实际的颜色
    var convertColor = function (translateFn, value) {

        return value ? ('' + value).replace(this, translateFn) : '';

    }.bind(/@([\w-]+)/g, function (_, key) {

        return this[key];

    }.bind(yaxi.color));


    // 单位转换函数, 把rem转换成rpx
    var convertUnit = function (value) {

        return value.replace(this, 'rpx');

    }.bind(/rem/g);

    


    function render(renderer, control, view, prefix, values) {
        
        var properties = control.$properties;
        var names = own(values);
        var index = 0;
        var classes, styles, property, name, value, any;

        while (name = names[index++])
        {
            property = properties[name];
            value = values[name];

            switch (property && property.kind)
            {
                case 'style': // 样式属性
                    if (any = renderer[name])
                    {
                        value = any.call(renderer, control, view, prefix, value);

                        if (value == null)
                        {
                            break;
                        }
                    }
                    else
                    {
                        switch (property.data)
                        {
                            case 1: // 处理单位值
                                value = convertUnit(value);
                                break;
    
                            case 2: // 处理颜色值
                                value = convertColor(value);
                                break;
    
                            case 3: // 处理单位及颜色值
                                value = convertUnit(convertColor(value));
                                break;
                        }
                    }

                    (styles || (styles = control.__styles || (control.__styles = create(null))))[name] = value;
                    break;

                case 'class': // class属性
                    if (any = renderer[name])
                    {
                        value = any.call(renderer, control, view, prefix, value);

                        if (value == null)
                        {
                            break;
                        }
                    }
                    else if (any = property.data)
                    {
                        if (property.type !== 'boolean')
                        {
                            value = value ? any + value.replace(/\s+/g, ' ' + any) : '';
                        }
                    }
                    else
                    {
                        value = '';
                    }

                    (classes || (classes = control.__classes || (control.__classes = create(null))))[name] = value;
                    break;

                default:
                    if (property.change) // 配置了处理变更的属性才处理
                    {
                        if (any = renderer[name])
                        {
                            any.call(renderer, control, view, prefix, value);
                        }
                        else if (any !== false) // 自定义渲染为false不做任何处理
                        {
                            view[prefix + name] = value;
                        }
                    }
                    break;
            }
        }

        if (classes)
        {
            values = [];

            for (name in classes)
            {
                if (value = classes[name])
                {
                    values.push(value);
                }
            }

            view[prefix + 'class'] = ' ' + values.join(' ');
        }

        if (styles)
        {
            values = [];

            for (name in styles)
            {
                if (value = styles[name])
                {
                    values.push(name, ':', value, ';');
                }
            }

            view[prefix + 's'] = values.join('');
        }
    }



    // 全局渲染
    this.render = function (control) {

        var storage = control.$storage;
        var view = create(null);
        var changes;

        control.__dirty = false;

        view.t = control.typeName;
        view.u = control.uuid;

        if (changes = control.__changes)
        {
            assign(storage, changes);
            control.__changes = null;
        }

        render(this, control, view, '', storage);

        this.onchange.call(this, control, view, '');
        return view;
    }


    // 全新渲染子控件(给子类用)
    this.renderChildren = function (view, prefix, children) {

        var length = children.length;
        
        if (length > 0)
        {
            var list = new Array(length);

            for (var i = 0; i < length; i++)
            {
                list[i] = children[i].$renderer.render(children[i]);
            }
            
            view[prefix + 'c'] = list;
        }
    }



    // 增量渲染
    this.patch = function (control, view, prefix) {

        var changes;

        control.__dirty = false;

        if (changes = control.__changes)
        {
            assign(control.$storage, changes);
            render(this, control, view, prefix += '.', changes);
            
            this.onchange.call(this, control, view, prefix);
            control.__changes = null;
        }
    }


    // 子控件变化补丁(给子类用)
    this.patchChildren = function (control, view, prefix, children) {

        var last, any;

        if (last = children.__last)
        {
            children.__last = null;

            if (any = last.length > 0)
            {
                control.destroyChildren(last);
            }

            // 曾经清除过
            if (!any || last.clear)
            {
                this.renderChildren(view, prefix, children);
            }
            else if (children.length < last.length)
            {
                patchRemoved(children, view, prefix);
            }
            else
            {
                patchChanged(children, last, view, prefix);
            }
        }
        else
        {
            patchUnchanged(children, view, prefix);
        }
    }


    function patchUnchanged(children, view, prefix) {

        var item;

        prefix += '.c[';

        for (var i = 0, l = children.length; i < l; i++)
        {
            if ((item = children[i]) && item.__dirty)
            {
                item.$renderer.patch(item, view, prefix + i + ']');
            }
        }
    }


    function patchRemoved(children, view, prefix) {

        var length = children.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = children[i].$renderer.render(children[i]);
        }

        view[prefix + '.c'] = view.children = list;
    }


    function patchChanged(children, last, view, prefix) {

        var length = children.length;
        var item;

        prefix += '.c[';

        for (var i = 0; i < length; i++)
        {
            if ((item = children[i]) !== last[i])
            {
                view[prefix + i + ']'] = item.$renderer.render(item);
            }
            else if (item.__dirty)
            {
                item.$renderer.patch(item, view, prefix + i + ']');
            }
        }
    }



    this.onchange = function (control, view, prefix) {
    }

    

});




yaxi.ContentControl.renderer(function (base) {

    

    this.render = function (control) {

        var view = base.render.call(this, control);
        var content = control.__init_content() || control.__no_content || '';

        this.renderContent(view, '', content);

        return view;
    }
    
    

    this.renderContent = function (view, prefix, content) {

        if (typeof content === 'string')
        {
            view[prefix + 'c'] = [{
                t: 'Text',
                u: this.uuid,
                text: content
            }];
        }
        else
        {
            this.renderChildren(view, prefix, content);
        }
    }


    
    this.content = function (control, view, prefix, value) {

        this.renderContent(view, prefix, control.__init_content() || '');
    }



});




yaxi.Box.renderer(function (base) {



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, '', children);

        return view;
    }


    this.patch = function (control, view, prefix) {

        this.patchChildren(control, view, prefix, control.__children);
        base.patch.call(this, control, view, prefix);
    }



});




yaxi.DataBox.renderer(function (base) {



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, '', children);

        return view;
    }


    this.patch = function (control, view, prefix) {

        this.patchChildren(control, view, prefix, control.__children);
        base.patch.call(this, control, view, prefix);
    }



});



yaxi.Marquee.renderer(function (base) {



    this.text = function (control, view, prefix, value) {

        // var length = value.length;

        // view[prefix + 'text'] = value;

        // if (length > 0)
        // {
        //     var speed = length >> 5;

        //     if ((speed << 5) < length)
        //     {
        //         speed++;
        //     }
        
        //     if (speed < 1)
        //     {
        //         speed = 1;
        //     }

        //     speed = speed * control.speed | 0;
        //     value = 'marquee ' + speed + 's linear infinite';
        // }

        // view[prefix + 'animation'] = value;
    }


    this.speed = function (control, view) {

        this.text.call(this, control, view, control.text);
    }



});




yaxi.Page.renderer(function (base, yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;




	// 页面栈
    var all = [];
    


    // 渲染前处理集合
    var renderings = [];

    // 渲染后处理集合
    var rendereds = [];




    function find(uuid, index) {

        var list = all;

        for (var i = list.length; i--;)
        {
            if (list[i].uuid === uuid)
            {
                return index ? i : list[i];
            }
        }

        throw new Error('can not find uuid ' + uuid + ' of page!');
    }



    // 通知渲染
    function notifyRender(list) {

        var index = 0;
        var fn;

        while (fn = list[index++])
        {
            fn.apply(list[index++], list[index++]);
        }

        list.length = 0;
    }


    // 注册渲染前事件
    yaxi.bindBeforeRender = function (fn, control, args) {

        renderings.push(fn, control, args);
    }


    // 注册渲染后事件
    yaxi.bindAfterRender = function (fn, control, args) {

        rendereds.push(fn, control, args);
    }


	
	// 获取当前所有页面
    define(yaxi, 'currentPages', {

        get: function () {

            return all.slice();
        }
    });


	// 获取当前页面
	define(yaxi, 'currentPage', {

        get: function () {

            return all[all.length - 1] || null;
        }
    });



	// 打开指定页面
    yaxi.openPage = function (Page, options) {

        try
        {
            var page = new Page(options);
        
            if (page.onloading(options) !== false)
            {
                all.push(page);
                page.options = options;
    
                wx.navigateTo({
    
                    url: '../../yaxi/pages/host?uuid=' + page.uuid
                });
            }
        }
        catch (e)
        {
            console.error(e);
            throw e;
        }
    }


	// 关闭当前页面
    yaxi.closePage = function (delta) {

        wx.navigateBack({

            delta: delta || 1
        });
	}
    


    // 打开微信主页面
    yaxi.openMainPage = function (Page, options, wxPage, wxName) {

        var page = new Page(options);
        var uuid = page.uuid;
        
        page.onloading(options);
        page.options = options;
            
        all.push(page);

        yaxi.__on_page_open(uuid, wxPage, wxName);

        return uuid;
    }
    

    yaxi.__on_page_open = function (uuid, wxPage, wxName) {

        try
        {
            var page = find(uuid);
            var data;

            notifyRender(renderings);

            data = {};
            data[wxName || (wxName = 'data')] = page.$renderer.render(page);

            console.log(data);

            page.__wx_page = wxPage;
            page.__wx_name = wxName;

            wxPage.setData(data, function () {

                notifyRender(rendereds);
                page.onload(page.options);
            });
        }
        catch (e)
        {
            console.error(e);
            throw e;
        }
    }


    yaxi.__on_page_patch = function (patches) {

        var index = 0;
        var times = 0;
        var control, page, data;

        notifyRender(renderings);

        while (control = patches[index++])
        {
            if (page = control.__wx_page)
            {
                times++;

                control.$renderer.patch(control, data = create(null), control.__wx_name);
                console.log(data);

                page.setData(data, function () {

                    if (--times <= 0)
                    {
                        notifyRender(rendereds);
                    }
                });
            }
        }
    }


    yaxi.__on_page_close = function (uuid) {

        var index = find(uuid, true);
        var page = all[index];

        page.onunload();

        page.__wx = null;
        page.destroy();

        all.splice(index, 1);
    }



});




yaxi.Header.renderer(function (base) {



    this.onchange = function (control, view, prefix) {

        view[prefix + 'back'] = yaxi.currentPages.length > 1;
    }



});
