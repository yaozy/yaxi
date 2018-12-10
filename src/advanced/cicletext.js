yaxi.CircleText = yaxi.Control.extend(function () {



    yaxi.template(this, '<svg class="yx-control yx-circletext" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /><text x="50%" y="50%" dy="20" text-anchor="middle" style="font-size:60;" /></svg>');



    this.$property('text', '');

    
    this.$property('stroke', '');


    this.$property('strokeWidth', 0);


    this.$property('fill', '');


    this.$property('color', '');


    this.$property('textSize', 60);


    

    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_stroke = function (dom, value) {

        dom.firstChild.style.stroke = value;
    }


    this.__set_strokeWidth = function (dom, value) {

        dom.firstChild.style.strokeWidth = value;
    }


    this.__set_fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }


    this.__set_color = function (dom, value) {

        dom.lastChild.style.fill = value;
    }


    this.__set_textSize = function (dom, value) {

        dom = dom.lastChild;
        dom.style.fontSize = value;
        dom.setAttribute('dy', 100 - value >> 1);
    }



}).register('CircleText');
