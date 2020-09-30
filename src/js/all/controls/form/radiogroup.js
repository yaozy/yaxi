yaxi.Box.extend('RadioGroup', function (Class, base) {



    this.$('name', '');


    this.$('value', '');




    function syncValue(children, value) {

        for (var i = children.length; i--;)
        {
            var radio = children[i];

            if (radio.key === value)
            {
                radio.checked = true;
            }
            else if (radio.checked)
            {
                radio.checked = false;
            }
        }
    }


    this.__set_value = function (value) {

        syncValue(this.__children, value);
        this.$push(value);
    }



    this.__load_children = function (values, scope) {

        var children = this.__children;

        children.load(values, scope);
        syncValue(children, this.value);
    }



    this.__on_tap = function (event) {

        var target = event.target;

        if (target.parent === this && !target.checked)
        {
            var children = this.children;

            for (var i = children.length; i--;)
            {
                if (children[i].checked)
                {
                    if (children[i].trigger('changing', false) === false)
                    {
                        return false;
                    }

                    break;
                }
            }

            if (target.trigger('changing', true) === false)
            {
                return false;
            }

            if (!(this.value = target.key))
            {
                throw new Error('radio control must set key!');
            }
        }
    }
    


}, function RadioGroup() {


    yaxi.Box.apply(this, arguments);
    

});
