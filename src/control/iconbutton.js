
yaxi.IconButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-iconbutton"><span><span></span><span></span></span></span>');



    // 文本内容
    this.$property('text', '');


    // 图标类名
    this.$property('icon', '');


    // svg图标
    this.$property('svg', '');


    // svg图标颜色
    this.$property('fill', '');

    
    // svg图标大小
    this.$property('size', '');


    // 是否竖排图标
    this.$property('vertical', false);
    



    this.__set_text = function (dom, value) {

        dom.firstChild.lastChild.textContent = value;
    }


    this.__set_icon = function (dom, value) {

        dom.firstChild.firstChild.className = value;
    }


    this.__set_svg = function (dom, value) {

        dom = dom.firstChild.firstChild;

        if (value)
        {
            dom.innerHTML = '<svg class="yx-icon-svg" aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>';

            if (value = this.fill)
            {
                dom.firstChild.style.fill = value;
            }

            if (value = this.size)
            {
                dom.firstChild.style.fontSize = value;
            }
        }
        else
        {
            dom.innerHTML = '';
        }
    }


    this.__set_fill = function (dom, value) {

        if (dom = dom.firstChild.firstChild.firstChild)
        {
            dom.style.fill = value;
        }
    }


    this.__set_size = function (dom, value) {

        if (dom = dom.firstChild.firstChild.firstChild)
        {
            dom.style.fontSize = value;
        }
    }


    this.__set_vertical = function (dom, value) {

        dom.firstChild.setAttribute('layout', value ? 'column-center' : 'row-center');
    }



}).register('IconButton');
