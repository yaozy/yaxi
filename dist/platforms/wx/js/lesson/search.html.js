module.exports = function (scope) {


return (
	[
		"band",
		{
			"style": "position:static;overflow:visible;z-index:1;height:80rem;"
		},
		[
			[
				"maskbox",
				{
					"bindings": {
						"hidden": "hidden"
					},
					"events": {
						"tap": this.handleClear.bind(this)
					}
				}
			],
			[
				"band",
				{
					"layout": "row",
					"theme": "level1",
					"style": "height:80rem;"
				},
				[
					[
						"textbox",
						{
							"placeholder": "搜索老师、机构、课程",
							"style": "position:absolute;width:710rem;height:60rem;line-height:60rem;top:50%;left:20rem;transform:translateY(-50%);border:.5px solid @border-level4-color;border-radius:60rem;padding:0 120rem 0 60rem;",
							"bindings": {
								"value": "text"
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
							"style": "position:absolute;top:50%;left:28rem;transform:translateY(-50%);"
						}
					],
					[
						"text",
						{
							"theme": "font-level2",
							"style": "position:absolute;width:120rem;height:80rem;line-height:80rem;right:20rem;text-align:center;",
							"bindings": {
								"hidden": "hidden"
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
					"theme": "level1",
					"bindings": {
						"hidden": "hidden"
					}
				},
				[
					[
						"band",
						{
							"layout": "row",
							"style": "height:80rem;line-height:80rem;padding:0 20rem;",
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
									"style": "margin-left:50rem;",
									"events": {
										"tap": this.handleCancel.bind(this)
									}
								},
								"取消搜索"
							]
						]
					],
					[
						"repeater",
						{
							"submodel": "data",
							"events": {
								"tap": this.handleSuggest.bind(this)
							}
						},
						[
							[
								"band",
								{
									"layout": "row",
									"style": "height:80rem;line-height:80rem;border-top:.5px solid @border-level4-color;padding:0 20rem;"
								},
								[
									[
										"text",
										{
											"bindings": {
												"text": "item.before"
											}
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
											"bindings": {
												"text": "item.after"
											}
										}
									]
								]
							]
						]
					]
				]
			]
		]
	]
)


}