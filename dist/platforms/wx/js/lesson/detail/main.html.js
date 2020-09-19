module.exports = function (data) {


return (
	[
		"page",
		null,
		[
			require("../../components/header.html").apply(this, []),
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