module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"content": "yaxi model page"
				}
			],
			[
				"box",
				{
					"layout": "column",
					"flex": "auto"
				},
				[
					[
						"box",
						{
							"layout": "row",
							"theme": "@bg-thick"
						},
						[
							[
								"button",
								{
									"flex": "auto",
									"content": "Append",
									"events": {
										"tap": this.handleAppend.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "auto",
									"content": "Replace",
									"events": {
										"tap": this.handleReplace.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "auto",
									"content": "Remove",
									"events": {
										"tap": this.handleRemove.bind(this)
									}
								}
							],
							[
								"button",
								{
									"flex": "auto",
									"content": "Reorder",
									"events": {
										"tap": this.handleReorder.bind(this)
									}
								}
							]
						]
					],
					[
						"databox",
						{
							"data": $model,
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
											"layout": "row",
											"height": "200rem"
										},
										[
											[
												"box",
												{
													"width": "50rem",
													"height": "120rem",
													"line-height": "120rem",
													"top": "0",
													"left": "20rem"
												},
												[
													[
														"text",
														{
															"bindings": {
																"text":  function () { return ($item && $item.$index != null ? $item.$index : $index) }
															}
														}
													]
												]
											],
											[
												"box",
												{
													"height": "180rem",
													"width": "700rem",
													"left": "70rem",
													"top": "20rem"
												},
												[
													[
														"text",
														{
															"width": "200rem",
															"bindings": {
																"text":  function () { return $item.name }
															}
														}
													],
													[
														"text",
														{
															"bindings": {
																"text":  function () { return $item.value }
															}
														}
													],
													[
														"text",
														{
															"bindings": {
																"text":  function () { return $item.computed }
															}
														}
													],
													[
														"databox",
														{
															"data": $item.submodel,
															"item": "$subitem",
															"index": "$subindex"
														},
														function (template, __data_list, __data_scope) {

															var $index = __data_scope[0];
															var $item = __data_scope[1];

															for (var $subindex = 0, __data_length = __data_list.length; $subindex < __data_length; $subindex++)
															{
																// 添加作用域解决循环变量绑定变化的问题
																(function () {

																var $subitem = __data_list[$subindex];

																template($subindex, $subitem,
																	[
																		"text",
																		{
																			"bindings": {
																				"text":  function () { return 'index:' + ($item && $item.$index != null ? $item.$index : $index) + '  subindex:' + ($subitem && $subitem.$index != null ? $subitem.$index : $subindex) + '  text:' + $subitem.text }
																			}
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
		]
	]
)


}