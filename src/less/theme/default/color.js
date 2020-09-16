(function (yaxi) {


    var create = Object.create;

    var colors = yaxi.colors || (yaxi.colors = create(null));

    var color = yaxi.color = colors.default = create(null);


    var bg = color.bg = create(null);

    var font = color.font = create(null);

    var border = color.border = create(null);

 

    bg.level1 = '#ffffff';
    bg.level2 = '#f7f7f7';
    bg.level3 = '#cccccc';
    bg.level4 = '#888888';
    bg.level5 = '#555555';

    bg.important = '#c40606';
    bg.primary = '#1c86ee';
    bg.second = '#48d1cc';
    bg.success = '#71c04a';
    bg.warning = '#e89518';
    bg.danger = '#ff6c6c';
    bg.disabled = '#eeeeee';


    font.level1 = '#31313d';
    font.level2 = '#6c768b';
    font.level3 = '#b8c0de';
    font.level4 = '#cccccc';
    font.level5 = '#f7f7f7';

    font.important = '#c40606';
    font.primary = '#1c86ee';
    font.second = '#48d1cc';
    font.success = '#71c04a';
    font.warning = '#e89518';
    font.danger = '#ff6c6c';
    font.disabled = '#999999';


    border.level1 = '#31313d';
    border.level2 = '#6c768b';
    border.level3 = '#b8c0de';
    border.level4 = '#cccccc';
    border.level5 = '#ffffff';

    border.important = '#c40606';
    border.primary = '#1c86ee';
    border.second = '#48d1cc';
    border.success = '#71c04a';
    border.warning = '#e89518';
    border.danger = '#ff6c6c';
    border.disabled = '#999999';


    color.mask = '#000000';
    
    color.shadow = '#888888';



    (function combine(prefix, value) {

        if (typeof value !== 'object')
        {
            color[prefix + 'color'] = value;
        }
        else
        {
            for (var name in value)
            {
                combine(prefix + name + '-', value[name]);
            }
        }

    })('', color);



})(yaxi);
