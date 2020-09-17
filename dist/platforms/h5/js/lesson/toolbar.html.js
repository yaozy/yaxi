module.exports = function (scope) {


return (
	[
		"band",
		{
			"style": "position:static;overflow:visible;z-index:1;height:80rem;border-bottom:.5px solid @border-level4;"
		},
		[
			[
				"maskbox",
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
					"style": "height:80rem;line-height:80rem;text-align:center;",
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
						"repeater",
						{
							"submodel": "sort.data",
							"events": {
								"tap": this.handleSort.bind(this)
							}
						},
						[
							[
								"band",
								{
									"style": "height:80rem;line-height:80rem;padding-left:30rem;border-top:.5px solid @border-level4;",
									"bindings": {
										"key": "index"
									}
								},
								[
									[
										"verticalline",
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
						"repeater",
						{
							"submodel": "category.firsts",
							"style": "width:30%;",
							"events": {
								"tap": this.handleCategoryFirst.bind(this)
							}
						},
						[
							[
								"iconbutton",
								{
									"layout": "row-left",
									"style": "height:80rem;padding-left:20rem;",
									"bindings": {
										"icon": "item.icon",
										"content": "item.text",
										"theme": "item.theme"
									}
								}
							]
						]
					],
					[
						"repeater",
						{
							"submodel": "category.seconds",
							"style": "width:30%;",
							"events": {
								"tap": this.handleCategorySecond.bind(this)
							}
						},
						[
							[
								"text",
								{
									"style": "height:80rem;line-height:80rem;",
									"bindings": {
										"text": "item.text",
										"theme": "item.theme"
									}
								}
							]
						]
					],
					[
						"repeater",
						{
							"submodel": "category.thirds",
							"style": "width:40%;",
							"events": {
								"tap": this.handleCategoryThird.bind(this)
							}
						},
						[
							[
								"text",
								{
									"style": "height:80rem;line-height:80rem;",
									"bindings": {
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
							"style": "font-size:28rem;"
						},
						[
							[
								"repeater",
								{
									"submodel": "filter.data",
									"style": "border-top:.5px solid @border-level4;"
								},
								[
									[
										"band",
										{
											"style": "height:60rem;line-height:60rem;padding-left:20rem;"
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
										"repeater",
										{
											"submodel": "item.data",
											"style": "padding: 20rem;"
										},
										[
											[
												"text",
												{
													"bindings": {
														"text": "item.text",
														"style": "item.style"
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
						"band",
						{
							"theme": "level1",
							"style": "height:80rem;line-height:80rem;"
						},
						[
							[
								"text",
								null,
								"清空筛选"
							],
							[
								"button",
								null,
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