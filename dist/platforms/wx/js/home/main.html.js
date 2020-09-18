module.exports = function (scope) {


return (
	[
		"box",
		{
			"theme": "bg-level2",
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
				"marquee",
				{
					"theme": "level1",
					"text": this.marquee
				}
			],
			[
				"box",
				{
					"key": "host",
					"flex": "auto",
					"style": "min-height:200rem;"
				}
			]
		]
	]
)


}