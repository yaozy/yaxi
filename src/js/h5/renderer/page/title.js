yaxi.Title = yaxi.Control.extend(function (Class) {
    
    

    yaxi.template(this, '<div class="$class"></div>');
    
    


    this.$property('text', '');




    this.$mixin.text = function (view, value) {

        view.textContent = value;
    }
	
	
	
}).register('Title');
