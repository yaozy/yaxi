yaxi.Page.extend('Dialog', function (Class, base, yaxi) {
	
	
	
}, function Dialog() {


	yaxi.Box.apply(this, arguments);


});




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
					padding: '20rem 50rem 80rem'
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
						width: '90%',
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



	Class.delete = function (text, onclosed) {

		if (typeof text === 'function')
		{
			onclosed = text;
			text = '';
		}

		this.open({

			title: '确认删除',
			content: '确认要删除' + (text || '') + '?'

		}, onclosed);
	}


	Class.info = function (text, onclosed) {

		this.open({

			title: '提醒',
			content: text,
			buttons: 'OK'

		}, onclosed);
	}


});
