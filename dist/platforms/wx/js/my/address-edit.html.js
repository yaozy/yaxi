module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\address-edit.html")

return (
	[
		"dialog",
		null,
		[
			[
				"masklayer",
				null
			],
			require("../components/header.html")($owner, $data, $model),
			[
				"box",
				{
					"width": "550rem",
					"absolute": "middle center",
					"padding": "50rem",
					"theme": "bg-standard"
				},
				[
					[
						"textbox",
						{
							"placeholder": "姓名",
							"width": "100%",
							"text-align": "center",
							"bindings": {
								"value":  function () { return $model.name },
								"onchange":  function (value) { $model.name = value; }
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
								"value":  function () { return $model.gendle },
								"onchange":  function (value) { $model.gendle = value; }
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
								"value":  function () { return $model.tel },
								"onchange":  function (value) { $model.tel = value; }
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
								"value":  function () { return $model.address },
								"onchange":  function (value) { $model.address = value; }
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
								"value":  function () { return $model.house },
								"onchange":  function (value) { $model.house = value; }
							}
						}
					],
					[
						"text",
						{
							"key": "error",
							"theme": "text-danger",
							"width": "100%",
							"height": "80rem",
							"line-height": "80rem"
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
					]
				]
			]
		]
	]
)


}