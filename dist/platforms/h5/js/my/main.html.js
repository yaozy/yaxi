module.exports = function ($owner, $data, $model) {

if (!$owner) throw new Error("template must input $owner argument! file: D:\\dev\\yaxi\\dist\\src\\js\\my\\main.html")

return (
	[
		"box",
		{
			"theme": "level5-reverse"
		},
		[
			[
				"box",
				{
					"theme": "level1"
				},
				[
					[
						"box",
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
				"box",
				{
					"theme": "level1",
					"margin-top": "10rem"
				},
				[
					[
						"box",
						null
					]
				]
			],
			[
				"box",
				{
					"theme": "level1",
					"margin-top": "10rem"
				},
				[
					[
						"box",
						null
					],
					[
						"box",
						null
					],
					[
						"box",
						null
					]
				]
			],
			[
				"box",
				{
					"theme": "level1",
					"margin-top": "10rem"
				},
				[
					[
						"box",
						null
					],
					[
						"box",
						null
					],
					[
						"box",
						null
					]
				]
			],
			[
				"box",
				{
					"theme": "level1",
					"margin-top": "10rem"
				},
				[
					[
						"box",
						null
					],
					[
						"box",
						null
					]
				]
			],
			[
				"box",
				{
					"margin-top": "10rem"
				},
				[
					[
						"button",
						{
							"events": {
								"tap": $owner.openTest.bind($owner)
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