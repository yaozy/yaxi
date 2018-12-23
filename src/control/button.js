yaxi.Button = yaxi.Control.extend(function (Class, base) {


    Class['en-US'] = {
        OK: 'OK',
        Cancel: 'Cancel',
        Yes: 'Yes',
        No: 'No'
    };


    Class['zh-CN'] = {
        OK: '确定',
        Cancel: '取消',
        Yes: '是',
        No: '否'
    };


    Class['zh-TW'] = {
        OK: '確定',
        Cancel: '取消',
        Yes: '是',
        No: '否'
    };



    yaxi.template(this, '<button type="button" class="yx-control yx-button"></button>');



    this.$property('text', '');
    


    this.renderer.text = function (dom, value) {

        dom.textContent = value;
    }



}).register('Button');
