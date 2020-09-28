module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"theme": "bg-standard"
				},
				"我的地址"
			],
			[
				"box",
				{
					"text-align": "center",
					"line-height": "100rem",
					"events": {
						"tap": this.handleAdd.bind(this)
					}
				},
				[
					[
						"iconbutton",
						{
							"width": "auto",
							"icon": "common-search",
							"text": "添加地址",
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
											"height": "180rem"
										},
										[
											[
												"icon",
												{
													"width": "100rem",
													"font-size": "60rem",
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
															"margin-top": "20rem",
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
											"layout": "row middle",
											"height": "100rem",
											"padding": "0 20rem",
											"theme": "line-lightest line-top",
											"bindings": {
												"tag":  function () { return ($item && $item.$index != null ? $item.$index : $index) }
											}
										},
										[
											[
												"checkbox",
												{
													"text": "默认地址",
													"layout": "row before",
													"flex": "auto",
													"bindings": {
														"theme":  function () { return $item.default ? 'text-warning' : 'text-lighter' },
														"checked":  function () { return $item.default }
													},
													"events": {
														"tap": this.handleDefault.bind(this)
													}
												}
											],
											[
												"text",
												{
													"padding": "0 30rem",
													"theme": "text-lightest",
													"events": {
														"tap": this.handleEdit.bind(this)
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
														"tap": this.handleDelete.bind(this)
													}
												},
												"删除"
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