yaxi.CircleText = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-circletext"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-circle"></use></svg><span></span></span>');



    this.$property('text', '');


    this.$property('fill', '');


    

    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }




}).register('CircleText');
