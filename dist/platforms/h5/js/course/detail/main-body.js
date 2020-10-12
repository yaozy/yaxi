const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./main-body.html');



module.exports = yaxi.Box.extend(function (Class, base) {



    this.init = function (data) {
        
        data.selectedStatus = {
            theme: 'text-primary line-primary line-bottom'
        };

        this.loadTemplate(template, this.data = data);
        this.find('>>@host').children[0].onload(data);
    }



    this.handleFavorite = function (event) {

        var source = event.source;

        if (source.theme !== 'text-primary')
        {
            source.theme = 'text-primary';
            yaxi.MessageBox.info('收藏成功!');
        }
    }


    this.handleThumbup = function (event) {
        
        var source = event.source;

        if (source.theme !== 'text-primary')
        {
            source.theme = 'text-primary';
            yaxi.MessageBox.info('点赞成功!');
        }
    }

    

});