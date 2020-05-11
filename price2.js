var https = require("https");
var iconv = require("iconv-lite");
var url="https://www.99ex.com/api/spot/v3/instruments/BTC-USDT/candles?granularity=86400&start=2019-03-19T16:00:00.000Z&end=2019-03-20T16:00:00.000Z";
https.get(url, function (res) {
    var datas = [];
    var size = 0;
    res.on('data', function (data) {
        datas.push(data);
        size += data.length;
  //process.stdout.write(data);
    });
    res.on("end", function () {
        var buff = Buffer.concat(datas, size);
        var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring
        console.log(result);
    });
}).on("error", function (err) {
    console.error(err.stack)
});
