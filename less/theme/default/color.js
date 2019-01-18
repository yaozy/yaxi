(function (color) {


    color['back-header'] = '#ffffff';
    color['back-content'] = '#f7f7f7';
    color['back-footer'] = '#ffffff';


    color['back-level1'] = '#ffffff';
    color['back-level2'] = '#cccccc';
    color['back-level3'] = '#b9ced4';
    color['back-level4'] = '#cccccc';
    color['back-level5'] = '#f7f7f7';

    color['back-reverse'] = '#f7f7f7';

    color['back-primary'] = '#d0ae75';
    color['back-second'] = '#d0ae75';
    color['back-success'] = '#71c04a';
    color['back-warning'] = '#e89518';
    color['back-danger'] = '#ff6c6c';
    color['back-disabled'] = '#666666';


    color['font-level1'] = '#2d4a63';
    color['font-level2'] = '#8094a5';
    color['font-level3'] = '#b9ced4';
    color['font-level4'] = '#cccccc';
    color['font-level5'] = '#cccccc';

    color['font-reverse'] = '#ffffff';

    color['font-primary'] = '#d0ae75';
    color['font-second'] = '#d0ae75';
    color['font-success'] = '#71c04a';
    color['font-warning'] = '#e89518';
    color['font-danger'] = '#ff6c6c';
    color['font-disabled'] = '#666666';


    color['border-level1'] = '#8094a5';
    color['border-level2'] = '#8094a5';
    color['border-level3'] = '#b9ced4';
    color['border-level4'] = '#cccccc';
    color['border-level5'] = '#cccccc';

    color['border-reverse'] = '#ffffff';

    color['border-primary'] = '#d0ae75';
    color['border-second'] = '#d0ae75';
    color['border-success'] = '#71c04a';
    color['border-warning'] = '#e89518';
    color['border-danger'] = '#dd6161';
    color['border-disabled'] = '#666666';


    color['icon-level1'] = '#2d4a63';
    color['icon-level2'] = '#8094a5';
    color['icon-level3'] = '#b9ced4';
    color['icon-level4'] = '#cccccc';
    color['icon-level5'] = '#cccccc';

    color['icon-reverse'] = '#ffffff';

    color['icon-primary'] = '#d0ae75';
    color['icon-second'] = '#d0ae75';
    color['icon-success'] = '#71c04a';
    color['icon-warning'] = '#e89518';
    color['icon-danger'] = '#ff6c6c';
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
