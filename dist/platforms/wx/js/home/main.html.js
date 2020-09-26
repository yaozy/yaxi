module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\home\\main.html")

return (
	[
		"box",
		{
			"theme": "bg-thick",
			"layout": "column"
		},
		[
			[
				"swiper",
				{
					"flex-shrink": "0"
				},
				[
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/splash-screen.jpg"
						}
					]
				]
			],
			[
				"marquee",
				{
					"theme": "bg-standard",
					"text": $data.marquee
				}
			],
			[
				"databox",
				{
					"key": "host",
					"flex": "auto",
					"min-height": "200rem",
					"margin-top": "10rem"
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
									"key": $item.id,
									"theme": "bg-standard",
									"margin-bottom": "10rem",
									"padding": "0 20rem"
								},
								[
									[
										"box",
										{
											"layout": "row",
											"overflow": "hidden",
											"height": "70rem",
											"line-height": "80rem"
										},
										[
											[
												"icon",
												{
													"theme": "text-light",
													"icon": $item.icon,
													"font-size": "50rem"
												}
											],
											[
												"text",
												{
													"theme": "text-light",
													"text": $item.text,
													"font-size": "30rem"
												}
											],
											[
												"box",
												{
													"layout": "row",
													"absolute": "middle right",
													"margin-top": "10rem",
													"theme": "text-lightest",
													"font-size": "28rem",
													"events": {
														"tap": $owner.handleMore.bind($owner)
													}
												},
												[
													[
														"text",
														null,
														"查看更多"
													],
													[
														"icon",
														{
															"icon": "common-more"
														}
													]
												]
											]
										]
									],
									[
										"databox",
										{
											"data": $item.data,
											"item": "$lesson"
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
															"height": "160rem",
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
																	"width": "200rem",
																	"height": "100%"
																}
															],
															[
																"box",
																{
																	"width": "500rem",
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
																			"height": "70rem",
																			"font-size": "24rem",
																			"overflow": "hidden"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $lesson.remark
																				}
																			]
																		]
																	],
																	[
																		"box",
																		{
																			"theme": "text-primary",
																			"height": "40rem",
																			"overflow": "hidden"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $lesson.price > 0 ? '￥' + $lesson.price : '免费'
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