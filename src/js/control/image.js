yaxi.Image = yaxi.Control.extend(function () {



    yaxi.template(this, '<img class="yx-control yx-image"></img>');
    
    

    // 图标路径
    this.$property('src', '');



}).register('Image');
