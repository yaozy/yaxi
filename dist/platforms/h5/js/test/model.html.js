module.exports = function (scope) {


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
					"flex": "both"
				},
				[
					[
						"box",
						{
							"layout": "row",
							"style": "background-color:@bg-level2-color"
						},
						[
							[
								"button",
								{
									"flex": "both",
									"content": "Append",
									"events": {
										"tap": this.handleAppend.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "both",
									"content": "Replace",
									"events": {
										"tap": this.handleReplace.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "both",
									"content": "Remove",
									"events": {
										"tap": this.handleRemove.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "both",
									"content": "Reorder",
									"events": {
										"tap": this.handleReorder.bind(this)
									}
								}
							]
						]
					],
					[
						"repeater",
						{
							"flex": "both",
							"item": "item",
							"index": "index"
						},
						[
							[
								"box",
								{
									"style": "height:120rem;"
								},
								[
									[
										"box",
										{
											"style": "width:50rem;height:120rem;line-height:120rem;position:absolute;top:0;left:20rem;"
										},
										[
											[
												"text",
												{
													"bindings": {
														"text": "index"
													}
												}
											]
										]
									],
									[
										"box",
										{
											"style": "height:100rem;width:700rem;position:absolute;left:70rem;top:20rem;"
										},
										[
											[
												"text",
												{
													"style": "width:200rem;",
													"bindings": {
														"text": "item.name"
													}
												}
											],
											[
												"text",
												{
													"bindings": {
														"text": "item.value"
													}
												}
											],
											[
												"text",
												{
													"style": "display:block;",
													"bindings": {
														"text": "item.computed"
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