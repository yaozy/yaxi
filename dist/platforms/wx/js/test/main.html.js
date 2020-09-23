module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\test\\main.html")

return (
	[
		"page",
		{
			"events": {
				"tap": $owner.handleTap.bind($owner)
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