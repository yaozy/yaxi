module.exports = function (data) {


return (
	[
		"box",
		{
			"layout": "column"
		},
		[
			[
				"box",
				{
					"flex": "auto"
				},
				[
					[
						"image",
						{
							"src": data.image,
							"width": "100%",
							"height": "400rem"
						}
					],
					[
						"box",
						{
							"padding": "0 20rem"
						},
						[
							[
								"box",
								{
									"layout": "row",
									"height": "80rem",
									"line-height": "80rem"
								},
								[
									[
										"text",
										{
											"text": data.name,
											"font-size": "36rem"
										}
									],
									[
										"text",
										{
											"text": '￥' + data.price,
											"theme": "primary",
											"align-self": "flex-end"
										}
									]
								]
							],
							[
								"box",
								{
									"layout": "row space-between",
									"theme": "level1",
									"height": "80rem",
									"font-size": "28rem",
									"border-bottom": ".5px solid @border-level4"
								},
								[
									[
										"box",
										{
											"layout": "row middle"
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
												{
													"theme": "level3",
													"margin-right": "10rem"
												},
												"学习人数"
											],
											[
												"text",
												{
													"theme": "second",
													"text": data.study
												}
											]
										]
									],
									[
										"box",
										{
											"layout": "row middle"
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
												{
													"theme": "level3",
													"margin-right": "10rem"
												},
												"浏览量"
											],
											[
												"text",
												{
													"theme": "second",
													"text": data.browse
												}
											]
										]
									],
									[
										"box",
										{
											"layout": "row middle"
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
												{
													"theme": "level3",
													"margin-right": "10rem"
												},
												"分享次数"
											],
											[
												"text",
												{
													"theme": "second",
													"text": data.share
												}
											]
										]
									]
								]
							],
							[
								"box",
								null,
								[
									[
										"text",
										{
											"text": data.activity,
											"margin": "20rem 0"
										}
									]
								]
							]
						]
					],
					[
						"tab",
						{
							"host": "<* >@host",
							"selected-index": "0",
							"height": "60rem",
							"line-height": "60rem",
							"text-align": "center"
						},
						[
							[
								"text",
								{
									"flex": "auto"
								},
								"详情"
							],
							[
								"text",
								{
									"flex": "auto"
								},
								"章节"
							],
							[
								"text",
								{
									"flex": "auto"
								},
								"试卷"
							],
							[
								"text",
								{
									"flex": "auto"
								},
								"评论"
							],
							[
								"text",
								{
									"flex": "auto"
								},
								"推荐"
							]
						]
					],
					[
						"box",
						{
							"key": "host"
						}
					]
				]
			],
			[
				"button",
				null,
				"报名学习"
			]
		]
	]
)


}