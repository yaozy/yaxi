module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\test\\test.html")

return (
	[
		"page",
		null,
		[
			[
				"header",
				{
					"content": "yaxi test page"
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
							"content": "append",
							"events": {
								"tap": $owner.handleAppend.bind($owner)
							}
						}
					],
					[
						"button",
						{
							"content": "remove last",
							"margin-top": "10rem",
							"events": {
								"tap": $owner.handleRemove.bind($owner)
							}
						}
					]
				]
			]
		]
	]
)


}