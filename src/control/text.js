yaxi.Text = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-text"></span>');



    this.$property('text', '');


    this.$property('format', {
    
        defaultValue: null,
        convertor: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    }, false);



    this.renderer.text = function (dom, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        dom.textContent = value;
    }



}).register('Text');
