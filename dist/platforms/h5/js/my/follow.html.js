module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\follow.html")

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"theme": "bg-standard",
					"content": "我的关注"
				}
			],
			[
				"databox",
				{
					"data": $model,
					"item": "$lesson",
					"flex": "auto",
					"padding": "0 20rem"
				},
				function (template, __data_list, __data_scope) {

					for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
					{
						// 添加作用域解决循环变量绑定变化的问题
						(function () {

						var $lesson = __data_list[$index];

						template($index, $lesson,
							[
								"box",
								{
									"layout": "line",
									"tag": $lesson.id,
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
													"height": "70rem",
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
													"theme": "text-primary",
													"height": "50rem",
													"overflow": "hidden"
												},
												[
													[
														"text",
														{
															"text": $lesson.price > 0 ? '￥' + $lesson.price : '免费'
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
													"overflow": "hidden",
													"font-size": "28rem"
												},
												[
													[
														"text",
														null,
														"关注时间:"
													],
													[
														"text",
														{
															"text": $lesson.time
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
)


}