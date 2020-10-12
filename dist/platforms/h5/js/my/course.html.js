module.exports = function ($this, $data, $model) {

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
					"flex": "auto",
					"padding": "0 20rem"
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
									"layout": "row",
									"tag": $item.courseid,
									"height": "160rem",
									"margin": "30rem 0",
									"events": {
										"tap": $this.handleOpenDetail.bind($this)
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
												"databox",
												{
													"data": $item.remark,
													"item": "$remark",
													"theme": "text-lightest",
													"height": "50rem",
													"line-height": "40rem",
													"font-size": "24rem"
												},
												function (template, data, scope) {

													var $index = scope[0];
													var $item = scope[1];

													for (var $index = 0, length = data.length; $index < length; $index++)
													{
														// 添加作用域解决循环变量绑定变化的问题
														(function ($index, $remark) {


														template($index, $remark,
															[
																"text",
																{
																	"text": $remark,
																	"theme": "bg-thick",
																	"border-radius": "20rem",
																	"padding": "0 20rem",
																	"margin-right": "10rem"
																}
															]
														);

														})($index, data[$index]);
													}

													// end function
												}
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

						})($index, data[$index]);
					}

					// end function
				}
			]
		]
	]
)


}