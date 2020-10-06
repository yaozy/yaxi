const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./main-body.html');



module.exports = yaxi.Box.extend(function (Class, base) {



    this.init = function (data) {
        
        data.selectedStatus = {
            theme: 'text-primary line-primary line-bottom'
        };

        this.loadTemplate(template, this.data = data);
        this.find('>>@host').children[0].onload(data);
    }



    this.handleSwitch = function (event) {

        var control;

        if (control = this.find('>>@host'))
        {
            var children = control.children;

            if (control = children[event.detail.lastIndex])
            {
                control.hidden = true;
            }

            if (control = children[event.detail.index])
            {
                control.hidden = false;

                if (!control.loaded)
                {
                    control.onload(this.data);
                    control.loaded = true;
                }
            }
        }
    }

    

});