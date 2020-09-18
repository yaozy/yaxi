module.exports = function (scope) {


return (
	[
		"page",
		null,
		[
			require("../components/header.html").apply(this, []),
			[
				"box",
				{
					"flex": "auto"
				}
			]
		]
	]
)


}