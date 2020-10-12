module.exports = function ($this, $data, $model) {

return (
	[
		"box",
		{
			"static": "true",
			"overflow": "visible",
			"z-index": "1",
			"height": "80rem",
			"theme": "line-lightest line-bottom"
		},
		[
			[
				"masklayer",
				{
					"bindings": {
						"hidden":  function () { return $model.hidden }
					},
					"events": {
						"tap": $this.handleClose.bind($this)
					}
				}
			],
			[
				"box",
				{
					"layout": "row",
					"theme": "bg-standard line-lightest line-bottom",
					"height": "80rem",
					"line-height": "80rem",
					"text-align": "center",
					"events": {
						"tap": $this.handleSwitch.bind($this)
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
								"icon":  function () { return $model.sort.icon },
								"text":  function () { return $model.sort.text }
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
								"icon":  function () { return $model.category.icon },
								"text":  function () { return $model.category.text }
							}
						}
					],
					[
						"iconbutton",
						{
							"layout": "row-reverse",
							"text": "筛选",
							"tag": "filter",
							"width": "33%",
							"height": "100%",
							"bindings": {
								"icon":  function () { return $model.filter.icon }
							}
						}
					]
				]
			],
			[
				"box",
				{
					"theme": "bg-standard",
					"bindings": {
						"hidden":  function () { return $model.sort.hidden }
					}
				},
				[
					[
						"databox",
						{
							"data": $model.sort.data,
							"events": {
								"tap": $this.handleSort.bind($this)
							}
						},
						function (template, data, scope) {

							for (var $index = 0, length = data.length; $index < length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function ($index, $item) {


								template($index, $item,
									[
										"box",
										{
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "30rem",
											"theme": "line-lightest line-top",
											"bindings": {
												"key":  function () { return ($item && $item.$index != null ? $item.$index : $index) }
											}
										},
										[
											[
												"vline",
												{
													"absolute": "left middle",
													"top": "0",
													"left": "0",
													"bindings": {
														"color":  function () { return $item.theme }
													}
												}
											],
											[
												"text",
												{
													"bindings": {
														"theme":  function () { return $item.theme },
														"text":  function () { return $item.text }
													}
												}
											]
										]
									]
								);

								})($index, data[$index]);
							}

							// end function
						}
					]
				]
			],
			[
				"box",
				{
					"layout": "row",
					"theme": "bg-standard",
					"max-height": "640rem",
					"bindings": {
						"hidden":  function () { return $model.category.hidden }
					}
				},
				[
					[
						"databox",
						{
							"data": $model.category.level1s,
							"theme": "bg-thicker",
							"width": "25%",
							"events": {
								"tap": $this.handleCategoryLevel1.bind($this)
							}
						},
						function (template, data, scope) {

							for (var $index = 0, length = data.length; $index < length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function ($index, $item) {


								template($index, $item,
									[
										"iconbutton",
										{
											"layout": "row before",
											"width": "100%",
											"height": "80rem",
											"padding-left": "20rem",
											"bindings": {
												"key":  function () { return ($item && $item.$index != null ? $item.$index : $index) },
												"icon":  function () { return $item.icon },
												"text":  function () { return $item.text },
												"theme":  function () { return $item.theme }
											}
										}
									]
								);

								})($index, data[$index]);
							}

							// end function
						}
					],
					[
						"databox",
						{
							"data": $model.category.level2s,
							"theme": "bg-thick",
							"width": "35%",
							"events": {
								"tap": $this.handleCategoryLevel2.bind($this)
							}
						},
						function (template, data, scope) {

							for (var $index = 0, length = data.length; $index < length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function ($index, $item) {


								template($index, $item,
									[
										"text",
										{
											"width": "100%",
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "20rem",
											"bindings": {
												"key":  function () { return ($item && $item.$index != null ? $item.$index : $index) },
												"text":  function () { return $item.text },
												"theme":  function () { return $item.theme }
											}
										}
									]
								);

								})($index, data[$index]);
							}

							// end function
						}
					],
					[
						"databox",
						{
							"data": $model.category.level3s,
							"width": "40%",
							"events": {
								"tap": $this.handleCategoryLevel3.bind($this)
							}
						},
						function (template, data, scope) {

							for (var $index = 0, length = data.length; $index < length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function ($index, $item) {


								template($index, $item,
									[
										"text",
										{
											"width": "100%",
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "20rem",
											"bindings": {
												"key":  function () { return ($item && $item.$index != null ? $item.$index : $index) },
												"text":  function () { return $item.text },
												"theme":  function () { return $item.theme }
											}
										}
									]
								);

								})($index, data[$index]);
							}

							// end function
						}
					]
				]
			],
			[
				"box",
				{
					"layout": "column",
					"theme": "bg-standard",
					"max-height": "640rem",
					"bindings": {
						"hidden":  function () { return $model.filter.hidden }
					}
				},
				[
					[
						"databox",
						{
							"data": $model.filter.data,
							"flex": "auto",
							"theme": "line-lightest line-top",
							"font-size": "28rem"
						},
						function (template, data, scope) {

							for (var $index = 0, length = data.length; $index < length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function ($index, $item) {


								template($index, $item,
									[
										"box",
										null,
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
																"text":  function () { return $item.text }
															}
														}
													]
												]
											],
											[
												"databox",
												{
													"data": $item.data,
													"padding-left": "20rem",
													"tag": "filter",
													"bindings": {
														"key":  function () { return ($item && $item.$index != null ? $item.$index : $index) }
													},
													"events": {
														"tap": $this.handleChangeFilter.bind($this)
													}
												},
												function (template, data, scope) {

													var $index = scope[0];
													var $item = scope[1];

													for (var $index = 0, length = data.length; $index < length; $index++)
													{
														// 添加作用域解决循环变量绑定变化的问题
														(function ($index, $item) {


														template($index, $item,
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
																		"key":  function () { return ($item && $item.$index != null ? $item.$index : $index) },
																		"text":  function () { return $item.text },
																		"theme":  function () { return $item.theme }
																	}
																}
															]
														);

														})($index, data[$index]);
													}

													// end function
												}
											]
										]
									]
								);

								})($index, data[$index]);
							}

							// end function
						}
					],
					[
						"box",
						{
							"theme": "bg-standard line-lightest line-top",
							"height": "80rem",
							"line-height": "80rem"
						},
						[
							[
								"text",
								{
									"theme": "text-primary",
									"padding": "0 30rem",
									"events": {
										"tap": $this.handleClearFilter.bind($this)
									}
								},
								"清空筛选"
							],
							[
								"button",
								{
									"width": "200rem",
									"height": "60rem",
									"absolute": "middle right",
									"right": "30rem",
									"events": {
										"tap": $this.handleFilter.bind($this)
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