const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');
const lessonTemplate = require('./main-lesson-list.html');



module.exports = yaxi.Box.extend(function (Class, base) {

    

    function render(data) {

        this.data = data;
        this.find('>>@host').load(lessonTemplate.call(this));
    }


    this.init = function () {

        this.load(template.call(this));
        yaxi.http.get('lesson/list').json(render.bind(this));
    }


    
    this.handleOpenDetail = function (event) {

        var control;

        if (control = event.target.findHasTag())
        {
            require('../lesson/detail').open(control.tag);
        }
    }



});
