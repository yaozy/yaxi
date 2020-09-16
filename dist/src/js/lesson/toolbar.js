const yaxi = require('../../yaxi/js/yaxi');
const template = require('./toolbar.html');


module.exports = yaxi.Band.extend(function (Class, base) {



    function computeIconFn(current) {

        return function () {

            return this.$parent.current === current ? 'common-expand' : 'common-collapse';
        }
    }



    var model = yaxi.store = new (yaxi.model({

        current: '',

        icon: {

            sort: computeIconFn('sort'),

            type: computeIconFn('type'),

            filter: computeIconFn('filter')
        }

    }))();



    this.init = function () {

        this.loadTemplate(template, model);
    }



});
