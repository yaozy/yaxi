module.exports = function ($data, $model) {

return (
	[
		"box",
		{
			"theme": "bg-thick",
			"layout": "column",
			"overflow": "auto"
		},
		[
			[
				"box",
				{
					"layout": "row middle",
					"height": "250rem",
					"theme": "bg-primary"
				},
				[
					[
						"box",
						{
							"width": "250rem",
							"padding-left": "50rem"
						},
						[
							[
								"image",
								{
									"width": "150rem",
									"height": "150rem",
									"border-radius": "75rem",
									"bindings": {
										"src":  function () { return $model.image }
									}
								}
							]
						]
					],
					[
						"box",
						{
							"layout": "column",
							"width": "550rem"
						},
						[
							[
								"text",
								{
									"theme": "text-white",
									"bindings": {
										"text":  function () { return $model.name }
									}
								}
							],
							[
								"text",
								{
									"theme": "text-white",
									"margin-top": "20rem",
									"font-size": "24rem",
									"bindings": {
										"text":  function () { return $model.nickname }
									}
								}
							],
							[
								"text",
								{
									"theme": "text-white",
									"margin-top": "10rem",
									"font-size": "24rem",
									"bindings": {
										"text":  function () { return $model.tel }
									}
								}
							]
						]
					]
				]
			],
			[
				"databox",
				{
					"data": $data,
					"overflow": "hidden"
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
									"theme": "bg-standard",
									"margin-top": "10rem"
								},
								[
									[
										"box",
										{
											"theme": "line-lightest line-bottom",
											"padding-left": "50rem",
											"height": "80rem",
											"line-height": "80rem"
										},
										[
											[
												"text",
												{
													"text": $item.text
												}
											]
										]
									],
									[
										"databox",
										{
											"data": $item.data,
											"item": "$subitem",
											"overflow": "hidden",
											"padding": "20rem 50rem",
											"events": {
												"tap": this.handleOpen.bind(this)
											}
										},
										function (template, __data_list, __data_scope) {

											var $index = __data_scope[0];
											var $item = __data_scope[1];

											for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
											{
												// 添加作用域解决循环变量绑定变化的问题
												(function () {

												var $subitem = __data_list[$index];

												template($index, $subitem,
													[
														"iconbutton",
														{
															"icon": $subitem.icon,
															"size": "60rem",
															"font-size": "28rem",
															"theme": "text-light",
															"text": $subitem.text,
															"tag": $subitem.url,
															"width": "160rem",
															"height": "140rem"
														}
													]
												);

												}).call(this);
											}

											// end function
										}.bind(this)
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