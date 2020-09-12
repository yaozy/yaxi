const api = require('../utils/api.js');
const TokenHeader = api.TokenHeader;
const ClientType = api.ClientType;
const TenantId = api.TenantId;
const TenantHeader = api.TenantHeader;
// 是否使用模拟数据
const mock = api.Mock;

export function get(url, data) {
	return send({
		method: 'GET',
		url: url,
		data: data
	});
}

export function post(url, data) {
	return send({
		method: 'POST',
		url: url,
		data: data
	});
}

function request(url, data = {}, method = "GET") {
	return send({
		method: method,
		url: url,
		data:data
	});
}

function send(data) {
	var url = (data || (data = {})).url;
	// mock
	if (mock) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					var response = require('../mock/' + url + '.js');

					if (typeof response === 'function') {
						resolve(response(data.data));
					} else {
						resolve(response);
					}
				} catch (e) {
					reject(e);
				}

			}, 500);
		});
	};

	// 远程调用
	return new Promise((resolve, reject) => {
		data.url = url
		data.data = data
		data.method = method
		data.header = {
			'Content-Type': 'application/json',
			'ClientType': ClientType,
			TokenHeader: wx.getStorageSync('token'),
			TenantHeader: wx.getAccountInfoSync().miniProgram.appId + '@' + TenantId
		}
		data.success = function (result) {
			if (result.success == true) {
				if (result.code == 501) {
					// 清除登录相关内容
					try {
						wx.removeStorageSync('userInfo');
						wx.removeStorageSync('token');
					} catch (e) {
						// Do something when catch error
					}
				} else {
					resolve(result.data);
				}
			} else {
				reject(result.msg);
			}
		}

		data.fail = function (e) {
			wx.showToast({
				icon: 'none',
				title: e.message || e
			});
		}

		wx.request(data);
	});
}
const _send = send;
export {
	_send as send
};
const _request = request;
export {
	_request as request
};