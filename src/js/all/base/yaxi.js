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


// 注册的类型集合
yaxi.classes = Object.create(null);


if (typeof jiac !== 'undefined')
{
    jiac.classes = yaxi.classes;
}



// 默认设置类型容器为自身, 框架初始化完毕后清除
yaxi.classHost = yaxi;



// 对象继承实现
Object.extend = function (name, fn, Class, force) {
	
    var base = this.prototype || null;
    var prototype = Object.create(base);
    var classes, ctor;

    if (base && this.sealed)
    {
        throw new Error(this.typeName + ' is sealed, can not be extended!');
    }

    if (typeof name === 'function')
    {
        force = Class;
        Class = fn;
        fn = name;
        name = '';
    }
    else if (Class === true) // 在具名的情况下第三或第四个参数传的是true表示强制覆盖同名类
    {
        force = true;
        Class = false;
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

    if (name && (classes = yaxi.classes))
    {
        if (force || !classes[name])
        {
            // 绑定到类容器
            if (force = yaxi.classHost)
            {
                force[name] = Class;
            }

            classes[Class.typeName = prototype.typeName = name] = Class;
            classes[name = Class.lowerTypeName = name.toLowerCase()] = Class;
        }
        else
        {
            throw new Error('class name "' + name + '" has exists!');
        }
    }

	return Class;
}

