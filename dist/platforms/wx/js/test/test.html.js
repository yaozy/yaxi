module.exports = function (scope) {


return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"content": "yaxi test page"
				}
			],
			[
				"box",
				{
					"layout": "row"
				},
				[
					[
						"sidebar",
						null
					],
					[
						"box",
						null,
						[
							[
								"band",
								null
							],
							[
								"box",
								{
									"layout": "column"
								},
								[
									[
										"box",
										null
									],
									[
										"button",
										{
											"content": "append",
											"events": {
												"tap": this.handleAppend.bind(this)
											}
										}
									],
									[
										"button",
										{
											"content": "remove last",
											"style": "margin-top:10rem;",
											"events": {
												"tap": this.handleRemove.bind(this)
											}
										}
									]
								]
							],
							[
								"band",
								null
							]
						]
					],
					[
						"sidebar",
						null
					]
				]
			],
			[
				"band",
				{
					"style": "background-color:silver;"
				}
			]
		]
	]
)


}