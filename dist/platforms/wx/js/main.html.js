module.exports = function (data) {


with (data) return (
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
					"key": "host"
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
						"imagebutton",
						{
							"src": "/images/home/home.png",
							"content": "首页",
							"module": require('home/main.js'),
							"selected-status": { theme: 'primary', src: '/images/home/home-selected.png' }
						}
					],
					[
						"imagebutton",
						{
							"src": "/images/home/category.png",
							"content": "分类",
							"module": require('category/main.js'),
							"selected-status": { theme: 'primary', src: '/images/home/category-selected.png' }
						}
					],
					[
						"imagebutton",
						{
							"src": "/images/home/bought.png",
							"content": "已购",
							"module": require('bought/main.js'),
							"selected-status": { theme: 'primary', src: '/images/home/bought-selected.png' }
						}
					],
					[
						"imagebutton",
						{
							"src": "/images/home/my.png",
							"content": "我的",
							"module": require('my/main.js'),
							"selected-status": { theme: 'primary', src: '/images/home/my-selected.png' }
						}
					]
				]
			]
		]
	]
)


}