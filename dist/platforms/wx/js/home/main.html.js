module.exports = function (owner, data) {


return (
	[
		"box",
		{
			"theme": "bg-level2",
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
					"theme": "level1",
					"text": data.marquee
				}
			],
			[
				"databox",
				{
					"key": "host",
					"flex": "auto",
					"min-height": "200rem",
					"scope": ""
				},
				function (controls, __loop_data, __loop_scope) {


				    for (var $index = 0, __loop_len = __loop_data.length; $index < __loop_len; $index++)
				    {
				        var $item = __loop_data[$index];

				        this.loadTemplate(controls, __loop_scope, $index, $item,
							[
								[
									"box",
									{
										"key": $item.id,
										"theme": "level1",
										"margin-top": "10rem",
										"padding": "0 20rem"
									},
									[
										[
											"box",
											{
												"height": "60rem",
												"line-height": "60rem"
											},
											[
												[
													"icon",
													{
														"theme": "level2",
														"icon": $item.icon,
														"position": "absolute",
														"font-size": "50rem"
													}
												],
												[
													"text",
													{
														"theme": "level2",
														"text": $item.text,
														"position": "absolute",
														"left": "60rem"
													}
												],
												[
													"box",
													{
														"layout": "row",
														"theme": "level4",
														"position": "absolute",
														"top": "0",
														"right": "0",
														"bottom": "0",
														"font-size": "28rem"
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
												"item": "$lesson",
												"scope": "$item,$index"
											},
											function (controls, __loop_data, __loop_scope) {

											    var $item = __loop_scope[0];
											    var $index = __loop_scope[1];

											    for (var $index = 0, __loop_len = __loop_data.length; $index < __loop_len; $index++)
											    {
											        var $lesson = __loop_data[$index];

											        this.loadTemplate(controls, __loop_scope, $index, $lesson,
														[
															[
																"box",
																{
																	"layout": "line",
																	"tag": $lesson.id,
																	"height": "160rem",
																	"margin": "20rem 0",
																	"overflow": "hidden",
																	"events": {
																		"tap": owner.handleOpenDetail.bind(owner)
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
																					"theme": "level4",
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
																					"theme": "primary",
																					"height": "40rem",
																					"overflow": "hidden"
																				},
																				[
																					[
																						"text",
																						{
																							"text": '￥' + $lesson.price
																						}
																					]
																				]
																			]
																		]
																	]
																]
															]
														]
													);
											    }

											    // end function
											}
										]
									]
								]
							]
						);
				    }

				    // end function
				}
			]
		]
	]
)


}