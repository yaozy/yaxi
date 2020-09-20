const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Box.extend(function (Class, base) {

    

    function render(data) {

        this.find('>>@main-body').data = data;
    }


    this.init = function () {

        this.load(template(this));
        yaxi.http.get('lesson/list').json(render.bind(this));
    }


    
    this.handleOpenDetail = function (event) {

        var control;

        if (control = event.target.findHasTag())
        {
            require('../lesson/detail/main').open(control.tag);
        }
    }



});
