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
