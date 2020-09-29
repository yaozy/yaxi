module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				null
			],
			[
				"stackbox",
				{
					"flex": "auto",
					"full": "true"
				}
			],
			[
				"tabbar",
				{
					"selected-index": "0",
					"theme": "line-lightest line-top"
				},
				[
					[
						"iconbutton",
						{
							"icon": "tabbar-home",
							"text": "首页",
							"module": require('home/main.js'),
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-lesson",
							"text": "课程",
							"module": require('lesson/main.js'),
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-spread",
							"text": "推广",
							"module": require('spread/main.js'),
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-message",
							"text": "消息",
							"module": require('message/main.js'),
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-my",
							"text": "我的",
							"module": require('my/main.js'),
							"selected-status": { theme: 'text-primary' }
						}
					]
				]
			]
		]
	]
)


}