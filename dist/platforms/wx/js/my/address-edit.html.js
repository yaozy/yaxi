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
						"box",
						{
							"height": "80rem",
							"layout": "row middle center",
							"theme": "line-standard line-bottom"
						},
						[
							[
								"icon",
								{
									"icon": "common-man",
									"width": "200rem",
									"height": "80rem",
									"line-height": "80rem",
									"bindings": {
										"theme":  function () { return $model.gendle ? 'text-primary' : '' }
									},
									"events": {
										"tap": $owner.handleMan.bind($owner)
									}
								}
							],
							[
								"text",
								{
									"width": "60rem",
									"text-align": "center",
									"bindings": {
										"text":  function () { return $model.gendle ? '男' : '女' }
									}
								}
							],
							[
								"icon",
								{
									"icon": "common-woman",
									"width": "200rem",
									"height": "80rem",
									"line-height": "80rem",
									"bindings": {
										"theme":  function () { return $model.gendle ? '' : 'text-primary' }
									},
									"events": {
										"tap": $owner.handleWoman.bind($owner)
									}
								}
							]
						]
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