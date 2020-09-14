/*
 * ContentControl主要作为自定义内容展示用, 子控件不支持绑定事件
 * 不支持对子控件进行操作
*/
yaxi.ContentControl = yaxi.Control.extend(function (Class, base, yaxi) {



    var A = Array;
    

    var classes = yaxi.classes;

    var patch = yaxi.patch;


    var check = yaxi.__check_parent;
    



    // 标记当前控件为content控件(事件检测用)
    this.__is_content = true;


    
    
    // 内容
    this.$property('content', null, {

        change: false,

        get: function () {

            return this.$storage.content;
        },

        set: function (value) {

            this.$storage.content = this.__load_content(value);
        }

    });



    function createControls(parent, values) {

        var length = values.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = createControl(parent, values[i]);
        }

        return list;
    }


    function createControl(parent, options) {

        var Class = options[0];
        var control;

        if (typeof Class === 'string' && !(Class = classes[Class]))
        {
            throw '"' + options[0] + '" doesn\'t register!';
        }

        if (Class)
        {
            check(Class, parent);
        }
        else
        {
            Class = yaxi.Text;
        }

        control = new Class();
        control.parent = parent;
        control.load(options);

        return control;
    }


    // 加载内容
    this.__load_content = function (values) {

        var content = this.__content;
    
        if (content && typeof content !== 'string')
        {
            for (var i = list.length; i--;)
            {
                list[i].destroy();
            }
        }

        if (values instanceof A)
        {
            try
            {
                yaxi.__content_count++;

                if (values[0] instanceof A)
                {
                    content = createControls(this, values);
                }
                else
                {
                    content = [createControl(this, values)];
                }
            }
            finally
            {
                yaxi.__content_count--;
            }
        }
        else
        {
            content = values = '' + values; 
        }

        this.__content = content;
        this.__content_dirty = true;  // 标记内容已变更

        this.__dirty || patch(this);

        return values;
    }



    this.destroy = function () {

        var content = this.__content;

        if (content && typeof content !== 'string')
        {
            for (var i = content.length; i--;)
            {
                content[i].destroy();
            }
        }

        base.destroy.call(this);
    }


});
