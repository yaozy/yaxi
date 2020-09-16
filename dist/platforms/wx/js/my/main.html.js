module.exports = function (scope) {


return (
	[
		"box",
		{
			"theme": "level5-reverse"
		},
		[
			[
				"band",
				{
					"theme": "level1"
				},
				[
					[
						"sidebar",
						null,
						[
							[
								"image",
								null
							]
						]
					],
					[
						"box",
						{
							"layout": "column"
						},
						[
							[
								"text",
								null
							],
							[
								"text",
								null
							],
							[
								"text",
								null
							]
						]
					]
				]
			],
			[
				"band",
				{
					"theme": "level1",
					"style": "margin-top:10rem;"
				},
				[
					[
						"band",
						null
					]
				]
			],
			[
				"band",
				{
					"theme": "level1",
					"style": "margin-top:10rem;"
				},
				[
					[
						"band",
						null
					],
					[
						"band",
						null
					],
					[
						"band",
						null
					]
				]
			],
			[
				"band",
				{
					"theme": "level1",
					"style": "margin-top:10rem;"
				},
				[
					[
						"band",
						null
					],
					[
						"band",
						null
					],
					[
						"band",
						null
					]
				]
			],
			[
				"band",
				{
					"theme": "level1",
					"style": "margin-top:10rem;"
				},
				[
					[
						"band",
						null
					],
					[
						"band",
						null
					]
				]
			],
			[
				"band",
				{
					"style": "margin-top:10rem;"
				},
				[
					[
						"button",
						{
							"events": {
								"tap": this.openTest.bind(this)
							}
						},
						"Open Test"
					]
				]
			]
		]
	]
)


}