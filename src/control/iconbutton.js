
yaxi.IconButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-iconbutton"><span class="yx-iconbutton-body"><span class="yx-iconbutton-icon"></span><span class="yx-iconbutton-text"></span></span></span>');



    // 文本内容
    this.$property('text', '');


    // 图标类名
    this.$property('icon', '');


    // svg图标
    this.$property('svg', '');


    // svg图标大小
    this.$property('size', '');


    // 图标与文字的间距
    this.$property('gap', '');
    



    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.firstChild.lastChild.textContent = value;
    }


    renderer.icon = function (dom, value) {

        dom.firstChild.firstChild.className = value;
    }


    renderer.svg = function (dom, value) {

        dom.firstChild.firstChild.innerHTML = value ? '<svg aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>' : '';
    }


    renderer.size = function (dom, value) {

        dom.firstChild.firstChild.style.fontSize = value;
    }


    renderer.gap = function (dom, value) {

        dom.firstChild.lastChild.style.marginTop = value;
    }



}).register('IconButton');
