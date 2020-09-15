const yaxi = require('../yaxi/js/yaxi');
const template = require('./main.html');


// 标记使用模拟数据
yaxi.http.mock = true;


module.exports = yaxi.Page.extend(function (Class, base) {


    // 标记作为起始主页
    Class.main = true;


    this.init = function () {

        this.loadTemplate(template);
    }


});
