module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\search.html")

return (
	[
		"box",
		{
			"position": "static",
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
						"tap": $owner.handleClear.bind($owner)
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
							"position": "absolute",
							"width": "710rem",
							"height": "60rem",
							"line-height": "60rem",
							"top": "50%",
							"left": "20rem",
							"transform": "translateY(-50%)",
							"theme": "line-lightest line-all",
							"border-radius": "60rem",
							"padding": "0 120rem 0 60rem",
							"bindings": {
								"value":  function () { return $model.text }
							},
							"events": {
								"input": $owner.handleInput.bind($owner),
								"focus": $owner.handleFocus.bind($owner)
							}
						}
					],
					[
						"icon",
						{
							"icon": "common-search",
							"position": "absolute",
							"top": "50%",
							"left": "28rem",
							"transform": "translateY(-50%)"
						}
					],
					[
						"text",
						{
							"theme": "text-lighter",
							"position": "absolute",
							"width": "120rem",
							"height": "80rem",
							"line-height": "80rem",
							"right": "20rem",
							"text-align": "center",
							"bindings": {
								"hidden":  function () { return $model.hidden }
							},
							"events": {
								"tap": $owner.handleClear.bind($owner)
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
								"tap": $owner.handleSearch.bind($owner)
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
										"tap": $owner.handleCancel.bind($owner)
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
								"tap": $owner.handleSuggest.bind($owner)
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

								})();
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