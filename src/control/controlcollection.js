yaxi.ControlCollection = Object.extend.call({}, function (Class) {


    
    var array = Array.prototype;

    var push = array.push;

    var splice = array.splice;



    this.length = 0;


    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;



    this.assign = function (values) {

        var owner = this.$control,
            childClass = owner.__child_class,
            subtype = owner.subtype || yaxi.Control,
            index = 0,
            control;

        if (this.length > 0)
        {
            this.clear();
        }

        for (var i = 0, l = values.length; i < l; i++)
        {
            if (control = createControl(owner, childClass, subtype, values[i]))
            {
                this[index++] = control;
            }
        }

        this.length = index;
    }




    function createControl(owner, childClass, subtype, values) {

        var control;

        if (values)
        {
            if (values.$storage)
            {
                if (values instanceof childClass)
                {
                    control = values;

                    if (control.destroyed)
                    {
                        console.error('对象已经被销毁,不能够再使用!');
                        return;
                    }

                    if (control.parent && control.parent !== owner)
                    {
                        control.remove();
                    }

                    control.parent = owner;
                    return control;
                }
            }
            else
            {
                control = new (values.Class || subtype)();
                control.parent = owner;
                control.assign(values);
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

        var owner = self.$control,
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
                changes,
                owner;

            if (changes = this.__changes)
            {
                changes.push.apply(changes[1], controls);
            }
            else
            {
                this.__changes = [0, controls];

                if (!(owner = this.$control).__dirty)
                {
                    owner.$patch();
                }
            }

            return push.apply(this, controls);
        }

        return this.length;
    }


    this.pop = function () {

        var control, changes, owner;

        if (control = array.pop.call(this))
        {
            control.parent = null;

            if (changes = this.__changes)
            {
                changes.push(control);
            }
            else
            {
                this.__changes = [0, [], control];

                if (!(owner = this.$control).__dirty)
                {
                    owner.$patch();
                }
            }
        }

        return control;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var controls = createControls(this, arguments, 0, []),
                changes,
                owner;

            if (changes = this.__changes)
            {
                changes[0] = 1;
                changes.push.apply(changes[1], controls);
            }
            else
            {
                this.__changes = [1, controls];

                if (!(owner = this.$control).__dirty)
                {
                    owner.$patch();
                }
            }

            return array.unshift.apply(this, controls);
        }

        return this.length;
    }


    this.shift = function () {

        var control, owner, changes;

        if (control = array.shift.call(this))
        {
            control.parent = null;

            if (changes = this.__changes)
            {
                changes[0] = 1;
                changes.push(control);
            }
            else
            {
                this.__changes = [1, [], control];

                if (!(owner = this.$control).__dirty)
                {
                    owner.$patch();
                }
            }
        }

        return control;
    }


    this.splice = function (index, length) {

        var owner = this.$control,
            changes = this.__changes,
            controls;

        if (arguments.length > 2)
        {
            controls = createControls(this, arguments, 2, [index, length]);
            
            if (changes)
            {
                changes[0] = 1;
                changes.push.apply(changes[1], controls.slice(2));
            }
            else
            {
                this.__changes = changes = [1, controls.slice(2)];

                if (!owner.__dirty)
                {
                    owner.$patch();
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

            if (changes)
            {
                changes[0] = 1;
                changes.push.apply(changes, controls);
            }
            else
            {
                this.__changes = [1, []].concat(controls);

                if (!owner.__dirty)
                {
                    owner.$patch();
                }
            }
        }

        return controls;
    }


    this.clear = function () {

        var controls = splice.call(this, 0),
            changes,
            owner;

        if (controls.length > 0)
        {
            for (var i = controls.length; i--;)
            {
                controls[i].parent = null;
            }

            if (changes = this.__changes)
            {
                changes[0] = 0;
                changes.push.apply(changes, controls);
            }
            else
            {
                this.__changes = [0, []].concat(controls);

                if (!(owner = this.$control).__dirty)
                {
                    owner.$patch();
                }
            }
        }

        return controls;
    }


    this.sort = function (sortby) {

        var changes, owner;

        if (this.length > 0)
        {
            array.sort.call(this, sortby);

            if (changes = this.__changes)
            {
                changes[0] = 1;
            }
            else
            {
                this.__changes = [1, []];

                if (!(owner = this.$control).__dirty)
                {
                    owner.$patch();
                }
            }
        }

        return this;
    }


    this.reverse = function () {

        var changes, owner;

        if (this.length > 0)
        {
            array.reverse.call(this);

            if (changes = this.__changes)
            {
                changes[0] = 1;
            }
            else
            {
                this.__changes = [1, []];

                if (!(owner = this.$control).__dirty)
                {
                    owner.$patch();
                }
            }
        }

        return this;
    }




    this.__patch = function (owner, dom, changes) {

        // 第二个以后是要移除节点
        if (changes.length > 2)
        {
            this.__remove(owner, dom, changes);
        }

        // 第二个参数是增加的子控件集合
        if (changes[1].length > 0)
        {
            this.__insert(owner, dom, changes[1]);
        }

        // 第一个参数是否排序
        if (changes[0])
        {
            this.__sort(dom);
        }

        this.__changes = null;

        if (changes = this.onchange)
        {
            changes.call(this, owner);
        }
    }


    this.__insert = function (owner, dom, controls) {

        var last = owner.__loading && dom.lastChild;

        for (var i = 0, l = controls.length; i < l; i++)
        {
            var control = controls[i];

            if (control.parent === owner)
            {
                dom.appendChild(control.$dom || control.render());
                control.onmounted();
            }
        }

        if (last)
        {
            dom.appendChild(last);
        }
    }


    this.__remove = function (owner, dom, changes) {

        var control, node;

        for (var i = 2, l = changes.length; i < l; i++)
        {
            // 父控件未发生变化则不处理
            if ((control = changes[i]).parent === owner)
            {
                continue;
            }

            // 父节点未变则
            if ((node = control.$dom) && node.parentNode === dom)
            {
                dom.removeChild(node);
            }

            // 如果没有父节点且不缓存则销毁组件
            if (!control.parent && !control.cached && !control.destroyed)
            {
                control.destroy();
            }
        }
    }


    this.__sort = function (dom) {

        var node, item, control;

        if (node = dom.firstChild)
        {
            var index = 0;

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
    }


}, function ControlCollection(control) {

    this.$control = control;
});
