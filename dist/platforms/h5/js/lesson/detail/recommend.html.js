module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\detail\\recommend.html")

return (
	[
		"databox",
		{
			"data": $data.recommends,
			"theme": "bg-standard",
			"padding": "20rem"
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
							"margin-bottom": "20rem",
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
										"box",
										{
											"height": "50rem",
											"overflow": "hidden",
											"theme": "text-lighter",
											"font-size": "28rem"
										},
										[
											[
												"text",
												null,
												"讲师:"
											],
											[
												"text",
												{
													"text": $item.teacher
												}
											],
											[
												"text",
												{
													"margin-left": "30rem"
												},
												"人气:"
											],
											[
												"text",
												{
													"text": $item.people
												}
											]
										]
									],
									[
										"box",
										{
											"theme": "text-primary",
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
)


}