yaxi.TextBox = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox"><input type="text" /></span>');



    this.$property('value', '');



    Object.defineProperty(this, 'text', {

        get: function () {
        
            var any;

            if (any = this.$dom)
            {
                return any.firstChild.value;
            }

            return (any = this.__format) ? any(this.value) : this.value;
        },
        set: function (value) {

            var dom;

            if (dom = this.$dom)
            {
                dom.firstChild.value = value;
            }
        }
    });

    
    this.$property('placeholder', '');


    this.$property('align', 'left');


    this.$property('maxLength', 0);


    this.$property('pattern', '');


    this.$property('format', {
    
        defaultValue: null,

        convertor: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    }, false);




    this.focus = function () {

        var dom;

        if (dom = this.$dom)
        {
            dom.focus();
        }
    }

    
    this.blur = function () {

        var dom;

        if (dom = this.$dom)
        {
            dom.blur();
        }
    }



    this.__set_value = function (dom, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        dom.firstChild.value = value;
    }



    this.__set_placeholder = function (dom, value) {

        dom.firstChild.placeholder = value;
    }


    this.__set_maxLength = function (dom, value) {

        dom.firstChild.maxLength = value;
    }


    this.__set_pattern = function (dom, value) {

        dom.firstChild.setAttribute('pattern', value);
    }


    
    this.__on_change = function () {

        var value = this.$dom.firstChild.value,
            binding;

        this.value = value;

        if (this.value !== value)
        {
            if (binding = this.__binding_push)
            {
                binding.model.$push(this, this.value);
            }
        }
        else
        {
            this.__set_value(this.$dom, value);
        }
    }



}).register('TextBox');
