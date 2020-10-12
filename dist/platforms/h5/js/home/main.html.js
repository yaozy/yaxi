module.exports = function ($this, $data, $model) {

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
				null,
				[
					[
						"image",
						{
							"src": "/images/demo/demo1.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/demo/demo2.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/demo/demo3.jpg"
						}
					],
					[
						"image",
						{
							"src": "/images/demo/demo4.jpg"
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
					"margin-top": "10rem"
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
									"key": $item.id,
									"theme": "bg-standard",
									"margin-bottom": "10rem",
									"padding": "0 20rem"
								},
								[
									[
										"box",
										{
											"layout": "row middle",
											"margin-top": "20rem"
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
													"absolute": "right",
													"layout": "row middle",
													"theme": "text-lightest",
													"font-size": "28rem",
													"events": {
														"tap": $this.handleMore.bind($this)
													}
												},
												[
													[
														"text",
														{
															"margin-top": "-5rem"
														},
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
											"item": "$course",
											"margin-top": "20rem"
										},
										function (template, data, scope) {

											var $index = scope[0];
											var $item = scope[1];

											for (var $index = 0, length = data.length; $index < length; $index++)
											{
												// 添加作用域解决循环变量绑定变化的问题
												(function ($index, $course) {


												template($index, $course,
													[
														"box",
														{
															"layout": "row",
															"tag": $course.id,
															"height": "160rem",
															"margin-bottom": "30rem",
															"events": {
																"tap": $this.handleOpenDetail.bind($this)
															}
														},
														[
															[
																"image",
																{
																	"src": $course.image,
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
																			"height": "50rem"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $course.name
																				}
																			]
																		]
																	],
																	[
																		"box",
																		{
																			"theme": "text-lightest",
																			"height": "70rem",
																			"font-size": "24rem"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $course.remark
																				}
																			]
																		]
																	],
																	[
																		"box",
																		{
																			"theme": "text-primary",
																			"height": "40rem"
																		},
																		[
																			[
																				"text",
																				{
																					"text": $course.price > 0 ? '￥' + $course.price : '免费'
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