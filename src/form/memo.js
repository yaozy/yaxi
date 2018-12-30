yaxi.Memo = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-memo"><textarea></textarea></span>');




    this.$property('value', '');

    
    this.$property('placeholder', '');




    Object.defineProperty(this, 'text', {

        get: function () {
        
            var any;

            if (any = this.$dom)
            {
                return any.firstChild.value;
            }

            return this.value;
        },
        set: function (value) {

            var dom;

            if (dom = this.$dom)
            {
                dom.firstChild.value = value;
            }
            else
            {
                this.value = value;
            }
        }
    });



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

    


    var renderer = this.renderer;


    renderer.value = function (dom, value) {

        dom.firstChild.value = value;
    }


    renderer.placeholder = function (dom, value) {

        dom.firstChild.placeholder = value;
    }



    this.__on_change = function (dom) {

        var value = this.value;

        this.value = dom.value;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            this.renderer.value(this.$dom, value);
        }
    }



}).register('Memo');
