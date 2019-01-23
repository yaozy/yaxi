yaxi.Header = yaxi.Panel.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-panel yx-header" layout="line-middle"></div>');



    this.$defaults.key = 'page-header';


    this.$defaults.layout = 'line-middle';
    


}).register('Header');
