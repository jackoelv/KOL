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
    await p.getTeam({from:accounts[0]}).then((result) => {console.log("account 0 child: "+result);});
    await p.getTeam({from:accounts[1]}).then((result) => {console.log("account 1 child: "+result);});
    await p.getTeam({from:accounts[2]}).then((result) => {console.log("account 2 child: "+result);});
    await p.getTeam({from:accounts[3]}).then((result) => {console.log("account 3 child: "+result);});

    var begin;
    await p.getLockHistory(0,{from:accounts[1]}).then((result) => {
      console.log("account 1 begin   is: "+ dateFtt(web3.utils.BN(result[0]).toString()));
      console.log("account 1 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
      console.log("account 1 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
      console.log("account 1 wDraw   is: "+result[3].toString());
      console.log("account 1 length  is: "+web3.utils.BN(result[4]).toString());
      begin = web3.utils.BN(result[0]);

    });
    await p.getLockHistory(0,{from:accounts[2]}).then((result) => {
      console.log("account 2 begin   is: "+ dateFtt(web3.utils.BN(result[0]).toString()));
      console.log("account 2 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
      console.log("account 2 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
      console.log("account 2 wDraw   is: "+result[3].toString());
      console.log("account 2 length  is: "+web3.utils.BN(result[4]).toString());
    });
    await p.getLockHistory(0,{from:accounts[3]}).then((result) => {
      console.log("account 3 begin   is: "+ dateFtt(web3.utils.BN(result[0]).toString()));
      console.log("account 3 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
      console.log("account 3 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
      console.log("account 3 wDraw   is: "+result[3].toString());
      console.log("account 3 length  is: "+web3.utils.BN(result[4]).toString());
    });

    await p.getLockHistory(0,{from:accounts[4]}).then((result) => {
      console.log("account 4 begin   is: "+ dateFtt(web3.utils.BN(result[0]).toString()));
      console.log("account 4 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
      console.log("account 4 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
      console.log("account 4 wDraw   is: "+result[3].toString());
      console.log("account 4 length  is: "+web3.utils.BN(result[4]).toString());
    });
    console.log("现在时间是："+ now());


    // for (var j = begin+1; j<begin + 601; j=j+60){
    //   await p.calcuBonusP(j,{from:accounts[1]}).then((result) => {
    //     conole.log("queryTime is: " + j);
    //     console.log("Bonus is: "(web3.utils.fromWei(result,'ether')));
    //   })
    //
    // }




    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
