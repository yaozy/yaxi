module.exports = function () {


return (
	[
		"box",
		{
			"layout": "column"
		},
		[
			[
				require("./search"),
				{

				}
			],
			[
				"band",
				null
			],
			[
				"scrollbox",
				{
					"key": "host",
					"style": "padding:0 20rem;"
				}
			]
		]
	]
)


}