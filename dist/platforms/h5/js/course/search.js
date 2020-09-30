const yaxi = require('../../yaxi/js/yaxi');
const template = require('./search.html');
const toolbar = require('./toolbar-model');



module.exports = yaxi.Box.extend(function () {


    
    var model = yaxi.store1 = new (yaxi.model({

        last: '',
        text: '',

        hidden: true,

        empty: function () {

            return !this.text;
        }

    }))();




    this.max = 8;



    this.init = function (size) {

        this.loadTemplate(template, {

            size: size || '100%'

        }, model);
    }



    function loadData(search, value) {

        var list = [];

        for (var i = 1, l = search.max || 8; i <= l; i++)
        {
            list.push({
                before: '课程',
                after: '章节' + i
            });
        }

        model.hidden = !value;
        model.text = value;

        search.find('>>databox').data = list;
    }


    this.handleInput = function (event) {

        loadData(this, event.detail);
    }


    this.handleClear = function () {

        model.hidden = true;
        model.text = model.last = '';
    }


    this.handleCancel = function () {

        model.text = model.last;
        model.hidden = false;
    }


    this.handleFocus = function () {

        toolbar.type = '';
        loadData(this, model.text);
    }



    function raiseEvent(target, value) {

        var event = new yaxi.Event('change', { value: value });

        model.hidden = true;
        model.text = model.last = value;

        target.trigger(event);
    }


    this.handleSearch = function () {

        raiseEvent(this, model.text);
    }


    this.handleSuggest = function (event) {

        var target = event.source;
        var item = +target.tag;

        if (item >= 0 && (item = target.parent.data[item]))
        {
            raiseEvent(this, item.before + model.text + item.after);
        }
    }



});
