const yaxi = require('../../yaxi/js/yaxi');
const template = require('./test.html');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.loadTemplate(template);
    }


    this.handleAppend = function () {

        var children = this.find('>>@host').children;

        children.append([
            yaxi.Text,
            {
                text: new Date()
            }
        ]);
        
        children[0].text = new Date();
    }


    this.handleRemove = function () {

        this.find('>>@host').children.removeAt(0);
    }


});
