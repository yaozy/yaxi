yaxi.languages = {

    'en-US': {
        OK: 'OK',
        Cancel: 'Cancel',
        Yes: 'Yes',
        No: 'No',

        ajax: {
            network: 'network refused！',
            timeout: 'request timeout'
        },

        loading: {
            loading: 'loading, please wait...',
            empty: 'no data',
            completed: 'no more data',
            failed: 'load fail, please click to retry'
        },

        pulldown: {
            pulldown: 'pulldown to refresh',
            release: 'release refresh',
            loading: 'loading, please wait...',
            success: 'refresh success',
            fail: 'refresh fail' 
        }

    },

    'zh-CN': {
        OK: '确定',
        Cancel: '取消',
        Yes: '是',
        No: '否',

        ajax: {
            network: '无法连接服务器, 请检查网络设置！',
            timeout: '请求超时！'
        },

        loading: {
            loading: '正在加载, 请稍候...',
            empty: '无数据',
            completed: '没有更多数据了',
            failed: '加载失败, 请点击重试'
        },

        pulldown: {
            pulldown: '下拉刷新',
            release: '放开刷新',
            loading: '正在加载, 请稍候...',
            success: '刷新成功',
            fail: '刷新失败'
        }

    },


    'zh-TW': {
        OK: '確定',
        Cancel: '取消',
        Yes: '是',
        No: '否',

        ajax: {
            network: '無法連接服務器, 請檢查網絡設置！',
            timeout: '請求超時！'
        },

        loading: {
            loading: '正在加載, 請稍候...',
            empty: '無數據',
            completed: '沒有更多數據了',
            failed: '加載失敗, 請點擊重試'
        },

        pulldown: {
            pulldown: '下拉重繪',
            release: '放開重繪',
            loading: '正在加載, 請稍候...',
            success: '重繪成功',
            fail: '重繪失敗'
        }

    }

};


yaxi.i18n = yaxi.languages[yaxi.language] || yaxi.languages['en-US'];
