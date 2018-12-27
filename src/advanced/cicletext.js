yaxi.CircleText = yaxi.Control.extend(function () {




    yaxi.template(this, '<span class="yx-control yx-circletext"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="50" ry="50" /></svg><span></span></span>');



    this.$property('text', '');

    
    this.$property('stroke', '');


    this.$property('strokeWidth', 0);

    


    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    renderer.stroke = function (dom, value) {

        dom.firstChild.firstChild.style.stroke = value;
    }


    renderer.strokeWidth = function (dom, value) {

        dom.firstChild.firstChild.style.strokeWidth = value;
    }



}).register('CircleText');
