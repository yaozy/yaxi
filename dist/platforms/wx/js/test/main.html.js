module.exports = function () {


return (
	[
		"page",
		{
			"events": {
				"tap": this.handleTap
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
									"theme": "danger-font",
									"style": "margin-left:.5em;font-weight:bold;"
								}
							]
						]
					],
					[
						"button",
						{
							"tag": "test.js",
							"style": "margin-top:10rem;"
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
									"theme": "danger-font",
									"style": "margin-left:.5em;font-weight:bold;"
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