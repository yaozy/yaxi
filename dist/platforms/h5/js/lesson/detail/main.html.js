module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\lesson\\detail\\main.html")

return (
	[
		"page",
		null,
		[
			require("../../components/header.html")($owner, $data, $model),
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