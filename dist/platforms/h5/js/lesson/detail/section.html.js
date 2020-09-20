module.exports = function (owner, data) {


return (
	[
		"databox",
		{
			"data": data.sections,
			"theme": "level1",
			"padding": "20rem",
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
								"layout": "line",
								"tag": $item.id,
								"height": "160rem",
								"margin-bottom": "20rem",
								"overflow": "hidden",
								"events": {
									"tap": owner.handleOpenDetail.bind(owner)
								}
							},
							[
								[
									"image",
									{
										"src": $item.image,
										"width": "200rem",
										"height": "100%"
									}
								],
								[
									"box",
									{
										"width": "500rem",
										"height": "100%",
										"padding-left": "20rem"
									},
									[
										[
											"box",
											{
												"height": "70rem",
												"overflow": "hidden"
											},
											[
												[
													"text",
													{
														"text": $item.name
													}
												]
											]
										],
										[
											"box",
											{
												"height": "50rem",
												"overflow": "hidden",
												"theme": "level3",
												"font-size": "28rem"
											},
											[
												[
													"text",
													null,
													"讲师:"
												],
												[
													"text",
													{
														"text": $item.teacher
													}
												],
												[
													"text",
													{
														"margin-left": "30rem"
													},
													"人气:"
												],
												[
													"text",
													{
														"text": $item.people
													}
												]
											]
										],
										[
											"box",
											{
												"theme": "primary",
												"height": "40rem",
												"overflow": "hidden"
											},
											[
												[
													"text",
													{
														"text": $item.price > 0 ? '￥' + $item.price : '免费'
													}
												]
											]
										]
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
)


}