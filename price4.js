var http=require('http');

var post_data={"query":{"match":{"imtype":"LTCUS"}},"sort":[{"rtdatetime":{"order":"desc"}}],"size":3}//这是需要提交的数据

var content=JSON.stringify(post_data);

console.log(content);

var options = {

  host: 'www.99ex.com',

  port: 443,

  path: '/api/spot/v3/instruments/BTC-USDT/candles',

  method: 'POST',

  headers:{

  'Content-Type':'application/json',

  'Content-Length':content.length

  }

};

console.log("post options:\n",options);

console.log("content:",content);

console.log("\n");

var req = http.request(options, function(res) {

  console.log("statusCode: ", res.statusCode);

  console.log("headers: ", res.headers);

  var _data='';

  res.on('data', function(chunk){

    _data += chunk;

  });

  res.on('end', function(){

    console.log("\n--->>\nresult:",_data)

  });

});

req.write(content);

req.end();
