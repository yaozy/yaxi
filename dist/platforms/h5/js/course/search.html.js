module.exports = function ($data, $model) {

return (
	[
		"box",
		{
			"static": "true",
			"overflow": "visible",
			"z-index": "5",
			"height": "80rem"
		},
		[
			[
				"masklayer",
				{
					"bindings": {
						"hidden":  function () { return $model.hidden }
					},
					"events": {
						"tap": this.handleClear.bind(this)
					}
				}
			],
			[
				"box",
				{
					"layout": "row",
					"theme": "bg-standard",
					"height": "80rem"
				},
				[
					[
						"textbox",
						{
							"placeholder": "搜索老师、机构、课程",
							"width": "710rem",
							"height": "60rem",
							"line-height": "60rem",
							"absolute": "middle",
							"left": "20rem",
							"theme": "line-lightest line-all",
							"border-radius": "60rem",
							"padding": "0 120rem 0 60rem",
							"bindings": {
								"value":  function () { return $model.text }
							},
							"events": {
								"input": this.handleInput.bind(this),
								"focus": this.handleFocus.bind(this)
							}
						}
					],
					[
						"icon",
						{
							"icon": "common-search",
							"absolute": "middle",
							"left": "28rem"
						}
					],
					[
						"text",
						{
							"width": "120rem",
							"height": "80rem",
							"absolute": "middle right",
							"line-height": "80rem",
							"right": "20rem",
							"theme": "text-lighter",
							"text-align": "center",
							"bindings": {
								"hidden":  function () { return $model.hidden }
							},
							"events": {
								"tap": this.handleClear.bind(this)
							}
						},
						"清除"
					]
				]
			],
			[
				"box",
				{
					"theme": "bg-standard",
					"bindings": {
						"hidden":  function () { return $model.hidden }
					}
				},
				[
					[
						"box",
						{
							"layout": "row",
							"height": "80rem",
							"line-height": "80rem",
							"padding": "0 20rem",
							"events": {
								"tap": this.handleSearch.bind(this)
							}
						},
						[
							[
								"icon",
								{
									"icon": "common-search"
								}
							],
							[
								"text",
								null,
								"搜索"
							],
							[
								"text",
								{
									"theme": "text-primary",
									"bindings": {
										"text":  function () { return $model.text }
									}
								}
							],
							[
								"text",
								{
									"theme": "text-lighter",
									"margin-left": "50rem",
									"events": {
										"tap": this.handleCancel.bind(this)
									}
								},
								"取消搜索"
							]
						]
					],
					[
						"databox",
						{
							"key": "search-body",
							"events": {
								"tap": this.handleSuggest.bind(this)
							}
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
											"tag": $index,
											"layout": "row middle",
											"height": "80rem",
											"line-height": "80rem",
											"theme": "line-lightest line-top",
											"padding": "0 20rem"
										},
										[
											[
												"text",
												{
													"text": $item.before
												}
											],
											[
												"text",
												{
													"theme": "text-primary",
													"bindings": {
														"text":  function () { return $model.text }
													}
												}
											],
											[
												"text",
												{
													"text": $item.after
												}
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