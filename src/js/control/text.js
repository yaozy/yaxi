yaxi.Text = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-text"></span>');



    this.$property('text', '');



    this.__set_text = function (dom, value) {

        dom.textContent = value;
    }



}).register('Text');
