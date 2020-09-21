module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\detail\\comment.html")

return (
	[
		"box",
		null,
		[
			[
				"box",
				{
					"layout": "row middle space-between",
					"theme": "level1",
					"height": "80rem",
					"padding": "0 20rem",
					"border-bottom": ".5px solid @border-level4"
				},
				[
					[
						"icon",
						{
							"icon": "common-search"
						}
					],
					[
						"textbox",
						{
							"width": "480rem",
							"height": "60rem"
						}
					],
					[
						"button",
						{
							"content": "评论",
							"width": "150rem",
							"height": "60rem"
						}
					]
				]
			],
			[
				"databox",
				{
					"data": $data.comments,
					"theme": "level1",
					"padding": "20rem 0"
				},
				function (template, __data_list, __data_scope) {

					for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
					{
						var $item = __data_list[$index];

						template($index, $item,
							[
								"box",
								{
									"layout": "line",
									"tag": $item.id,
									"height": "150rem",
									"padding": "20rem",
									"overflow": "hidden"
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
										"box",
										{
											"width": "600rem",
											"margin-left": "10rem"
										},
										[
											[
												"box",
												{
													"layout": "row space-between",
													"height": "50rem",
													"overflow": "hidden",
													"theme": "level2",
													"font-size": "28rem"
												},
												[
													[
														"text",
														{
															"text": $item.name
														}
													],
													[
														"text",
														{
															"text": $item.time
														}
													]
												]
											],
											[
												"text",
												{
													"text": $item.text,
													"theme": "level3"
												}
											]
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
)


}