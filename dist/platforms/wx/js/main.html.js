module.exports = function (scope) {


return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"content": "华旅教育"
				}
			],
			[
				"box",
				{
					"key": "host",
					"flex": "both"
				}
			],
			[
				"tab",
				{
					"host": "<* >@host",
					"selected-index": "0"
				},
				[
					[
						"iconbutton",
						{
							"icon": "tabbar-home",
							"content": "首页",
							"module": require('home/main.js'),
							"selected-status": { theme: 'primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-lesson",
							"content": "课程",
							"module": require('lesson/main.js'),
							"selected-status": { theme: 'primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-spread",
							"content": "推广",
							"module": require('spread/main.js'),
							"selected-status": { theme: 'primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-message",
							"content": "消息",
							"module": require('message/main.js'),
							"selected-status": { theme: 'primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-my",
							"content": "我的",
							"module": require('my/main.js'),
							"selected-status": { theme: 'primary' }
						}
					]
				]
			]
		]
	]
)


}