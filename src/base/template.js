;(function () {



    var styleKeys = Object.create(null);

    var styleCache = Object.create(null);




    function parse(array, node, space) {

        var attributes = node.attributes,
            tagName = node.tagName,
            item,
            name,
            value,
            bindings,
            styles,
            events,
            any;

        switch (tagName)
        {
            case 'R':
            case 'Ref':
            case 'Require':
            case 'Reference':
                array.push(space, 'Class: yaxi.loadModule(__dirname, "', node.getAttribute('src'), '")');
                node.removeAttribute('src');
                break;

            case 'HTML':
            case 'HtmlControl':
                array.push(space, 'Class: __k.HtmlControl,\n');
                array.push(space, 'html: \'', node.innerHTML.replace(/\n\s*/g, '').replace(/[']/g, '\\\''), '\'');
                node = null;
                break;

            default:
                array.push(space, 'Class: __k.', tagName);
                break;
        }

        if (attributes && attributes[0])
        {
            for (var i = 0, l = attributes.length; i < l; i++)
            {
                item = attributes[i];
                name = item.nodeName;
                value = item.nodeValue;

                if (name === 'style')
                {
                    parseStyle(styles || (styles = []), value, space + '\t');
                    continue;
                }

                if (name === 'class')
                {
                    array.push(',\n', space, 'className: "', value, '"');
                    continue;
                }
                
                if (name[1] === '-')
                {
                    any = name[0];
                    name = name.substring(2);

                    // 传入的数据
                    if (any === 'd')
                    {
                        // 样式
                        if (name[0] === 's' && /style-/.test(name))
                        {
                            name = name.substring(6);
                            name = styleKeys[name] || (styleKeys[name] = name.replace(/-([\w])/g, camelize));
                            
                            if (styles)
                            {
                                styles.push(styles[0] ? ',\n' : '', space, '\t', name, ': ', value);
                            }
                            else
                            {
                                styles = [space, '\t', name, ': ', value];
                            }
                        }
                        else
                        {
                            array.push(',\n', space, name, ': ', value);
                        }
                        continue;
                    }

                    // 绑定
                    if (any === 'b')
                    {
                        // 样式
                        if (name[0] === 's' && /style-/.test(name))
                        {
                            name = name.substring(6);
                            name = styleKeys[name] || (styleKeys[name] = name.replace(/-([\w])/g, camelize));

                            if (styles)
                            {
                                any = styles.bindings || (styles.bindings = []);
                            }
                            else
                            {
                                any = (styles = []).bindings = [];
                            }

                            any.push(any[0] ? ',\n' : '', space, '\t\t', name, ': "', value, '"');
                        }
                        else if (bindings)
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

                array.push(',\n', space, name, ': "', value, '"');
            }

            if (styles)
            {
                array.push(',\n', space, 'style: {', styles.join(''));

                if (any = styles.bindings)
                {
                    array.push(styles[0] ? ',\n' : '', space, '\tbindings: {\n', any.join(''), '\n', space, '\t}');
                }
                
                array.push('\n', space, '}');
            }

            if (bindings)
            {
                array.push(',\n', space, 'bindings: {');
                writeBindings(array, bindings, space + '\t');
                array.push('\n', space, '}');
            }

            if (events)
            {
                array.push(',\n', space, 'events: {');
                writeEvents(array, events, space + '\t');
                array.push('\n', space, '}');
            }
        }

        if (node && (node = node.firstChild))
        {
            if (tagName === 'Repeater')
            {
                parseTemplate(array, node, space);
            }
            else
            {
                parseChildren(array, node, space);
            }
        }
    }


    function parseTemplate(array, node, space) {

        do
        {
            if (node.nodeType === 1)
            {
                array.push(',\n', space, '\ttemplate: {\n');
                parse(array, node, space + '\t\t'),
                array.push('\n', space, '\t}');

                return;
            }
        }
        while (node = node.nextSibling);
    }


    function parseChildren(array, node, space) {

        var flag;

        do
        {
            if (node.nodeType === 1)
            {
                if (flag)
                {
                    array.push(',');
                }
                else
                {
                    array.push(',\n', space, 'children: [');
                    flag = 1;
                }

                array.push('\n', space, '\t{\n');
                parse(array, node, space + '\t\t'),
                array.push('\n', space, '\t}');
            }
        }
        while (node = node.nextSibling);

        if (flag)
        {
            array.push('\n', space, ']');
        }
    }


    function parseStyle(array, text, space) {

        var keys = styleKeys,
            cache = styleCache,
            tokens = text.split(';'),
            token,
            index,
            name,
            flag;

        for (var i = 0, l = tokens.length; i < l; i++)
        {
            if ((token = tokens[i]) && (index = token.indexOf(':')) > 0)
            {
                name = token.substring(0, index);
               
                if (!(token = token.substring(index + 1)))
                {
                    continue;
                }

                name = keys[name] || (keys[name] = name.trim().replace(/-([\w])/g, camelize));
                token = cache[token] || (cache[token] = styleValue(token.trim()));

                if (flag)
                {
                    array.push(',');
                }
                else
                {
                    flag = 1;
                }

                array.push('\n', space, name, ': ', token);
            }
        }
    }


    function styleValue(text) {

        // c-开头表示系统颜色
        if (text.indexOf('c-') >= 0)
        {
            text = '"' + text.replace(/c\-([\w-]+)/g, '" + __c["$1"] + "') + '"';
            return text.replace('"" + ', '').replace('+ ""', '');
        }

        return '"' + text + '"';
    }


    function camelize(_, key) {

        return key.toUpperCase();
    }


    function writeBindings(array, bindings, space) {

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


    function writeEvents(array, events, space) {

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




    
    require.template = function (text, url) {

        var node = new DOMParser().parseFromString(text, 'text/xml').documentElement,
            array = ['var __dirname = "' + url.substring(0, url.lastIndexOf('/') + 1) + '";\n',
                'var __c = color || yaxi.color;\n',
                'var __k = classes || yaxi.classes;\n\n',
                'with(data)\n{\n',
                'return {\n'];

        parse(array, node, '\t');

        array.push('\n};\n}\n\n//# sourceURL=', url);

        return array.join('');
    }



})();
