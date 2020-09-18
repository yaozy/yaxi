module.exports = function (scope) {


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
							"src": this.data.image,
							"style": "width:100%;height:400rem;"
						}
					],
					[
						"box",
						{
							"style": "padding:0 20rem;"
						},
						[
							[
								"box",
								{
									"style": "height:80rem;line-height:80rem;"
								},
								[
									[
										"text",
										{
											"text": this.data.name,
											"style": "font-size:36rem;"
										}
									],
									[
										"text",
										{
											"text": '￥' + this.data.price,
											"theme": "primary",
											"style": "float:right;"
										}
									]
								]
							],
							[
								"box",
								{
									"layout": "row space-between",
									"theme": "level1",
									"style": "height:80rem;font-size:28rem;border-bottom:.5px solid @border-level4;"
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
													"style": "margin-right:10rem;"
												},
												"学习人数"
											],
											[
												"text",
												{
													"theme": "second",
													"text": this.data.study
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
													"style": "margin-right:10rem;"
												},
												"浏览量"
											],
											[
												"text",
												{
													"theme": "second",
													"text": this.data.browse
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
													"style": "margin-right:10rem;"
												},
												"分享次数"
											],
											[
												"text",
												{
													"theme": "second",
													"text": this.data.share
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
											"text": this.data.activity,
											"style": "margin:20rem 0;"
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
							"style": "height:60rem;line-height:60rem;text-align:center;"
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