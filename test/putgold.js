const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
/**************************************时间格式化处理************************************/
function dateFtt(dd)
{ //author: meizz
   dd = dd +"000";
   var fmt = "yyyy-MM-dd hh:mm:ss";
   var date = new Date(parseInt(dd));
   var o = {
   "M+" : date.getMonth()+1,     //月份
   "d+" : date.getDate(),     //日
   "h+" : date.getHours(),     //小时
   "m+" : date.getMinutes(),     //分
   "s+" : date.getSeconds(),     //秒
   "q+" : Math.floor((date.getMonth()+3)/3), //季度
   "S" : date.getMilliseconds()    //毫秒
   };
   if(/(y+)/.test(fmt))
   fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
   for(var k in o)
   if(new RegExp("("+ k +")").test(fmt))
   fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
   return fmt;
}
function now()
{ //author: meizz
   var fmt = "yyyy-MM-dd hh:mm:ss";
   var date = new Date();
   var o = {
   "M+" : date.getMonth()+1,     //月份
   "d+" : date.getDate(),     //日
   "h+" : date.getHours(),     //小时
   "m+" : date.getMinutes(),     //分
   "s+" : date.getSeconds(),     //秒
   "q+" : Math.floor((date.getMonth()+3)/3), //季度
   "S" : date.getMilliseconds()    //毫秒
   };
   if(/(y+)/.test(fmt))
   fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
   for(var k in o)
   if(new RegExp("("+ k +")").test(fmt))
   fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
   return fmt;
}

contract("test",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");

    var time = new Date();
    var unixTimeNow = time.getTime();
    unixTimeNow = Math.round(unixTimeNow / 1000);

    let theSecond = unixTimeNow;
    let target = accounts[2];
    let every = 10;


    console.log("****************查询一下第一个起息的时间****************");
    let a1result = await p.getMyHistoryBonus(0,{from:target});
    let begin = web3.utils.BN(a1result[0]);
    console.log("开始时间是："+begin);
    console.log("本地时间是：" + dateFtt(begin));
    let price = 0;
    let tmp = parseInt(begin);
    console.log("tmp is:" +tmp);




    nextBegin = tmp-every;
    for (var j = tmp-every; j<unixTimeNow ;j=j+every){
        price = await p.ClosePrice(j);
        console.log("i is :" + j + "price is :" + price);
        if (price == 0){
          nextBegin = j;
          break;
        }
    }
    console.log("nextbegin is: "+ nextBegin);

    for (var i = nextBegin; i < unixTimeNow + 12 *every; i = i+every){
      await p.putClosePrice(5000,i+2);
    }

    for (var jj = tmp-every; jj<unixTimeNow ;jj=jj+every){
        price = await p.ClosePrice(jj);
        console.log("jj is :" + jj + "price is :" + price);
        if (price == 0){
          // nextBegin = j;
          break;
        }
    }

    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
