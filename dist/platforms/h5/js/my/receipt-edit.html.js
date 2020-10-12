module.exports = function ($this, $data, $model) {

return (
	[
		"dialog",
		null,
		[
			[
				"masklayer",
				null
			],
			[
				"header",
				{
					"text": "发票抬头"
				}
			],
			[
				"box",
				{
					"width": "80%",
					"absolute": "middle center",
					"padding": "50rem",
					"theme": "bg-standard"
				},
				[
					[
						"radiogroup",
						{
							"height": "100rem",
							"line-height": "100rem",
							"text-align": "center",
							"bindings": {
								"value":  function () { return $model.type },
								"onchange":  function (value) { $model.type = value; }
							}
						},
						[
							[
								"radio",
								{
									"key": "1",
									"text": "公司发票"
								}
							],
							[
								"radio",
								{
									"key": "2",
									"text": "个人发票",
									"margin-left": "20rem"
								}
							]
						]
					],
					[
						"textbox",
						{
							"placeholder": "请填写发票抬头",
							"width": "100%",
							"bindings": {
								"value":  function () { return $model.name },
								"onchange":  function (value) { $model.name = value; }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "请填写15/18/20位税务识别号",
							"width": "100%",
							"bindings": {
								"value":  function () { return $model.taxid },
								"onchange":  function (value) { $model.taxid = value; },
								"hidden":  function () { return $model.type !== 1 }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "请填写开户银行",
							"width": "100%",
							"bindings": {
								"value":  function () { return $model.bank },
								"onchange":  function (value) { $model.bank = value; },
								"hidden":  function () { return $model.type !== 2 }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "请填写银行帐号",
							"width": "100%",
							"bindings": {
								"value":  function () { return $model.account },
								"onchange":  function (value) { $model.account = value; },
								"hidden":  function () { return $model.type !== 2 }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "请填写电话",
							"width": "100%",
							"bindings": {
								"value":  function () { return $model.tel },
								"onchange":  function (value) { $model.tel = value; }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "请填写地址",
							"width": "100%",
							"bindings": {
								"value":  function () { return $model.address },
								"onchange":  function (value) { $model.address = value; }
							}
						}
					],
					[
						"textbox",
						{
							"placeholder": "请填写电子发票接收邮箱",
							"width": "100%",
							"bindings": {
								"value":  function () { return $model.email },
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
								"tap": $this.handleOK.bind($this)
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