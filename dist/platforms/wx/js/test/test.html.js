module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"text": "yaxi test page"
				}
			],
			[
				"box",
				{
					"key": "host",
					"flex": "auto"
				}
			],
			[
				"box",
				{
					"layout": "column"
				},
				[
					[
						"box",
						null
					],
					[
						"button",
						{
							"events": {
								"tap": this.handleAppend.bind(this)
							}
						},
						"append"
					],
					[
						"button",
						{
							"margin-top": "10rem",
							"events": {
								"tap": this.handleRemove.bind(this)
							}
						},
						"remove last"
					]
				]
			]
		]
	]
)


}