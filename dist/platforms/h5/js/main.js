const yaxi = require('../yaxi/js/yaxi');
const template = require('./main.html');


// 标记使用模拟数据
yaxi.http.mock = true;


module.exports = yaxi.Page.extend(function (Class, base) {


    // 标记作为起始主页
    Class.main = true;


    // 默认窗口标题
    yaxi.Header.text = '华旅云创';

    

    this.init = function () {

        this.loadTemplate(template);

        this.on('more', function () {

            this.find('>tabbar').selectedIndex = 1;
        });
    }


});
