module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\main.html")

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
							"key": "main-body"
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
											"layout": "line",
											"tag": $item.id,
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
															"overflow": "hidden"
														},
														function (template, __data_list, __data_scope) {

															var $index = __data_scope[0];
															var $item = __data_scope[1];

															for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
															{
																// 添加作用域解决循环变量绑定变化的问题
																(function () {

																var $remark = __data_list[$index];

																template($index, $remark,
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
																);

																})();
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
								);

								})();
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