
yaxi.IconButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-iconbutton"><span class="yx-icon"></span><span></span></span>');



    // 文本内容
    this.$property('text', '');


    // 图标类名
    this.$property('icon', '');


    // svg图标id
    this.$property('svg', '');


    // svg颜色
    this.$property('fill', '');

    
    // 图标大小
    this.$property('size', '');
    



    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_icon = function (dom, value) {

        var classList = dom.firstChild.classList,
            icon = this.__icon_;

        if (icon)
        {
            classList.remove(icon);
        }

        if (this.__icon_ = value)
        {
            classList.add(value);
        }
    }


    this.__set_svg = function (dom, value) {

        dom.firstChild.innerHTML = value ? '<svg aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>' : '';
    }


    this.__set_fill = function (dom, value) {

        if (dom = dom.firstChild.firstChild)
        {
            dom.style.fill = value;
        }
    }


    this.__set_size = function (dom, value) {

        dom.firstChild.style.fontSize = value;
    }



}).register('IconButton');
