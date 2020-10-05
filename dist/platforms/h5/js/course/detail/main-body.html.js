module.exports = function ($data, $model) {

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
					"flex": "auto",
					"overflow": "auto"
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
													"icon": "my-study"
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
													"theme": "text-secondary",
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
													"icon": "common-browse"
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
													"theme": "text-secondary",
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
													"icon": "common-share"
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
													"theme": "text-secondary",
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
											"margin": "20rem 0",
											"theme": "text-lighter"
										}
									]
								]
							]
						]
					],
					[
						"tabbar",
						{
							"height": "80rem",
							"line-height": "80rem",
							"theme": "bg-standard line-lightest line-bottom",
							"margin-top": "10rem",
							"text-align": "center",
							"events": {
								"change": this.handleSwitch.bind(this)
							}
						},
						[
							[
								"text",
								{
									"flex": "auto",
									"selected-status": $data.selectedStatus
								},
								"详情"
							],
							[
								"text",
								{
									"flex": "auto",
									"selected-status": $data.selectedStatus
								},
								"章节"
							],
							[
								"text",
								{
									"flex": "auto",
									"selected-status": $data.selectedStatus
								},
								"试卷"
							],
							[
								"text",
								{
									"flex": "auto",
									"selected-status": $data.selectedStatus
								},
								"评论"
							],
							[
								"text",
								{
									"flex": "auto",
									"selected-status": $data.selectedStatus
								},
								"推荐"
							]
						]
					],
					[
						"box",
						{
							"key": "host"
						},
						[
							[
								require("./info"),
								{

								}
							],
							[
								require("./section"),
								{

								}
							],
							[
								require("./test-paper"),
								{

								}
							],
							[
								require("./comment"),
								{

								}
							],
							[
								require("./recommend"),
								{

								}
							]
						]
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