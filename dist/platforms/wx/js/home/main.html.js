module.exports = function (data) {


with (data) return (
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
								"tap": openTest
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