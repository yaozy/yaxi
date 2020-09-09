yaxi.Collection = Object.extend.call({}, function (Class) {



    var classes = yaxi.classes;

    var controls = yaxi.$controls;

    var Control = yaxi.Control;

    
    var array = Array.prototype;

    var push = array.push;

    var slice = array.slice;

    var splice = array.splice;

    var released = false;


    var check = yaxi.__check_parent;



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
                throw 'length is readonly!';
            }
        }
    });




    function checkSubtype(parent) {

        var subtype;

        if (subtype = parent.subtype)
        {
            switch (typeof subtype)
            {
                case 'string':
                    subtype = classes[subtype];
                    break;

                case 'function':
                    break;

                default:
                    throw 'not a valid subtype, must be a function or a type name!';
            }
        }
        
        check(subtype || (subtype = Control), parent);

        return subtype;
    }


    function createControl(parent, subtype, options) {

        var Class, control;

        if (options)
        {
            if (options.$storage && (Class = options.constructor))
            {
                check(Class, parent);

                control = options;

                if (control.parent && control.parent !== parent)
                {
                    control.remove();
                }

                control.parent = parent;
                return control;
            }

            if (Class = options.Class)
            {
                if (typeof Class === 'string')
                {
                    Class = classes[control];
                }
                
                check(Class, parent);
            }

            control = new (Class || subtype)();
            control.parent = parent;
            control.assign(options);
        }
        else
        {
            control = new subtype();
            control.parent = parent;
        }

        return control;
    }



    function patch(target) {

        target.__last = slice.call(target, 0);

        if ((target = target.$uuid) && (target = controls[target]) && !target.__dirty)
        {
            yaxi.patch(target);
        }
    }



    this.createControls = function (list, index, outputs) {

        var parent = controls[this.$uuid],
            subtype = checkSubtype(parent),
            length = list.length,
            control;

        if ((index |= 0) < 0)
        {
            index = 0;
        }

        outputs || (outputs = []);

        while (index < length)
        {
            if (control = createControl(parent, subtype, list[index++]))
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



    this.assign = function (values) {

        var parent = controls[this.$uuid],
            subtype = checkSubtype(parent),
            index = 0,
            control;

        if (this.__length > 0)
        {
            this.clear();
        }

        for (var i = 0, l = values.length; i < l; i++)
        {
            if (control = createControl(parent, subtype, values[i]))
            {
                this[index++] = control;
            }
        }

        this.__length = index;
    }


    this.set = function (index, value) {

        if ((index |= 0) >= 0 && this.__length > index)
        {
            var parent = controls[this.$uuid];
            var subtype = parent.subtype || yaxi.Control;

            check(subtype, parent);
            value = createControl(parent, subtype, value);

            this.__last || patch(this);
            this[0] = value;
        }
    }


    this.push = function () {

        if (arguments.length > 0)
        {
            var controls = this.createControls(arguments, 0, []);

            this.__last || patch(this);

            released = true;
            return push.apply(this, controls);
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
            var controls = this.createControls(arguments, 0, []);

            this.__last || patch(this);

            released = true;
            return array.unshift.apply(this, controls);
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

        var controls;

        this.__last || patch(this);

        released = true;

        if (arguments.length > 2)
        {
            controls = this.createControls(arguments, 2, [index, length]);
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
        }

        return controls;
    }


    this.clear = function () {

        var controls;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;
            controls = splice.call(this, 0)

            for (var i = controls.length; i--;)
            {
                controls[i].parent = null;
            }
        }

        return controls || [];
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



}, function Collection(control) {

    this.$uuid = control.uuid;
    
});
