yaxi.Button = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-button"><span class="yx-button-icon"></span><span class="yx-button-text"></span></span>');



    // 按钮文字
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

        dom.lastChild.textContent = value;
    }
    

    renderer.icon = function (dom, value) {

        dom.firstChild.className = value;
    }


    renderer.svg = function (dom, value) {

        dom.firstChild.innerHTML = value ? '<svg aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>' : '';
    }


    renderer.size = function (dom, value) {

        var style = dom.firstChild.style;
        // style.width = style.height = 
        style.fontSize = value;
    }


    renderer.gap = function (dom, value) {

        dom.lastChild.style.marginLeft = value;
    }



}).register('Button');
