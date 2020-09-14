module.exports = function (scope) {


return (
	[
		"box",
		null,
		[
			[
				"swiper",
				null,
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
				null,
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
				"band",
				null
			],
			[
				"band",
				null
			],
			[
				"band",
				null
			]
		]
	]
)


}