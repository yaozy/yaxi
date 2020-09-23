module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\main.html")

return (
	[
		"page",
		null,
		[
			require("./components/header.html")($owner, $data, $model),
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
					"theme": "border-level4 border-top"
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