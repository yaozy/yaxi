module.exports = function ($data, $model) {

return (
	[
		"box",
		null,
		[
			[
				"box",
				{
					"layout": "column",
					"theme": "bg-standard"
				},
				[
					[
						"box",
						{
							"padding": "20rem 0",
							"theme": "line-lightest line-bottom"
						},
						[
							[
								"text",
								{
									"border-left": "5rem solid @line-primary",
									"padding": "0 20rem"
								},
								"任课教师"
							]
						]
					],
					[
						"databox",
						{
							"data": $data.teachers,
							"layout": "row",
							"padding": "20rem"
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
													"text": $item.name,
													"theme": "text-lighter"
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
			],
			[
				"box",
				{
					"margin-top": "10rem",
					"theme": "bg-standard"
				},
				[
					[
						"box",
						{
							"padding": "20rem 0",
							"theme": "line-lightest line-bottom"
						},
						[
							[
								"text",
								{
									"border-left": "5rem solid @line-primary",
									"padding": "0 20rem"
								},
								"课程内容"
							]
						]
					],
					[
						"box",
						{
							"padding": "40rem 20rem"
						},
						[
							[
								"text",
								{
									"text": $data.detail,
									"theme": "text-lighter"
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