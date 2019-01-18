(function (color) {


    color['back-header'] = '#ffffff';
    color['back-content'] = '#f7f7f7';
    color['back-footer'] = '#ffffff';


    color['back-default'] = '#ffffff';
    color['back-light'] = '#cccccc';
    color['back-info'] = '#b9ced4';
    color['back-explain'] = '#cccccc';
    color['back-reverse'] = '#f7f7f7';

    color['back-primary'] = '#d0ae75';
    color['back-second'] = '#d0ae75';
    color['back-success'] = '#71c04a';
    color['back-warning'] = '#e89518';
    color['back-danger'] = '#dd6161';
    color['back-disabled'] = '#666666';


    color['font-default'] = '#2d4a63';
    color['font-light'] = '#8094a5';
    color['font-info'] = '#b9ced4';
    color['font-explain'] = '#cccccc';
    color['font-reverse'] = '#ffffff';

    color['font-primary'] = '#d0ae75';
    color['font-second'] = '#d0ae75';
    color['font-success'] = '#71c04a';
    color['font-warning'] = '#e89518';
    color['font-danger'] = '#dd6161';
    color['font-disabled'] = '#666666';


    color['border-default'] = '#8094a5';
    color['border-light'] = '#8094a5';
    color['border-info'] = '#b9ced4';
    color['border-explain'] = '#cccccc';
    color['border-reverse'] = '#ffffff';

    color['border-primary'] = '#d0ae75';
    color['border-second'] = '#d0ae75';
    color['border-success'] = '#71c04a';
    color['border-warning'] = '#e89518';
    color['border-danger'] = '#dd6161';
    color['border-disabled'] = '#666666';


    color['icon-default'] = '#2d4a63';
    color['icon-light'] = '#8094a5';
    color['icon-info'] = '#b9ced4';
    color['icon-explain'] = '#cccccc';
    color['icon-reverse'] = '#ffffff';

    color['icon-primary'] = '#d0ae75';
    color['icon-second'] = '#d0ae75';
    color['icon-success'] = '#71c04a';
    color['icon-warning'] = '#e89518';
    color['icon-danger'] = '#dd6161';
    color['icon-disabled'] = '#666666';


    color.back = {};
    color.font = {};
    color.border = {};
    color.icon = {};

    for (var name in color)
    {
        var items = name.split('-');
        color[items[0]][items[1]] = color[name];
    }


    color['mask'] = '#000000';


    (yaxi.colors || (yaxi.colors = Object.create(null))).default = color;
    
    

})(yaxi.color = Object.create(null));
