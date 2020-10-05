const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./main.html');



module.exports = yaxi.Page.extend(function (Class, base) {


    
    this.init = function (id) {

        this.loadTemplate(template);

        yaxi.http.get('course/detail', id).json(function (data) {

            this.children.set(1, new (require('./main-body'))(data));

        }.bind(this));
    }



});
