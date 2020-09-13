module.exports = function (data) {


with (data) return (
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
												"tap": handleAppend
											}
										}
									],
									[
										"button",
										{
											"content": "remove last",
											"style": "margin-top:10rem;",
											"events": {
												"tap": handleRemove
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