var yaxi = Object.create(null);



// 当前语言
yaxi.language = navigator.language || navigator.userLanguage || 'en-US';



// 处理rem自适应及支持1px边框问题
(function () {

    var style = document.documentElement.style,
        scale = +window.devicePixelRatio || 1,
        width = window.innerWidth,
        height = window.innerHeight;

    if (scale >= 2)
    {
        scale = (scale * 10000 / 2 | 0) / 10000;
    }

    yaxi.scale = scale;
    
    width = width * scale + .5 | 0;
    height = height * scale + .5 | 0;

    // rem自适应计算（按照375px的宽度，1rem = 100px的比例）
    style.fontSize = (yaxi.rem = (width * 10000 / 375 | 0) / 100) + 'px';
    style.overflow = 'hidden';
    style.width = width + 'px';
    style.height = height + 'px';
    style.transformOrigin = '0 0';
    style.transform = 'scale(' + 1 / scale + ',' + 1 / scale + ')';

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
