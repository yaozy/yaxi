yaxi.Control.extend('Button', function (Class, base) {


    
    var A = Array;
    
    var build = yaxi.Control.build;
    
    var loading;



    this.$('text', '');


    this.__set_text = function (value) {

        this.content(value);
    }


    // 是否禁用
    this.$('disabled', false);



    function createShadows(parent, values) {

        var length = values.length;
        var controls = new A(length);

        for (var i = 0; i < length; i++)
        {
            controls[i] = build(parent, values[i]);
            controls[i].__shadow = true;
        }

        return controls;
    }


    this.content = this.__load_children = function (values) {

        var shadows;

        if (shadows = this.__shadows)
        {
            if (typeof shadows === 'object')
            {
                for (var i = shadows.length; i--;)
                {
                    shadows[i].destroy();
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
                    values = createShadows(this, values);
                }
                else
                {
                    values = [build(this, values)];
                    values[0].__shadow = true;
                }

                this.__fields.text = '';
            }
            finally
            {
                loading = false;
            }
        }
        else
        {
            this.__fields.text = values = '' + values; 
        }

        this.__shadows = values;
    }



    this.destroy = function () {

        var shadows = this.__shadows;

        if (shadows && typeof shadows !== 'string')
        {
            for (var i = shadows.length; i--;)
            {
                shadows[i].destroy();
            }
        }

        base.destroy.call(this);
    }



}, function Button() {


    yaxi.Control.apply(this, arguments);


});
