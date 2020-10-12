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
					"text": "我的试卷"
				}
			],
			[
				"databox",
				{
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
									"tag": $index,
									"theme": "bg-standard",
									"layout": "row",
									"margin": "10rem 0",
									"padding": "40rem 0",
									"events": {
										"tap": $this.handleStart.bind($this)
									}
								},
								[
									[
										"icon",
										{
											"icon": "my-exercise",
											"width": "120rem",
											"font-size": "80rem"
										}
									],
									[
										"box",
										{
											"layout": "column",
											"flex": "auto",
											"height": "100%"
										},
										[
											[
												"text",
												{
													"text": $item.name,
													"height": "60rem"
												}
											],
											[
												"box",
												{
													"layout": "row middle",
													"theme": "text-lightest",
													"height": "30rem",
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

						})($index, data[$index]);
					}

					// end function
				}
			]
		]
	]
)


}