module.exports = function (scope) {


return (
	[
		"band",
		{
			"style": "height:80rem;border-bottom:.5px solid @border-level4-color;"
		},
		[
			[
				"box",
				{
					"layout": "row",
					"style": "height:80rem;line-height:80rem;text-align:center;"
				},
				[
					[
						"box",
						{
							"layout": "row-center",
							"style": "width:33%;"
						},
						[
							[
								"text",
								null,
								"综合排序"
							],
							[
								"icon",
								{
									"bindings": {
										"icon": "icon.sort"
									}
								}
							]
						]
					],
					[
						"box",
						{
							"layout": "row-center",
							"style": "width:34%;"
						},
						[
							[
								"text",
								{
									"d": "type"
								}
							],
							[
								"icon",
								{
									"bindings": {
										"icon": "icon.type"
									}
								}
							]
						]
					],
					[
						"box",
						{
							"layout": "row-center",
							"style": "width:33%;"
						},
						[
							[
								"text",
								null,
								"筛选"
							],
							[
								"icon",
								{
									"bindings": {
										"icon": "icon.filter"
									}
								}
							]
						]
					]
				]
			],
			[
				"box",
				null
			],
			[
				"box",
				null
			],
			[
				"box",
				null
			]
		]
	]
)


}