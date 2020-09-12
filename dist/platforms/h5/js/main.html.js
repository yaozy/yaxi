module.exports = function (data) {


return {
	"Class": "page",
	"children": [
		{
			"Class": "header",
			"content": "华旅教育"
		},
		{
			"Class": "box",
			"key": "host"
		},
		{
			"Class": "tab",
			"host": "<* >@host",
			"selected-index": "0",
			"children": [
				{
					"Class": "imagebutton",
					"src": "/images/home/home.png",
					"content": "首页",
					"module": require('home/main.js'),
					"selected-status": { theme: 'primary', src: '/images/home/home-selected.png' }
				},
				{
					"Class": "imagebutton",
					"src": "/images/home/category.png",
					"content": "分类",
					"module": require('category/main.js'),
					"selected-status": { theme: 'primary', src: '/images/home/category-selected.png' }
				},
				{
					"Class": "imagebutton",
					"src": "/images/home/bought.png",
					"content": "已购",
					"module": require('bought/main.js'),
					"selected-status": { theme: 'primary', src: '/images/home/bought-selected.png' }
				},
				{
					"Class": "imagebutton",
					"src": "/images/home/my.png",
					"content": "我的",
					"module": require('my/main.js'),
					"selected-status": { theme: 'primary', src: '/images/home/my-selected.png' }
				}
			]
		}
	]
};


}