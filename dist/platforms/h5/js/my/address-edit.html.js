module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\address-edit.html")

return (
	[
		"box",
		{
			"theme": "bg-standard",
			"opacity": ".3",
			"position": "absolute",
			"left": "0",
			"top": "0",
			"width": "100%",
			"height": "100%"
		},
		[
			[
				"box",
				{
					"width": "500rem",
					"left": "100rem",
					"top": "50%",
					"transform": "translateY(-50%)"
				},
				[
					[
						"textbox",
						{
							"placeholder": "姓名"
						}
					],
					[
						"textbox",
						{
							"placeholder": "姓名"
						}
					],
					[
						"textbox",
						{
							"placeholder": "姓名"
						}
					],
					[
						"textbox",
						{
							"placeholder": "姓名"
						}
					],
					[
						"textbox",
						{
							"placeholder": "姓名"
						}
					],
					[
						"button",
						null,
						"确认"
					],
					[
						"icon",
						{
							"icon": "common-close"
						}
					]
				]
			]
		]
	]
)


}