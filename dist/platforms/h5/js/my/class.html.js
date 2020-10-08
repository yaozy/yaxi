module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"text": "我的班级"
				}
			],
			[
				"databox",
				{
					"flex": "auto",
					"theme": "bg-thick"
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
											"height": "300rem",
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
															"width": "150rem"
														},
														"班主任:"
													],
													[
														"text",
														{
															"text": $item.master,
															"margin-left": "10rem"
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
															"width": "150rem"
														},
														"助教:"
													],
													[
														"text",
														{
															"text": $item.slave,
															"margin-left": "10rem"
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
															"width": "150rem"
														},
														"课时数:"
													],
													[
														"text",
														{
															"text": $item.lessons,
															"margin-left": "10rem"
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
															"width": "150rem"
														},
														"科目数:"
													],
													[
														"text",
														{
															"text": $item.subjects,
															"margin-left": "10rem"
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
															"width": "150rem"
														},
														"必修学分:"
													],
													[
														"text",
														{
															"text": $item.credits,
															"margin-left": "10rem"
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
															"width": "150rem"
														},
														"学员数:"
													],
													[
														"text",
														{
															"text": $item.students,
															"margin-left": "10rem"
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
															"width": "150rem"
														},
														"地址:"
													],
													[
														"text",
														{
															"text": $item.address,
															"margin-left": "10rem"
														}
													]
												]
											]
										]
									],
									[
										"text",
										{
											"text": $item.comment,
											"theme": "text-lighter line-lightest line-top",
											"padding": "20rem",
											"font-size": "28rem"
										}
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