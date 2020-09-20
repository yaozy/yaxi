module.exports = function (owner, data) {


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
						"hidden": "hidden"
					},
					"events": {
						"tap": owner.handleClear.bind(owner)
					}
				}
			],
			[
				"box",
				{
					"layout": "row",
					"theme": "level1",
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
							"border": ".5px solid @border-level4",
							"border-radius": "60rem",
							"padding": "0 120rem 0 60rem",
							"bindings": {
								"value": "text"
							},
							"events": {
								"input": owner.handleInput.bind(owner),
								"focus": owner.handleFocus.bind(owner)
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
							"theme": "font-level2",
							"position": "absolute",
							"width": "120rem",
							"height": "80rem",
							"line-height": "80rem",
							"right": "20rem",
							"text-align": "center",
							"bindings": {
								"hidden": "hidden"
							},
							"events": {
								"tap": owner.handleClear.bind(owner)
							}
						},
						"清除"
					]
				]
			],
			[
				"box",
				{
					"theme": "level1",
					"bindings": {
						"hidden": "hidden"
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
								"tap": owner.handleSearch.bind(owner)
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
									"theme": "font-primary",
									"bindings": {
										"text": "text"
									}
								}
							],
							[
								"text",
								{
									"theme": "font-level4",
									"margin-left": "50rem",
									"events": {
										"tap": owner.handleCancel.bind(owner)
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
							"scope": "",
							"events": {
								"tap": owner.handleSuggest.bind(owner)
							}
						},
						function (controls, __loop_data, __loop_scope) {


						    for (var $index = 0, __loop_len = __loop_data.length; $index < __loop_len; $index++)
						    {
						        var $item = __loop_data[$index];

						        this.loadTemplate(controls, __loop_scope, $index, $item,
									[
										[
											"box",
											{
												"tag": $index,
												"layout": "row",
												"height": "80rem",
												"line-height": "80rem",
												"border-top": ".5px solid @border-level4",
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
														"theme": "font-primary",
														"bindings": {
															"text": "text"
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
									]
								);
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