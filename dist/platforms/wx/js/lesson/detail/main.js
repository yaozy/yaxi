const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./main.html');
const ajaxTemplate = require('./main-ajax.html')


module.exports = yaxi.Page.extend(function (Class, base) {



    function render(data) {

        this.find('>Box').load(ajaxTemplate.call(this, data));
    }

    

    this.init = function (id) {

        this.load(template.call(this));
        yaxi.http.get('lesson/1').json(render.bind(this));
    }


});
