module.exports = function ($data, $model) {

return (
	[
		"page",
		{
			"theme": "bg-thick"
		},
		[
			[
				"header",
				{
					"theme": "bg-standard",
					"content": "我的订单"
				}
			],
			[
				"databox",
				{
					"data": $model.categories,
					"height": "100rem",
					"line-height": "100rem",
					"layout": "row middle",
					"theme": "bg-standard line-lightest line-bottom",
					"padding": "0 20rem",
					"events": {
						"tap": this.handleSwitch.bind(this)
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
									"text": $item.text,
									"tag": $index,
									"flex": "auto",
									"text-align": "center",
									"bindings": {
										"theme":  function () { return ($item && $item.$index != null ? $item.$index : $index) === $model.status ? 'text-primary' : '' }
									}
								}
							]
						);

						}).call(this);
					}

					// end function
				}.bind(this)
			],
			[
				"databox",
				{
					"data": $model.data,
					"flex": "auto"
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
									"margin-top": "10rem",
									"theme": "bg-standard",
									"bindings": {
										"hidden":  function () { return $model.status && $item.status !== $model.status }
									}
								},
								[
									[
										"box",
										{
											"line-height": "80rem",
											"padding": "0 20rem",
											"theme": "line-lightest line-bottom"
										},
										[
											[
												"text",
												{
													"text": $item.time
												}
											],
											[
												"text",
												{
													"absolute": "middle right",
													"margin-right": "50rem",
													"bindings": {
														"text":  function () { return $model.categories[$item.status].text },
														"hidden":  function () { return $item.status >= 3 }
													}
												}
											],
											[
												"icon",
												{
													"icon": "common-delete",
													"absolute": "middle right",
													"width": "120rem",
													"bindings": {
														"tag":  function () { return ($item && $item.$index != null ? $item.$index : $index) },
														"hidden":  function () { return $item.status < 3 }
													},
													"events": {
														"tap": this.handleDelete.bind(this)
													}
												}
											]
										]
									],
									[
										"databox",
										{
											"data": $item.data,
											"item": "$detail",
											"padding": "0 20rem"
										},
										function (template, __data_list, __data_scope) {

											var $index = __data_scope[0];
											var $item = __data_scope[1];

											for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
											{
												// 添加作用域解决循环变量绑定变化的问题
												(function () {

												var $detail = __data_list[$index];

												template($index, $detail,
													[
														"box",
														{
															"tag": $detail.lessonid,
															"layout": "row",
															"height": "100rem",
															"margin": "20rem 0",
															"events": {
																"tap": this.handleOpenDetail.bind(this)
															}
														},
														[
															[
																"image",
																{
																	"src": $detail.image,
																	"width": "140rem",
																	"height": "100%"
																}
															],
															[
																"box",
																{
																	"width": "560rem",
																	"height": "100%",
																	"padding-left": "20rem"
																},
																[
																	[
																		"box",
																		{
																			"height": "50rem"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $detail.name
																				}
																			]
																		]
																	],
																	[
																		"box",
																		{
																			"layout": "row middle",
																			"theme": "text-lightest",
																			"height": "40rem",
																			"font-size": "28rem"
																		},
																		[
																			[
																				"text",
																				null,
																				"单价:"
																			],
																			[
																				"text",
																				{
																					"text": '￥' + $detail.price
																				}
																			],
																			[
																				"text",
																				{
																					"margin-left": "50rem"
																				},
																				"数量:"
																			],
																			[
																				"text",
																				{
																					"text": $detail.amount
																				}
																			]
																		]
																	]
																]
															]
														]
													]
												);

												}).call(this);
											}

											// end function
										}.bind(this)
									],
									[
										"icon",
										{
											"icon": "common-completed",
											"absolute": "right",
											"width": "120rem",
											"height": "120rem",
											"line-height": "120rem",
											"font-size": "120rem",
											"top": "300rem",
											"right": "20rem",
											"bindings": {
												"tag":  function () { return ($item && $item.$index != null ? $item.$index : $index) },
												"hidden":  function () { return $item.status < 3 }
											}
										}
									],
									[
										"box",
										{
											"height": "80rem",
											"line-height": "80rem",
											"theme": "line-lightest line-top",
											"padding-left": "20rem"
										},
										[
											[
												"text",
												null,
												"总价:"
											],
											[
												"text",
												{
													"text": '￥' + $item.total
												}
											],
											[
												"button",
												{
													"absolute": "middle right",
													"width": "200rem",
													"height": "60rem",
													"margin-right": "20rem",
													"bindings": {
														"hidden":  function () { return $item.status !== 1 }
													}
												},
												"去付款"
											],
											[
												"button",
												{
													"absolute": "middle right",
													"width": "200rem",
													"height": "60rem",
													"margin-right": "20rem",
													"bindings": {
														"hidden":  function () { return $item.status !== 2 }
													}
												},
												"提醒发货"
											]
										]
									]
								]
							]
						);

						}).call(this);
					}

					// end function
				}.bind(this)
			]
		]
	]
)


}