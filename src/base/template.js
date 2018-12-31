;(function () {

    
    function parse(array, node, space) {

        var attributes = node.attributes,
            item,
            name,
            value,
            bindings,
            events,
            any;

        switch (name = node.tagName)
        {
            case 'Require':
                array.push(space, 'Class: require.load(baseURL, "', node.getAttribute('src'), '")');
                node.removeAttribute('src');
                break;

            case 'HtmlControl':
                array.push(space, 'Class: classes.', name, ',\n');
                array.push(space, 'html: \'', node.innerHTML.replace(/\n\s*/g, '').replace(/[']/g, '\\\''), '\'');
                node = null;
                break;

            default:
                array.push(space, 'Class: classes.', name);
                break;
        }

        if (attributes && attributes[0])
        {
            bindings = events = null;

            for (var i = 0, l = attributes.length; i < l; i++)
            {
                item = attributes[i];
                name = item.nodeName;
                value = item.nodeValue;

                if (name === 'style')
                {
                    array.push(',\n', space, 'style: {');
                    parseStyle(array, value, space + '\t');
                    array.push('\n', space, '}');

                    continue;
                }
                
                if (name[1] === '-')
                {
                    any = name[0];
                    name = name.substring(2);

                    // 传入的数据
                    if (any === 'd')
                    {
                        array.push(',\n', space, name, ': data.' + value);
                        continue;
                    }

                    // 绑定
                    if (any === 'b')
                    {
                        if (bindings)
                        {
                            bindings.push(name, value);
                        }
                        else
                        {
                            bindings = [name, value];
                        }
                        
                        continue;
                    }

                    // 事件
                    if (any === 'e')
                    {
                        if (events)
                        {
                            events.push(name, value);
                        }
                        else
                        {
                            events = [name, value];
                        }

                        continue;
                    }
                }
            }

            if (bindings)
            {
                array.push(',\n', space, 'bindings: {');
                parseBindings(array, bindings, space + '\t');
                array.push('\n', space, '}');
            }

            if (events)
            {
                array.push(',\n', space, 'events: {');
                parseEvents(array, events, space + '\t');
                array.push('\n', space, '}');
            }
        }

        if (node = node && node.firstChild)
        {
            any = 0;
            array.push(',\n', space, 'children: [');

            do
            {
                if (node.nodeType === 1)
                {
                    if (any)
                    {
                        array.push(',');
                    }
                    else
                    {
                        any = 1;
                    }

                    array.push('\n', space, '\t{\n');
                    parse(array, node, space + '\t\t'),
                    array.push('\n', space, '\t}');
                }
            }
            while (node = node.nextSibling);

            array.push('\n', space, ']');
        }
    }


    function parseBindings(array, bindings, space) {

        var index = 0,
            name;

        while (name = bindings[index++])
        {
            if (index > 1)
            {
                array.push(',');
            }

            array.push('\n', space, name, ': "', bindings[index++], '"');
        }
    }


    function parseEvents(array, events, space) {

        var index = 0,
            name;

        while (name = events[index++])
        {
            if (index > 1)
            {
                array.push(',');
            }

            array.push('\n', space, name, ': data.', events[index++]);
        }
    }



    var styles = Object.create(null);

    var values = Object.create(null);


    function parseStyle(array, text, space) {

        var map = styles,
            cache = values,
            tokens = text.replace(/\s*([:;])\s*/g, '$1').split(';'),
            token,
            index,
            name,
            flag,
            bindings;

        for (var i = 0, l = tokens.length; i < l; i++)
        {
            if ((token = tokens[i]) && (index = token.indexOf(':')) > 0)
            {
                name = token.substring(0, index);
                name = map[name] || (map[name] = name.replace(/-([\w])/g, camelize));

                if (!(token = token.substring(index + 1)))
                {
                    continue;
                }

                token = cache[token] || (cache[token] = styleValue(token));

                if (token[0])
                {
                    if (bindings)
                    {
                        bindings.push(name, token[1]);
                    }
                    else
                    {
                        bindings = [name, token[1]];
                    }
                }
                else
                {
                    if (flag)
                    {
                        array.push(',');
                    }
                    else
                    {
                        flag = 1;
                    }
    
                    array.push('\n', space, name, ': ', token[1]);
                }
            }
        }

        if (bindings)
        {
            array.push(flag ? ',\n' : '\n', space, 'bindings: {');
            parseBindings(array, bindings, space + '\t');
            array.push('\n', space, '}');
        }
    }


    function styleValue(text) {

        // 绑定
        if (text[0] === 'b' && text[1] === '-')
        {
            return [1, text.substring(2)];
        }

        var list = text.split(/\s+/);

        for (var i = list.length; i--;)
        {
            text = list[i];

            if (text[1] === '-')
            {
                var key = text[0];

                // 传入的数据
                if (key === 'd')
                {
                    list[i] = 'data.' + text.substring(2) + '';
                    continue;
                }
                
                // 系统颜色
                if (key === 'c')
                {
                    list[i] = 'color["' + text.substring(2) + '"]';
                    continue;
                }
            }

            list[i] = '"' + text + '"';
        }

        return [0, list[1] ? list.join(' + ') : list[0]];
    }


    function camelize(_, key) {

        return key.toUpperCase();
    }


    
    require.template = function (text, url) {

        var node = new DOMParser().parseFromString(text, 'text/xml').documentElement,
            array = ['var baseURL = "' + url.substring(0, url.lastIndexOf('/') + 1) + '";\n\n',
                'if (!color) color = yaxi.color;\n',
                'if (!classes) classes = yaxi.classes;\n\n',
                'return {\n'];

        parse(array, node, '\t');

        array.push('\n};\n\n//# sourceURL=', url);

        return array.join('');
    }



})();
