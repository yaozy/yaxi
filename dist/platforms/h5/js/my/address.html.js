module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\address.html")

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"theme": "bg-standard",
					"content": "我的地址"
				}
			],
			[
				"box",
				{
					"text-align": "center",
					"line-height": "100rem",
					"events": {
						"tap": $owner.handleAdd.bind($owner)
					}
				},
				[
					[
						"iconbutton",
						{
							"width": "auto",
							"icon": "common-search",
							"content": "添加地址",
							"layout": "row middle",
							"theme": "text-primary"
						}
					]
				]
			],
			[
				"databox",
				{
					"data": $model,
					"theme": "bg-thick",
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
									"margin-top": "20rem",
									"theme": "bg-standard"
								},
								[
									[
										"box",
										{
											"layout": "row middle",
											"height": "150rem"
										},
										[
											[
												"icon",
												{
													"width": "100rem",
													"bindings": {
														"icon":  function () { return $item.gendle ? 'common-man' : 'common-woman' }
													}
												}
											],
											[
												"box",
												{
													"width": "600rem"
												},
												[
													[
														"box",
														{
															"layout": "row space-between"
														},
														[
															[
																"text",
																{
																	"bindings": {
																		"text":  function () { return $item.name }
																	}
																}
															],
															[
																"text",
																{
																	"bindings": {
																		"text":  function () { return $item.tel }
																	}
																}
															]
														]
													],
													[
														"text",
														{
															"theme": "text-lightest",
															"font-size": "28rem",
															"bindings": {
																"text":  function () { return $item.address }
															}
														}
													]
												]
											]
										]
									],
									[
										"box",
										{
											"tag": $index,
											"layout": "row middle",
											"padding": "0 20rem",
											"theme": "line-lightest line-top"
										},
										[
											[
												"iconbutton",
												{
													"content": "默认地址",
													"layout": "row before",
													"flex": "auto",
													"bindings": {
														"icon":  function () { return $item.default ? 'common-checked' : 'common-unchecked' },
														"theme":  function () { return $item.default ? 'text-warning' : 'text-lighter' }
													},
													"events": {
														"tap": $owner.handleDefault.bind($owner)
													}
												}
											],
											[
												"text",
												{
													"padding": "0 30rem",
													"theme": "text-lightest",
													"events": {
														"tap": $owner.handleEdit.bind($owner)
													}
												},
												"编辑"
											],
											[
												"text",
												{
													"padding": "0 30rem",
													"theme": "text-lightest",
													"events": {
														"tap": $owner.handleDelete.bind($owner)
													}
												},
												"删除"
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