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
