module.exports = function (data) {


with (data) return (
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
					"layout": "column"
				},
				[
					[
						"band",
						{
							"layout": "row",
							"style": "background-color:@bg-level2-color"
						},
						[
							[
								"button",
								{
									"content": "Append",
									"events": {
										"tap": handleAppend
									}
								}
							],
							[
								"button",
								{
									"content": "Replace",
									"events": {
										"tap": handleReplace
									}
								}
							],
							[
								"button",
								{
									"content": "Remove",
									"events": {
										"tap": handleRemove
									}
								}
							],
							[
								"button",
								{
									"content": "Reorder",
									"events": {
										"tap": handleReorder
									}
								}
							]
						]
					],
					[
						"repeater",
						{
							"layout": "column",
							"item": "item",
							"index": "index"
						},
						[
							[
								"band",
								{
									"layout": "row",
									"style": "height:auto;padding:20rem;"
								},
								[
									[
										"sidebar",
										{
											"style": "width:50rem;line-height:2;"
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
										null,
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