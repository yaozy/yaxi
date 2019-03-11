jiac.module('index.js', function (require, exports, module) {


	
	module.exports = yaxi.Page.extend(function () {
	
	
	
	    this.init = function () {
	
	        this.assign({
	            // header: 'samples',
	            header: {
	                children: [
	                    {
	                        Class: yaxi.BackButton,
	                        float: 'right'
	                    },
	                    {
	                        Class: yaxi.Title,
	                        text: 'samples'
	                    }
	                ]
	            },
	            content: {
	                subtype: yaxi.Button,
	                layout: 'block',
	                baseURL: require.baseURL,
	                gap: '4px top',
	                padding: '.1rem',
	                children: [
	                    { text: '模板开发演示', url: 'template.js' },
	                    { text: '模型开发演示', url: 'model.js' },
	                    { text: '多线程开发演示', events: { tap: runThread } },
	                    {
	                        Class: yaxi.Segment,
	                        segments: 5
	                    }
	                    // {
	                    //     Class: yaxi.ClipImage,
	                    //     src: 'http://img5.imgtn.bdimg.com/it/u=49764040,3750999451&fm=26&gp=0.jpg',
	                    //     style: {
	                    //         height: '4rem'
	                    //     }
	                    // }
	                ]
	            },
	            footer: {
	                height: '.5rem'
	            }
	        });
	    }
	
	
	    function runThread() {
	debugger
	        var thread = require.runAsThread('thread.js');
	
	        // 调用线程内的异步方法
	        thread.exec('asyncCall', ['async call: get thread ', ' value'], function (value, error) {
	            
	            alert(value);
	
	        }, true);
	
	        // 调用线程内的同步方法
	        thread.exec('syncCall', ['sync call: get thread ', ' value'], function (value, error) {
	            
	            alert(value);
	        });
	    }
	
	
	
	});
	
});




jiac.module('model.js', function (require, exports, module) {


	module.exports = yaxi.Page.extend(function () {
	
	
	
	    var Store = yaxi.store({
	        name: '',
	        age: 0
	    });
	
	    
	    var Model = yaxi.model({
	        width: '320px',
	        text: '',
	        displayText: function () {
	
	            return this.text;
	        },
	        submodel: yaxi.model({
	
	            value: 0
	        }),
	        store: Store
	    });
	
	
	    var model = new Model().$assign({
	        text: 11111.1222223,
	        submodel: {
	            value: 20
	        },
	        store: [
	            { name: 1111, age: 1 },
	            { name: 2222, age: 2 },
	            { name: 3333, age: 3 }
	        ]
	    });
	
	
	    this.init = function () {
	
	        this.assign({
	            header: '模型开发演示',
	            content: {
	                model: model,
	                children: [
	                    {
	                        Class: yaxi.Repeater,
	                        store: 'store',
	                        template: {
	                            Class: yaxi.Text,
	                            line: 'bottom-1px',
	                            display: 'block',
	                            bindings: {
	                                text: 'name'
	                            }
	                        }
	                    },
	                    {
	                        Class: yaxi.TextBox,
	                        bindings: {
	                            value: 'text',
	                            change: 'text'
	                        }
	                    },
	                    {
	                        Class: yaxi.TextBox,
	                        value: 50,
	                        bindings: {
	                            value: 'submodel.value',
	                            change: 'submodel.value'
	                        }
	                    }
	                ]
	            }
	        });
	    }
	
	
	});
	
});




jiac.module('template.js', function (require, exports, module) {


	module.exports = yaxi.Page.extend(function () {
	
	
	    var data = {
	        header: '模板开发演示',
	        model: {
	            value: 100,
	            width: '100%'
	        },
	        i18n: {
	            text: 'i18n'
	        },
	        onchange: function () {
	
	            alert(this.model.value);
	        }
	    };
	
	
	
	    this.init = function () {
	
	        // var time = performance.now();
	
	        var template = require('template.html')(data);
	    
	        // alert(performance.now() - time);
	
	        this.assign(template);
	    }
	
	
	
	});
	
});




jiac.module('template.html', function (data) {

	var __k = jiac.classes;
	var color = jiac.color;

	with (data)
	{
		return {
			"Class": __k.Page,
			"header": header,
			"children": [
				{
					"Class": __k.Content,
					"children": [
						{
							"Class": __k.Text,
							"text": i18n.text,
							"display": "block"
						},
						{
							"Class": __k.HtmlControl,
							"html": 'html text',
							"color": "red"
						},
						{
							"Class": __k.Panel,
							"layout": "line-middle",
							"background-color": "silver",
							"color": "red",
							"height": "1rem",
							"children": [
								{
									"Class": __k.Button,
									"text": "123",
									"width": "1rem"
								},
								{
									"Class": __k.Button,
									"text": "456"
								},
								{
									"Class": __k.Button,
									"text": "789",
									"width": "1rem",
									"position": "absolute",
									"right": "0"
								}
							]
						}
					]
				},
				{
					"Class": __k.Footer,
					"model": model,
					"events": {
						"change": data.onchange
					},
					"children": [
						{
							"Class": __k.TextBox,
							"background-color": "#888888",
							"background-color": color,
							"bindings": {
								"width": "width",
								"value": "value",
								"change": "value"
							}
						}
					]
				}
			]
		};
	}
});



