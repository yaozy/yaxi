module.exports = function ($this, $data, $model) {

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
					"text": "我的订单"
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
						"tap": $this.handleSwitch.bind($this)
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
									"text": $item.text,
									"tag": $item.status,
									"flex": "auto",
									"text-align": "center",
									"bindings": {
										"theme":  function () { return $item.status === $model.status ? 'text-primary' : '' }
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
					"data": $model.data,
					"key": "host",
					"flex": "auto"
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
									"margin-top": "10rem",
									"theme": "bg-standard"
								},
								[
									[
										"box",
										{
											"height": "80rem",
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
														"tap": $this.handleDelete.bind($this)
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
										function (template, data, scope) {

											var $index = scope[0];
											var $item = scope[1];

											for (var $index = 0, length = data.length; $index < length; $index++)
											{
												// 添加作用域解决循环变量绑定变化的问题
												(function ($index, $detail) {


												template($index, $detail,
													[
														"box",
														{
															"tag": $detail.courseid,
															"layout": "row",
															"height": "100rem",
															"margin": "20rem 0",
															"events": {
																"tap": $this.handleOpenDetail.bind($this)
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

												})($index, data[$index]);
											}

											// end function
										}
									],
									[
										"icon",
										{
											"icon": "my-order-completed",
											"theme": "text-lightest",
											"absolute": "right",
											"width": "120rem",
											"height": "120rem",
											"line-height": "120rem",
											"font-size": "120rem",
											"top": "280rem",
											"right": "20rem",
											"bindings": {
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

						})($index, data[$index]);
					}

					// end function
				}
			]
		]
	]
)


}