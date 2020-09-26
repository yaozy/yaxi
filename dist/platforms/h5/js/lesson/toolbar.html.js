module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\toolbar.html")

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
						"tap": $owner.handleClose.bind($owner)
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
						"tap": $owner.handleSwitch.bind($owner)
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
								"content":  function () { return $model.sort.text }
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
								"content":  function () { return $model.category.text }
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
								"tap": $owner.handleSort.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function () {

								var $item = __data_list[$index];

								template($index, $item,
									[
										"box",
										{
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "30rem",
											"theme": "line-lightest line-top",
											"bindings": {
												"key":  function () { return ($item.$index != null ? $item.$index : $index) }
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

								})();
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
								"tap": $owner.handleCategoryLevel1.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function () {

								var $item = __data_list[$index];

								template($index, $item,
									[
										"iconbutton",
										{
											"layout": "row before",
											"width": "100%",
											"height": "80rem",
											"padding-left": "20rem",
											"bindings": {
												"key":  function () { return ($item.$index != null ? $item.$index : $index) },
												"icon":  function () { return $item.icon },
												"content":  function () { return $item.text },
												"theme":  function () { return $item.theme }
											}
										}
									]
								);

								})();
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
								"tap": $owner.handleCategoryLevel2.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function () {

								var $item = __data_list[$index];

								template($index, $item,
									[
										"text",
										{
											"width": "100%",
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "20rem",
											"bindings": {
												"key":  function () { return ($item.$index != null ? $item.$index : $index) },
												"text":  function () { return $item.text },
												"theme":  function () { return $item.theme }
											}
										}
									]
								);

								})();
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
								"tap": $owner.handleCategoryLevel3.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function () {

								var $item = __data_list[$index];

								template($index, $item,
									[
										"text",
										{
											"width": "100%",
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "20rem",
											"bindings": {
												"key":  function () { return ($item.$index != null ? $item.$index : $index) },
												"text":  function () { return $item.text },
												"theme":  function () { return $item.theme }
											}
										}
									]
								);

								})();
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
						"box",
						{
							"flex": "auto",
							"font-size": "28rem"
						},
						[
							[
								"databox",
								{
									"data": $model.filter.data,
									"theme": "line-lightest line-top"
								},
								function (template, __data_list, __data_scope) {

									for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
									{
										// 添加作用域解决循环变量绑定变化的问题
										(function () {

										var $item = __data_list[$index];

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
																"key":  function () { return ($item.$index != null ? $item.$index : $index) }
															},
															"events": {
																"tap": $owner.handleChangeFilter.bind($owner)
															}
														},
														function (template, __data_list, __data_scope) {

															var $index = __data_scope[0];
															var $item = __data_scope[1];

															for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
															{
																// 添加作用域解决循环变量绑定变化的问题
																(function () {

																var $item = __data_list[$index];

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
																				"key":  function () { return ($item.$index != null ? $item.$index : $index) },
																				"text":  function () { return $item.text },
																				"theme":  function () { return $item.theme }
																			}
																		}
																	]
																);

																})();
															}

															// end function
														}
													]
												]
											]
										);

										})();
									}

									// end function
								}
							]
						]
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
										"tap": $owner.handleClearFilter.bind($owner)
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
										"tap": $owner.handleFilter.bind($owner)
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