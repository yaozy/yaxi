yaxi.PasswordBox.renderer(function (renderer, base) {



    yaxi.template(this, '<span class="$class"><input type="password" /><span><svg aria-hidden="true"><use xlink:href="#icon-yaxi-eye-close"></use></svg></span></span>');




    renderer.type = function (view, value) {

        view.lastChild.className = value ? 'yx-password-' + value : '';
    }


    this.__on_tap = function (event) {

        var view = this.$view,
            target = event.view,
            icon;

        while (target && target !== view)
        {
            if (target.tagName === 'SPAN')
            {
                view = view.firstChild;
                
                if (view.type === 'text')
                {
                    view.type = 'password';
                    icon = 'yaxi-eye-close';
                }
                else
                {
                    view.type = 'text';
                    icon = 'yaxi-eye-open';
                }

                target.firstChild.firstChild.setAttribute('xlink:href', '#icon-' + icon);
                return;
            }

            target = target.parentNode;
        }
    }




});
