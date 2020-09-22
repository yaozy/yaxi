module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\detail\\test-paper.html")

return (
	[
		"databox",
		{
			"data": $data.test,
			"theme": "level1"
		},
		function (template, __data_list, __data_scope) {

			for (var $index = 0, __data_length = __data_list.length; $index < __data_length; $index++)
			{
				var $item = __data_list[$index];

				template($index, $item,
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
				);
			}

			// end function
		}
	]
)


}