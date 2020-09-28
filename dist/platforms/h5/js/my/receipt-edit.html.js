module.exports = function ($data, $model) {

return (
	[
		"dialog",
		null,
		[
			[
				"masklayer",
				null
			],
			require("../components/header.html").call(this, $data, $model),
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
						"checkbox",
						null
					],
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
										"tap": this.handleMan.bind(this)
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
										"tap": this.handleWoman.bind(this)
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
								"tap": this.handleOK.bind(this)
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