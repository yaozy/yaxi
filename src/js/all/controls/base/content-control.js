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

        convert: function (value) {

            var content = this.__content;

            if (content)
            {
                this.__content = null;

                if (typeof content === 'object')
                {
                    for (var i = content.length; i--;)
                    {
                        content[i].destroy();
                    }
                }
            }

            return value;
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
            throw new Error('create control error: class "' + options[0] + '" doesn\'t register!');
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


    this.__load_content = function (values) {

        this.content = values;
    }



    // 初始化内容
    this.__init_content = function () {

        var content = this.__content;

        if (content)
        {
            return content;
        }

        content = this.content;

        if (content instanceof A)
        {
            try
            {
                yaxi.__content_count++;

                if (content[0] instanceof A)
                {
                    content = createControls(this, content);
                }
                else
                {
                    content = [createControl(this, content)];
                }
            }
            finally
            {
                yaxi.__content_count--;
            }
        }
        else
        {
            content = '' + content; 
        }

        return this.__content = content;
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
