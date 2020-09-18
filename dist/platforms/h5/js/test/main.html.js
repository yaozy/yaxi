module.exports = function (scope) {


return (
	[
		"page",
		{
			"events": {
				"tap": this.handleTap.bind(this)
			}
		},
		[
			[
				"header",
				{
					"content": "yaxi test page"
				}
			],
			[
				"box",
				null,
				[
					[
						"button",
						{
							"tag": "model.js"
						},
						[
							[
								"text",
								null,
								"open"
							],
							[
								"text",
								{
									"text": "model",
									"theme": "font-important",
									"margin-left": ".5em",
									"font-weight": "bold"
								}
							]
						]
					],
					[
						"button",
						{
							"tag": "test.js",
							"margin-top": "10rem"
						},
						[
							[
								"text",
								null,
								"open"
							],
							[
								"text",
								{
									"text": "test",
									"theme": "font-important",
									"margin-left": ".5em",
									"font-weight": "bold"
								}
							]
						]
					]
				]
			]
		]
	]
)


}