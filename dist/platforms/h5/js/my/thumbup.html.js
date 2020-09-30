module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"text": "我的点赞"
				}
			],
			[
				"databox",
				{
					"flex": "auto",
					"padding": "0 20rem"
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
									"layout": "row",
									"tag": $item.courseid,
									"height": "160rem",
									"margin": "20rem 0",
									"events": {
										"tap": this.handleOpenDetail.bind(this)
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
													"height": "70rem"
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
												"box",
												{
													"theme": "text-primary",
													"height": "50rem"
												},
												[
													[
														"text",
														{
															"text": $item.price > 0 ? '￥' + $item.price : '免费'
														}
													]
												]
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
														"点赞时间:"
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