module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\components\\header.html")

return (
	[
		"header",
		{
			"theme": "bg-standard",
			"content": "华旅教育"
		}
	]
)


}