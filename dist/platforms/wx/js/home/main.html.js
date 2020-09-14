module.exports = function () {


return (
	[
		"box",
		{
			"theme": "level5-bg"
		},
		[
			[
				"swiper",
				{
					autoplay: false
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
					"style": "height:100rem;margin-top:10rem;padding:10rem 20rem;"
				},
				[
					[
						"button",
						{
							"layout": "row",
							"theme": "level4",
							"style": "line-height:80rem;border-radius:80rem;border:.5px solid @border-level4-color",
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
				"band",
				{
					"theme": "level1",
					"style": "height:100rem;margin-top:10rem;padding:10rem;"
				},
				[
					require("./box-title.html").call({ icon: 'home-hot', text: '热门课程' }),
					[
						"band",
						{
							"key": "hot"
						}
					]
				]
			],
			[
				"band",
				{
					"theme": "level1",
					"style": "height:100rem;margin-top:10rem;padding:10rem;"
				},
				[
					require("./box-title.html").call({ icon: 'home-live', text: '直播课程' }),
					[
						"band",
						{
							"key": "live"
						}
					]
				]
			],
			[
				"band",
				{
					"theme": "level1",
					"style": "height:100rem;margin-top:10rem;padding:10rem;"
				},
				[
					require("./box-title.html").call({ icon: 'home-my', text: '我的课程' }),
					[
						"band",
						{
							"key": "my"
						}
					]
				]
			],
			[
				"band",
				{
					"style": "margin-top:10rem;"
				},
				[
					[
						"button",
						{
							"events": {
								"tap": this.openTest
							}
						},
						"Open Test"
					]
				]
			],
			[
				"button",
				null,
				[
					[
						"text",
						null,
						"dwwwwwwwwwww"
					],
					[
						"button",
						null,
						"ddddddddddd"
					]
				]
			]
		]
	]
)


}