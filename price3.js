var https = require('https');
var zlib = require('zlib');

var post_data="granularity=86400&start=2019-03-19T16:00:00.000Z&end=2019-03-20T16:00:00.000Z";//请求数据
var reqdata = JSON.stringify(post_data);
console.log(reqdata);
return;
var options = {
    hostname: 'www.99ex.com',
    port: '443',
    path: '/api/spot/v3/instruments/BTC-USDT/candles?',
    method: 'GET',
    rejectUnauthorized: true,
    requestCert: false,
    headers: {
        'Cookie': 'locale=zh_CN',
        'Accept-Encoding': 'gzip, deflate',
        'X-Timeout': '3600000',
        'Content-Type': 'Application/json',
        "Content-Length":reqdata.length
    }
};
var req = https.request(options, function (res) {
});
req.write(reqdata);
req.on('response', function (response) {
    switch (response.headers['content-encoding']) {
        case 'gzip':
            var body = '';
            var gunzip = zlib.createGunzip();
            response.pipe(gunzip);
            gunzip.on('data', function (data) {
                body += data;
            });
            gunzip.on('end', function () {
                var returndatatojson= JSON.parse(body);
                req.end();
            });
            gunzip.on('error', function (e) {
                console.log('error' + e.toString());
                req.end();
            });
            break;
        case 'deflate':
            var output = fs.createWriteStream("d:temp.txt");
            response.pipe(zlib.createInflate()).pipe(output);
            req.end();
            break;
        default:req.end();
            break;
    }
});
req.on('error', function (e) {
    console.log(new Error('problem with request: ' + e.message));
    req.end();
    setTimeout(cb, 10);
});
