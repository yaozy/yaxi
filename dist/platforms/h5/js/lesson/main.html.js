module.exports = function (scope) {


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
				require("./toolbar"),
				{

				}
			],
			[
				"scrollbox",
				{
					"key": "host",
					"flex": "auto",
					"style": "padding:0 20rem;"
				}
			]
		]
	]
)


}