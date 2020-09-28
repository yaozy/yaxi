'use strict'



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
            var callback = function (event) {

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
                    stream.resolve(response(data));
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





;(function (colors) {

    
    var create = Object.create;
    var names = 'black,white,standard,thick,thicker,thickest,light,lighter,lightest,primary,secondary,important,success,warning,danger,disabled'.split(',');

    
    colors.load = function (name, values) {

        var color = yaxi.color = colors[name] = create(null);

        parse(color, 'bg', values[0]);
        parse(color, 'text', values[1]);
        parse(color, 'line', values[2]);
    }


    function parse(color, type, values) {

        var keys = names;
        var item = create(null);

        values = values.split(',');

        for (var i = values.length; i--;)
        {
            var name = keys[i];
            var value = '#' + values[i];

            item[name] = value;
            color[type + '-' + name] = value;
        }

        color[type] = item;
    }


})(yaxi.colors = Object.create(null));






yaxi.colors.load('blue', [
    '000000,ffffff,ffffff,f5f5f5,e0e0e0,bdbdbd,ffffff,ffffff,ffffff,1c86ee,5eaadd,ff6c6c,71c04a,e89518,c40606,eeeeee',
    '000000,ffffff,212121,181818,121212,000000,37474f,616161,9e9e9e,1c86ee,5eaadd,ff6c6c,71c04a,e89518,c40606,999999',
    '000000,ffffff,263238,212121,121212,000000,37474f,546e7a,78909c,1c86ee,5eaadd,ff6c6c,71c04a,e89518,c40606,999999'
]);




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




;(function (yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;


    // 管道编译器
    var compile = yaxi.pipe.compile;

    // 控件对象集合
    var controls = yaxi.$controls || (yaxi.$controls = create(null));


    // 绑定的目标
    var bindingTarget = null;



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

        var convert = options.convert;
        var watches;

        return function (value) {

            var storage = this.$storage;
            var bindings;

            if (convert)
            {
                value = convert(value);
            }

            if (value === storage[name] || (watches = this.__watches) && watches[name] && this.$notify(name, value) === false)
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

        if (options.length !== 1 && !options[0] || typeof options[0] !== 'object')
        {
            throw new Error('define model error: sub array model must be a none empty object only!');
        }

        return yaxi.arrayModel(options[0]);
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
                    (model || (this[name] = new Model(this))).$load(values);
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
            set: function (values) {

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

                if (values && values.length > 0)
                {
                    arrayModel.push.apply(arrayModel, values);
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
                        this.__b_onchange = fn;
                    }
                    else // 表达式绑定
                    {
                        bindingTarget = yaxi.__bindingTarget = {
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
            bindingTarget = yaxi.__bindingTarget = null;
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

        var target = this;
        var watches, items, index, fn;

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
            values = values.$storage || values;

            for (var name in values)
            {
                this[name] = values[name];
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



}).call(Object.create(null), yaxi);




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
                model = data;
                model.$parent = parent;
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

                if (scope !== false)
                {
                    control.parent = parent;
                }
                else // scope === false时不设置parent
                {
                    control.__own = parent;
                }
                
                return control;
            }

            if (Class = options[0])
            {
                if (typeof Class === 'string' && !(Class = classes[Class]))
                {
                    if (options[0] === 'slot')
                    {
                        throwError('can only use slot in component!');
                    }

                    throwError('"' + options[0] + '" doesn\'t register!');
                }
                
                checkParent(Class, parent);

                control = new Class();

                if (scope !== false)
                {
                    control.parent = parent;
                }
                else // scope === false时不设置parent
                {
                    control.__own = parent;
                }

                control.__load(options, scope);

                return control;
            }
        }

        throwError('no options, eg: ["box", { theme: "text-primary" }, [[...], ...]]');
    }


    // 查找事件触发目标, disabled的控件不能触发, content control会接管所有子控件事件
    this.findEventTarget = function () {

        var target = this;
        var parent = this;

        while (parent = parent.parent)
        {
            if (parent.disabled)
            {
                target = parent.parent;
            }
            else if (parent.__own)
            {
                return parent;
            }
            else
            {
                break;
            }
        }

        if (parent = target.__own)
        {
            do
            {
                if (parent.disabled)
                {
                    target = parent.parent;
                }
            }
            while (parent = parent.parent);
        }

        return target;
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
    this.property = yaxi.impl.property();




    // 构建触发变更通知的属性
    function build_set_change(name, convert) {

        var init = create;
        var key = '__set_' + name;

        return function (value) {

            var changes;

            value = convert ? convert.call(this, value) : value;

            if (changes = this.__changes)
            {
                if (value !== changes[name] && !(this[key] && this[key](value) === false))
                {
                    changes[name] = value;
                    this.__dirty || patch(this);
                }
            }
            else if (value !== this.$storage[name] && !(this[key] && this[key](value) === false))
            {
                (this.__changes = init(this.$storage))[name] = value;
                this.__dirty || patch(this);
            }
        }
    }


    // 构建不触发变更通知的属性
    function build_set_unchange(name, convert) {

        var key = '__set_' + name;

        return convert ? function (value) {

            if (!this[key] || this[key](value) !== false)
            {
                this.$storage[name] = convert.call(this, value);
            }

        } : function (value) {

            if (!this[key] || this[key](value) !== false)
            {
                this.$storage[name] = value;
            }
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




    // 直接设置属性值
    this.$set = function (name, value) {

        var storage, changes;

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
            (this.__changes = create(storage))[name] = value;
            this.__dirty || patch(this);
        }
    }



    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls || (yaxi.$controls = create(null));


    // 控件唯一id
    this.$('uuid', 0, {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });



    // id 控件id仅做为内部属性用, 不会同步到dom节点上
    this.$('id', '', false);


    // 默认class
    this.$class = 'yx-control';



    
    // 控件风格
    this.$('theme', '', {

        kind: 'class',
        data: 'yx-theme-'
    });
    


    // 插槽名
    this.$('slot', '', false);


    // 是否隐藏
    this.$('hidden', false);


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

            var target = this,
                parent;

            while (!target.isTopLevel && (parent = target.parent))
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
        data: 'yx-absolute-'
    });



    // 是否使用静态定位(默认使用相对定位)
    this.$('static', false, {

        kind: 'class',
        data: 'yx-static'
    });




    var style = function (name, data) {

        this.$(name, '', {

            alias: name.replace(/-(\w)/g, function (_, x) {
        
                return x.toUpperCase();
            }),

            kind: 'style',
            data: data | 0,
            style: true
        });

    }.bind(this);



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



    this.$properties.events = {
        
        convert: function (events) {

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

        this.parent = this.__b_onchange = this.__d_scope = null;
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

            this.__last || patch(this);
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

    this.$uuid = control && control.uuid;
    
});




/*
 * Box是一个自由的容器控件
 * 不仅可以通过children属性访问子控件集合, 也可以通过find及query方法对子控件进行处理
*/
yaxi.Box = yaxi.Control.extend(function (Class, base) {




    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });

    

    // 子控件集合
    this.$('children', null, {

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


    this.__load_children = function (values, scope) {

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





yaxi.Control.extend(function (Class, base, yaxi) {


    
    var create = Object.create;

    var assign = Object.assign;



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
            shadow.destroy();
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
            this.__shadow.load(values);
        }
    }


    function parseSlot(values, slots) {

        for (var i = values.length; i--;)
        {
            // if (value)
        }
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
    this.__shadows = new yaxi.Collection();

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



    this.$('text', '')


});




/*
 * DataBox是一个通过数据集合(data)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.DataBox = yaxi.Control.extend(function (Class, base) {




    var build = yaxi.Control.build;



    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });


    // 模板
    this.$('template', null, {
     
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



    // 数据集合
    // 可以是数组模型也可以是普通的数组, 如果是普通数组不能实现双向绑定
    this.$('data', null, {

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
    this.$('children', null, {

        get: nochildren,
        set: nochildren
    });


    function nochildren () {

        throw new Error('BataBox control doesn\'t supports children, please use data and template!');
    }



    this.__load_children = function (value, scope) {

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
                this.__children.set(index, controls[0]);
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



    this.$class += ' iconfont'

    
    // 图标名
    this.$('icon', '', {

        kind: 'class',
        data: 'icon-'
    });



}, function Icon() {

    yaxi.Control.apply(this, arguments);

}).register('Icon');




yaxi.IconButton = yaxi.Control.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图标名
    this.$('icon', '');


    // 图标大小
    this.$('size', '');


    // 文字内容
    this.$('text', '');



    this.__load_children = function (values) {

        this.text = values;
    }



}, function IconButton() {


    yaxi.Control.apply(this, arguments);

    
}).register('IconButton');




yaxi.Image = yaxi.Control.extend(function (Class, base) {


    // 图片资源地址
    this.$('src', '');


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
    this.$('mode', '');


    // 图片懒加载，在即将进入一定范围（上下三屏）时才开始加载
    this.$('lazyLoad', false, {

        alias: 'lazy-load'
    });



}, function Image() {

    yaxi.Control.apply(this, arguments);

}).register('Image');




yaxi.ImageButton = yaxi.Control.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图像路径
    this.$('src', '');


    // 图像大小
    this.$('size', '');


    // 文字内容
    this.$('text', '');



    this.__load_children = function (values) {

        this.text = values;
    }



}, function ImageButton() {


    yaxi.Control.apply(this, arguments);

    
}).register('ImageButton');




yaxi.Line = yaxi.Control.extend(function (Class, base) {



    this.$('size', '5rem');


    this.$('color', 'text-standard');



}, function Line() {

    yaxi.Control.apply(this, arguments);

}).register('Line');




yaxi.Vline = yaxi.Control.extend(function (Class, base) {



    this.$('size', '5rem');


    this.$('color', 'text-standard');



}, function Vline() {

    yaxi.Control.apply(this, arguments);

}).register('Vline');




yaxi.Loading = yaxi.Control.extend(function (Class, base) {



}, function Loading() {


    yaxi.Control.apply(this, arguments);


}).register('Loading');




yaxi.Marquee = yaxi.Control.extend(function (Class, base) {



    this.$('text', '');


    // 速度, 每32字显示的秒数
    this.$('speed', 10);


    
}, function Marquee() {

    yaxi.Control.apply(this, arguments);

}).register('Marquee');




yaxi.MaskLayer = yaxi.Control.extend(function (Class, base) {


    



}, function MaskLayer() {


    yaxi.Control.apply(this, arguments);


}).register('MaskLayer');




yaxi.RichText = yaxi.Control.extend(function (Class, base) {


    
    this.$('html', '');



}, function RichText() {


    yaxi.Control.apply(this, arguments);


}).register('RichText');




yaxi.ScrollBox = yaxi.Box.extend(function () {


}, function ScrollBox() {

    yaxi.Box.call(this);

}).register('ScrollBox');




yaxi.StackBox = yaxi.Box.extend(function (Class, base) {



    this.$('layout', {

        get: nolayout,
        set: nolayout
    });


    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout! can only use full!');
    }



    // 子项是否充满容器
    this.$('full', false);




}, function StackBox() {

    yaxi.Box.apply(this, arguments);

}).register('StackBox');




yaxi.Swiper = yaxi.Box.extend(function (Class, base) {



    // 是否自动切换
    this.$('autoplay', true, false);


    // 当前所在滑块的 index
    this.$('current', 0);


    // 自动切换时间间隔
    this.$('interval', 5000, false);


    // 滑动动画时长
    this.$('duration', 500, false);



    // 前边距, 可用于露出前一项的一小部分, 接受px和rem值
    this.$('before', '');


    // 后边距, 可用于露出后一项的一小部分, 接受px和rem值
    this.$('after', '');



    this.__on_change = function (value) {

        this.current = value;
    }



}, function Swiper() {

    yaxi.Box.apply(this, arguments);

}).register("Swiper");




yaxi.TabBar = yaxi.Box.extend(function (Class, base) {



    // 页面容器
    this.$('host', '', false);



    // 获取或设置当前页索引
    this.$('selectedIndex', -1, {

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
    this.$('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.children[index] || null;
        }
    });


    // 选中的页签容器
    this.$('selectedHost', null, {

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



    var pipe = yaxi.pipe.compile;
    


    this.$('text', '');


    this.$('security', '');


    this.$('format', null, false);


    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.__load_children = function (value) {

        this.text = value;
    }



}, function Text() {

    yaxi.Control.apply(this, arguments);

}).register('Text');




yaxi.TextBox = yaxi.Control.extend(function () {



    var pipe = yaxi.pipe.compile;

    


    this.$('name', '');


    this.$('value', '');

    
    this.$('placeholder', '');


    this.$('maxlength', -1);


    this.$('pattern', '');


    this.$('format', null, false);



    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.$('selectionStart', 0, {

        alias: 'selection-start'
    });


    
    this.$('selectionEnd', 0, {

        alias: 'selection-end'
    });



    // 是否禁用
    this.$('disabled', false);

    

    this.focus = function () {

        this.$renderer.focus(this);
    }



    this.__on_change = function (value) {

        this.$push(value);
    }




}, function TextBox() {

    yaxi.Control.apply(this, arguments);
    
}).register('TextBox');




yaxi.Button = yaxi.Control.extend(function (Class, base) {


    
    var A = Array;
    
    var build = yaxi.Control.build;
    
    var loading;



    this.$('text', '');


    this.__set_text = function (value) {

        this.content(value);
    }


    // 是否禁用
    this.$('disabled', false);



    function createControls(parent, values) {

        var length = values.length;
        var list = new A(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = build(parent, values[i], false);
            list[i].__own = this;
        }

        return list;
    }


    this.content = this.__load_children = function (values) {

        var content;

        if (content = this.__content)
        {
            if (typeof content === 'object')
            {
                for (var i = content.length; i--;)
                {
                    content[i].destroy();
                }
            }
        }

        if (values instanceof A)
        {
            if (loading)
            {
                throw new Error('load button error: button can not embed button!');
            }

            try
            {
                loading = true;

                if (values[0] instanceof A)
                {
                    values = createControls(this, values);
                }
                else
                {
                    values = [build(this, values, false)];
                }

                this.$storage.text = '';
            }
            finally
            {
                loading = false;
            }
        }
        else
        {
            this.$storage.text = values = '' + values; 
        }

        this.__content = values;
    }



    this.destroy = function () {

        var content = this.__content;

        if (content && typeof content !== 'string')
        {
            for (var i = content.length; i--;)
            {
                content[i].destroy();
                content[i].__own = null;
            }
        }

        base.destroy.call(this);
    }



}, function Button() {


    yaxi.Control.apply(this, arguments);


}).register('Button');




yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {




    this.$('name', '');
    

    this.$('text', '');
    

    this.$('checked', false);


    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change');
    }


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);

    

    this.__on_tap = function () {

        if (this.trigger('changing') !== false)
        {
            this.checked = !this.value;
        }
    }


    
}, function CheckBox() {

    yaxi.Control.apply(this, arguments);

}).register('CheckBox');




yaxi.CheckGroup = yaxi.Box.extend(function (Class, base) {




}, function CheckGroup() {


    yaxi.Box.apply(this, arguments);


}).register('CheckGroup');




yaxi.Form = yaxi.Box.extend(function (Class, base) {



}, function Form() {


    yaxi.Box.apply(this, arguments);


}).register('Form');




yaxi.Memo = yaxi.Control.extend(function () {


    
    this.$('name', '');
    

    this.$('value', '');

    
    this.$('placeholder', '');


    this.$('text', '');


    // 是否禁用
    this.$('disabled', false);


    
}, function Memo() {

    yaxi.Control.apply(this, arguments);

}).register('Memo');




yaxi.NumberBox = yaxi.TextBox.extend(function () {



    this.$('name', '');
    

    // 是否显示button
    this.$('button', false);


    // 当前值
    this.$('value', 0, {
    
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
    this.$('min', -Infinity, false);


    // 最大值
    this.$('max', Infinity, false);


    // 加减步进
    this.$('step', 1);



}, function NumberBox() {

    
    yaxi.Control.apply(this, arguments);


}).register('NumberBox');




yaxi.PasswordBox = yaxi.TextBox.extend(function () {






}, function PasswordBox() {


    yaxi.Control.apply(this, arguments);


}).register('PasswordBox');




yaxi.Radio = yaxi.Control.extend(function (Class, base) {




    Class.allowParent = function (parent) {

        return parent instanceof yaxi.RadioGroup;
    }



    this.$('name', '');


    this.$('text', '');


    this.$('checked', false);


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);



    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change');
    }



}, function Radio() {


    yaxi.Control.apply(this, arguments);


}).register('Radio');




yaxi.RadioGroup = yaxi.Box.extend(function (Class, base) {



    this.__on_tap = function (event) {

        var target = event.target;

        if (target.parent === this && !target.checked && this.trigger('changing') !== false)
        {
            var children = this.children;

            for (var i = children.length; i--;)
            {
                children[i].checked = children[i] === target;
            }
        }
    }
    


}, function RadioGroup() {


    yaxi.Box.apply(this, arguments);
    

}).register('RadioGroup');




yaxi.RichEdit = yaxi.Control.extend(function (Class, base) {


    
    // 是否禁用
    this.$('disabled', false);



}, function RichEdit() {


    yaxi.Control.apply(this, arguments);


}).register('RichEdit');




yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {



    this.$('name', '');
    

    this.$('checked', false);
    

    // 是否禁用
    this.$('disabled', false);



}, function SwitchButton() {


    yaxi.Control.apply(this, arguments);


}).register('SwitchButton');




yaxi.TextArea = yaxi.TextBox.extend(function () {


    
    // 是否禁用
    this.$('disabled', false);



}, function TextArea() {


    yaxi.Control.apply(this, arguments);


}).register('TextArea');




yaxi.Page = yaxi.Box.extend(function (Class, base) {


	
	// 禁止作为子控件
	Class.allowParent = false;




    // 是否顶级控件
    this.isTopLevel = true;



	this.__find_up = function () {
	
		return null;
	}

	
	
	// 页面加载前处理
	this.onloading = function (options) {
	}
	
	

	// 页面加载后处理
	this.onload = function (options) {
	}
	


	// 页面卸载前处理(返回false退停止关闭窗口)
	this.onunloading = function (options) {
	}


	// 页面卸载后处理
	this.onunload = function (options) {
	}


	// 关闭窗口
	this.close = function (type, data) {

		yaxi.closePage(type, data);
	}



	function open(options, callback) {

		yaxi.openPage(this, options, callback);
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


    
}, function Page() {

    yaxi.Box.apply(this, arguments);

}).register('Page');




yaxi.Dialog = yaxi.Box.extend(function (Class, base, yaxi) {
	


	// 禁止作为子控件
	Class.allowParent = function (parent) {

		return parent instanceof yaxi.Page;
	}



    // 是否顶级控件
    this.isTopLevel = true;



	this.__find_up = function () {
	
		return null;
	}

	
	
	// 对话框加载前处理
	this.onloading = function (options) {
	}
	
	

	// 对话框加载后处理
	this.onload = function (options) {
	}
	

	// 对话框关闭前处理(返回false退停止关闭窗口)
	this.onunloading = function (options) {
	}


	// 对话框关闭后处理
	this.onunload = function (options) {
	}


	// 关闭窗口
	this.close = function (type, data) {

		var page = yaxi.currentPage;
		var options = this.options;
		var callback;

		if (page && this.onunloading(options) !== false)
		{
			this.remove();
			this.onunload(options);
    
			this.options = null;
			this.destroy();
	
			if (callback = this.__callback)
			{
				this.__callback = null;
				callback(type, data);
			}
		}
	}


	
	function open(options, callback) {

		var page = yaxi.currentPage;
		var dialog = new this(options);
        
		if (page && dialog.onloading(options) !== false)
		{
			dialog.options = options;
			dialog.__callback = callback;

			page.children.push(dialog);
			
			dialog.onload(options);
		}
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


	
	
}, function Dialog() {

	yaxi.Box.apply(this, arguments);

}).register('Dialog');




yaxi.MessageBox = yaxi.Dialog.extend(function (Class) {



	Class.sealed = true;


	Class.buttons = {
		OK: '确定',
		Cancel: '取消',
		Yes: '是',
		No: '否',
		Agree: '同意',
		Refuse: '拒绝'
	}



	function close(event) {

		this.close(event.target.key);
	}


	this.init = function (options) {

		var title, content, buttons;
		
		if (options)
		{
			if (typeof options !== 'object')
			{
				options = '' + options;
			}
		}
		else
		{
			options = {};
		}

		title = options.title || Class.title || 'yaxi';
		content = options.content;
		buttons = options.buttons || 'OK,Cancel';
	
		if (typeof title === 'string')
		{
			title = [
				'text',
				{
					height: '120rem',
					lineHeight: '120rem',
					textAlign: 'center',
					fontWeight: 'bold'
				},
				title
			];
		}
	
		if (typeof content === 'string')
		{
			content = [
				'text', 
				{
					minHeight: '150rem',
					padding: '20rem 50rem'
				},
				content
			];
		}
	
		if (typeof buttons === 'string')
		{
			var keys = Class.buttons;
			var last = (buttons = buttons.split(',')).length - 1;

			for (var i = last + 1; i--;)
			{
				buttons[i] = [
					'text',
					{
						key: buttons[i],
						minWidth: '180rem',
						height: '80rem',
						lineHeight: '80rem',
						theme: i === last ? 'text-primary' : '',
						textAlign: 'center',
						fontWeight: 'bold',
						events: {
							tap: close.bind(this)
						}
					},
					keys[buttons[i]]
				]
			}
		}
	
		this.load([
			'',
			null,
			[
				[
					'masklayer',
					{
						key: 'Cancel',
						events: {
							tap: close.bind(this)
						}
					}
				],
				[
					'box',
					{
						theme: 'bg-standard line-lighter line-top',
						absolute: 'middle center',
						width: '80%',
						minHeight: '250rem',
						maxHeight: '80%',
						layout: 'column'
					},
					[
						title,
						content,
						[
							'box',
							{
								layout: 'row middle after',
								theme: 'line-lightest line-top',
								minHeight: '120rem',
								padding: '0 50rem'
							},
							buttons
						]
					]
				]
			]

		]);
	}




	Class.delete = function (text, callback) {

		if (typeof text === 'function')
		{
			callback = text;
			text = '';
		}

		this.open({

			title: '确认删除',
			content: '确认要删除' + (text || '') + '?'

		}, callback);
	}


	Class.info = function (text) {

		this.open({

			title: '提醒',
			content: text,
			buttons: 'OK'
		});
	}


});




yaxi.component('Header', function (Class, base) {



    // 标记不能被继承
    Class.sealed = true;



    Class.allowParent = function (parent) {

        if (parent && parent.isTopLevel)
        {
            return true;
        }

        throw new Error('Header can only add to top level control!');
    }




    // 图标
    this.$('icon', '');


    this.__on_tap = function (event) {

        if (event.flag === 'back')
        {
            this.parent.close('Back');
        }
    }


});




;(function (yaxi) {
    
    
    
    var h5 = yaxi.h5 = Object.create(null);



    yaxi.platform = 'h5';


    // 是否在微信浏览器中打开
    h5.weixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;



    // 获取系统信息
    yaxi.getSystemInfo = function (callback) {

        var w = window;
        var n = navigator;
        var s = screen;
        var o = w.orientation;

        callback && callback({
            deviceOrientation: o == 180 || o == 0 ? 'portrait' : 'landscape',
            language: n.language,
            pixelRatio: w.devicePixelRatio,
            platform: n.platform,
            screenHeight: s.height,
            screenWidth: s.width,
            statusBarHeight: 0,
            system: n.appName,
            version: n.appVersion,
            windowHeight: w.innerWidth,
            windowWidth: w.innerHeight
        });
    }



})(yaxi);




;(function (yaxi) {



    var host = yaxi.__view_host = document.createElement('div');


	host.className = 'yx-host';

    if (document.body)
    {
        document.body.appendChild(host);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', function () {

            document.body.appendChild(host);
        });
	}
	
	
    // 处理rem自适应
    document.documentElement.style.fontSize = (yaxi.rem = (window.innerWidth * 10000 / 750 | 0) / 10000) + 'px';
    host.style.cssText = 'width:100%;height:100%;transform-origin: 0 0;';



    var controls = yaxi.$controls;


    var Event = yaxi.Event;

    
    var bind = host.addEventListener.bind(host);



    // 是否检查点击
    var tap = false;

    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();

    // 开始触摸时的控件及时间
    var touchControl, touchTime, touches;
    
    // dom标记
    var flag;




    function findControl(view) {

        var control, uuid, f;

        while (view)
        {
            f || (f = view.getAttribute('flag'));

            if ((uuid = view.id) && (control = controls[uuid]))
            {
                flag = f || '';
                return control.findEventTarget();
            }

            view = view.parentNode;
        }
    }

    

    function touchEvent(event) {

        var e = new Event(event.type);

        e.target = touchControl;
        e.flag = flag;
        e.changedTouches = parseTouches(event.changedTouches);
        e.touches = parseTouches(event.touches);

        return e;
    }


    function touchendEvent(event) {

        var touch1 = touches;
        var touch2 = event.changedTouches;
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


    function parseTouches(touches) {

        var index = touches.length;
        var list = new Array(index);

        while (index--)
        {
            var touch = touches[index];

            // 微信小程序只支持以下touch属性
            list[index] = {
                identifier: touch.identifier,
                pageX: touch.pageX,
                pageY: touch.pageY,
                clientX: touch.clientX,
                clientY: touch.clientY 
            }
        }

        return list;
    }


    
    function handler(event) {

        var control;

        if (control = findControl(event.target))
        {
            event = new Event(event.type);
            event.flag = flag;

            return control.trigger(event);
        }
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


    
	bind('touchstart', function (event) {
		
        var control;

        if (control = findControl(event.target))
        {
            touchControl = control;
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

	}, true);


	bind('touchmove', function (event) {
        
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

        if (yaxi.h5.weixin)
        {
            return false;
        }

	}, true);


	bind('touchend', function (event) {
        
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

	}, true);


	bind('touchcancel', function (event) {
        
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

    }, true);



    bind('input', function (event) {

        var control, fn, value;

        if (control = findControl(event.target))
        {
            value = event.target.value;

            if ((fn = control.__on_input) && fn.call(control, value) === false)
            {
                return false;
            }

            event = new Event('input');
            event.flag = flag;
            event.value = value;

            return control.trigger(event);
        }

    }, true);


    bind('change', function (event) {

        var control, fn, value;

        if (control = findControl(event.target))
        {
            value = event.target.value;

            if ((fn = control.__on_change) && fn.call(control, value) === false)
            {
                return false;
            }

            event = new Event('change');
            event.flag = flag;
            event.value = value;

            return control.trigger(event);
        }

    }, true);



    
    bind('keydown', handler, true);

    bind('keypress', handler, true);

    bind('keyup', handler, true);



    bind('blur', handler, true);

    bind('focus', function (event) {
     
        var control;

        if (control = findControl(event.target))
        {
            event = new Event('focus');
            event.flag = false;

            return control.trigger(event);
        }
        
    }, true);

    

    bind('scroll', function (event) {

        var control, fn;

        if (control = findControl(event.target))
        {
            if (fn = control.__on_scroll)
            {
                fn.call(control, event.target);
            }

            event = new Event('scroll');
            event.flag = false;

            return control.trigger(event);
        }

    }, true);


    
    window.addEventListener('resize', function () {

        var view = document.activeElement;

        // 打开输入法时把焦点控件移动可视区
        if (view && this.innerHeight / this.innerWidth < 1.2)
        {
            view.scrollIntoViewIfNeeded();
        }
    });



})(yaxi);




yaxi.__ajax_send = function (options) {

    var stream = new yaxi.Stream();
    var ajax = new XMLHttpRequest();
    var timeout, any;
    
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

            if (timeout)
            {
                clearTimeout(timeout);

                if (this.status >= 100 && this.status < 300)
                {
                    stream.resolve(this.responseText || this.responseXML);
                }
                else
                {
                    stream.reject({
                        url: options.url,
                        status: this.status || 600,
                        message: this.statusText || this.responseText,
                        options: options
                    });
                }
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

    timeout = setTimeout(function () {

        timeout = 0;
        ajax.abort();

        stream.reject({
            url: options.url,
            status: 601,
            message: 'ajax request timeout'
        });

    }, options.timeout);

    ajax.send(options.data);

    return stream;
}





yaxi.Control.renderer(function () {



    var own = Object.getOwnPropertyNames;

    var create = Object.create;

    var div = document.createElement('div');


    // 颜色转换函数, 把@color颜色变量转换成实际的颜色
    var convertColor = function (translateFn, value) {

        return value ? ('' + value).replace(this, translateFn) : '';

    }.bind(/@([\w-]+)/g, function (_, key) {

        return this[key];

    }.bind(yaxi.color));

    

    

    yaxi.template = function (target, html) {

        if (target && html)
        {
            target.__html_template = html;
            target.__dom_template = null;
        }
    }



    this.__html_template = '<div class="$class"></div>';
    


    function init_template(target, control) {

        var view;
        
        div.innerHTML = target.__html_template.replace('$class', control.$class);

        view = div.firstChild;
        div.removeChild(view);

        return control.constructor.__dom_template = view;
    }




    // 渲染控件
    this.render = function (control) {

        var view = control.$view || (control.$view = (control.constructor.__dom_template || init_template(this, control)).cloneNode(true));

        view.id = control.uuid;
        this.patch(control, view);

        return view;
    }


    // 全新渲染子控件(给子类用)
    this.renderChildren = function (view, children) {

        var index = 0;
        var control;

        while (control = children[index++])
        {
            view.appendChild(control.$view || control.$renderer.render(control));
        }
    }



    this.patch = function (control, view) {

        var values;

        control.__dirty = false;

        if (values = control.__changes)
        {
            var properties = control.$properties;
            var storage = control.$storage;
            var names = own(values);
            var index = 0;
            var classes, property, name, value, any;

            while (name = names[index++])
            {
                property = properties[name];
                value = storage[name] = values[name];

                switch (property && property.kind)
                {
                    case 'style': // 样式属性
                        // 处理颜色值
                        if (any = this[name])
                        {
                            value = any.call(this, control, view, value);

                            if (value == null)
                            {
                                break;
                            }
                        }
                        else if ((property.data) & 2 === 2)
                        {
                            value = convertColor(value);
                        }

                        view.style[name] = value;
                        break;

                    case 'class': // class属性
                        if (any = this[name])
                        {
                            value = any.call(this, control, view, value);

                            if (value == null)
                            {
                                break;
                            }
                        }
                        else if (value)
                        {
                            any = property.data;
                            value = property.type !== 'boolean' ? any + value.replace(/\s+/g, ' ' + any) : any;
                        }
                        else
                        {
                            value = '';
                        }

                        (classes || (classes = control.__classes || (control.__classes = create(null))))[name] = value;
                        break;

                    default:
                        if (any = this[name])
                        {
                            any.call(this, control, view, values[name]);
                        }
                        break;
                }
            }

            // 有变化的class则合并处理
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

                view.className = control.$class + ' ' + values.join(' ');
            }

            control.__changes = null;
        }
    }



    // 子控件变化补丁(给子类用)
    this.patchChildren = function (control, view, children) {

        var control, last, any;

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
                // 先清空原控件
                view.textContent = '';

                this.renderChildren(view, children);
            }
            else
            {
                patchChildren(view, children);
            }
        }
        else if ((any = children.length) > 0)
        {
            for (var i = 0; i < any; i++)
            {
                if ((control = children[i]) && control.__dirty && (view = control.$view))
                {
                    control.$renderer.patch(control, view);
                }
            }
        }
    }


    function patchChildren(view, children) {

        var refChild = view.firstChild;
        var index = 0;
        var control;
        var newChild;

        while (control = children[index++])
        {
            if (newChild = control.$view)
            {
                if (control.__dirty)
                {
                    control.$renderer.patch(control, newChild);
                }

                if (newChild !== refChild)
                {
                    view.insertBefore(newChild, refChild);
                }
                else
                {
                    refChild = refChild.nextSibling;
                }
            }
            else
            {
                view.insertBefore(control.$renderer.render(control), refChild);
            }
        }

        while (refChild)
        {
            newChild = refChild;
            refChild = refChild.nextSibling;

            view.removeChild(newChild);
        }
    }




    this.hidden = function (control, view, value) {

        view.style.display = value ? 'none' : '';
    }


    this.disabled = function (control, view, value) {

        if (value)
        {
            view.setAttribute('disabled', 'disabled');
        }
        else
        {
            view.removeAttribute('disabled');
        }
    }


    
});





yaxi.Box.renderer(function (base) {



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, children);

        return view;
    }


    
    this.patch = function (control, view) {

        this.patchChildren(control, this.getChildrenView(view), control.__children);
        base.patch.call(this, control, view);
    }


    this.getChildrenView = function (view) {

        return view;
    }



});




yaxi.DataBox.renderer(function (base) {



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, children);

        return view;
    }


    
    this.patch = function (control, view) {

        this.patchChildren(control, view, control.__children);
        base.patch.call(this, control, view);
    }

    

});




yaxi.Icon.renderer(function (base) {



    this.$class += ' iconfont';



});




yaxi.IconButton.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div></div>'
            + '<div class="yx-iconbutton-content"></div>'
        + '</div>');


    
    this.icon = function (control, view, value) {

        view.firstChild.className = 'yx-iconbutton-icon iconfont' + (value ? ' icon-' + value : '');
    }


    this.size = function (control, view, value) {

        view.firstChild.style.fontSize = value > 0 ? value + 'rem' : value;
    }


    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


});




yaxi.Image.renderer(function (base) {



    yaxi.template(this, '<image class="$class"></image>');



    this.src = function (control, view, value) {

        view.src = value;
    }



});




yaxi.ImageButton.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div class="yx-imagebutton-image"></div>'
            + '<div class="yx-imagebutton-content"></div>'
        + '</div>');



    this.src = function (control, view, value) {

        view.firstChild.style.backgroundImage = value ? 'url(' + value + ')' : '';
    }


    this.size = function (control, view, value) {

        var style = view.firstChild.style;
        style.width = style.height = value;
    }


    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


});




yaxi.Line.renderer(function (base) {


    var color = yaxi.color;


    this.size = function (control, view, value) {

        view.style.width = value;
    }


    this.color = function (control, view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});



yaxi.Vline.renderer(function (base) {


    var color = yaxi.color;


    this.size = function (control, view, value) {

        view.style.height = value;
    }


    this.color = function (control, view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});






yaxi.Marquee.renderer(function (base) {


    yaxi.template(this, '<div class="$class"><div class="yx-marquee-content"></div></div>')

    
    this.text = function (control, view, value) {

        // var length = value.length;

        // view = view.firstChild;

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

        //     speed = speed * this.speed | 0;
    
        //     value = '<span "margin-right:100rem;">' + value + '</span>';
    
        //     view.innerHTML = value + value;
        //     value = 'marquee ' + speed + 's linear infinite';
        // }

        // view.style.animation = value;
    }


    this.speed = function (control, view) {

        this.text.call(this, control, view, control.text);
    }


});




yaxi.ScrollBox.renderer(function (base) {





});




yaxi.StackBox.renderer(function (base) {



    
    yaxi.template(this, '<div class="$class"><div class="yx-stackbox-body"></div></div>');



    this.getChildrenView = function (view) {

        return view.firstChild;
    }



    this.full = function (control, view, value) {

        view.firstChild.className = 'yx-stackbox-body' + (value ? ' yx-stackbox-full' : '');
    }


});




yaxi.Swiper.renderer(function (base) {



    yaxi.template(this, '<div class="$class"></div>');


});




yaxi.Text.renderer(function (base) {



    yaxi.template(this, '<span class="$class"></span>');

    

    this.text = function (control, view, value) {

        var format;

        if (!control.__security)
        {
            view.textContent = (format = control.__format) ? format(value) : value;
        }
    }


    this.security = function (control, view, value) {

        var format;

        if (control.__security = value)
        {
            view.textContent = value;
        }
        else
        {
            view.textContent = (format = control.__format) ? format(control.text) : control.text;
        }
    }



});




yaxi.Button.renderer(function (base) {



    function renderContent(control, view) {

        var content = control.__content || '';

        if (typeof content === 'string')
        {
            view.textContent = content;
        }
        else
        {
            view.textContent = '';
            this.renderChildren(view, content);
        }
    }



    this.render = function (control) {

        var view = base.render.call(this, control);

        renderContent.call(this, control, view);
        return view;
    }
    

    this.text = function (control, view) {

        renderContent.call(this, control, view);
    }



});





yaxi.CheckBox.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div class="yx-checkbox-icon iconfont icon-common-unchecked"></div>'
            + '<div class="yx-checkbox-content"></div>'
        + '</div>');



    this.checked = function (control, view, value) {

        view.firstChild.className = 'yx-checkbox-icon iconfont icon-common-' + (value ? 'checked' : 'unchecked');
    }
    
    
    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


});




yaxi.Memo.renderer(function (base) {



    this.focus = function (control) {

        var view;

        if (view = control.$view)
        {
            view.focus();
        }
    }

    
    this.blur = function (control) {

        var view;

        if (view = control.$view)
        {
            view.blur();
        }
    }

    

    yaxi.template(this, '<span class="$class"><textarea></textarea></span>');



    this.value = function (control, view, value) {

        view.firstChild.value = value;
    }


    this.placeholder = function (control, view, value) {

        view.firstChild.placeholder = value;
    }



});




yaxi.NumberBox.renderer(function (base) {





});




yaxi.PasswordBox.renderer(function (base) {





});




yaxi.Radio.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div class="yx-radio-icon iconfont icon-common-unchecked"></div>'
            + '<div class="yx-radio-content"></div>'
        + '</div>');



    this.checked = function (control, view, value) {

        view.firstChild.className = 'yx-radio-icon iconfont icon-common-' + (value ? 'checked' : 'unchecked');
    }
    
    
    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }




});




yaxi.SwitchButton.renderer(function (base) {





});




yaxi.TextBox.renderer(function (base) {



    yaxi.template(this, '<input type="text" class="$class" />');





    this.value = function (control, view, value) {

        var format;

        if (format = control.__format)
        {
            value = format(value);
        }

        view.value = value;
    }



    this.placeholder = function (control, view, value) {

        view.setAttribute('placeholder', value);
    }


    this.maxlength = function (control, view, value) {

        view.setAttribute('maxlength', value);
    }


    this.pattern = function (control, view, value) {

        view.setAttribute('pattern', value);
    }


    this.selectionStart = function (control, view, value) {

        view.selectionStart = value;
    }


    this.selectionEnd = function (control, view, value) {

        view.selectionEnd = value;
    }



    this.focus = function (control) {

        control.$view.focus();
    }



});




yaxi.Page.renderer(function (base) {



    var define = Object.defineProperty;


	// 页面栈
    var all = [];
    


    // 渲染前处理集合
    var renderings = [];

    // 渲染后处理集合
	var rendereds = [];
	


	var host = yaxi.__view_host;



	yaxi.template(this, '<div class="$class"></div>');




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
	yaxi.openPage = function (Page, options, callback) {

        if (typeof options === 'function')
        {
            callback = options;
            options = null;
        }

        var page = new Page(options);
        
        if (page.onloading(options) !== false)
        {
            all.push(page);

            page.options = options;
            page.__callback = callback;

			host.appendChild(page.$renderer.render(page));

			notifyRender(renderings);
			page.onload(page.options);
		}
	}

	
	// 关闭当前页面
    yaxi.closePage = function (type, data) {

        var page, options, callback;

        if (page = all.pop())
        {
            if (page.onunloading(options = page.options) !== false)
            {
                host.removeChild(page.$view);

                page.onunload(options);
                page.options = null;
                page.destroy();
                
                if (callback = page.__callback)
                {
                    page.__callback = null;
                    callback(type, data);
                }
            }
            else
            {
                all.push(page);
            }
        }
	}
    
    

    yaxi.__on_page_patch = function (patches) {

        var index = 0;
        var control, view;

        notifyRender(renderings);

        while (control = patches[index++])
        {
            if (view = control.$view)
            {
                control.$renderer.patch(control, view);
            }
        }

        notifyRender(rendereds);
    }


    
});




