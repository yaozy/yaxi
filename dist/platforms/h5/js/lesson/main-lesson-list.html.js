module.exports = function (scope) {


return (
	[
		"box",
		null,
		(function (__for_list) {

		    var __for_data = [];

		    for (var index = 0, __for_len = __for_list.length; index < __for_len; index++)
		    {
		        var item = __for_list[index];

		        __for_data.push.apply(__for_data,
					[
						[
							"box",
							{
								"tag": item.id,
								"style": "height:160rem;margin:20rem 0;overflow:hidden;",
								"events": {
									"tap": this.handleOpenDetail.bind(this)
								}
							},
							[
								[
									"image",
									{
										"src": item.image,
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
											"box",
											{
												"style": "height:80rem;overflow:hidden;"
											},
											[
												[
													"text",
													{
														"text": item.name
													}
												]
											]
										],
										[
											"box",
											{
												"theme": "level3",
												"style": "height:40rem;line-height:40rem;font-size:24rem;overflow:hidden;"
											},
											(function (__for_list) {

											    var __for_data = [];

											    for (var index = 0, __for_len = __for_list.length; index < __for_len; index++)
											    {
											        var item = __for_list[index];

											        __for_data.push.apply(__for_data,
														[
															[
																"text",
																{
																	"text": item,
																	"theme": "bg-level2",
																	"style": "display:inline-block;border-radius:20rem;padding:0 20rem;margin-right:10rem;"
																}
															]
														] || []);
											    }

											    return __for_data;

											}).call(this, item.remark)
										],
										[
											"box",
											{
												"theme": "important",
												"style": "height:40rem;overflow:hidden;"
											},
											[
												[
													"text",
													{
														"text": item.price > 0 ? '￥' + item.price : '免费'
													}
												]
											]
										]
									]
								]
							]
						]
					] || []);
		    }

		    return __for_data;

		}).call(this, this.data)
	]
)


}