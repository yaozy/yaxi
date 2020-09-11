/*
 * ContentControl主要作为自定义内容展示用
 * 不支持对子控件进行操作
*/
yaxi.ContentControl = yaxi.Control.extend(function (Class, base) {


    
    var classes = yaxi.classes;

    var check = yaxi.__check_parent;


    
    // 内容
    this.$property('content', {

        defaultValue: null,

        converter: function (value) {

            var content = this.__content;
    
            if (content && typeof content !== 'string')
            {
                for (var i = list.length; i--;)
                {
                    list[i].destroy();
                }
            }
    
            if (!value || typeof value !== 'object')
            {
                content = this.__text_content(value = '' + value);
            }
            else if (value instanceof Array)
            {
                content = createControls(this, value);
            }
            else if (value.Class)
            {
                content = [createControl(this, value)];
            }
            else
            {
                content = value = '' + value; 
            }
    
            this.__content = content;
            this.__content_dirty = true;  // 标记内容已变更

            return value;
        }

    });




    this.__text_content = function (text) {

        return text;
    }
    


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

        var Class = options.Class;
        var control;

        if (typeof Class === 'string' && !(Class = classes[Class]))
        {
            throw '"' + options.Class + '" doesn\'t register!';
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
        control.assign(options);

        return control;
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
