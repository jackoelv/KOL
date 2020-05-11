var unirest = require("unirest");

var req = unirest("GET", "https://www.99ex.com/api/spot/v3/instruments/BTC-USDT/candles");

req.query({
  "granularity": "86400",
  "start": "2019-05-10T00:00:00.000Z",
  "end": "2019-05-11T12:00:00.000Z"
});

req.headers({
  "cache-control": "no-cache",
  "Connection": "keep-alive",
  "Cookie": "__cfduid=deda4d2735e2aae48d48efbb4b2d71ab11589154497; locale=en_US",
  "Accept-Encoding": "gzip, deflate",
  "Host": "www.99ex.com",
  "Postman-Token": "e5f5248e-257e-47b5-881d-654a243349c0,0f40bbfe-a70b-4f73-adb3-03b7acfdcbca",
  "Cache-Control": "no-cache",
  "Accept": "*/*",
  "User-Agent": "PostmanRuntime/7.16.3"
});


req.end(function (res) {
  if (res.error) throw new Error(res.error);

  console.log(res.body);
});
