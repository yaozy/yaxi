module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\order.html")

return (
	[
		"page",
		{
			"theme": "bg-thick"
		},
		[
			require("../components/header.html")($owner, $data, $model),
			[
				"databox",
				{
					"data": $model.categories,
					"height": "80rem",
					"layout": "row middle space-between",
					"margin-bottom": "10rem",
					"padding": "0 20rem",
					"events": {
						"tap": $owner.handleSwitch.bind($owner)
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
									"tag": "$item.status",
									"bindings": {
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
									"margin-bottom": "10rem",
									"theme": "bg-standard"
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
												"icon",
												{
													"tag": $index,
													"icon": "common-delete",
													"absolute": "middle right"
												}
											]
										]
									],
									[
										"databox",
										{
											"data": $item.data,
											"item": "$lesson",
											"padding": "0 20rem"
										},
										function (template, __data_list, __data_scope) {

											var $index = __data_scope[0];
											var $item = __data_scope[1];

											for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
											{
												// 添加作用域解决循环变量绑定变化的问题
												(function () {

												var $lesson = __data_list[$index];

												template($index, $lesson,
													[
														"box",
														{
															"layout": "line",
															"tag": $lesson.id,
															"height": "100rem",
															"margin": "20rem 0",
															"overflow": "hidden",
															"events": {
																"tap": $owner.handleOpenDetail.bind($owner)
															}
														},
														[
															[
																"image",
																{
																	"src": $lesson.image,
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
																			"height": "50rem",
																			"overflow": "hidden"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $lesson.name
																				}
																			]
																		]
																	],
																	[
																		"box",
																		{
																			"theme": "text-lightest",
																			"height": "40rem",
																			"overflow": "hidden",
																			"font-size": "24rem"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $lesson.amount + ' * ￥' + $lesson.price + ' = ' + $owner.pipe('round:2')($lesson.amount * $lesson.price)
																				}
																			]
																		]
																	]
																]
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
							]
						);

						})();
					}

					// end function
				}
			]
		]
	]
)


}