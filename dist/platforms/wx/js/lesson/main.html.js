module.exports = function (data) {


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
					"padding": "0 20rem"
				}
			]
		]
	]
)


}