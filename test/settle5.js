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

//测试一下 如果提现选择提现本金，但是事实上利息都还没有完全settle的情况下会不会提出问题来？

    //第一步，先把结构部署好，然后拿accounts1来测试一下。
    //还需要测试一下gas的消耗，例如网体架构100个，1000个是什么效果？
    // 我锁仓的余额是多少？

    await p.join(web3.utils.toWei('1000','ether'),true,{from:accounts[5]});

    var begin;
    let target = accounts[5];

    // await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[5]});
    await p.getLockHistory(0,{from:target}).then((result) => {
      console.log("account 1 begin   is: " + web3.utils.BN(result[0]).toString() + " time is: " + dateFtt(web3.utils.BN(result[0]).toString()));
      console.log("account 1 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
      console.log("account 1 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
      console.log("account 1 wDraw   is: "+result[3].toString());
      console.log("account 1 length  is: "+web3.utils.BN(result[4]).toString());
      begin = web3.utils.BN(result[0]);

    });

    await k.balanceOf(target).then((result) => {
      console.log("banlance  is: "+web3.utils.fromWei(result,"ether").toString());
    });


    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    console.log("开始执行settle，会释放出来30个周期的");
    await p.settlement({from:target});

    console.log("****************查询一下target的收益****************");
    let a1result = await p.getMyHistoryBonus(0,{from:target});
    console.log("释放历史余额的长度是：" + a1result[3]);
    console.log("the time  is: "+ web3.utils.BN(a1result[0]).toString());
    console.log("the time  is: "+ dateFtt(web3.utils.BN(a1result[0]).toString()));
    console.log("the  bonus is: "+ web3.utils.fromWei(a1result[1],"ether"));
    console.log("left bonus is: "+ web3.utils.fromWei(a1result[2],"ether"));

    if (a1result[3]>1){
      for (var j = 1; j<a1result[3];j++){
        aNresult = await p.getMyHistoryBonus(j,{from:target});
        console.log("the time  is: "+ web3.utils.BN(aNresult[0]).toString());
        console.log("the  time  is: "+ dateFtt(web3.utils.BN(aNresult[0]).toString()));
        console.log("the  bonus is: "+ web3.utils.fromWei(aNresult[1],"ether"));
        console.log("left bonus is: "+ web3.utils.fromWei(aNresult[2],"ether"));
      }
    }

    var time = new Date();
    var unixTime = time.getTime();
    unixTime = Math.round(unixTime / 1000) - 10;
    // console.log(unixTime);
    await p.queryLockBalanceP(unixTime,{from:target}).then((result) => {
      console.log("time is "+ dateFtt(unixTime) + " lock balance  is: "+web3.utils.fromWei(result,"ether").toString());
    });

    // console.log("##############################################");
    // console.log("先测试一下提本息啥效果？");
    // await p.withDraw(false,{from:target});

    time = new Date();
    unixTime = time.getTime();
    unixTime = Math.round(unixTime / 1000);
    // console.log(unixTime);
    // await p.calcuBonusP(unixTime,{from:target}).then((result) => {
    //   console.log("今天的持币收益是："+web3.utils.fromWei(result,"ether").toString());
    // });
    await p.queryLockBalanceP(unixTime,{from:target}).then((result) => {
      console.log("提完以后 time is "+ dateFtt(unixTime) + " lock balance  is: "+web3.utils.fromWei(result,"ether").toString());
    });
    console.log("************father************")
    let father = accounts[4];
    await p.getTeam({from:father}).then((result) => {
      console.log(result);
    });
    await p.getTeamTotalUsers({from:father}).then((result) => {
      console.log(web3.utils.BN(result).toString());
    });
    await p.getTeamTotalAmount({from:father}).then((result) => {
      console.log(web3.utils.fromWei(result,"ether").toString());
    });

    console.log("************top father************");
    let topfather = accounts[1];
    await p.getTeam({from:topfather}).then((result) => {
      console.log(result);
    });
    await p.getTeamTotalUsers({from:topfather}).then((result) => {
      console.log(web3.utils.BN(result).toString());
    });
    await p.getTeamTotalAmount({from:topfather}).then((result) => {
      console.log(web3.utils.fromWei(result,"ether").toString());
    });







    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
