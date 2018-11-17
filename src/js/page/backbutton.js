yaxi.BackButton = yaxi.Control.extend(function (Class, base) {

    
    
    var create = Object.create;
    


    yaxi.template(this, '<span class="yx-control yx-backbutton yx-icon"><svg aria-hidden="true"><use xlink:href="#icon-back"></use></svg></span>');



    Class.ctor = function (data) {

        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }

        this.on('tap', handleTap.bind(this));
    }


    function handleTap(event) {

        var target = this,
            parent;

        while (parent = target.parent)
        {
            target = parent;
        }

        target.close('BACK');
    }


    
}).register('BackButton');
