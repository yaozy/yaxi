module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"text": "我的课程"
				}
			],
			[
				"databox",
				{
					"theme": "bg-thick",
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
									"layout": "column",
									"theme": "bg-standard",
									"margin": "10rem 0"
								},
								[
									[
										"text",
										{
											"text": $item.name,
											"theme": "line-lightest line-bottom",
											"height": "80rem",
											"line-height": "80rem",
											"padding": "0 20rem"
										}
									],
									[
										"box",
										{
											"layout": "column space-between",
											"theme": "text-lighter",
											"height": "220rem",
											"padding": "20rem",
											"font-size": "28rem"
										},
										[
											[
												"box",
												{
													"layout": "row"
												},
												[
													[
														"text",
														{
															"width": "120rem"
														},
														"班级:"
													],
													[
														"text",
														{
															"text": $item.class
														}
													]
												]
											],
											[
												"box",
												{
													"layout": "row"
												},
												[
													[
														"text",
														{
															"width": "120rem"
														},
														"讲师:"
													],
													[
														"text",
														{
															"text": $item.teacher
														}
													]
												]
											],
											[
												"box",
												{
													"layout": "row"
												},
												[
													[
														"text",
														{
															"width": "120rem"
														},
														"地址:"
													],
													[
														"text",
														{
															"text": $item.address
														}
													]
												]
											],
											[
												"box",
												{
													"layout": "row"
												},
												[
													[
														"text",
														{
															"width": "120rem"
														},
														"时间:"
													],
													[
														"text",
														{
															"text": $item.time
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
			]
		]
	]
)


}