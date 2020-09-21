module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\toolbar.html")

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
						"hidden":  function ($pipe) { return $model.hidden }
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
					"theme": "level1",
					"height": "80rem",
					"line-height": "80rem",
					"text-align": "center",
					"border-bottom": ".5px solid @border-level4",
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
								"icon":  function ($pipe) { return $model.sort.icon },
								"content":  function ($pipe) { return $model.sort.text }
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
								"icon":  function ($pipe) { return $model.category.icon },
								"content":  function ($pipe) { return $model.category.text }
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
								"icon":  function ($pipe) { return $model.filter.icon }
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
						"hidden":  function ($pipe) { return $model.sort.hidden }
					}
				},
				[
					[
						"databox",
						{
							"type": "model",
							"data": $model.sort.data,
							"events": {
								"tap": $owner.handleSort.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
								var $item = __data_list[$index];

								template($index, $item,
									[
										"box",
										{
											"height": "80rem",
											"line-height": "80rem",
											"padding-left": "30rem",
											"border-top": ".5px solid @border-level4",
											"bindings": {
												"key":  function ($pipe) { return $item.$index }
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
														"color":  function ($pipe) { return $item.theme }
													}
												}
											],
											[
												"text",
												{
													"bindings": {
														"theme":  function ($pipe) { return $item.theme },
														"text":  function ($pipe) { return $item.text }
													}
												}
											]
										]
									]
								);
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
					"theme": "level1",
					"max-height": "640rem",
					"bindings": {
						"hidden":  function ($pipe) { return $model.category.hidden }
					}
				},
				[
					[
						"databox",
						{
							"type": "model",
							"data": $model.category.level1s,
							"theme": "bg-level3",
							"width": "25%",
							"events": {
								"tap": $owner.handleCategoryLevel1.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
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
												"key":  function ($pipe) { return $item.$index },
												"icon":  function ($pipe) { return $item.icon },
												"content":  function ($pipe) { return $item.text },
												"theme":  function ($pipe) { return $item.theme }
											}
										}
									]
								);
							}

							// end function
						}
					],
					[
						"databox",
						{
							"type": "model",
							"data": $model.category.level2s,
							"theme": "bg-level2",
							"width": "35%",
							"events": {
								"tap": $owner.handleCategoryLevel2.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
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
												"key":  function ($pipe) { return $item.$index },
												"text":  function ($pipe) { return $item.text },
												"theme":  function ($pipe) { return $item.theme }
											}
										}
									]
								);
							}

							// end function
						}
					],
					[
						"databox",
						{
							"type": "model",
							"data": $model.category.level3s,
							"width": "40%",
							"events": {
								"tap": $owner.handleCategoryLevel3.bind($owner)
							}
						},
						function (template, __data_list, __data_scope) {

							for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
							{
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
												"key":  function ($pipe) { return $item.$index },
												"text":  function ($pipe) { return $item.text },
												"theme":  function ($pipe) { return $item.theme }
											}
										}
									]
								);
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
					"theme": "level1",
					"max-height": "640rem",
					"bindings": {
						"hidden":  function ($pipe) { return $model.filter.hidden }
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
									"type": "model",
									"data": $model.filter.data,
									"border-top": ".5px solid @border-level4"
								},
								function (template, __data_list, __data_scope) {

									for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
									{
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
															"line:height": "80rem",
															"padding-left": "20rem"
														},
														[
															[
																"text",
																{
																	"bindings": {
																		"text":  function ($pipe) { return $item.text }
																	}
																}
															]
														]
													],
													[
														"databox",
														{
															"type": "model",
															"data": $item.data,
															"padding-left": "20rem",
															"tag": "filter",
															"bindings": {
																"key":  function ($pipe) { return $item.$index }
															},
															"events": {
																"tap": $owner.handleChangeFilter.bind($owner)
															}
														},
														function (template, __data_list, __data_scope) {

															var $item = __data_scope[0];
															var $index = __data_scope[1];

															for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
															{
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
																				"key":  function ($pipe) { return $item.$index },
																				"text":  function ($pipe) { return $item.text },
																				"theme":  function ($pipe) { return $item.theme }
																			}
																		}
																	]
																);
															}

															// end function
														}
													]
												]
											]
										);
									}

									// end function
								}
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
									"position": "absolute",
									"top": "10rem",
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