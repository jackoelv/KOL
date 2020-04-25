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
      console.log("account 1 begin   is: " + web3.utils.BN(result[0]).toString() + " time is: " + dateFtt(web3.utils.BN(result[0]).toString()));
      console.log("account 1 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
      console.log("account 1 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
      console.log("account 1 wDraw   is: "+result[3].toString());
      console.log("account 1 length  is: "+web3.utils.BN(result[4]).toString());
      begin = web3.utils.BN(result[0]);

    });
    // await p.getLockHistory(1,{from:accounts[1]}).then((result) => {
    //   console.log("account 1 begin   is: " + web3.utils.BN(result[0]).toString() + " time is: " + dateFtt(web3.utils.BN(result[0]).toString()));
    //   console.log("account 1 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
    //   console.log("account 1 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
    //   console.log("account 1 wDraw   is: "+result[3].toString());
    //   console.log("account 1 length  is: "+web3.utils.BN(result[4]).toString());
    //
    // });
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
    await p.getLockHistory(0,{from:accounts[5]}).then((result) => {
      console.log("account 5 begin   is: "+ dateFtt(web3.utils.BN(result[0]).toString()));
      console.log("account 5 end     is: "+ dateFtt(web3.utils.BN(result[1]).toString()));
      console.log("account 5 amount  is: "+web3.utils.fromWei(result[2],"ether").toString());
      console.log("account 5 wDraw   is: "+result[3].toString());
      console.log("account 5 length  is: "+web3.utils.BN(result[4]).toString());
    });

    console.log("现在时间是："+ now());

    let target = accounts[5];
    let father = accounts[1];


    console.log("****************target 收益写入链上****************");
    await p.settlement({from:target});
    //
    // console.log("****************下级提本金之前看一下上级的反应****************");
    // await p.getTeam({from:father}).then((result) => {
    //   console.log("father1的直推：" + result);
    // });
    // await p.getTeamTotalUsers({from:father}).then((result) => {
    //   console.log("father1的团队人数：" + web3.utils.BN(result).toString());
    // });
    // await p.getTeamTotalAmount({from:father}).then((result) => {
    //   console.log("father1的团队入金总数数：" + web3.utils.BN(result).toString());
    // });


    //
    // console.log("****************target 提现一把试试****************");
    // k.balanceOf(target).then((result) => {
    //   console.log("提现之前的余额：" + (web3.utils.fromWei(result,'ether')));
    // })
    // await p.withDraw(false,{from:target});
    //
    // k.balanceOf(target).then((result) => {
    //   console.log("提现之后的余额：" + (web3.utils.fromWei(result,'ether')));
    // })
    //
    // console.log("****************下级提本金之后看一下上级的反应****************");
    // await p.getTeam({from:father}).then((result) => {
    //   console.log("father1的直推：" + result);
    // });
    // await p.getTeamTotalUsers({from:father}).then((result) => {
    //   console.log("father1的团队人数：" + web3.utils.BN(result).toString());
    // });
    // await p.getTeamTotalAmount({from:father}).then((result) => {
    //   console.log("father1的团队入金总数数：" + web3.utils.BN(result).toString());
    // });



    console.log("****************查询一下target的收益****************");
    let a1result = await p.getMyHistoryBonus(0,{from:target});
    console.log("the time  is: "+ dateFtt(web3.utils.BN(a1result[0]).toString()));
    console.log("the  bonus is: "+ web3.utils.fromWei(a1result[1],"ether"));
    console.log("left bonus is: "+ web3.utils.fromWei(a1result[2],"ether"));

    //
    // console.log("****************accounts 1 昨天静态收益****************");
    // await p.calcuBonusP(a1result[0],{from:accounts[1]}).then((result) => {
    //   console.log("本人的昨日静态收益是：" + web3.utils.fromWei(result,"ether"));
    // });
    //
    // console.log("****************accounts 1 昨天推广收益****************");
    // await p.calcuInviteBonusP(a1result[0],{from:accounts[1]}).then((result) => {
    //   console.log("本人的昨日推广收益总和是：" + web3.utils.fromWei(result,"ether"));
    // });
    //
    //
    // console.log("****************accounts 1 昨天网体收益****************");
    // await p.calcuTeamBonusP(a1result[0],{from:accounts[1]}).then((result) => {
    //   console.log("本人的昨日网体收益总和是：" + web3.utils.fromWei(result,"ether"));


    if (a1result[3]>1){
      console.log("释放历史余额的长度是：" + a1result[3]);
      for (var j = 1; j<a1result[3];j++){
        aNresult = await p.getMyHistoryBonus(j,{from:target});
        console.log("the  time  is: "+ dateFtt(web3.utils.BN(aNresult[0]).toString()));
        console.log("the  bonus is: "+ web3.utils.fromWei(aNresult[1],"ether"));
        console.log("left bonus is: "+ web3.utils.fromWei(aNresult[2],"ether"));


        // console.log("****************accounts 1 昨天静态收益****************");
        // await p.calcuBonusP(aNresult[0],{from:accounts[2]}).then((result) => {
        //   console.log("本人的昨日静态收益是：" + web3.utils.fromWei(result,"ether"));
        // });
        //
        // console.log("****************accounts 1 昨天推广收益****************");
        // await p.calcuInviteBonusP(aNresult[0],{from:accounts[2]}).then((result) => {
        //   console.log("本人的昨日推广收益总和是：" + web3.utils.fromWei(result,"ether"));
        // });
        //
        //
        // console.log("****************accounts 1 昨天网体收益****************");
        // await p.calcuTeamBonusP(aNresult[0],{from:accounts[2]}).then((result) => {
        //   console.log("本人的昨日网体收益总和是：" + web3.utils.fromWei(result,"ether"));
        // });

      }
    }

    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
