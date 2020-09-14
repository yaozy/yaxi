module.exports = function () {


return (
	[
		"band",
		{
			"style": "height:60rem;line-height:60rem;"
		},
		[
			[
				"icon",
				{
					"icon": this.icon,
					"style": "position:absolute;font-size:50rem;"
				}
			],
			[
				"text",
				{
					"text": this.text,
					"style": "position:absolute;left:60rem;"
				}
			],
			[
				"box",
				{
					"layout": "row",
					"style": "position:absolute;top:0;right:0;bottom:0;"
				},
				[
					[
						"text",
						null,
						"查看更多"
					],
					[
						"icon",
						{
							"icon": "common-more"
						}
					]
				]
			]
		]
	]
)


}