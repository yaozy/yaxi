const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Box.extend(function (Class, base) {

    

    function render(data) {

        this.find('>>@main-body').data = data;
    }


    this.init = function () {

        this.loadTemplate(template);
        yaxi.http.get('lesson/list').json(render.bind(this));
    }


    
    this.handleOpenDetail = function (event) {

        require('../lesson/detail/main').open(event.source.tag);
    }



});
