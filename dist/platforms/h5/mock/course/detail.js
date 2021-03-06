const list = require('./list');


module.exports = function (id) {

    var name = list[id - 1].name;

    return {

        id: 1,
        name: name,
        price: 100,
        image: '/images/demo/demo8.jpg',
        study: 1012,
        browse: 5028,
        share: 467,
        activity: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        detail: '总是有读不完的书,写不完的字,走不完的路,看不完的风景,想不完的事情,问不完的问题.',
        teachers: [
            { name: '祝枝山', image: '/images/demo/demo1.jpg' },
            { name: '文徵明', image: '/images/demo/demo2.jpg' },
            { name: '徐贞卿', image: '/images/demo/demo3.jpg' }
        ],
        sections: [
            {
                id: 1,
                name: name + ' 第一节',
                price: 0,
                image: '/images/demo/demo1.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 2,
                name: name + ' 第二节',
                price: 0,
                image: '/images/demo/demo2.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 3,
                name: name + ' 第三节',
                price: 0,
                image: '/images/demo/demo3.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 4,
                name: name + ' 第四节',
                price: 40,
                image: '/images/demo/demo4.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 5,
                name: name + ' 第五节',
                price: 50,
                image: '/images/demo/demo5.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 6,
                name: name + ' 第六节',
                price: 20,
                image: '/images/demo/demo6.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 7,
                name: name + ' 第七节',
                price: 40,
                image: '/images/demo/demo7.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 8,
                name: name + ' 第八节',
                price: 30,
                image: '/images/demo/demo8.jpg',
                teacher: '文徵明',
                people: 1845
            }
        ],
        recommends: [
            {
                id: 1,
                name: name + ' 第一节',
                price: 0,
                image: '/images/demo/demo1.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 2,
                name: name + ' 第二节',
                price: 0,
                image: '/images/demo/demo2.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 3,
                name: name + ' 第三节',
                price: 0,
                image: '/images/demo/demo3.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 4,
                name: name + ' 第四节',
                price: 40,
                image: '/images/demo/demo4.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 5,
                name: name + ' 第五节',
                price: 50,
                image: '/images/demo/demo5.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 6,
                name: name + ' 第六节',
                price: 20,
                image: '/images/demo/demo6.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 7,
                name: name + ' 第七节',
                price: 40,
                image: '/images/demo/demo7.jpg',
                teacher: '文徵明',
                people: 1845
            },
            {
                id: 8,
                name: name + ' 第八节',
                price: 30,
                image: '/images/demo/demo8.jpg',
                teacher: '文徵明',
                people: 1845
            }
        ],
        comments: [
            {
                name: '张三丰',
                image: '/images/demo/demo1.jpg',
                time: '2020-09-20 12:23:34',
                text: 'xxxxxxxxxxxxxxxxxxxx'
            },
            {
                name: '张无忌',
                image: '/images/demo/demo2.jpg',
                time: '2020-09-20 12:56:28',
                text: 'xxxxxxxxxxxxxxxxxxxx'
            },
            {
                name: '郭靖',
                image: '/images/demo/demo3.jpg',
                time: '2020-09-20 13:20:23',
                text: 'xxxxxxxxxxxxxxxxxxxx'
            },
            {
                name: '杨康',
                image: '/images/demo/demo4.jpg',
                time: '2020-09-20 13:23:45',
                text: 'xxxxxxxxxxxxxxxxxxxx'
            }
        ],
        test: [
            {
                id: 1,
                name: name + ' 练习1',
                time: 60,
                score: 100
            },
            {
                id: 2,
                name: name + ' 练习2',
                time: 60,
                score: 100
            },
            {
                id: 3,
                name: name + ' 练习3',
                time: 60,
                score: 100
            },
            {
                id: 4,
                name: name + ' 练习4',
                time: 60,
                score: 100
            },
            {
                id: 5,
                name: name + ' 练习5',
                time: 60,
                score: 100
            },
            {
                id: 6,
                name: name + ' 练习6',
                time: 60,
                score: 100
            },
            {
                id: 7,
                name: name + ' 练习7',
                time: 60,
                score: 100
            },
            {
                id: 8,
                name: name + ' 练习8',
                time: 60,
                score: 100
            }
        ]
    }


}