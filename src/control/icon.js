yaxi.Icon = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-icon"></span>');
    
    

    // 图标类名
    this.$property('icon', '');


    // svg图标
    this.$property('svg', '');

    
    // svg图标颜色
    this.$property('fill', '');


    // svg图标大小
    this.$property('size', '');




    this.__set_icon = function (dom, value) {

        var classList = dom.classList,
            icon = this.__icon;

        if (icon)
        {
            classList.remove(icon);
        }

        if (this.__icon = value)
        {
            classList.add(value);
        }
    }


    this.__set_svg = function (dom, value) {

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

        if (dom = dom.firstChild)
        {
            dom.style.fill = value;
        }
    }


    this.__set_size = function (dom, value) {

        if (dom = dom.firstChild)
        {
            dom.style.fontSize = value;
        }
    }



}).register('Icon');
