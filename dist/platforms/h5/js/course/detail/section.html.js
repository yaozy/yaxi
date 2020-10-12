module.exports = function ($this, $data, $model) {

return (
	[
		"databox",
		{
			"data": $data.sections,
			"theme": "bg-standard",
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
							"tag": $item.id,
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
										"box",
										{
											"height": "50rem",
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
)


}