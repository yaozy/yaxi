yaxi.BackButton = yaxi.Control.extend(function (Class, base) {

    
    
    var create = Object.create;
    


    yaxi.template(this, '<span class="yx-control yx-backbutton"><svg class="yx-icon-svg" aria-hidden="true"><use xlink:href="#icon-yaxi-back"></use></svg><span></span></span>');



    Class.ctor = function (data) {

        this.$storage = create(this.$defaults);

        if (data)
        {
            this.__init(data);
        }

        this.on('tap', handleTap.bind(this));
    }




    this.$property('text', '');



    function handleTap(event) {

        var target = this,
            parent;

        while (parent = target.parent)
        {
            target = parent;
        }

        target.close('BACK');
    }



    this.__set_text = function (dom, value) {

        dom.lastChild.innerHTML = value;
        dom.style.width = value ? 'auto' : '';
    }



    
}).register('BackButton');
