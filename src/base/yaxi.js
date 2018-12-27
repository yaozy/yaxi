var yaxi = Object.create(null);



// 当前语言
yaxi.language = navigator.language || navigator.userLanguage || 'en-US';


// 处理rem自适应及支持1px边框问题
(function () {

    var ratio = window.devicePixelRatio || 1,
        scale = 1 / ratio;

    document.querySelector("meta[name=viewport]").setAttribute('content',
        'width=device-width,initial-scale=' + scale +
        ',maximum-scale=' + scale +
        ',minimum-scale=' + scale +
        ',user-scalable=no');

    // rem自适应计算（按照375px的宽度，1rem = 100px的比例）
    document.documentElement.style.fontSize = (yaxi.rem = window.innerWidth * 100 / 375) + 'px';

})();



// 对象继承实现
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
