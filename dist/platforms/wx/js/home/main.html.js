module.exports = function (data) {


return {
	"Class": "box",
	"children": [
		{
			"Class": "swiper",
			"children": [
				{
					"Class": "image",
					"src": "/images/splash-screen.jpg"
				},
				{
					"Class": "image",
					"src": "/images/splash-screen.jpg"
				},
				{
					"Class": "image",
					"src": "/images/splash-screen.jpg"
				},
				{
					"Class": "image",
					"src": "/images/splash-screen.jpg"
				}
			]
		},
		{
			"Class": "band",
			"children": [
				{
					"Class": "button",
					"events": {
						"tap": data.openPage
					}
				}
			]
		},
		{
			"Class": "band"
		},
		{
			"Class": "band"
		},
		{
			"Class": "band"
		}
	]
};


}