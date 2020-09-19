module.exports = function (data) {


return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"content": "yaxi model page"
				}
			],
			[
				"box",
				{
					"layout": "column",
					"flex": "auto"
				},
				[
					[
						"box",
						{
							"layout": "row",
							"background-color": "@bg-level2-color"
						},
						[
							[
								"button",
								{
									"flex": "auto",
									"content": "Append",
									"events": {
										"tap": this.handleAppend.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "auto",
									"content": "Replace",
									"events": {
										"tap": this.handleReplace.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "auto",
									"content": "Remove",
									"events": {
										"tap": this.handleRemove.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "auto",
									"content": "Reorder",
									"events": {
										"tap": this.handleReorder.bind(this)
									}
								}
							]
						]
					],
					[
						"modelbox",
						{
							"flex": "auto"
						},
						[
							[
								"box",
								{
									"height": "120rem"
								},
								[
									[
										"box",
										{
											"width": "50rem",
											"height": "120rem",
											"line-height": "120rem",
											"position": "absolute",
											"top": "0",
											"left": "20rem"
										},
										[
											[
												"text",
												{
													"bindings": {
														"text": "$index"
													}
												}
											]
										]
									],
									[
										"box",
										{
											"height": "100rem",
											"width": "700rem",
											"position": "absolute",
											"left": "70rem",
											"top": "20rem"
										},
										[
											[
												"text",
												{
													"width": "200rem",
													"bindings": {
														"text": "$item.name"
													}
												}
											],
											[
												"text",
												{
													"bindings": {
														"text": "$item.value"
													}
												}
											],
											[
												"text",
												{
													"bindings": {
														"text": "$item.computed"
													}
												}
											]
										]
									]
								]
							]
						]
					]
				]
			]
		]
	]
)


}