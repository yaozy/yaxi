const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.loadTemplate(template);
    }


    this.handleTap = function (event) {

        var target = event.target;
        var tag;

        while (target)
        {
            if (tag = target.tag)
            {
                require(tag).open();
                break;
            }

            target = target.parent;
        }
    }


});
