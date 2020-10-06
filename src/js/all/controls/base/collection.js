yaxi.Collection = Object.extend.call({}, function (Class) {


    
    var A = Array;

    var array = A.prototype;


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

        target.__last = array.slice.call(target, 0);

        if (target = controls[target.$uuid])
        {
            target.__dirty || $patch(target);
        }
    }


    function createControls(parent, list, index, offset) {

        var length = list.length;
        var outputs = new A(length + offset);

        while (index < length)
        {
            outputs[index + offset] = build(parent, list[index++]);
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
        else
        {
            this.__last || patch(this);
        }

        for (var i = 0; i < length; i++)
        {
            this[i] = build(parent, values[i], scope);
        }
        
        this.__length = length;
    }



    this.set = function (index, value) {
        
        var control;

        if ((index |= 0) < 0)
        {
            index += this.__length;
        }

        if (control = this[index])
        {
            control.destroy();
            control = build(controls[this.$uuid], value);

            this.__last || patch(this);
            this[index] = control;
        }
        else
        {
            return false;
        }
    }


    this.append = function () {

        if (arguments.length > 0)
        {
            var list = createControls(controls[this.$uuid], arguments, 0, 0);

            this.__last || patch(this);

            released = true;
            array.push.apply(this, list);
        }
    }


    this.insert = function (index) {

        if (arguments.length > 1)
        {
            var length = this.__length;

            if ((index |= 0) < 0 && (index += length) < 0)
            {
                index = 0;
            }
            else if (index > length)
            {
                index = length;
            }

            this.__last || patch(this);

            list = createControls(controls[this.$uuid], arguments, 1, 2);
            list[0] = index;
            list[1] = 0;

            released = true;
            array.push.apply(this, list);
        }
    }


    this.removeAt = function (index, count) {

        var length = this.__length;
        var removed;

        if ((index |= 0) < 0 && (index += length) < 0)
        {
            index = 0;
        }
        else if (index >= length)
        {
            return false;
        }

        this.__last || patch(this);

        released = true;
        removed = array.splice.call(this, index, count || 1);

        for (var i = removed.length; i--;)
        {
            removed[i].parent = null;
        }

        return removed;
    }


    this.remove = function (item) {

        var index = this.indexOf(item);

        if (index >= 0)
        {
            this.removeAt(index, 1);
        }
    }


    this.clear = function () {

        var list;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;
            list = array.splice.call(this, 0)

            for (var i = list.length; i--;)
            {
                list[i].parent = null;
            }
        }
    }


    this.sort = function (sortby) {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.sort.call(this, sortby);
        }
    }



    this.reverse = function () {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.reverse.call(this);
        }
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


    this.__set = function (index, control) {

        this.__last || patch(this);

        this[index].destroy();
        this[index] = control;
    }



}, function Collection(control) {

    this.$uuid = control && control.uuid;
    
});
