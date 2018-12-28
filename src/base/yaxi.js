var yaxi = Object.create(null);



// 当前语言
yaxi.language = navigator.language || navigator.userLanguage || 'en-US';


// 处理rem自适应
// 字体放大两倍, 然后设置页面为2倍屏幕宽度再缩小一半解决无法渲染1px像素问题
document.documentElement.style.fontSize = (yaxi.rem = (window.innerWidth * 2 * 10000 / 375 | 0) / 100) + 'px';



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
