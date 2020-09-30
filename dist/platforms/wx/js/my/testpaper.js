const yaxi = require('../../yaxi/js/yaxi');
const template = require('./testpaper.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template);

        yaxi.http.get('my/testpaper').json(function (data) {

            this.find('>>databox').data = data;

        }.bind(this));
    }



    this.handleStart = function (event) {
        
        var data;

        if (data = this.find('>>databox').data[event.source.tag])
        {
            require('./testpaper-start').open(data);
        }
    }


});
