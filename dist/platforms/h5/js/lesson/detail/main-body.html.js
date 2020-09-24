module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\detail\\main-body.html")

return (
	[
		"box",
		{
			"layout": "column",
			"flex": "auto",
			"theme": "bg-thick"
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
							"src": $data.image,
							"width": "100%",
							"height": "400rem"
						}
					],
					[
						"box",
						{
							"padding": "0 20rem",
							"theme": "bg-standard"
						},
						[
							[
								"box",
								{
									"layout": "row space-between",
									"height": "80rem",
									"line-height": "80rem"
								},
								[
									[
										"text",
										{
											"text": $data.name,
											"font-size": "36rem"
										}
									],
									[
										"text",
										{
											"text": '￥' + $data.price,
											"theme": "text-primary",
											"align-self": "flex-end"
										}
									]
								]
							],
							[
								"box",
								{
									"layout": "row space-between",
									"theme": "bg-standard text-light line-lightest line-bottom",
									"height": "80rem",
									"font-size": "28rem"
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
													"theme": "text-lighter",
													"margin-right": "10rem"
												},
												"学习人数"
											],
											[
												"text",
												{
													"theme": "secondary",
													"text": $data.study
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
													"theme": "text-lighter",
													"margin-right": "10rem"
												},
												"浏览量"
											],
											[
												"text",
												{
													"theme": "secondary",
													"text": $data.browse
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
													"theme": "text-lighter",
													"margin-right": "10rem"
												},
												"分享次数"
											],
											[
												"text",
												{
													"theme": "secondary",
													"text": $data.share
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
											"text": $data.activity,
											"margin": "20rem 0"
										}
									]
								]
							]
						]
					],
					[
						"tabbar",
						{
							"full": "false",
							"selected-index": "0",
							"height": "80rem",
							"line-height": "80rem",
							"theme": "bg-standard line-lightest line-bottom",
							"margin-top": "10rem",
							"text-align": "center"
						},
						[
							[
								"text",
								{
									"flex": "auto",
									"module": require('./info'),
									"data": $data,
									"selected-status": $data.selectedStatus
								},
								"详情"
							],
							[
								"text",
								{
									"flex": "auto",
									"module": require('./section'),
									"data": $data,
									"selected-status": $data.selectedStatus
								},
								"章节"
							],
							[
								"text",
								{
									"flex": "auto",
									"module": require('./test-paper'),
									"data": $data,
									"selected-status": $data.selectedStatus
								},
								"试卷"
							],
							[
								"text",
								{
									"flex": "auto",
									"module": require('./comment'),
									"data": $data,
									"selected-status": $data.selectedStatus
								},
								"评论"
							],
							[
								"text",
								{
									"flex": "auto",
									"module": require('./recommend'),
									"data": $data,
									"selected-status": $data.selectedStatus
								},
								"推荐"
							]
						]
					],
					[
						"stackbox",
						null
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