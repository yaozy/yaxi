
yaxi.IconButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-iconbutton"><span></span><span></span></span>');



    // 文本内容
    this.$property('text', '');


    // 图标类名
    this.$property('icon', '');


    // svg图标
    this.$property('svg', '');


    // svg图标大小
    this.$property('size', '');


    // 是否竖排图标
    this.$property('vertical', false);
    



    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    renderer.icon = function (dom, value) {

        dom.firstChild.className = value;
    }


    renderer.svg = function (dom, value) {

        dom = dom.firstChild;

        if (value)
        {
            dom.innerHTML = '<svg aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>';

            if (value = this.fill)
            {
                dom.style.fill = value;
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


    renderer.size = function (dom, value) {

        if (dom = dom.firstChild.firstChild)
        {
            dom.style.fontSize = value;
        }
    }


    renderer.vertical = function (dom, value) {

        dom.setAttribute('layout', value ? 'column-center' : 'row-center');
    }



}).register('IconButton');
