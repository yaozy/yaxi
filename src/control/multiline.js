yaxi.Multiline = yaxi.Control.extend(function () {



    yaxi.template(this, '<div class="yx-control yx-multiline"></div>');



    this.$property('text', '');



    this.__set_text = function (dom, value) {

        if (value)
        {
            var list = yaxi.html.encode(value).split('\n');

            for (var i = list.length; i--;)
            {
                list[i] = '<div>' + list[i] + '</div>';
            }

            dom.innerHTML = list.join('');
        }
        else
        {
            dom.innerHTML = '';
        }
    }



}).register('Multiline');
