module.exports = function (owner, data) {


return (
	[
		"databox",
		{
			"data": data.test,
			"theme": "level1",
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
								"height": "200rem",
								"padding": "40rem 20rem"
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
											"时间:"
										],
										[
											"text",
											{
												"text": $item.time
											}
										],
										[
											"text",
											{
												"margin-left": "30rem"
											},
											"分数:"
										],
										[
											"text",
											{
												"text": $item.score
											}
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