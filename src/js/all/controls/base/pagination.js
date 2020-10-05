yaxi.component('Pagination', function (Class, base) {


    // 分页模式
    // dot      点
    // number   数字
    this.$('mode', 'dot');


    // 数量
    this.$('count', 0);



    this.__set_mode = function (value) {

    }


    this.__set_count = function (value) {

    }



    function render_dot(count) {

    }


    function render_number(count) {

    }



}, function Pagination() {


    yaxi.Control.apply(this, arguments);


});
