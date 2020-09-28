module.exports = function ($data, $model) {

return (
	[
		"box",
		null,
		[
			[
				"box",
				{
					"layout": "row middle space-between",
					"theme": "bg-standard line-lightest line-bottom",
					"height": "80rem",
					"padding": "0 20rem"
				},
				[
					[
						"icon",
						{
							"icon": "common-search"
						}
					],
					[
						"textbox",
						{
							"width": "480rem",
							"height": "60rem"
						}
					],
					[
						"button",
						{
							"width": "150rem",
							"height": "60rem"
						},
						"评论"
					]
				]
			],
			[
				"databox",
				{
					"data": $data.comments,
					"theme": "bg-standard",
					"padding": "20rem 0"
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
									"tag": $item.id,
									"height": "150rem",
									"padding": "20rem"
								},
								[
									[
										"image",
										{
											"src": $item.image,
											"width": "100rem",
											"height": "100rem",
											"border-radius": "100rem"
										}
									],
									[
										"box",
										{
											"width": "600rem",
											"margin-left": "10rem"
										},
										[
											[
												"box",
												{
													"layout": "row space-between",
													"height": "50rem",
													"theme": "text-light",
													"font-size": "28rem"
												},
												[
													[
														"text",
														{
															"text": $item.name
														}
													],
													[
														"text",
														{
															"text": $item.time
														}
													]
												]
											],
											[
												"text",
												{
													"text": $item.text,
													"theme": "text-lighter"
												}
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