yaxi.Collection = Object.extend.call({}, function (Class) {


    
    var array = Array.prototype;

    var push = array.push;

    var slice = array.slice;

    var splice = array.splice;


    var $patch = yaxi.patch;


    var controls = yaxi.$controls;

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
                throw 'the length of collection is readonly!';
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
            if (control = parent.$createSubControl(list[index++]))
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



    this.load = function (values, model) {

        var parent = controls[this.$uuid];
        var length = values.length;

        if (this.__length > 0)
        {
            this.clear();
        }

        for (var i = 0; i < length; i++)
        {
            this[i] = parent.$createSubControl(values[i], model);
        }

        this.__length = length;
    }



    this.set = function (index, value) {

        if ((index |= 0) >= 0 && this.__length > index)
        {
            value = controls[this.$uuid].$createSubControl(value);

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



    // 直接插入控件(给repeater控件用)
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
