module.exports = function (owner, data) {


return (
	[
		"box",
		{
			"layout": "column"
		},
		[
			[
				require("./search"),
				{

				}
			],
			[
				require("./toolbar"),
				{

				}
			],
			[
				"scrollbox",
				{
					"flex": "auto",
					"padding": "0 20rem"
				},
				[
					[
						"databox",
						{
							"key": "main-body",
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
												"layout": "line",
												"tag": $item.id,
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
														"src": $item.image,
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
																"height": "70rem",
																"overflow": "hidden"
															},
															[
																[
																	"text",
																	{
																		"text": $item.name
																	}
																]
															]
														],
														[
															"databox",
															{
																"data": $item.remark,
																"item": "$remark",
																"layout": "flow",
																"theme": "level3",
																"height": "50rem",
																"line-height": "40rem",
																"font-size": "24rem",
																"overflow": "hidden",
																"scope": "$item,$index"
															},
															function (controls, __loop_data, __loop_scope) {

															    var $item = __loop_scope[0];
															    var $index = __loop_scope[1];

															    for (var $index = 0, __loop_len = __loop_data.length; $index < __loop_len; $index++)
															    {
															        var $remark = __loop_data[$index];

															        this.loadTemplate(controls, __loop_scope, $index, $remark,
																		[
																			[
																				"text",
																				{
																					"text": $remark,
																					"theme": "bg-level2",
																					"border-radius": "20rem",
																					"padding": "0 20rem",
																					"margin-right": "10rem"
																				}
																			]
																		]
																	);
															    }

															    // end function
															}
														],
														[
															"box",
															{
																"theme": "important",
																"height": "40rem",
																"overflow": "hidden"
															},
															[
																[
																	"text",
																	{
																		"text": $item.price > 0 ? '￥' + $item.price : '免费'
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
	]
)


}