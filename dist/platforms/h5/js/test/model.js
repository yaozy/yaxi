const yaxi = require('../../yaxi/js/yaxi');
const template = require('./model.html');


module.exports = yaxi.Page.extend(function (Class, base) {


    var id = 1;


    var arrayModel = yaxi.store = new (yaxi.arrayModel({
        name: '',
        value: 0,

        submodel: [
            {
                text: ''
            }
        ],

        computed: function () {

            return 'computed: ' + this.name + ' + ' + this.value;
        }
    }));



    for (var i = 1; i < 100; i++)
    {
        arrayModel.push({
            name: 'name' + id++,
            value: Math.random(),

            submodel: [
                { text: 'submodel text 1' },
                { text: 'submodel text 2' },
                { text: 'submodel text 3' },
            ]
        })
    }



    this.init = function () {

        this.load(template(this, {}, arrayModel));
    }


    this.handleAppend = function () {

        arrayModel.push({
            name: 'name' + id++,
            value: Math.random()
        })
    }


    this.handleReplace = function () {

        arrayModel.forEach(function (item) {

            item.value = Math.random();
        });
    }


    this.handleRemove = function () {

        arrayModel.shift();
    }


    this.handleReorder = function () {

        arrayModel.reverse();
    }


});
