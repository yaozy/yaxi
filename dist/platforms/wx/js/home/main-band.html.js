module.exports = function (scope) {


return (
	[
		"box",
		{
			"theme": "level1",
			"style": "margin-top:10rem;padding:0 20rem;"
		},
		[
			[
				"box",
				{
					"style": "height:60rem;line-height:60rem;"
				},
				[
					[
						"icon",
						{
							"theme": "level2",
							"icon": this.icon,
							"style": "position:absolute;font-size:50rem;"
						}
					],
					[
						"text",
						{
							"theme": "level2",
							"text": this.text,
							"style": "position:absolute;left:60rem;"
						}
					],
					[
						"box",
						{
							"layout": "row",
							"theme": "level4",
							"style": "position:absolute;top:0;right:0;bottom:0;font-size:28rem;"
						},
						[
							[
								"text",
								null,
								"查看更多"
							],
							[
								"icon",
								{
									"icon": "common-more"
								}
							]
						]
					]
				]
			],
			[
				"box",
				null,
				(function (__for_list) {

				    var __for_data = [];

				    for (var index = 0, __for_len = __for_list.length; index < __for_len; index++)
				    {
				        var item = __for_list[index];

				        __for_data.push.apply(__for_data,
							[
								[
									"box",
									{
										"tag": item.id,
										"style": "height:160rem;margin:20rem 0;overflow:hidden;",
										"events": {
											"tap": this.handleOpenDetail.bind(this)
										}
									},
									[
										[
											"image",
											{
												"src": item.image,
												"style": "width:200rem;height:100%;"
											}
										],
										[
											"box",
											{
												"style": "display:inline-block;width:500rem;height:100%;padding-left:20rem;"
											},
											[
												[
													"box",
													{
														"style": "height:50rem;overflow:hidden;"
													},
													[
														[
															"text",
															{
																"text": item.name
															}
														]
													]
												],
												[
													"box",
													{
														"theme": "level4",
														"style": "height:70rem;font-size:24rem;overflow:hidden;"
													},
													[
														[
															"text",
															{
																"text": item.remark
															}
														]
													]
												],
												[
													"box",
													{
														"theme": "primary",
														"style": "height:40rem;overflow:hidden;"
													},
													[
														[
															"text",
															{
																"text": '￥' + item.price
															}
														]
													]
												]
											]
										]
									]
								]
							] || []);
				    }

				    return __for_data;

				}).call(this, this.data)
			]
		]
	]
)


}