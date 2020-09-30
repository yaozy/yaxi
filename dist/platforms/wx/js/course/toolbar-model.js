const yaxi = require('../../yaxi/js/yaxi');

const all = { id: 0, text: '全部' };



function computeIconFn(type) {

    return function () {

        return this.$parent.type === type ? 'common-expand' : 'common-collapse';
    }
}


function computeHiddenFn(type) {

    return function () {

        return this.$parent.type !== type;
    }
}



module.exports = yaxi.store = new (yaxi.model({

    type: '',

    hidden: function () {

        return !this.type;
    },

    sort: {
        icon: computeIconFn('sort'),
        hidden: computeHiddenFn('sort'),

        key: 'common',
        text: '综合排序',

        data: [
            {
                key: '',
                text: '',

                theme: function () {

                    return this.$parent.key === this.key ? 'text-primary' : '';
                }
            }
        ]
    },

    category: {
        icon: computeIconFn('category'),
        hidden: computeHiddenFn('category'),

        text: all.text,

        level1: all,

        level2: all,

        level3: all,

        level1s: [
            {
                id: 0,
                text: '',

                theme: function () {

                    return this.$parent.level1.id === this.id ? 'bg-thick text-primary' : '';
                }
            }
        ],

        level2s: [
            {
                id: 0,
                text: '',

                theme: function () {

                    return this.$parent.level2.id === this.id ? 'bg-standard text-primary' : '';
                }
            }
        ],

        level3s: [
            {
                id: 0,
                text: '',

                theme: function () {

                    return this.$parent.level3.id === this.id ? 'text-primary' : '';
                }
            }
        ]
    },

    filter: {
        icon: computeIconFn('filter'),
        hidden: computeHiddenFn('filter'),
        
        data: [
            {
                id: 0,
                text: '',
                checked: '',

                data: [
                    {
                        id: 0,
                        text: '',

                        checked: function () {

                            return this.$parent.checked.indexOf(this.id) >= 0;
                        },

                        theme: function () {

                            return this.checked ? 'bg-thick line-primary text-primary' :  'bg-thicker';
                        }
                    }
                ]
            }
        ]
    }


}))();

