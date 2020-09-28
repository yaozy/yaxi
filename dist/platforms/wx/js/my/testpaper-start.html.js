module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				null,
				"我的试卷"
			],
			[
				"box",
				{
					"layout": "column",
					"padding": "100rem 50rem",
					"text-align": "center"
				},
				[
					[
						"text",
						{
							"text": $model.name
						}
					],
					[
						"box",
						{
							"theme": "text-lightest",
							"padding": "50rem 0",
							"line-height": "60rem",
							"font-size": "28rem"
						},
						[
							[
								"box",
								null,
								[
									[
										"text",
										null,
										"总分:"
									],
									[
										"text",
										{
											"text": $model.score
										}
									]
								]
							],
							[
								"box",
								null,
								[
									[
										"text",
										null,
										"时长:"
									],
									[
										"text",
										{
											"text": $model.time
										}
									],
									[
										"text",
										null,
										"分钟"
									]
								]
							],
							[
								"box",
								null,
								[
									[
										"text",
										null,
										"发布人:"
									],
									[
										"text",
										{
											"text": $model.publish
										}
									]
								]
							]
						]
					],
					[
						"button",
						{
							"events": {
								"tap": this.handleStart.bind(this)
							}
						},
						"开始考试"
					]
				]
			]
		]
	]
)


}