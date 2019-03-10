(function (color) {


    color['back-header'] = '#ffffff';
    color['back-content'] = '#f7f7f7';
    color['back-footer'] = '#ffffff';


    color['back-default'] = '#ffffff';
    color['back-reverse'] = '#f7f7f7';

    color['back-primary'] = '#f4b532';
    color['back-second'] = '#f4b532';
    color['back-success'] = '#71c04a';
    color['back-warning'] = '#e89518';
    color['back-danger'] = '#ff6c6c';
    color['back-disabled'] = '#666666';


    color['font-level1'] = '#31313d';
    color['font-level2'] = '#6c768b';
    color['font-level3'] = '#b8c0de';
    color['font-level4'] = '#cccccc';
    color['font-level5'] = '#f7f7f7';

    color['font-reverse'] = '#ffffff';

    color['font-primary'] = '#f4b532';
    color['font-second'] = '#f4b532';
    color['font-success'] = '#71c04a';
    color['font-warning'] = '#e89518';
    color['font-danger'] = '#ff6c6c';
    color['font-disabled'] = '#666666';


    color['border-level1'] = '#6c768b';
    color['border-level2'] = '#6c768b';
    color['border-level3'] = '#b8c0de';
    color['border-level4'] = '#cccccc';
    color['border-level5'] = '#f7f7f7';

    color['border-reverse'] = '#ffffff';

    color['border-primary'] = '#f4b532';
    color['border-second'] = '#f4b532';
    color['border-success'] = '#71c04a';
    color['border-warning'] = '#e89518';
    color['border-danger'] = '#dd6161';
    color['border-disabled'] = '#666666';


    color['icon-level1'] = '#31313d';
    color['icon-level2'] = '#6c768b';
    color['icon-level3'] = '#b8c0de';
    color['icon-level4'] = '#cccccc';
    color['icon-level5'] = '#f7f7f7';

    color['icon-reverse'] = '#ffffff';

    color['icon-primary'] = '#f4b532';
    color['icon-second'] = '#f4b532';
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


    
    (yaxi.colors || (yaxi.colors = {})).default = color;
    

    if (typeof color !== 'undefined')
    {
        jiac.color = color;
    }
    

})(yaxi.color = {});
