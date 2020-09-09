yaxi.GestureInput = yaxi.Control.extend(function (Class, base) {



    // 节点贯穿检查
    var throughs = [null,

        // 1
        {
            3: 2,
            7: 4,
            9: 5
        },

        // 2
        {
            8: 5
        },

        // 3
        {
            1: 2,
            7: 5,
            9: 6
        },

        // 4
        {
            6: 5
        },

        // 5
        {},

        //6
        {
            4: 5
        },

        // 7
        {
            1: 4,
            3: 5,
            9: 8
        },

        // 8
        {
            2: 5
        },

        // 9
        {
            1: 5,
            3: 6,
            7: 8
        }
    ];



    yaxi.template(this, '<div class="$class"><div><canvas></canvas><div></div></div></div>');



    
    this.$property('border', '1px solid silver');


    this.$property('color', 'silver');


    this.$property('size', .2);


    this.$property('lineColor', 'silver', true, 'line-color');


    this.$property('lineWidth', 5, true, 'line-width');


    this.$property('value', '');




    this.render = function () {

        var view = base.render.call(this);
        
        view.firstChild.lastChild.innerHTML = points(this);
        return view;
    }


    function points(self) {

        var array = [''],
            size = self.size,
            half = Decimal.singleton(size).div(2).value + 'rem;',
            style = ' style="width:' + (size += 'rem;')
                + 'height:' + size 
                + 'margin-top:-' + half 
                + 'margin-left:-' + half 
                + 'background-color:' + self.color 
                + ';border:' + self.border
                + ';border-radius:' + half,
            top,
            left;

        for (var i = 0; i < 3; i++)
        {
            top = i > 0 ? (i === 1 ? 'top:50%;' : 'bottom:' + half) : 'top:' + size;
            
            for (var j = 1; j < 4; j++)
            {
                left = j > 1 ? (j === 2 ? 'left:50%;' : 'right:' + half) : 'left:' + size;
                array.push('<div class="yx-gestureinput-point"', style, top, left, '"></div>');
            }
        }

        return array.join('');
    }




    var state = {};


    this.__on_touchstart = function (event) {

        var view = this.$view.firstChild,
            rect = view.getBoundingClientRect(),
            index;

        state.x = rect.left;
        state.y = rect.top;
        state.width = view.offsetWidth;
        state.height = view.offsetHeight;
        state.size = state.width / 6 | 0;

        this.value = '';

        if (index = hitTest(event.clientX - state.x, event.clientY - state.y))
        {
            change.call(this, index, false);
        }

        event.stop();
        return false;
    }


    this.__on_touchmove = function (event) {

        var index = hitTest(event.clientX - state.x, event.clientY - state.y);

        if (!index || !change.call(this, index))
        {
            draw.call(this, {

                x: event.clientX - state.x, 
                y: event.clientY - state.y
            });
        }

        event.stop();
        return false;
    }


    this.__on_touchend = function () {

        var event = new yaxi.Event('change');

        draw.call(this);

        event.value = this.value;
        this.trigger(event);
    }


    function change(index, through) {

        var children = this.$view.firstChild.lastChild.children,
            value = this.value;

        if (through !== false)
        {
            through = throughs[index][value[value.length - 1]];

            if (through && value.indexOf(through) < 0)
            {
                value += through;
                children[through - 1].setAttribute('choose', 1);
            }
            else
            {
                through = '';
            }
        }

        if (value.indexOf(index) < 0)
        {
            children[index - 1].setAttribute('choose', 1);
            this.value = value + index;

            return true;
        }

        if (through)
        {
            this.value = value;
            return true;
        }

        return false;
    }


    function hitTest(x, y) {

        var width = state.width,
            height = state.height,
            size = state.size,
            half = size / 2 | 0,
            column,
            row;

        if (x < 0 || x > width || y < 0 || y > height)
        {
            return 0;
        }

        if (y <= size)
        {
            row = 0;
        }
        else if (y >= height - size)
        {
            row = 2;
        }
        else if ((y = y - (height / 2 | 0)) < -half || y > half)
        {
            return 0;
        }
        else
        {
            row = 1;
        }

        if (x <= size)
        {
            column = 1;
        }
        else if (x >= width - size)
        {
            column = 3;
        }
        else if ((x = x - (width / 2 | 0)) < -half || x > half)
        {
            return 0;
        }
        else
        {
            column = 2;
        }

        return row * 3 + column;
    }


    function draw(point) {

        var view = this.$view,
            value = this.value,
            canvas = view.firstChild.firstChild,
            context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width = canvas.offsetWidth, canvas.height = canvas.offsetHeight);

        if (value)
        {
            var children = view.firstChild.lastChild.children,
                index = 1;

            view = children[value[0] - 1];

            context.moveTo(view.offsetLeft + view.offsetWidth / 2, view.offsetTop + view.offsetHeight / 2);

            while (view = children[value[index++] - 1])
            {
                context.lineTo(view.offsetLeft + view.offsetWidth / 2, view.offsetTop + view.offsetHeight / 2);
            }

            if (point)
            {
                context.lineTo(point.x, point.y);
            }

            context.strokeStyle = this.lineColor;
            context.lineWidth = this.lineWidth;
            context.lineJoin = 'bevel';
            context.stroke();
        }
    }



    this.$mixin.value = function (view, value) {

        if (value)
        {
            if (view.offsetWidth > 0)
            {
                draw.call(this);
            }
            else if (this.parent)
            {
                this.root.once('opened', draw.bind(this));
            }
        }
        else
        {
            draw.call(this);
            
            view = view.firstChild.lastChild.firstChild;
            
            while (view)
            {
                view.removeAttribute('choose');
                view = view.nextSibling;
            }
        }
    }



}).register('GestureInput');
