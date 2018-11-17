yaxi.TextBox = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox"><input type="text" /></span>');




    this.$property('text', '');

    
    this.$property('placeholder', '');



    
    Object.defineProperty(this, 'displayText', {

        get: function () {

            var dom = this.$dom;
            return dom ? dom.firstChild.value : '';
        }
    });



    this.__set_text = function (dom, value) {

        dom.firstChild.value = value;
    }


    this.__set_placeholder = function (dom, value) {

        dom.firstChild.placeholder = value;
    }


    
    this.__on_change = function () {

        this.text = this.$dom.firstChild.value;
    }



}).register('TextBox');
