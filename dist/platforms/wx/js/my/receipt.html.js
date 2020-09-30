module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"text": "发票抬头"
				}
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
							"text": "添加发票抬头",
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
											"layout": "column",
											"height": "200rem",
											"padding": "50rem"
										},
										[
											[
												"box",
												{
													"layout": "row"
												},
												[
													[
														"text",
														{
															"theme": "bg-primary text-white",
															"width": "70rem",
															"height": "40rem",
															"line-height": "40rem",
															"margin-right": "10rem",
															"border-radius": "5rem",
															"text-align": "center",
															"font-size": "24rem",
															"bindings": {
																"text":  function () { return $item.type === 1 ? '公司' : '个人' }
															}
														}
													],
													[
														"text",
														{
															"bindings": {
																"text":  function () { return $item.name }
															}
														}
													]
												]
											],
											[
												"box",
												{
													"flex": "auto",
													"margin-top": "20rem",
													"layout": "row baseline"
												},
												[
													[
														"text",
														{
															"text": "税务识别号:",
															"theme": "text-lightest",
															"font-size": "28rem",
															"bindings": {
																"hidden":  function () { return $item.type !== 1 }
															}
														}
													],
													[
														"text",
														{
															"margin-left": "10rem",
															"theme": "text-lightest",
															"font-size": "28rem",
															"bindings": {
																"hidden":  function () { return $item.type !== 1 },
																"text":  function () { return $item.taxid }
															}
														}
													],
													[
														"text",
														{
															"theme": "text-lightest",
															"font-size": "28rem",
															"bindings": {
																"hidden":  function () { return $item.type !== 2 },
																"text":  function () { return $item.bank }
															}
														}
													],
													[
														"text",
														{
															"margin-left": "10rem",
															"theme": "text-lightest",
															"font-size": "28rem",
															"bindings": {
																"hidden":  function () { return $item.type !== 2 },
																"text":  function () { return $item.account }
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
													"text": "默认发票抬头",
													"layout": "row before",
													"flex": "auto",
													"bindings": {
														"theme":  function () { return $item.default ? 'text-warning' : 'text-lighter' },
														"checked":  function () { return $item.default },
														"onchange":  function (value) { $item.default = value; }
													},
													"events": {
														"changing": this.handleDefault.bind(this)
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