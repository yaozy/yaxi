module.exports = function ($this, $data, $model) {

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
				"slidebox",
				{
					"flex": "auto",
					"circular": "true",
					"events": {
						"transition": $this.handleTransition.bind($this),
						"change": $this.handleChange.bind($this)
					}
				},
				[
					[
						require("home/main"),
						{

						}
					],
					[
						require("course/main"),
						{

						}
					],
					[
						require("spread/main"),
						{

						}
					],
					[
						require("message/main"),
						{

						}
					],
					[
						require("my/main"),
						{

						}
					]
				]
			],
			[
				"tabbar",
				{
					"theme": "line-lightest line-top"
				},
				[
					[
						"iconbutton",
						{
							"icon": "tabbar-home",
							"text": "首页",
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-course",
							"text": "课程",
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-spread",
							"text": "推广",
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-message",
							"text": "消息",
							"selected-status": { theme: 'text-primary' }
						}
					],
					[
						"iconbutton",
						{
							"icon": "tabbar-my",
							"text": "我的",
							"selected-status": { theme: 'text-primary' }
						}
					]
				]
			]
		]
	]
)


}