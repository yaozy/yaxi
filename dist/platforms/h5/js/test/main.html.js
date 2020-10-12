module.exports = function ($this, $data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"text": "yaxi test page"
				}
			],
			[
				"box",
				{
					"events": {
						"tap": $this.handleTap.bind($this)
					}
				},
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