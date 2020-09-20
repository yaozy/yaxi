module.exports = function (owner, data) {


return (
	[
		"box",
		{
			"position": "static",
			"overflow": "visible",
			"z-index": "1",
			"height": "80rem",
			"border-bottom": ".5px solid @border-level4"
		},
		[
			[
				"masklayer",
				{
					"bindings": {
						"hidden": "hidden"
					},
					"events": {
						"tap": owner.handleClose.bind(owner)
					}
				}
			],
			[
				"box",
				{
					"layout": "row",
					"theme": "level1",
					"height": "80rem",
					"line-height": "80rem",
					"text-align": "center",
					"border-bottom": ".5px solid @border-level4",
					"events": {
						"tap": owner.handleSwitch.bind(owner)
					}
				},
				[
					[
						"iconbutton",
						{
							"layout": "row-reverse",
							"tag": "sort",
							"width": "33%",
							"height": "100%",
							"bindings": {
								"icon": "sort.icon",
								"content": "sort.text"
							}
						}
					],
					[
						"iconbutton",
						{
							"layout": "row-reverse",
							"tag": "category",
							"width": "34%",
							"height": "100%",
							"bindings": {
								"icon": "category.icon",
								"content": "category.text"
							}
						}
					],
					[
						"iconbutton",
						{
							"layout": "row-reverse",
							"content": "筛选",
							"tag": "filter",
							"width": "33%",
							"height": "100%",
							"bindings": {
								"icon": "filter.icon"
							}
						}
					]
				]
			],
			[
				"box",
				{
					"theme": "level1",
					"bindings": {
						"hidden": "sort.hidden"
					}
				},
				[
					[
						"modelbox",
						{
							"submodel": "sort.data",
							"scope": "",
							"events": {
								"tap": owner.handleSort.bind(owner)
							}
						},
						[
							[
								"box",
								{
									"height": "80rem",
									"line-height": "80rem",
									"padding-left": "30rem",
									"border-top": ".5px solid @border-level4",
									"bindings": {
										"key": "$index"
									}
								},
								[
									[
										"vline",
										{
											"position": "absolute",
											"top": "0",
											"left": "0",
											"bindings": {
												"color": "$item.theme"
											}
										}
									],
									[
										"text",
										{
											"bindings": {
												"theme": "$item.theme",
												"text": "$item.text"
											}
										}
									]
								]
							]
						]
					]
				]
			],
			[
				"box",
				{
					"layout": "row",
					"theme": "level1",
					"max-height": "640rem",
					"bindings": {
						"hidden": "category.hidden"
					}
				},
				[
					[
						"modelbox",
						{
							"submodel": "category.level1s",
							"theme": "bg-level3",
							"width": "25%",
							"scope": "",
							"events": {
								"tap": owner.handleCategoryLevel1.bind(owner)
							}
						},
						[
							[
								"iconbutton",
								{
									"layout": "row before",
									"width": "100%",
									"height": "80rem",
									"padding-left": "20rem",
									"bindings": {
										"key": "$index",
										"icon": "$item.icon",
										"content": "$item.text",
										"theme": "$item.theme"
									}
								}
							]
						]
					],
					[
						"modelbox",
						{
							"submodel": "category.level2s",
							"theme": "bg-level2",
							"width": "35%",
							"scope": "",
							"events": {
								"tap": owner.handleCategoryLevel2.bind(owner)
							}
						},
						[
							[
								"text",
								{
									"width": "100%",
									"height": "80rem",
									"line-height": "80rem",
									"padding-left": "20rem",
									"bindings": {
										"key": "$index",
										"text": "$item.text",
										"theme": "$item.theme"
									}
								}
							]
						]
					],
					[
						"modelbox",
						{
							"submodel": "category.level3s",
							"width": "40%",
							"scope": "",
							"events": {
								"tap": owner.handleCategoryLevel3.bind(owner)
							}
						},
						[
							[
								"text",
								{
									"width": "100%",
									"height": "80rem",
									"line-height": "80rem",
									"padding-left": "20rem",
									"bindings": {
										"key": "$index",
										"text": "$item.text",
										"theme": "$item.theme"
									}
								}
							]
						]
					]
				]
			],
			[
				"box",
				{
					"layout": "column",
					"theme": "level1",
					"max-height": "640rem",
					"bindings": {
						"hidden": "filter.hidden"
					}
				},
				[
					[
						"box",
						{
							"flex": "auto",
							"font-size": "28rem"
						},
						[
							[
								"modelbox",
								{
									"submodel": "filter.data",
									"border-top": ".5px solid @border-level4",
									"scope": ""
								},
								[
									[
										"box",
										{
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "20rem"
										},
										[
											[
												"text",
												{
													"bindings": {
														"text": "$item.text"
													}
												}
											]
										]
									],
									[
										"modelbox",
										{
											"submodel": "$item.data",
											"padding-left": "20rem",
											"tag": "filter",
											"scope": "$item$index",
											"bindings": {
												"key": "$index"
											},
											"events": {
												"tap": owner.handleChangeFilter.bind(owner)
											}
										},
										[
											[
												"text",
												{
													"width": "220rem",
													"height": "60rem",
													"line-height": "60rem",
													"margin": "0 20rem 20rem 0",
													"border-radius": "40rem",
													"text-align": "center",
													"bindings": {
														"key": "$index",
														"text": "$item.text",
														"theme": "$item.theme"
													}
												}
											]
										]
									]
								]
							]
						]
					],
					[
						"box",
						{
							"theme": "level1",
							"height": "80rem",
							"line-height": "80rem",
							"border-top": ".5px solid @border-level4"
						},
						[
							[
								"text",
								{
									"theme": "primary",
									"padding": "0 30rem",
									"events": {
										"tap": owner.handleClearFilter.bind(owner)
									}
								},
								"清空筛选"
							],
							[
								"button",
								{
									"width": "200rem",
									"height": "60rem",
									"position": "absolute",
									"top": "10rem",
									"right": "30rem",
									"events": {
										"tap": owner.handleFilter.bind(owner)
									}
								},
								"确定"
							]
						]
					]
				]
			]
		]
	]
)


}