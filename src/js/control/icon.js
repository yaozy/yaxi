yaxi.Icon = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-icon"></span>');
    
    

    // 图标类名
    this.$property('icon', '');


    // svg图标id
    this.$property('svg', '');

    
    // svg颜色
    this.$property('fill', '');




    this.__set_icon = function (dom, value) {

        var classList = dom.classList,
            icon = this.__icon_;

        if (icon)
        {
            dom.classList.remove(icon);
        }

        if (this.__icon_ = value)
        {
            dom.classList.add(value);
        }
    }


    this.__set_svg = function (dom, value) {

        dom.innerHTML = value ? '<svg aria-hidden="true"><use xlink:href="#' + value.replace(/[<>"']/g, '') + '"></use></svg>' : '';
    }


    
    this.__set_fill = function (dom, value) {

        if (dom = dom.firstChild)
        {
            dom.style.fill = value;
        }
    }



}).register('Icon');
