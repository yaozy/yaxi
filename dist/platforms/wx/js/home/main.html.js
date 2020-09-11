module.exports = function (data) {


return {
	"Class": "Panel",
	"children": [
		{
			"Class": "Swiper",
			"children": [
				{
					"Class": "Image",
					"src": "/images/splash-screen.jpg"
				},
				{
					"Class": "Image",
					"src": "/images/splash-screen.jpg"
				},
				{
					"Class": "Image",
					"src": "/images/splash-screen.jpg"
				},
				{
					"Class": "Image",
					"src": "/images/splash-screen.jpg"
				}
			]
		},
		{
			"Class": "Band",
			"children": [
				{
					"Class": "Button",
					"events": {
						"tap": data.openPage
					},
					"content": "Open Page"
				}
			]
		},
		{
			"Class": "Band"
		},
		{
			"Class": "Band"
		},
		{
			"Class": "Band"
		}
	]
};


}