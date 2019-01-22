yaxi.BackButton = yaxi.Control.extend(function (Class, base) {

    

    yaxi.template(this, '<span class="yx-control yx-backbutton"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-back"></use></svg><span></span></span>');




    this.$property('text', '');



    this.__on_tap = function handleTap() {

        var target = this,
            parent;

        while (parent = target.parent)
        {
            target = parent;
        }

        target.close('BACK');
    }



    this.renderer.text = function (dom, value) {

        dom.lastChild.innerHTML = value;
        dom.style.width = value ? 'auto' : '';
    }



    
}).register('BackButton');
