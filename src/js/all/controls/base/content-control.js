/*
 * ContentControl主要作为自定义内容展示用, 子控件不支持绑定事件, 不支持嵌套其它ContentControl
 * 不支持对子控件进行操作
*/
yaxi.ContentControl = yaxi.Control.extend(function (Class, base, yaxi) {



    var A = Array;
    
    var build = yaxi.Control.build;
    



    // 标记当前控件为content控件(事件检测用)
    this.__is_content = true;


    
    
    // 内容
    this.property('content', null, {

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
        var list = new A(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = build(parent, values[i]);
        }

        return list;
    }



    this.__load_children = function (values) {

        this.content = values;
    }



    var loading;


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
            if (loading)
            {
                throw new Error('create control error: content control can not inside content control!');
            }

            try
            {
                loading = true;

                if (content[0] instanceof A)
                {
                    content = createControls(this, content);
                }
                else
                {
                    content = [build(this, content)];
                }
            }
            finally
            {
                loading = false;
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
