module.exports = function () {


return (
	[
		"box",
		{
			"theme": "level5-bg",
			"layout": "column"
		},
		[
			[
				"swiper",
				{
					"style": "flex-shrink:0;"
				},
				[
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					]
				]
			],
			[
				"band",
				{
					"style": "height:60rem;"
				}
			],
			[
				"band",
				{
					"theme": "level1",
					"style": "height:80rem;margin-top:10rem;padding:10rem 20rem;"
				},
				[
					[
						"button",
						{
							"layout": "row",
							"theme": "level4",
							"style": "height:60rem;line-height:60rem;border-radius:60rem;border:.5px solid @border-level4-color",
							"events": {
								"tap": this.handleSearch
							}
						},
						[
							[
								"icon",
								{
									"icon": "common-search"
								}
							],
							[
								"text",
								null,
								"搜索老师、机构、课程"
							]
						]
					]
				]
			],
			[
				"box",
				{
					"key": "host",
					"style": "min-height:200rem;"
				}
			]
		]
	]
)


}