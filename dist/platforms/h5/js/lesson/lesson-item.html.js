module.exports = function (scope) {


return (
	[
		"box",
		{
			"tag": this.id,
			"style": "height:160rem;margin:20rem 0;overflow:hidden;"
		},
		[
			[
				"image",
				{
					"src": this.image,
					"style": "width:200rem;height:100%;"
				}
			],
			[
				"box",
				{
					"style": "display:inline-block;width:500rem;height:100%;padding-left:20rem;"
				},
				[
					[
						"band",
						{
							"style": "height:80rem;overflow:hidden;"
						},
						[
							[
								"text",
								{
									"text": this.name
								}
							]
						]
					],
					[
						"band",
						{
							"theme": "level3",
							"style": "height:40rem;line-height:40rem;font-size:24rem;overflow:hidden;"
						},
						(function () {

						    var __for_2_1 = this.remark;
						    var __for_2_2 = [];

						    for (var index = 0, __for_2_len = __for_2_1.length; index < __for_2_len; index++)
						    {
						        var item = __for_2_1[index];

						        __for_2_2.push.apply(__for_2_2,
									[
										[
											"text",
											{
												"text": this.item,
												"theme": "bg-level5",
												"style": "display:inline-block;border-radius:20rem;padding:0 20rem;margin-right:10rem;"
											}
										]
									] || []);
						    }

						    return __for_2_2;

						}).call(this)
					],
					[
						"band",
						{
							"theme": "important",
							"style": "height:40rem;overflow:hidden;"
						},
						[
							[
								"text",
								{
									"text": this.price > 0 ? '￥' + this.price : '免费'
								}
							]
						]
					]
				]
			]
		]
	]
)


}