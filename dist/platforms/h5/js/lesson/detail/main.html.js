module.exports = function ($data, $model) {

return (
	[
		"page",
		null,
		[
			require("../../components/header.html").call(this, $data, $model),
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