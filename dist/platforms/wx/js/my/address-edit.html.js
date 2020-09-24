module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\address-edit.html")

return (
	[
		"floatlayer",
		null,
		[
			[
				"box",
				{
					"width": "550rem",
					"padding": "50rem",
					"left": "100rem",
					"top": "50%",
					"transform": "translateY(-50%)"
				},
				[
					[
						"textbox",
						{
							"placeholder": "姓名",
							"width": "100%",
							"text-align": "center",
							"bindings": {
								"text":  function () { return $model.name },
								"change":  function () { return $model.name }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "性别",
							"width": "100%",
							"text-align": "center",
							"bindings": {
								"text":  function () { return $model.gendle },
								"change":  function () { return $model.gendle }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "电话",
							"width": "100%",
							"text-align": "center",
							"bindings": {
								"text":  function () { return $model.tel },
								"change":  function () { return $model.tel }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "地址",
							"width": "100%",
							"text-align": "center",
							"bindings": {
								"text":  function () { return $model.address },
								"change":  function () { return $model.address }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "楼宇门牌",
							"width": "100%",
							"text-align": "center",
							"bindings": {
								"text":  function () { return $model.house },
								"change":  function () { return $model.house }
							}
						}
					],
					[
						"button",
						{
							"events": {
								"tap": $owner.handleOK.bind($owner)
							}
						},
						"确认"
					],
					[
						"icon",
						{
							"icon": "common-close",
							"events": {
								"tap": $owner.handleClose.bind($owner)
							}
						}
					]
				]
			]
		]
	]
)


}