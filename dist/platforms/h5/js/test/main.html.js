module.exports = function ($data, $model) {

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
									"theme": "text-important",
									"margin-left": ".5em",
									"text-weight": "bold"
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
									"theme": "text-important",
									"margin-left": ".5em",
									"text-weight": "bold"
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