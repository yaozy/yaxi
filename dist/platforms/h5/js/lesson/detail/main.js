const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./main.html');
const bodyTemplate = require('./main-body.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    function render(data) {

        data.selectedStatus = {
            theme: 'primary', 
            'border-bottom': '.5px solid @border-primary' 
        };

        this.find('>box').load(bodyTemplate(this, data));
    }

    
    this.init = function (id) {

        this.load(template(this));
        yaxi.http.get('lesson/1').json(render.bind(this));
    }


});