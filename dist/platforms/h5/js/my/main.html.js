module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\main.html")

return (
	[
		"box",
		{
			"theme": "bg-thick"
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
							"layout": "vline",
							"width": "550rem"
						},
						[
							[
								"text",
								{
									"bindings": {
										"text":  function () { return $model.name }
									}
								}
							],
							[
								"text",
								{
									"bindings": {
										"text":  function () { return $model.nickname }
									}
								}
							],
							[
								"text",
								{
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
					"data": $data
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
											"padding": "20rem 50rem",
											"events": {
												"tap": $owner.handleOpen.bind($owner)
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
															"content": $subitem.text,
															"tag": $subitem.url,
															"width": "160rem",
															"height": "120rem"
														}
													]
												);

												})();
											}

											// end function
										}
									]
								]
							]
						);

						})();
					}

					// end function
				}
			],
			[
				"box",
				{
					"theme": "bg-primary",
					"text-align": "center",
					"line-height": "80rem",
					"events": {
						"tap": $owner.openTest.bind($owner)
					}
				},
				[
					[
						"text",
						null,
						"Open Test"
					]
				]
			]
		]
	]
)


}