(function(window){var svgSprite='<svg><symbol id="icon-pulldown" viewBox="0 0 1024 1024"><path d="M512 960C264.96 960 64 759.04 64 512S264.96 64 512 64s448 200.96 448 448S759.04 960 512 960zM512 128C300.256 128 128 300.256 128 512c0 211.744 172.256 384 384 384 211.744 0 384-172.256 384-384C896 300.256 723.744 128 512 128z"  ></path><path d="M694.56 522.144c-12.544-12.608-33.376-12.64-45.952-0.064L544 625.984 544 319.328c0-17.76-14.208-32.16-32-32.16-17.76 0-32 14.4-32 32.16l0 308.32-105.216-106.688c-12.48-12.608-32.704-12.736-45.312-0.256C316.832 533.216 316.8 553.6 329.28 566.208l159.36 161.056c6.272 6.336 14.592 9.568 22.88 9.568 8.16 0 16.384-3.168 22.624-9.312 0.032-0.064 0.032-0.064 0.064-0.128 0.032 0 0.064 0 0.096-0.064l160.192-159.68C707.072 555.104 707.104 534.72 694.56 522.144z"  ></path></symbol><symbol id="icon-back" viewBox="0 0 1024 1024"><path d="M395.21518 513.604544l323.135538-312.373427c19.052938-18.416442 19.052938-48.273447 0-66.660212-19.053961-18.416442-49.910737-18.416442-68.964698 0L291.75176 480.290811c-19.052938 18.416442-19.052938 48.273447 0 66.660212l357.633237 345.688183c9.525957 9.207709 22.01234 13.796214 34.497699 13.796214 12.485359 0 24.971741-4.588505 34.466999-13.82896 19.052938-18.416442 19.052938-48.242747 0-66.660212L395.21518 513.604544z"  ></path></symbol><symbol id="icon-radio-checked" viewBox="0 0 1024 1024"><path d="M512 259.56503703c-138.83922963 0-252.43496297 113.59573333-252.43496297 252.43496297s113.59573333 252.43496297 252.43496297 252.43496297 252.43496297-113.59573333 252.43496297-252.43496297S650.83922963 259.56503703 512 259.56503703zM512 7.13007408C234.323968 7.13007408 7.13007408 234.323968 7.13007408 512s227.19389392 504.86992592 504.86992592 504.86992592 504.86992592-227.19389392 504.86992592-504.86992592S789.676032 7.13007408 512 7.13007408zM512 915.89594075c-222.13791289 0-403.89594075-181.76045511-403.89594075-403.89594075S289.86208711 108.10405925 512 108.10405925 915.89594075 289.86208711 915.89594075 512 734.13791289 915.89594075 512 915.89594075z"  ></path></symbol><symbol id="icon-checkbox-uncheck" viewBox="0 0 1024 1024"><path d="M892.24735231 1012.51492048l-760.49638045 0c-66.35446257 0-120.26589234-53.91310559-120.26589234-120.26589234l0-760.56676528c0-66.35446257 53.91310559-120.26589234 120.26589234-120.26589236l760.49638045 0c66.35446257 0 120.26589234 53.91310559 120.26589235 120.26589236l0 760.56676528c0 66.35446257-53.91310559 120.26589234-120.26589235 120.26589234zM131.75264769 82.98768981c-26.88533005 0-48.76495786 21.95168848-48.76495788 48.76495788l0 760.56676528c0 26.81326939 21.87962782 48.76495786 48.76495788 48.76495787l760.49638045 0c26.81326939 0 48.76495786-21.95168848 48.76495787-48.76495787l0-760.56676528c0-26.81326939-21.95168848-48.76495786-48.76495787-48.76495788l-760.49638045 0z"  ></path></symbol><symbol id="icon-checkbox-checked" viewBox="0 0 1024 1024"><path d="M892.24735231 1012.51492048l-760.49638045 0c-66.35446257 0-120.26589234-53.91310559-120.26589234-120.26589234l0-760.56676528c0-66.35446257 53.91310559-120.26589234 120.26589234-120.26589236l760.49638045 0c66.35446257 0 120.26589234 53.91310559 120.26589235 120.26589236l0 760.56676528c0 66.35446257-53.91310559 120.26589234-120.26589235 120.26589234zM131.75264769 82.98768981c-26.88533005 0-48.76495786 21.95168848-48.76495788 48.76495788l0 760.56676528c0 26.81326939 21.87962782 48.76495786 48.76495788 48.76495787l760.49638045 0c26.81326939 0 48.76495786-21.95168848 48.76495787-48.76495787l0-760.56676528c0-26.81326939-21.95168848-48.76495786-48.76495787-48.76495788l-760.49638045 0z"  ></path><path d="M449.57870885 836.76231882l-274.13886619-274.21092687 101.10445971-101.10445972 154.87344396 154.80138332 308.38779037-431.80089021 116.40478156 83.08594269z"  ></path></symbol><symbol id="icon-circle" viewBox="0 0 1024 1024"><path d="M32 512c0 265.09653333 214.90346667 480 480 480s480-214.90346667 480-480c0-265.09653333-214.90346667-480-480-480-265.09653333 0-480 214.90346667-480 480z"  ></path></symbol><symbol id="icon-hollow-circle" viewBox="0 0 1024 1024"><path d="M512.00545813 988.48956907C249.261904 988.48956907 35.50933867 774.738096 35.50933867 511.99345067c0-262.73154667 213.75256533-476.484112 476.4961184-476.484112 262.73154667 0 476.484112 213.75256533 476.484112 476.484112C988.48956907 774.738096 774.738096 988.48956907 512.00545813 988.48956907zM512.00545813 146.8974464c-201.321168 0-365.10910293 163.78138453-365.10910293 365.09600427 0 201.321168 163.78793387 365.10910293 365.10910293 365.10910293 201.31571093 0 365.09709547-163.78793387 365.09709547-365.10910293C877.1025536 310.678832 713.321168 146.8974464 512.00545813 146.8974464z"  ></path></symbol><symbol id="icon-radio-uncheck" viewBox="0 0 1024 1024"><path d="M512 7.13007408C234.323968 7.13007408 7.13007408 234.323968 7.13007408 512s227.19389392 504.86992592 504.86992592 504.86992592 504.86992592-227.19389392 504.86992592-504.86992592S789.676032 7.13007408 512 7.13007408zM512 915.89351348c-222.13791287 0-403.89351348-181.75802787-403.89351348-403.89351348S289.86208713 108.10405925 512 108.10405925 915.89594075 289.86208713 915.89594075 512 734.13791287 915.89351348 512 915.89351348z"  ></path></symbol><symbol id="icon-eye-open" viewBox="0 0 1024 1024"><path d="M515.2 224C208 224 22.4 537.6 22.4 537.6s214.4 304 492.8 304 492.8-304 492.8-304S822.4 224 515.2 224zM832 652.8c-102.4 86.4-211.2 140.8-320 140.8s-217.6-51.2-320-140.8c-35.2-32-70.4-64-99.2-99.2-6.4-6.4-9.6-12.8-16-19.2 3.2-6.4 9.6-12.8 12.8-19.2 25.6-35.2 57.6-70.4 92.8-102.4 99.2-89.6 208-144 329.6-144s230.4 54.4 329.6 144c35.2 32 64 67.2 92.8 102.4 3.2 6.4 9.6 12.8 12.8 19.2-3.2 6.4-9.6 12.8-16 19.2-28.8 32-60.8 67.2-99.2 99.2z" fill="" ></path><path d="M512 345.6c-96 0-169.6 76.8-169.6 169.6 0 96 76.8 169.6 169.6 169.6 96 0 169.6-76.8 169.6-169.6S604.8 345.6 512 345.6z m0 294.4c-67.2 0-121.6-54.4-121.6-121.6 0-67.2 54.4-121.6 121.6-121.6 67.2 0 121.6 54.4 121.6 121.6 0 64-54.4 121.6-121.6 121.6z" fill="" ></path></symbol><symbol id="icon-eye-close" viewBox="0 0 1024 1024"><path d="M515.49297778 629.18428445c-203.28106667 0-392.82460445-109.44284445-494.81500445-285.59587556-14.90261333-25.73084445-6.05297778-58.56256 19.55953778-73.46631111 25.73084445-14.90147555 58.67975111-6.05297778 73.46631111 19.56067555C196.48284445 432.65592889 350.39914667 521.48906667 515.37692445 521.48906667S834.26986667 432.65479111 917.04888889 289.56672c14.90261333-25.73084445 47.73546667-34.57934222 73.46631111-19.67672889s34.46215111 47.73546667 19.67559111 73.46631111C908.31758222 519.74144 718.77404445 629.18314667 515.49297778 629.18314667z m-278.72597333 53.5552c-9.43104 0-19.09418667-2.44394667-27.70944-7.68341334-25.4976-15.36796445-33.64750222-48.43406222-18.27953778-73.81447111l59.37720888-98.26417778c15.36910222-25.4976 48.4352-33.53144889 73.8156089-18.27953777 25.4976 15.36796445 33.64750222 48.43406222 18.2784 73.8144711l-59.3772089 98.26417778c-10.12963555 16.64910222-27.82663111 25.96408889-46.1050311 25.96408889z m554.5415111 0c-18.16234667 0-35.97653333-9.19665778-46.1050311-25.96295112l-59.37834667-98.26417778c-15.36796445-25.4976-7.21806222-58.44650667 18.16234667-73.8144711 25.4976-15.36796445 58.44764445-7.21806222 73.81560888 18.16234666l59.37720889 98.26417778c15.36796445 25.4976 7.21806222 58.44764445-18.16234667 73.81560889-8.61525333 5.23832889-18.27953778 7.80060445-27.70944 7.80060444z m-275.81553777 69.97333333c-29.68917333 0-53.78958222-24.10040889-53.78958223-53.78958223v-123.52853333c0-29.68917333 24.10040889-53.78958222 53.78958223-53.78958222 29.68917333 0 53.78958222 24.10040889 53.78958222 53.78958222v123.52853333c0 29.68917333-24.10040889 53.78958222-53.78958222 53.78958223z" fill="#707070" ></path></symbol><symbol id="icon-checkbox-three" viewBox="0 0 1024 1024"><path d="M1012.51436242 941.01231019V82.98768981a71.50205225 71.50205225 0 0 0-71.50205223-71.50205223H82.98768981a71.50205225 71.50205225 0 0 0-71.50205223 71.50205223v858.02462038a71.50205225 71.50205225 0 0 0 71.50205223 71.50205223h858.02462038a71.50205225 71.50205225 0 0 0 71.50205223-71.50205223z m-143.00410448-71.50205225H154.48974206V154.48974206h715.02051588v715.02051588z"  ></path><path d="M297.49384493 297.49384493h429.01231014v429.01231014H297.49384493z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)



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

    // 如父类支持属性则生成默认值及属性集合
    if (base && base.__properties)
    {
        prototype.__defaults = Object.create(base.__defaults);
        prototype.__properties = Object.create(base.__properties);
    }

    if (fn)
    {
        fn.call(prototype, Class, base);
        ctor = Class.ctor;
    }

    // 类初始化
    if (fn = prototype.__class_init)
    {
        fn.call(prototype, Class, base);
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


    this.addYear = function (value) {

        this.setFullYear(this.getFullYear() + (value | 0));
        return this;
    };


    this.addMonth = function (value) {

        this.setMonth(this.getMonth() + (value | 0));
        return this;
    };


    this.addDate = function (value) {

        this.setDate(this.getDate() + (value | 0));
        return this;
    };



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



    
    // 定义属性方法
    return function (name, options) {

        if (/\W/.test(name))
        {
            throw '"' + name + '" not a valid property name!'; 
        }

        if (options == null)
        {
            options = { defaultValue: null };
        }
        else if (typeof options !== 'object')
        {
            options = { defaultValue: options };
        }
        
        var type = options.type,
            defaultValue = options.defaultValue,
            convertor = options.convertor || null,
            alias = options.name || (options.name = name);

        if (defaultValue === void 0)
        {
            options.defaultValue = defaultValue = null;
        }

        this.__defaults[name] = defaultValue;

        if (!type)
        {
            options.type = type = typeof defaultValue;
        }

        switch (type)
        {
            case 'boolean':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_boolean), alias);
                break;

            case 'int':
            case 'integer':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_integer), alias);
                break;

            case 'number':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_number), alias);
                break;

            case 'string':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_string), alias);
                break;

            case 'date':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_date), alias);
                break;

            default:
                options.get = get(name, alias);
                options.set = set(name, convertor, alias);
                break;
        }

        this['__convert_' + name] = [alias, options.convertor = convertor];

        define(this, name, this.__properties[name] = options);
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



    Class.mixin = function (target) {

        target.on = prototype.on;
        target.once = prototype.once;
        target.off = prototype.off;
        target.trigger = prototype.trigger;
    }



});




(function () {



    var Event = yaxi.Event;

    
    // 滑动事件按下时的状态
    var start = Object.create(null);


    // longTap定时器
    var delay = 0;


    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();


    // 正在输入的控件
    var input;

 


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
    


	document.addEventListener('touchstart', function (event) {
		
        var control = findControl(event.target);

        if (control)
        {
            var touch = event.changedTouches[0];

            start.swipe = 0;
            start.tap = start.longTap = true;

            start.dom = event.target;
            start.control = control;
            start.screenX = touch.screenX;
            start.screenY = touch.screenY;

            // 提交输入
            if (input && input !== control)
            {
                input.__on_change && input.__on_change();
                input = null;
            }

            if (control.trigger(touchEvent(event, touch)) === false)
            {
                cancelTap();
                return false;
            }

            delay = setTimeout(longTapDelay, 600);
        }
        
	}, true);


	document.addEventListener('touchmove', function (event) {
        
        var control = start.control;

        if (control)
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

                if (any = control.__on_tap)
                {
                    any.call(control, event.dom);
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
        
        var control = start.control;

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (control)
        {
            start.control = null;
            return control.trigger(touchEvent(event));
        }

    }, true);



    document.addEventListener('input', function (event) {

        var control = findControl(event.target);

        if (control)
        {
            var e = new Event();

            input = control;

            e.type = 'input';
            e.dom = event.dom;
            e.text = event.target.value;

            return control.trigger(e);
        }

    }, true);


    document.addEventListener('change', function () {

        var control = findControl(event.target);

        if (control)
        {
            var fn = control.__on_change;
            
            input = null;

            fn && fn.call(control);

            var e = new Event();

            e.type = 'change';
            e.dom = event.target;

            return control.trigger('change');
        }

    }, true);



    
    document.addEventListener('keydown', listener, true);

    document.addEventListener('keypress', listener, true);

    document.addEventListener('keyup', listener, true);


    document.addEventListener('focus', listener, true);

    document.addEventListener('blur', listener, true);


    document.addEventListener('scroll', listener, true);



    function listener(event) {

        var control = findControl(event.target);

        if (control)
        {
            var e = new Event();

            e.type = event.type;
            e.dom = event.target;
            e.original = event;

            return control.trigger(e);
        }
    }



})();




yaxi.Observe = Object.extend.call({}, function (Class) {



    var create = Object.create;
    


    Class.ctor = function (data) {

        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }
    }



    // 初始化数据
    this.__init = function (data) {

        var changes = this.__changes = {},
            convert,
            any;

        for (var name in data)
        {
            if (convert = this['__convert_' + name])
            {
                // 默认转换器
                if (any = convert[0])
                {
                    changes[any] = (any = convert[1]) ? any(data[name]) : data[name];
                }
                else // 自定义转换器
                {
                    convert[1].call(this, data[name]);
                }
            }
            else if (convert !== false)
            {
                this[name] = data[name];
            }
        }
    }



    
    this.__defaults = Object.create(null);

    this.__properties = Object.create(null);


    // 定义多个属性方法
    this.$properties = function (properties) {

        for (var name in properties)
        {
            this.$property(name, properties[name]);
        }
    }

    
    // 定义属性
    this.$property = yaxi.__extend_properties(function (name, alias) {

        return function () {

            var value = this.__changes;
            return value && (value = value[alias]) !== void 0 ? value : this.$storage[alias];
        }

    }, function (name, convertor, alias) {

        return function (value) {

            var changes = this.__changes;

            if (convertor)
            {
                value = convertor(value);
            }

            if (changes)
            {
                if (value === changes[alias])
                {
                    return;
                }

                if (value !== this.$storage[alias])
                {
                    changes[alias] = value;
                }
                else
                {
                    delete changes[alias];
                }
            }
            else if (value !== this.$storage[alias])
            {
                patch(this)[alias] = value;
            }
        }

    });



    // 不处理Class属性
    this.__convert_Class = false;



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




    // 转换bindings
    this.__convert_bindings = [0, function (data) {

        var model;

        if (data && (model = this.model = this.__find_model()))
        {
            this.__bindings = model.$bind(this, data);
        }
    }];





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
            item;

        for (var i = 0, l = list.length; i < l; i++)
        {
            if (item = list[i])
            {
                item.__update_patch();
            }
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

    

});




yaxi.Style = yaxi.Observe.extend(function (Class, base) {
    
    

    var create = Object.create;
    


    Class.ctor = function (data) {

        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }
    }
    


    this.$properties((function () {

        var properties = {},
            style = document.createElement('div').style,
            regex = /^(?:webkit|ms|moz|o)([A-Z])/;

        function replace(_, key) {

            return key.toLowerCase();
        }

        for (var name in style)
        {
            switch (name)
            {
                case 'cssFloat':
                case 'styleFloat':
                    properties.float = { name: name, defaultValue: '' };
                    break;

                case 'cssText':
                    break;

                default:
                    properties[name.replace(regex, replace)] = { name: name, defaultValue: '' };
                    break;
            }
        }

        return properties;

    })());



    this.__update_patch = function () {

        var dom = this.parent.$dom,
            changes;

        if (dom && (changes = this.__changes))
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


    // 绑定的目标
    var bindingTarget = [];

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
            defaults = prototype.__defaults = extend(null),
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

        prototype.__properties = extend(null);
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;
        
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

    }, function (name, convertor) {

        var watches = watchKeys;

        return function (value) {

            var any = this.$storage;

            if (convertor)
            {
                value = convertor(value);
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

        for (var name in bindings)
        {
            var binding = bindings[name],
                value = model[binding.name],
                pipe = binding.pipe;

            if (pipe)
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
                binding.pipe = pipe = yaxi.pipe(pipe);
            }

            value = model[binding.name];
            observe[binding.property = name] = pipe ? pipe(value) : value;
    
            return binding;
        }

        throw 'binding expression is invalid! no binding name!';
    }


    // 绑定
    this.$bind = function (observe, bindings) {

        try
        {
            var keys = observe.__bindings = {},
                expression;

            for (var name in bindings)
            {
                if (expression = bindings[name])
                {
                    keys[name] = compileBinding(this, observe, name, expression);
                }
            }
        }
        finally
        {
            bindingTarget = null;
        }
    }


    // 解除绑定
    this.$unbind = function (observe) {

        var bindings, binding, items;

        if (bindings = observe.__bindings)
        {
            for (var name in bindings)
            {
                if ((binding = bindings[name]) && (items = binding.model.__bindings))
                {
                    for (var i = items.length; i--;)
                    {
                        if (items[i] === binding)
                        {
                            items.splice(i, 1);
                            break;
                        }
                    }
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
            var storage = this.$storage || (this.$storage = {});

            for (var name in data)
            {
                if (convert = this['__convert_' + name])
                {
                    storage[name] = convert[1] ? convert[1](data[name]) : data[name];
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

        this.$storage = create(this.__defaults);

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
                push.apply(this, createModels(this, arguments, 0, [], 'push'));
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
                list[i].$parent = null;
                list[i].__bindings = null;
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


    this.reject = function (reason, abort) {

        var fn = this.__fail,
            next = this.__next;

        if (fn)
        {
            abort = true;

            try
            {
                if (fn.call(this, reason, next) === false)
                {
                    return false;
                }
            }
            catch (error)
            {
                reason = error.message || error || reason;
                abort = false;
            }
        }

        if (next)
        {
            next.reject(reason, abort);
        }
        else if (!abort) // 处理过则不再抛出异常
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




/**
 * 本部分代码从flyingon或yaxi框架中相关代码修改而来
 */


// http
(function (yaxi) {



    var http = yaxi.http = Object.create(null);

    var enctype = 'application/x-www-form-urlencoded';

    
    
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


    
    function send(method, url, data, options) {

        var stream = new yaxi.Stream(),
            ajax = stream.ajax = new XMLHttpRequest(),
            type,
            any;

        options = options || {};
        options.method = method;
        options.url = url;
        options.data = data;
        
        if (/get|head|options/i.test(method))
        {
            if (data)
            {
                url = url + (url.indexOf('?') >= 0 ? '&' : '?') + encodeData(data);
                data = null;
            }
        }
        else if ((type = options.contentType) === enctype)
        {
            data = encodeData(data);
        }
        else if (typeof data !== 'string')
        {
            type = 'application/json';
            data = JSON.stringify(data);
        }
        
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
                if (http.timeout)
                {
                    clearTimeout(http.timeout);
                    http.timeout = 0;
                }

                if (this.status >= 100 && this.status < 300)
                {
                    if (this.status === http.redirectStatus)
                    {
                        http.redirect();
                    }
                    else
                    {
                        stream.resolve(this.responseText || this.responseXML);
                    }
                }
                else
                {
                    stream.reject({
                        url: url,
                        status: this.status,
                        message: this.statusText || this.responseText
                    });
                }
                
                // 清除引用
                this.onreadystatechange = null;
            }
        }

        ajax.open(method, url, options.async !== false);
        
        if (type)
        {
            ajax.setRequestHeader('Content-Type', type);
            // ajax.setRequestHeader('Content-Length', data.length);
        }

        if (any = options.header)
        {
            for (var name in any)
            {
                ajax.setRequestHeader(name, any[name]);
            }
        }

        http.timeout = setTimeout(function () {

            ajax.abort();

            stream.reject({
                url: url,
                status: 'timeout',
                message: http.timeoutText
            });

        }, options.timeout || 60000);

        ajax.send(data);

        return stream;
    }



    // 重定向状态码
    http.redirectStatus = 299;


    // 超时提醒
    http.timeoutText = '请求超时!';


    // 重定向
    http.redirect = function () {
        
        location.href = 'index.html';
    }


    http.send = function (method, url, data, options) {

        return send(method || 'GET', url, data, options);
    }


    http.head = function (url, data, options) {

        return send('HEAD', url, data, options);
    }


    http.get = function (url, data, options) {

        return send('GET', url, data, options);
    }


    http.post = function (url, data, options) {

        return send('POST', url, data, options);
    }


    http.put = function (url, data, options) {

        return send('PUT', url, data, options);
    }
    

    http.del = function (url, data, options) {

        return send('DELETE', url, data, options);
    }



})(yaxi);








(function (color) {


    color.back = '#ffffff';


    color.default1 = '#000000';
    color.default2 = '#606266';
    color.default3 = '#c0c4cc';
    color.default4 = '#e0e0e0';
    color.default5 = '#f8f8f8';
    
    
    color.primary1 = '#3a8ee6';
    color.primary2 = '#66b1ff';
    color.primary3 = '#8cc5ff';
    color.primary4 = '#b3d8ff';
    color.primary5 = '#d9ecff';
    
    
    color.second1 = '#66b1ff';
    color.second2 = '#8cc5ff';
    color.second3 = '#b3d8ff';
    color.second4 = '#d9ecff';
    color.second5 = '#e9fcff';
    
    
    color.success1 = '#5daf34';
    color.success2 = '#85ce61';
    color.success3 = '#a4da89';
    color.success4 = '#c2e7b0';
    color.success5 = '#f0f9eb';
    
    
    color.warning1 = '#cf9236';
    color.warning2 = '#ebb563';
    color.warning3 = '#f0c78a';
    color.warning4 = '#f5dab1';
    color.warning5 = '#fdf6ec';
    
    
    color.danger1 = '#dd6161';
    color.danger2 = '#f78989';
    color.danger3 = '#f9a7a7';
    color.danger4 = '#fbc4c4';
    color.danger5 = '#fef0f0';
    
    
    color.disabled1 = '#82848a';
    color.disabled2 = '#a6a9ad';
    color.disabled3 = '#bcbec2';
    color.disabled4 = '#d3d4d6';
    color.disabled5 = '#f4f4f5';
    
    
    color.icon1 = '#000000';
    color.icon2 = '#3a8ee6';
    color.icon3 = '#66b1ff';
    color.icon4 = '#5daf34';
    color.icon5 = '#cf9236';
    color.icon6 = '#dd6161';
    color.icon7 = '#82848a';
    
    
    color.headerBack = '#f8f8f8';
    color.headerFont = '#ffffff';
    color.headerBorder = '#c0c4cc';


    color.mask = '#000000';

    color.toastBack = '#606060';
    color.toastFont = '#ffffff';
    color.toastBorder = '#606060';


    (yaxi.colors || (yaxi.colors = Object.create(null))).default = color;
    
    

})(yaxi.color = Object.create(null));




yaxi.Control = yaxi.Observe.extend(function (Class, base) {


    
    var eventTarget = yaxi.EventTarget.prototype;


    // 注册的控件类集合
    var Controls = yaxi.Controls = Object.create(null);



    
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
    

    // 自定义key
    this.$property('key', '');
    

    // 自定义tag
    this.$property('tag', null);




    // 样式集
    Object.defineProperty(this, 'style', {

        get: function () {

            return this.__style || (this.__style = new yaxi.Style());
        }
    });

    
    this.__convert_style = [0, function (data) {
     
        this.__style = new yaxi.Style(data);
    }];




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



    this.__set_events = false;


    this.__convert_events = [0, function (events) {

        for (var name in events)
        {
            this.on(name, events[name]);
        }
    }];




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

        var bindings, any;

        if (any = this.$dom)
        {
            any.$control = this.$dom = null;
        }

        if (bindings = this.__bindings)
        {
            for (var name in bindings)
            {
                if ((any = bindings[name]) && (any = any.model))
                {
                    any.$unbind(name, this);
                }
            }
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
        }

        if (this.__event_keys)
        {
            this.off();
        }
        
        if (this.ondestroy)
        {
            this.ondestroy();
        }

        this.parent = null;
        this.destroyed = true;
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
            any.parent = this;
            any.__update_patch();
        }

        if (any = this.__events)
        {
            any.__update_patch();
        }

        return dom;
    }



    this.__update_patch = function () {

        var changes;

        if (changes = this.__changes)
        {
            var storage = this.$storage,
                dom = this.$dom,
                value,
                fn;

            for (var name in changes)
            {
                storage[name] = value = changes[name];

                if (fn = this['__set_' + name])
                {
                    fn.call(this, dom, value);
                }
                else if (fn !== false)
                {
                    if (name in dom)
                    {
                        (fn = updateDom(name, value)).call(this, dom, value);
                    }
                    else
                    {
                        fn = false;
                    }

                    this.constructor.prototype['__set_' + name] = fn;
                }
            }

            this.__changes = null;
        }
    }

    
    this.__set_key = this.__set_tag = false;


    this.__set_className = function (dom, value) {

        dom.className = value ? this.$className + ' ' + value : this.$className;
    }


    this.__set_theme = function (dom, value) {

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



}).register('Control');




yaxi.container = function (base, nopulldown) {



    // 布局类型
    this.$property('layout', '');



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



    this.__set_layout = function (dom, value) {

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

        if (control = this.__loading)
        {
            control.show(dom);

            if (control.load)
            {
                control.index = 0;
                control.load.call(this, control);
            }
        }

        return dom;
    }



    // 不支持pulldown及loading
    if (nopulldown)
    {
        return;
    }


    

    
    var pulldown, overflowY;



    // loading设置
    Object.defineProperty(this, 'loading', {
    
        get: function () {

            return this.__loading;
        },
        set: function (value) {

            if (value)
            {
                var loading;

                if (typeof value === 'function')
                {
                    loading = new yaxi.Loading();
                    loading.load = value;
                }
                else
                {
                    if (typeof value.load !== 'function')
                    {
                        throw 'loading load must be a function!'
                    }
                    
                    if (!(value instanceof yaxi.Loading))
                    {
                        loading = new yaxi.Loading(value);
                    }
                }

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
                var pulldown;

                if (typeof value === 'function')
                {
                    pulldown = new yaxi.Pulldown();
                    pulldown.refresh = value;
                }
                else
                {
                    if (typeof value.refresh !== 'function')
                    {
                        throw 'pulldown refresh must be a function!'
                    }

                    if (!(value instanceof yaxi.Pulldown))
                    {
                        pulldown = new yaxi.Pulldown(value);
                    }
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


    function scroll(event) {

        var loading = this.__loading;

        if (!pulldown && loading && !loading.completed && this.scrollTop + (this.offsetHeight << 1) > this.scrollHeight)
        {
            loading.index++;
            loading.load.call(this, loading);
        }
    }


    function touchmove(event) {

        var start = event.start;

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

        if (!start.swipe && this.pulldown && this.$dom.scrollTop < 1 &&
            (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var style = this.$dom.style;

            // 以当前控件和位置开始滑动
            start.swipe = 2;
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
                if (pulldown.stop())
                {
                    pulldown.refresh.call(this, pulldown);
                }

                pulldown = null;
            
                event.stop();
                return false;
            }
            else
            {
                pulldown = null;
            }
        }
    }


}




yaxi.Panel = yaxi.Control.extend(function (Class, base) {

    
    
    var create = Object.create;

    

    yaxi.template(this, '<div class="yx-control yx-panel"></div>');



    
    Class.ctor = function (data) {
 
        this.$storage = create(this.__defaults);

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


    this.__convert_children = [0, function (value) {
      
        if (value && value.length > 0)
        {
            this.__children.__init(this, value);
        }
    }];


    // 子控件类型
    this.__child_class = yaxi.Control;




    // 扩展容器功能
    yaxi.container.call(this, base);




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
    


    this.__set_text = function (dom, value) {

        dom.textContent = value;
    }



}).register('Button');




yaxi.Carousel = yaxi.Panel.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-panel yx-carousel"></div>');



    



}).register('Carousel');




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

        var changes, dom;

        if (changes = this.__changes)
        {
            // 第二个以后是要移除节点
            if (changes.length > 2)
            {
                this.__remove_patch(changes);
            }

            // 第二个参数是增加的子控件集合
            if (changes[1].length > 0 && (dom = this.owner.$dom))
            {
                this.__insert_patch(changes[1], dom);
            }

            // 第一个参数是否排序
            if (changes[0] && (dom || (dom = this.owner.$dom)))
            {
                this.__sort_patch(dom);
            }

            this.__changes = null;
        }
    }


    this.__insert_patch = function (controls, dom) {

        var last = dom.lastChild;

        for (var i = 0, l = controls.length; i < l; i++)
        {
            var control = controls[i];

            if (control.parent === this)
            {
                dom.appendChild(control.$dom || control.render());
            }
        }

        // 把loading放到最后
        if (last.$control instanceof yaxi.Loading)
        {
            dom.appendChild(last);
        }
    }


    this.__remove_patch = function (changes) {

        var control, dom, parent;

        for (var i = 2, l = changes.length; i < l; i++)
        {
            if ((control = changes[i]) === this)
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

        var index = 0,
            node = dom.firstChild,
            item,
            control;

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


});




yaxi.HtmlControl = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-htmlcontrol"></div>');



    // html
    this.$property('html', '');



    this.__set_html = function (dom, value) {

        dom.innerHTML = value;
    }



}).register('HtmlControl');




yaxi.Icon = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-icon"></span>');
    
    

    // 图标类名
    this.$property('icon', '');


    // svg图标id
    this.$property('svg', '');

    
    // svg颜色
    this.$property('fill', '');




    this.__set_icon = function (dom, value) {

        var classList = dom.classList,
            icon = this.__icon_;

        if (icon)
        {
            dom.classList.remove(icon);
        }

        if (this.__icon_ = value)
        {
            dom.classList.add(value);
        }
    }


    this.__set_svg = function (dom, value) {

        dom.innerHTML = value ? '<svg aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>' : '';
    }


    
    this.__set_fill = function (dom, value) {

        if (dom = dom.firstChild)
        {
            dom.style.fill = value;
        }
    }



}).register('Icon');





yaxi.IconButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-iconbutton"><span class="yx-icon"></span><span></span></span>');



    // 文本内容
    this.$property('text', '');


    // 图标类名
    this.$property('icon', '');


    // svg图标id
    this.$property('svg', '');


    // svg颜色
    this.$property('fill', '');

    
    // 图标大小
    this.$property('size', '');
    



    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_icon = function (dom, value) {

        var classList = dom.firstChild.classList,
            icon = this.__icon_;

        if (icon)
        {
            classList.remove(icon);
        }

        if (this.__icon_ = value)
        {
            classList.add(value);
        }
    }


    this.__set_svg = function (dom, value) {

        dom.firstChild.innerHTML = value ? '<svg aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>' : '';
    }


    this.__set_fill = function (dom, value) {

        if (dom = dom.firstChild.firstChild)
        {
            dom.style.fill = value;
        }
    }


    this.__set_size = function (dom, value) {

        dom.firstChild.style.fontSize = value;
    }



}).register('IconButton');




yaxi.Image = yaxi.Control.extend(function () {



    yaxi.template(this, '<img class="yx-control yx-image"></img>');
    
    

    // 图标路径
    this.$property('src', '');



}).register('Image');




yaxi.Loading = yaxi.Control.extend(function (Class) {


    Class['en-US'] = {
        end: 'no more data',
        empty: 'no data',
        loading: 'loading, please wait...'
    };


    Class['zh-CN'] = {
        end: '没有更多数据了',
        empty: '无数据',
        loading: '正在加载, 请稍候...'
    };


    Class['zh-TW'] = {
        end: '沒有更多數據了',
        empty: '無數據',
        loading: '正在加載, 請稍候...'
    };


    yaxi.template(this, '<div class="yx-loading"><span class="yx-loading-img"></span><span></span></div>');
    
    

    this.$property('emptyText', '');

    this.$property('endText', '');
    
    this.$property('loadingText', '');



    // 显示loading
    this.show = function (host) {

        var dom = this.$dom || this.render();

        this.index = 0;
        this.completed = false;

        dom.firstChild.style.display = '';
        dom.lastChild.innerHTML = this.loadingText || Class[yaxi.language].loading;

        (host.$dom || host).appendChild(dom);
    }


    // 加载完毕
    this.done = function (empty) {

        var i18n = Class[yaxi.language];

        this.completed = true;
        this.$dom.firstChild.style.display = 'none';
        this.$dom.lastChild.innerHTML = empty ? this.emptyText || i18n.empty : this.endText || i18n.end;
    }


    // 隐藏loading
    this.hide = function () {

        var dom = this.$dom,
            parent;

        if (dom && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
        }
    }



}).register('Loading');




yaxi.ProgressBar = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-progressbar"><div></div></div>');



    this.$property('value', 0);



    this.__set_value = function (dom, value) {

        dom.firstChild.style.width = value + '%';
    }



}).register('ProgressBar');




yaxi.Pulldown = yaxi.Control.extend(function (Class) {



    Class['en-US'] = {
        pulldown: 'pulldown to refresh',
        release: 'release refresh',
        loading: 'loading, please wait...'
    };


    Class['zh-CN'] = {
        pulldown: '下拉刷新',
        release: '放开刷新',
        loading: '正在加载, 请稍候...'
    };


    Class['zh-TW'] = {
        pulldown: '下拉重繪',
        release: '放開重繪',
        loading: '正在加載, 請稍候...'
    };



    yaxi.template(this, '<div class="yx-control yx-pulldown" style="height:0;">' +
            '<span class="yx-pulldown-body">' +
                '<svg aria-hidden="true"><use xlink:href="#icon-pulldown"></use></svg>' +
                '<span class="yx-loading-img" style="display:none;"></span>' +
                '<span></span>' +
            '</span>' +
        '</div>');




    this.$property('pulldownText', '');

    this.$property('releaseText', '');
    
    this.$property('loadingText', '');



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
                text = this.releaseText || Class[yaxi.language].release;
            }
            else
            {
                transform = '';
                text = this.pulldownText || Class[yaxi.language].pulldown;
            }

            dom = dom.firstChild;
            dom.firstChild.style.transform = transform;
            dom.lastChild.innerHTML = text;

            style.height = offset + 'px';
        }
    }


    this.stop = function () {

        var dom = this.$dom,
            style = dom.style;

        style.transition = 'height 600ms ease';

        if (this.ready)
        {
            style.height = '.5rem';

            dom = dom.firstChild.firstChild;
            dom.style.display = 'none';
    
            dom = dom.nextSibling;
            dom.style.display = '';
    
            dom = dom.nextSibling;
            dom.innerHTML = this.loadingText || Class[yaxi.language].loading;

            return true;
        }

        style.height = 0;
        setTimeout(this.hide.bind(this), 600);
    }


    this.hide = function () {

        var dom = this.$dom,
            parent;

        if (dom && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
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




yaxi.Slider = yaxi.Control.extend(function (Class, base) {



	var create = Object.create;

    var thumb = '<svg class="yx-slider-thumb" aria-hidden="true"><use xlink:href="#icon-circle"></use></svg>';



    yaxi.template(this, '<div class="yx-control yx-slider"><div class="yx-slider-line"></div><div class="yx-slider-body">' + thumb + '</div>');




    Class.ctor = function (data) {

        // 初始化存储值
        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }

        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchcancel);
    }




    // 最小值
    this.$property('min', 0);


    // 最大值
    this.$property('max', 100);


    // 当前值
    this.$property('value', 0);


    // 步进
    this.$property('step', 1);


    // 分段
    this.$property('steps', null);


    // 是否强制到分段值
    this.$property('force', true);

    
    // 空间
    this.$property('space', '');




    this.__set_value = function (dom, value) {

        var min = this.min;
        dom.lastChild.lastChild.style.left = (value - min) * 100 / (this.max - min) + '%';
    }


    this.__set_steps = function (dom, value) {

        value = value && value.length > 0 ? render.call(this, value) : '';
        dom.lastChild.innerHTML = value + thumb;
    }


    this.__set_space = function (dom, value) {

        dom = dom.firstChild;

        while (dom)
        {
            dom.style.left = dom.style.right = value;
            dom = dom.nextSibling;
        }
    }



    function render(steps) {

        var array = [],
            min = this.min,
            max = this.max,
            long = max - min;

        for (var i = 0, l = steps.length; i < l; i++)
        {
            array.push('<svg class="yx-slider-node" aria-hidden="true" style="left:',
                (steps[i] - min) * 100 / long,
                '%;"><use xlink:href="#icon-hollow-circle"></use></svg>');
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
            if (target.classList && target.classList.contains('yx-slider-thumb'))
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

        var value = (event.clientX - state.left) / state.width,
            any;

        state.thumb = null;

        if (value < 0)
        {
            value = 0;
        }
        else if (value > 1)
        {
            value = 1;
        }

        value = (any = this.min) + (this.max - any) * value;

        if (any = this.step)
        {
            value = any * Math.round(value / any);
        }

        if (this.force && (any = this.steps))
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
            this.trigger('change', { value: value });
        }
        else
        {
            this.__set_value(this.$dom, value);
        }

        event.stop();
        return false;
    }


    function touchcancel() {

        this.__set_value(this.$dom, this.value);
    }



}).register('Slider');




yaxi.SwipePanel = yaxi.Panel.extend(function (Class, base) {


    
    yaxi.template(this, '<div class="yx-control yx-panel yx-swipepanel"></div>');



    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);

        this.index = 0;
        
        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchcancel);
    }


    
    function touchstart() {

        var next = this.__children[this.index + 1],
            lazy;

        swipe = false;

        if (next && (lazy = next.lazy) && !next.__lazyed)
        {
            if (typeof lazy === 'function')
            {
                lazy.call(next);
            }
            else
            {
                for (var name in lazy)
                {
                    next[name] = lazy[name];
                }
            }

            next.__lazyed = true;
        }
    }


    function touchmove(event) {

        var start = event.start;

        switch (start.swipe)
        {
            case 1:
                swipeMove.call(this, event);
                event.stop();
                return false;

            case 2:
                return;

            default:
                var x = event.distanceX,
                    y = event.distanceY;

                x = x < 0 ? -x : x;
                y = y < 0 ? -y : y;

                if (x > 16 && x > y + 4)
                {
                    // 以当前控件和位置开始滑动
                    start.swipe = 1;
                    start.control = this;
                    start.screenX = event.screenX;
                    start.screenY = event.screenY;

                    swipeMove.call(this, event);

                    event.stop();
                    return false;
                }
                break;
        }
    }


    function touchend(event) {


    }


    function touchcancel(event) {


    }



    function swipeMove(event) {

        var index = this.index,
            x = event.distanceX;

        // 向左滑
        if (x < 0)
        {
            if (index > 0)
            {

            }
        }
        else
        {
            var children = this.__children;
        
            if (index < children.length - 1)
            {

            }
        }
    }


    function swipeEnd() {


    }


    

}).register('SwipePanel');




yaxi.Tab = yaxi.Panel.extend(function (Class, base) {


    
    yaxi.template(this, '<div class="yx-control yx-panel yx-tab"></div>');


    
    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);
        this.on('tap', handleTap.bind(this));
    }



    function handleTap(event) {

        var target = event.target;

        while (target && target !== this)
        {
            if (target.parent === this)
            {
                if (target.theme !== 'primary')
                {
                    var children = this.children,
                        last;

                    for (var i = children.length; i--;)
                    {
                        if ((last = children[i]) && last.theme === 'primary')
                        {
                            last.theme = '';
                            break;
                        }
                    }

                    target.theme = 'primary';

                    this.trigger('selected-change', {

                        current: target,
                        last: last
                    });
                }

                break;
            }

            target = target.parent;
        }
    }

    

}).register('Tab');




yaxi.Text = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-text"></span>');



    this.$property('text', '');



    this.__set_text = function (dom, value) {

        dom.textContent = value;
    }



}).register('Text');




yaxi.TextBox = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox"><input type="text" /></span>');




    this.$property('text', '');

    
    this.$property('placeholder', '');



    
    Object.defineProperty(this, 'displayText', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.firstChild.value : '';
        }
    });



    this.__set_text = function (dom, value) {

        dom.firstChild.value = value;
    }


    this.__set_placeholder = function (dom, value) {

        dom.firstChild.placeholder = value;
    }


    
    this.__on_change = function () {

        this.text = this.$dom.firstChild.value;
    }



}).register('TextBox');




yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-checkbox"><svg aria-hidden="true"><use xlink:href="#icon-checkbox-uncheck"></use></svg><span></span></span>');




    this.$property('text', '');
    

    this.$property('fill', '');

    
    this.$property('checked', false);

    


    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_checked = function (dom, value) {

        dom.firstChild.firstChild.setAttribute('xlink:href', '#icon-checkbox-' + (value ? 'checked' : 'uncheck'));
    }


    this.__set_fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }



    this.__on_tap = function () {

        this.checked = !this.checked;
        this.trigger('change');
    }



}).register('CheckBox');




yaxi.Memo = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-memo"><textarea></textarea></span>');




    this.$property('text', '');

    
    this.$property('placeholder', '');




    Object.defineProperty(this, 'displayText', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.firstChild.value : '';
        }
    });




    this.__set_text = function (dom, value) {

        dom.firstChild.value = value;
    }


    this.__set_placeholder = function (dom, value) {

        dom.firstChild.placeholder = value;
    }



    this.__on_change = function () {

        this.text = this.$dom.firstChild.value;
    }



}).register('Memo');




yaxi.Number = yaxi.TextBox.extend(function () {


    yaxi.template(this, '<span class="yx-control yx-textbox yx-number"><input type="number" /></span>');


}).register('Number');




yaxi.Password = yaxi.TextBox.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox yx-password"><input type="password" /><span><svg aria-hidden="true"><use xlink:href="#icon-eye-close"></use></svg></span></span>');




    this.$property('type', '');




    this.__set_type = function (dom, value) {

        dom.lastChild.className = value ? 'yx-password-' + value : '';
    }


    this.__on_tap = function (target) {

        var dom = this.$dom,
            icon;

        while (target && target !== dom)
        {
            if (target.tagName === 'SPAN')
            {
                dom = dom.firstChild;
                
                if (dom.type === 'text')
                {
                    dom.type = 'password';
                    icon = 'eye-close';
                }
                else
                {
                    dom.type = 'text';
                    icon = 'eye-open';
                }

                target.firstChild.firstChild.setAttribute('xlink:href', '#icon-' + icon);
                return;
            }

            target = target.parentNode;
        }
    }




}).register('Password');




yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-radiobutton"><svg aria-hidden="true"><use xlink:href="#icon-radio-uncheck"></use></svg><span></span></span>');




    this.$property('text', '');

    this.$property('fill', '');
    
    this.$property('checked', false);

    


    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_checked = function (dom, value) {

        dom.firstChild.firstChild.setAttribute('xlink:href', '#icon-radio-' + (value ? 'checked' : 'uncheck'));
    }


    this.__set_fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }


    this.__on_tap = function () {

        this.checked = !this.checked;
        this.trigger('change');
    }



}).register('RadioButton');




yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-switchbutton"><span class="yx-switchbutton-bar"></span><span class="yx-switchbutton-button"></span></span>');




    this.$property('checked', false);
    



    this.__set_checked = function (dom, value) {

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

        this.checked = !this.checked;
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

		this.$storage = create(this.__defaults);

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
	this.$property('autoDestroy', true);

		


	this.__convert_header = [0, function (data) {
		
		var control;

		if (data && typeof data === 'object')
		{
			control = new (data.Class || yaxi.Panel)(data);
		}
		else
		{
			control = new yaxi.Panel({
				children: [
					{
						Class: yaxi.BackButton
					},
					{
						Class: yaxi.Title,
						text: data
					}
				]
			});
		}
		
		control.parent = this;
		control.key = 'page-header';
		control.$className = 'yx-header';

		this.__children.push(this.header = control);
	}];
	
	
	this.__convert_content = [0, function (data) {
		
		var control;
		
		if (data && typeof data === 'object')
		{
			control = new (data.Class || yaxi.Panel)(data);
		}
		else
		{
			control = new yaxi.Text();
			control.text = data;
		}

		control.parent = this;
		control.key = 'page-content';
		control.$className = 'yx-content';

		this.__children.push(this.content = control);
	}];
	
	
	this.__convert_footer = [0, function (data) {
	
		var control;

		if (data && typeof data === 'object')
		{
			control = new (data.Class || yaxi.Panel)(data);
		}
		else
		{
			control = new yaxi.Text();
			control.text = data;
		}

		control.parent = this;
		control.key = 'page-footer';
		control.$className = 'yx-footer';

		this.__children.push(this.footer = control);
	}];

	

	function onfocus(event) {

		event.target.blur();
		removeFocusEvent();
	}


	function removeFocusEvent() {

		document.removeEventListener('focus', onfocus, true);
		onfocus.enabled = 0;
	}



	this.__find_up = function () {
	
		return null;
	}

	
	// 扩展容器功能
	yaxi.container.call(this, base, true);




	this.open = function (options) {
				
		var opener = Class.current || null;
		
		if (this.onopening(options) !== false)
		{
			var dom = this.$dom || this.render();

			document.body.appendChild(dom);
			
			Class.current = this;
			
		    this.opener = opener;

			this.onopened(options);
			this.onshow();

			if (!onfocus.enabled)
			{
				document.addEventListener('focus', onfocus, true);
				onfocus.enabled = 1;
			}

			setTimeout(removeFocusEvent, 300);
			
			if (opener)
			{
				opener.$dom.style.display = 'none';
				opener.onhide();
			}
			
			this.trigger('opened');
			
			return true;
		}

		return false;
	}
	
	
	this.close = function (closeType) {
		
		if (this.onclosing(closeType) !== false)
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
			
			return true;
		}
		
		return false;
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
	
	
    
}).register('Page');




yaxi.BackButton = yaxi.Control.extend(function (Class, base) {

    
    
    var create = Object.create;
    


    yaxi.template(this, '<span class="yx-control yx-backbutton yx-icon"><svg aria-hidden="true"><use xlink:href="#icon-back"></use></svg></span>');



    Class.ctor = function (data) {

        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }

        this.on('tap', handleTap.bind(this));
    }


    function handleTap(event) {

        var target = this,
            parent;

        while (parent = target.parent)
        {
            target = parent;
        }

        target.close('BACK');
    }


    
}).register('BackButton');




yaxi.Dialog = yaxi.Page.extend(function (Class, base) {
	
	
	
	var stack = [];
	
	var eventName = 'ontouchstart' ? 'touchstart' : 'mousedown';

    var mask = document.createElement('div');


	mask.className = 'yx-mask';
	


    yaxi.template(this, '<div class="yx-control yx-dialog"></div>');
	



	// 是否自动关闭
	this.$property('autoClose', false);




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

			style.top = (window.innerHeight - dom.offsetHeight >> 1) + 'px';
			style.left = (window.innerWidth - dom.offsetWidth >> 1) + 'px';
		}
	}


	
	this.open = function (options) {
		
		if (stack.indexOf(this) >= 0 || this.onopening(options) === false)
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

		this.onopened(options);
		this.onshow();

		this.trigger('opened');

		stack.push(this);
		computePosition.call(this);

		if (!stack[1])
		{
			document.addEventListener(eventName, checkTap, true);
			window.addEventListener('resize', computePosition, true);
		}

		return true;
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
	
	
	
	var stack = [];
	
	
	
	document.addEventListener('ontouchstart' ? 'touchstart' : 'mousedown', function (event) {
		
		var layer = stack[stack.length - 1];
		
		if (layer)
		{
			var root = layer.$dom,
				node = event.target;
				
			while (node)
			{
				if (node === root)
				{
					return;
				}
				
				node = node.parentNode;
			}

			layer.close();
			
			event.stopPropagation();
			event.preventDefault();
			
			return false;
		}
		
	}, true);
	
	
	
	
	this.show = function (reference, offset) {
		
		var rect = reference.getBoundingClientRect(),
			offsetX = offset ? (offset.x | 0) : 0,
			offsetY = offset ? (offset.y | 0) : 0;
		
		this.showAt(rect.left + offsetX, rect.top + reference.offsetHeight + offsetY);
	}
	
	
	
	this.showAt = function (x, y) {
		
		if (stack.indexOf(this) < 0)
		{
			var dom = this.$dom;
			
			if (!dom)
			{
				dom = this.$dom = this.render();
				dom.classList.add('yx-floatlayer');
			}

			style = dom.style;
			style.left = x > 0 ? x + 'px' : x;
			style.top = y > 0 ? y + 'px' : y;
			
			document.body.appendChild(dom);
			
			stack.push(this);
		}
	}
	
	
	
	this.close = function () {
		
		var layer = stack.pop(),
			parent,
			dom;
		
		if (layer && (dom = this.$dom) && (parent = dom.parentNode))
		{
			parent.removeChild(dom);
		}
	}

	
	
}).register('FloatLayer');




yaxi.showMessage = function (options) {

    var Button = yaxi.Button,
        dialog,
        content,
        callback;

    if (typeof options === 'string')
    {
        options = {
            header: options
        }
    }
    else
    {
        options = options || {};
    }

    if ((content = options.content) && typeof content === 'string')
    {
        content = [
            {
                Class: yaxi.HtmlControl,
                html: content
            }
        ];
    }

    callback = options.callback;

    options = {
        className: 'yx-messagebox',
        header: options.header || yaxi.showMessage.header,
        content: {
            layout: 'row',
            style: {
                alignItems: 'center',
                wordBreak: 'break-word'
            },
            children: content
        },
        footer: {
            subtype: Button,
            children: options.buttons || [
                {
                    key: 'OK',
                    text: Button[yaxi.language].OK
                }
            ],
            events: {

                tap: function (event) {

                    var target = event.target;

                    if (target !== this && target.key && (!callback || callback.call(dialog, target) !== false))
                    {
                        dialog.close();
                    }
                }
            }
        }
    };
    
    dialog = new yaxi.Dialog(options);
    dialog.open();

    return dialog;
}


yaxi.prompt = function (options) {

    var callback = options && options.callback,
        i18n = yaxi.Button[yaxi.language];

    options = options || {};

    callback && (options.callback = function (button) {

        return callback.call(this, this.content.findByKey('input').displayText, button);
    });

    options.content = [
        {
            Class: options.control || (options.password ? yaxi.Password : yaxi.TextBox),
            key: 'input',
            text: options.value || '',
            style: {
                width: '100%',
                margin: '.3rem 0 .2rem',
                borderStyle: 'none none solid none'
            }
        }
    ];

    options.buttons || (options.buttons = [
        {
            theme: 'primary',
            key: 'OK',
            text: i18n.OK
        },
        {
            key: 'Cancel',
            text: i18n.Cancel
        }
    ]);

    return yaxi.showMessage(options);
}




yaxi.Title = yaxi.Control.extend(function (Class) {
    
    

    yaxi.template(this, '<div class="yx-control yx-title"></div>');
    
    


    this.$property('text', '');




    this.__set_text = function (dom, value) {

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

        delay = setTimeout(close, options.time || 2500);
    }


    function close() {

        var any;

        delay = 0;

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
        }

        if (!options)
        {
            return;
        }

        if (typeof options === 'string')
        {
            options = { text: options };
        }
    
        if (options.delay > 0)
        {
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

        if (delay)
        {
            clearTimeout(delay);
        }

        close();
    }

    

}).call(yaxi);
