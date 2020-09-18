module.exports = function (scope) {


return (
	[
		"box",
		{
			"style": "position:static;overflow:visible;z-index:1;height:80rem;border-bottom:.5px solid @border-level4;"
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
					"style": "height:80rem;line-height:80rem;text-align:center;border-bottom:.5px solid @border-level4;",
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
							"style": "width:33%;height:100%;",
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
							"style": "width:34%;height:100%;",
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
							"style": "width:33%;height:100%;",
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
									"style": "height:80rem;line-height:80rem;padding-left:30rem;border-top:.5px solid @border-level4;",
									"bindings": {
										"key": "index"
									}
								},
								[
									[
										"vline",
										{
											"style": "position:absolute;top:0;left:0;",
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
					"style": "max-height:640rem;",
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
							"style": "width:25%;",
							"events": {
								"tap": this.handleCategoryLevel1.bind(this)
							}
						},
						[
							[
								"iconbutton",
								{
									"layout": "row before",
									"style": "width:100%;height:80rem;padding-left:20rem;",
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
							"style": "width:35%;",
							"events": {
								"tap": this.handleCategoryLevel2.bind(this)
							}
						},
						[
							[
								"text",
								{
									"style": "width:100%;height:80rem;line-height:80rem;padding-left:20rem;",
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
							"style": "width:40%;",
							"events": {
								"tap": this.handleCategoryLevel3.bind(this)
							}
						},
						[
							[
								"text",
								{
									"style": "width:100%;height:80rem;line-height:80rem;padding-left:20rem;",
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
					"style": "max-height:640rem;",
					"bindings": {
						"hidden": "filter.hidden"
					}
				},
				[
					[
						"box",
						{
							"flex": "auto",
							"style": "font-size:28rem;"
						},
						[
							[
								"modelbox",
								{
									"submodel": "filter.data",
									"style": "border-top:.5px solid @border-level4;"
								},
								[
									[
										"box",
										{
											"style": "height:80rem;line-height:80rem;padding-left:20rem;"
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
											"style": "padding-left:20rem;",
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
													"style": "width:220rem;height:60rem;line-height:60rem;margin:0 20rem 20rem 0;border-radius:40rem;text-align:center;",
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
							"style": "height:80rem;line-height:80rem;border-top:.5px solid @border-level4;"
						},
						[
							[
								"text",
								{
									"theme": "primary",
									"style": "padding:0 30rem;",
									"events": {
										"tap": this.handleClearFilter.bind(this)
									}
								},
								"清空筛选"
							],
							[
								"button",
								{
									"style": "float:right;width:200rem;height:60rem;margin:10rem 30rem 0 0;",
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