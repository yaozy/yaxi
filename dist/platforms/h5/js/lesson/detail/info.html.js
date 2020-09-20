module.exports = function (owner, data) {


return (
	[
		"box",
		null,
		[
			[
				"box",
				{
					"layout": "vline",
					"theme": "level1"
				},
				[
					[
						"box",
						{
							"padding": "20rem 0",
							"border-bottom": ".5px solid @border-level4"
						},
						[
							[
								"text",
								{
									"border-left": "5rem solid @border-second",
									"padding": "0 20rem"
								},
								"任课教师"
							]
						]
					],
					[
						"databox",
						{
							"data": data.teachers,
							"layout": "line",
							"padding": "10rem 20rem",
							"scope": ""
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
												"layout": "column center",
												"margin-left": "20rem"
											},
											[
												[
													"image",
													{
														"src": $item.image,
														"width": "100rem",
														"height": "100rem",
														"border-radius": "100rem"
													}
												],
												[
													"text",
													{
														"text": $item.name
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
			],
			[
				"box",
				{
					"margin-top": "10rem",
					"theme": "level1"
				},
				[
					[
						"box",
						{
							"padding": "20rem 0",
							"border-bottom": ".5px solid @border-level4"
						},
						[
							[
								"text",
								{
									"border-left": "5rem solid @border-second",
									"padding": "0 20rem"
								},
								"课程内容"
							]
						]
					],
					[
						"box",
						{
							"padding": "20rem"
						},
						[
							[
								"text",
								{
									"text": data.detail
								}
							]
						]
					]
				]
			]
		]
	]
)


}