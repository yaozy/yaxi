yaxi.Memo.renderer(function (renderer, base) {



    this.focus = function () {

        var view;

        if (view = this.$view)
        {
            view.focus();
        }
    }

    
    this.blur = function () {

        var view;

        if (view = this.$view)
        {
            view.blur();
        }
    }

    

    yaxi.template(this, '<span class="$class"><textarea></textarea></span>');



    renderer.value = function (view, value) {

        view.firstChild.value = value;
    }


    renderer.placeholder = function (view, value) {

        view.firstChild.placeholder = value;
    }



    this.__on_change = function (event) {

        var value = this.value;

        this.value = event.target.value;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            renderer.value(this.$view, value);
        }
    }



});
