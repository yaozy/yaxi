const yaxi = require('../../yaxi/js/yaxi');
const template = require('./detail.html');
const ajaxTemplate = require('./detail-ajax.html')


module.exports = yaxi.Page.extend(function (Class, base) {



    function render(data) {

        this.data = data;
        this.find('>Box').load(ajaxTemplate.call(this));
    }

    

    this.init = function (id) {

        this.load(template.call(this));
        yaxi.http.get('lesson/1').json(render.bind(this));
    }


});
