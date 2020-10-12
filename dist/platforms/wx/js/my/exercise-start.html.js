module.exports = function ($this, $data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"text": "我的练习"
				}
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
							"text": $data.name
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
											"text": $data.score
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
											"text": $data.time
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
											"text": $data.publish
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
								"tap": $this.handleStart.bind($this)
							}
						},
						"开始练习"
					]
				]
			]
		]
	]
)


}