yaxi.Button = yaxi.Control.extend(function (Class, base) {


    
    var A = Array;
    
    var build = yaxi.Control.build;
    
    var loading;



    this.$('text', '');


    this.__set_text = function (value) {

        this.content(value);
    }


    // 是否禁用
    this.$('disabled', false);



    function createControls(parent, values) {

        var length = values.length;
        var list = new A(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = build(parent, values[i], false);
        }

        return list;
    }


    this.content = this.__load_children = function (values) {

        var content;

        if (content = this.__content)
        {
            if (typeof content === 'object')
            {
                for (var i = content.length; i--;)
                {
                    content[i].destroy();
                }
            }
        }

        if (values instanceof A)
        {
            if (loading)
            {
                throw new Error('load button error: button can not embed button!');
            }

            try
            {
                loading = true;

                if (values[0] instanceof A)
                {
                    values = createControls(this, values);
                }
                else
                {
                    values = [build(this, values, false)];
                }

                this.$storage.text = '';
            }
            finally
            {
                loading = false;
            }
        }
        else
        {
            this.$storage.text = values = '' + values; 
        }

        this.__content = values;
    }



    this.destroy = function () {

        var content = this.__content;

        if (content && typeof content !== 'string')
        {
            for (var i = content.length; i--;)
            {
                content[i].destroy();
                content[i].__own = null;
            }
        }

        base.destroy.call(this);
    }



}, function Button() {


    yaxi.Control.apply(this, arguments);


}).register('Button');
