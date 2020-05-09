const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
var KOLD = artifacts.require("KOLWithDraw");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
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
contract("testjoin",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");
    let d = await KOLD.at("0x46Ba0c589c0E0531319809BcA37db878Eb4CC651")
    let draw = "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651";



    let paddr = p.address;

    let inviteLen = await p.getLockInviteBonusLen(accounts[1]);
    for (var i=0;i<inviteLen;i++){
      let result = await p.LockInviteBonus(accounts[1],i);
      console.log("theDayLastSecond is    :"+dateFtt(result[0]));
      console.log("theDayLastSecond is    :"+web3.utils.BN(result[0]));
      console.log("theDayInviteBonus is   :"+web3.utils.fromWei(result[1],"ether"));
      console.log("totalInviteBonus is    :"+web3.utils.fromWei(result[2],"ether"));
    }

    console.log("*******************************************");

    console.log("*                                         *");
    console.log("*                                         *");
    let teamLen = await p.getLockTeamBonusLen(accounts[1]);
    for (var i=0;i<teamLen;i++){
      let result = await p.LockTeamBonus(accounts[1],i);
      console.log("theDayLastSecond is    :"+dateFtt(result[0]));
      console.log("theDayTeamBonus is     :"+web3.utils.fromWei(result[1],"ether"));
      console.log("totalTeamBonus is      :"+web3.utils.fromWei(result[2],"ether"));
      console.log("theDayRate is          :"+web3.utils.BN(result[3]));
    }
    console.log("*******************************************");

    console.log("*                                         *");
    console.log("*                                         *");

    for (var i=1;i<22;i++){
      let result = await p.LockHistory(accounts[i],0);
      console.log("begin time  is    :"+dateFtt(result[0]));
    }





    //
    // var iCode;
    // await p.register(0,{from:accounts[1]});
    // iCode=await p.RInviteCode(accounts[1]);
    // iCode = web3.utils.BN(iCode);
    // await k.transfer(accounts[1],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    // await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[1]});
    // await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[1]});

    // for (var m = 9; m<12; m++){
    //   console.log("m is: " + m + " iCode is: " + iCode);
    //   await sleep(1000);
    //   await p.register(iCode,{from:accounts[m]});
    //   // iCode= await p.getCode({from:accounts[m]});
    //   // iCode = web3.utils.BN(iCode);
    //   await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    //   await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[m]});
    //   if ((m % 2) == 1){
    //     await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
    //   }
    //   else {
    //     await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
    //   }
    // }
    // iCode=await p.RInviteCode(accounts[2]);
    // iCode = web3.utils.BN(iCode);
    // for (var m = 12; m<17; m++){
    //   console.log("m is: " + m + " iCode is: " + iCode);
    //   await sleep(1000);
    //   await p.register(iCode,{from:accounts[m]});
    //   // iCode= await p.getCode({from:accounts[m]});
    //   // iCode = web3.utils.BN(iCode);
    //   await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    //   await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[m]});
    //   if ((m % 2) == 1){
    //     await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
    //   }
    //   else {
    //     await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
    //   }
    // }
    // iCode=await p.RInviteCode(accounts[3]);
    // iCode = web3.utils.BN(iCode);
    // for (var m = 18; m<20; m++){
    //   console.log("m is: " + m + " iCode is: " + iCode);
    //   await sleep(1000);
    //   await p.register(iCode,{from:accounts[m]});
    //   // iCode= await p.getCode({from:accounts[m]});
    //   // iCode = web3.utils.BN(iCode);
    //   await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    //   await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[m]});
    //   if ((m % 2) == 1){
    //     await p.join(web3.utils.toWei('5000','ether'),true,{from:accounts[m]});
    //   }
    //   else {
    //     await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
    //   }
    // }


    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
