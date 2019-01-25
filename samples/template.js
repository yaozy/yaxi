module.exports = yaxi.Page.extend(function () {


    var data = {
        header: '模板开发演示',
        model: {
            value: 100,
            width: '100%'
        },
        i18n: {
            text: 'i18n'
        },
        onchange: function () {

            alert(this.model.value);
        }
    };



    this.init = function () {

        // var time = performance.now();

        var template = require('template.html')(data);
    
        // alert(performance.now() - time);

        this.assign(template);
    }



});
