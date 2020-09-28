yaxi.Dialog = yaxi.Box.extend(function (Class, base, yaxi) {
	


	// 禁止作为子控件
	Class.allowParent = function (parent) {

		return parent instanceof yaxi.Page;
	}



    // 是否顶级控件
    this.isTopLevel = true;



	this.__find_up = function () {
	
		return null;
	}

	
	
	// 对话框加载前处理
	this.onloading = function (options) {
	}
	
	

	// 对话框加载后处理
	this.onload = function (options) {
	}
	

	// 对话框关闭前处理(返回false退停止关闭窗口)
	this.onunloading = function (options) {
	}


	// 对话框关闭后处理
	this.onunload = function (options) {
	}


	// 关闭窗口
	this.close = function (type, data) {

		var page = yaxi.currentPage;
		var options = this.options;
		var callback;

		if (page && this.onunloading(options) !== false)
		{
			this.remove();
			this.onunload(options);
    
			this.options = null;
			this.destroy();
	
			if (callback = this.__callback)
			{
				this.__callback = null;
				callback(type, data);
			}
		}
	}


	
	function open(options, callback) {

		var page = yaxi.currentPage;
		var dialog = new this(options);
        
		if (page && dialog.onloading(options) !== false)
		{
			dialog.options = options;
			dialog.__callback = callback;

			page.children.push(dialog);
			
			dialog.onload(options);
		}
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


	
	
}, function Dialog() {

	yaxi.Box.apply(this, arguments);

}).register('Dialog');




yaxi.MessageBox = yaxi.Dialog.extend(function (Class) {



	Class.sealed = true;


	Class.buttons = {
		OK: '确定',
		Cancel: '取消',
		Yes: '是',
		No: '否',
		Agree: '同意',
		Refuse: '拒绝'
	}



	function close(event) {

		this.close(event.target.key);
	}


	this.init = function (options) {

		var title, content, buttons;
		
		if (options)
		{
			if (typeof options !== 'object')
			{
				options = '' + options;
			}
		}
		else
		{
			options = {};
		}

		title = options.title || Class.title || 'yaxi';
		content = options.content;
		buttons = options.buttons || 'OK,Cancel';
	
		if (typeof title === 'string')
		{
			title = [
				'text',
				{
					height: '120rem',
					lineHeight: '120rem',
					textAlign: 'center',
					fontWeight: 'bold'
				},
				title
			];
		}
	
		if (typeof content === 'string')
		{
			content = [
				'text', 
				{
					minHeight: '150rem',
					padding: '20rem 50rem'
				},
				content
			];
		}
	
		if (typeof buttons === 'string')
		{
			var keys = Class.buttons;
			var last = (buttons = buttons.split(',')).length - 1;

			for (var i = last + 1; i--;)
			{
				buttons[i] = [
					'text',
					{
						key: buttons[i],
						minWidth: '180rem',
						height: '80rem',
						lineHeight: '80rem',
						theme: i === last ? 'text-primary' : '',
						textAlign: 'center',
						fontWeight: 'bold',
						events: {
							tap: close.bind(this)
						}
					},
					keys[buttons[i]]
				]
			}
		}
	
		this.load([
			'',
			null,
			[
				[
					'masklayer',
					{
						key: 'Cancel',
						events: {
							tap: close.bind(this)
						}
					}
				],
				[
					'box',
					{
						theme: 'bg-standard line-lighter line-top',
						absolute: 'middle center',
						width: '80%',
						minHeight: '250rem',
						maxHeight: '80%',
						layout: 'column'
					},
					[
						title,
						content,
						[
							'box',
							{
								layout: 'row middle after',
								theme: 'line-lightest line-top',
								minHeight: '120rem',
								padding: '0 50rem'
							},
							buttons
						]
					]
				]
			]

		]);
	}




	Class.delete = function (text, callback) {

		if (typeof text === 'function')
		{
			callback = text;
			text = '';
		}

		this.open({

			title: '确认删除',
			content: '确认要删除' + (text || '') + '?'

		}, callback);
	}


	Class.info = function (text) {

		this.open({

			title: '提醒',
			content: text,
			buttons: 'OK'
		});
	}


});
