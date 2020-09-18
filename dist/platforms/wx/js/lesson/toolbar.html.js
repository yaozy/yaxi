module.exports = function (scope) {


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
						"tap": this.handleClose.bind(this)
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
						"tap": this.handleSwitch.bind(this)
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
							"events": {
								"tap": this.handleSort.bind(this)
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
										"key": "index"
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
												"color": "item.theme"
											}
										}
									],
									[
										"text",
										{
											"bindings": {
												"theme": "item.theme",
												"text": "item.text"
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
							"events": {
								"tap": this.handleCategoryLevel1.bind(this)
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
										"key": "index",
										"icon": "item.icon",
										"content": "item.text",
										"theme": "item.theme"
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
							"events": {
								"tap": this.handleCategoryLevel2.bind(this)
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
										"key": "index",
										"text": "item.text",
										"theme": "item.theme"
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
							"events": {
								"tap": this.handleCategoryLevel3.bind(this)
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
										"key": "index",
										"text": "item.text",
										"theme": "item.theme"
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
									"border-top": ".5px solid @border-level4"
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
														"text": "item.text"
													}
												}
											]
										]
									],
									[
										"modelbox",
										{
											"submodel": "item.data",
											"padding-left": "20rem",
											"tag": "filter",
											"bindings": {
												"key": "index"
											},
											"events": {
												"tap": this.handleChangeFilter.bind(this)
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
														"key": "index",
														"text": "item.text",
														"theme": "item.theme"
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
										"tap": this.handleClearFilter.bind(this)
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
										"tap": this.handleFilter.bind(this)
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