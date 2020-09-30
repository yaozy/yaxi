const yaxi = require('../../yaxi/js/yaxi');
const template = require('./timetable.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template);

        yaxi.http.get('my/timetable').json(function (data) {

            this.find('>>databox').data = data;

        }.bind(this));
    }

    

});
