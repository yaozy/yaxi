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
					"theme": "bg-standard"
				},
				"我的试卷"
			],
			[
				"databox",
				{
					"data": $model,
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
									"tag": $index,
									"theme": "bg-standard",
									"layout": "row",
									"height": "150rem",
									"margin-top": "10rem",
									"padding": "20rem 0",
									"events": {
										"tap": this.handleStart.bind(this)
									}
								},
								[
									[
										"icon",
										{
											"icon": "my-exercise",
											"width": "120rem",
											"height": "100%",
											"line-height": "",
											"font-size": "80rem"
										}
									],
									[
										"box",
										{
											"layout": "column",
											"flex": "auto",
											"height": "100%",
											"padding-left": "20rem"
										},
										[
											[
												"text",
												{
													"text": $item.name,
													"height": "70rem",
													"line-height": "35rem"
												}
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
														"总分:"
													],
													[
														"text",
														{
															"text": $item.score
														}
													],
													[
														"text",
														{
															"margin-left": "50rem"
														},
														"时长:"
													],
													[
														"text",
														{
															"text": $item.time
														}
													],
													[
														"text",
														null,
														"分钟"
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