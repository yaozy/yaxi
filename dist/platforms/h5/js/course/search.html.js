module.exports = function ($this, $data, $model) {

return (
	[
		"box",
		{
			"static": "true",
			"overflow": "visible",
			"z-index": "2",
			"height": "90rem"
		},
		[
			[
				"masklayer",
				{
					"bindings": {
						"hidden":  function () { return $model.hidden }
					},
					"events": {
						"tap": $this.handleClear.bind($this)
					}
				}
			],
			[
				"box",
				{
					"layout": "row",
					"theme": "bg-standard",
					"height": "90rem"
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
								"input": $this.handleInput.bind($this),
								"focus": $this.handleFocus.bind($this)
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
								"tap": $this.handleClear.bind($this)
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
								"tap": $this.handleSearch.bind($this)
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
										"tap": $this.handleCancel.bind($this)
									}
								},
								"取消搜索"
							]
						]
					],
					[
						"databox",
						null,
						function (template, data, scope) {

							for (var $index = 0, length = data.length; $index < length; $index++)
							{
								// 添加作用域解决循环变量绑定变化的问题
								(function ($index, $item) {


								template($index, $item,
									[
										"box",
										{
											"tag": $index,
											"layout": "row middle",
											"height": "80rem",
											"line-height": "80rem",
											"theme": "line-lightest line-top",
											"padding": "0 20rem",
											"events": {
												"tap": $this.handleSuggest.bind($this)
											}
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

								})($index, data[$index]);
							}

							// end function
						}
					]
				]
			]
		]
	]
)


}