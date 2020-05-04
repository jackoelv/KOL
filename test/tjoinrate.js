const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
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
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
contract("testjoin",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");

    let len = await p.getTeamRateList(accounts[1],0,{from:accounts[1]});
    // console.log(len);
    for (var i = 0; i<len[2]; i++){
      let result = await p.getTeamRateList(accounts[1],i,{from:accounts[1]});
      console.log(dateFtt(result[1])+","+web3.utils.BN(result[0]));
      // console.log("unixtime is: " + web3.utils.BN(result[1]));
      // console.log("time is: " + dateFtt(result[1]));
      // console.log("rate is: " +web3.utils.BN(result[0]));
    }

    let bonus = await p.getHistoryTeamBonus(accounts[1],0);
    for (var n = 0; n<bonus[4]; n++){
      let result = await p.getHistoryTeamBonus(accounts[1],n);
      console.log(dateFtt(result[0])+","+web3.utils.fromWei(result[1],"ether")+","+web3.utils.fromWei(result[2],"ether")+","+ web3.utils.BN(result[3]));
      // console.log("n is: " + n);
      // console.log("the unix time is:" + web3.utils.BN(result[0]));
      // console.log("the time is:" + dateFtt(result[0]));
      // console.log("theDayTeamBonus :" +web3.utils.fromWei(result[1],"ether"));
      // console.log("totalTeamBonus :" +web3.utils.fromWei(result[2],"ether"));
      // console.log("theDayRate :" +web3.utils.BN(result[3]));
    }
    let inviteBonus = await p.getHistoryInviteBonus(accounts[1],0);
    for (var w = 0; w<inviteBonus[3]; w++){
      let result = await p.getHistoryInviteBonus(accounts[1],w);
      console.log(dateFtt(result[0])+","+web3.utils.fromWei(result[1],"ether")+","+web3.utils.fromWei(result[2],"ether"));
      // console.log("n is: " + n);
      // console.log("the unix time is:" + web3.utils.BN(result[0]));
      // console.log("the time is:" + dateFtt(result[0]));
      // console.log("theDayTeamBonus :" +web3.utils.fromWei(result[1],"ether"));
      // console.log("totalTeamBonus :" +web3.utils.fromWei(result[2],"ether"));
      // console.log("theDayRate :" +web3.utils.BN(result[3]));
    }


    for (var j = 1; j<18; j++){
      let lock = await p.getLockHistory(0,{from:accounts[j]});
      console.log(dateFtt(lock[0])+","+j+","+web3.utils.fromWei(lock[2],"ether"));
      // console.log("accounts is :" + j);
      // console.log("begin is :" +dateFtt(lock[0]));
      // console.log("begin unixtime is: " +web3.utils.BN(lock[0]));
      // console.log("amount is :" + web3.utils.fromWei(lock[2],"ether"));
      // console.log("length is :" + lock[4]);
    }



    // for (var m = 1; m<4; m++){
    //   console.log("*****************************************");
    //   console.log("accounts is: " + m);
    //   let len = await p.getMyTeamRateList(accounts[m],0);
    //   for (var i = 0; i<len[4]; i++){
    //     let result = await p.getHistoryTeamBonus(accounts[m],i);
    //     console.log("i is: " + i);
    //     console.log("the time is:" + dateFtt(result[0]));
    //     console.log("theDayTeamBonus :" +web3.utils.fromWei(result[1],"ether"));
    //     console.log("totalTeamBonus :" +web3.utils.fromWei(result[2],"ether"));
    //     console.log("theDayRate :" +web3.utils.BN(result[3]));
    //   }
    //   console.log("########################################");
    //
    // }




    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
