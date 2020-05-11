let http = require("https"); // 引入http模块
let co = require('co');

/**
 * http模块发送请求
 * @param host
 * @param port
 * @param route
 * @param headers
 * @param encoding 可选值： utf8 binary
 */
function sendHttpRequest(host, port, route, headers = {}, encoding = 'utf8') {
    let options = {
        hostname: host,
        // port: port,
        path: '/' + route,
        method: 'GET',
        headers: headers
    };

    let data = '';
    return new Promise(function (resolve, reject) {
        let req = http.request(options, function(res) {
            res.setEncoding(encoding);
            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                resolve({result: true, data: data});
            });
        });

        req.on('error', (e) => {
            resolve({result: false, errmsg: e.message});
        });
        req.end();
    });
}

// 请求例子
let res = co(function* () {
    let req_res = yield sendHttpRequest('https://www.99ex.com', 80, '/api/spot/v3/instruments/BTC-USDT/candles?granularity=86400&start=2019-03-19T16:00:00.000Z&end=2019-03-20T16:00:00.000Z');
    console.log(req_res);
});
console.log(res);
console.log('123');
