module.exports = function (scope) {


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