const KK= artifacts.require("KOLVote");
const KOLP = artifacts.require("KOLPro");
const KOLD = artifacts.require("KOLWithDraw");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function diff(a,b){
  var df = parseInt(b) - parseInt(a);
  var df2 = df % 60;
  return ((df-df2)/60);
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
    let d = await KOLD.at("0x46Ba0c589c0E0531319809BcA37db878Eb4CC651");

    let pro = "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154";
    let draw = "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651";

    // let target = pro;
    // let balance =await k.balanceOf(target);
    // balance = web3.utils.BN(balance);
    // balance = web3.utils.fromWei(balance,"ether");
    // console.log("########################################");
    // console.log("pro balance is: "+balance);
    // console.log("########################################");
    // console.log("*                                      *");
    // console.log("*                                      *");
    // console.log("*                                      *");
    let target = draw;
    let balance =await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("########################################");
    console.log("draw  balance is: "+balance);
    console.log("########################################");

    console.log("*                                      *");
    console.log("*                                      *");
    console.log("*                                      *");

    var time = new Date();
    var unixTime = time.getTime();
    unixTime = Math.round(unixTime / 1000);
      console.log("humantime now is             :" +dateFtt(unixTime));
      console.log("unixtime now is              :" +unixTime);

    target = accounts[1];
    let lock = await p.LockHistory(target,0);
    let lockBegin = web3.utils.BN(lock[0]);
      console.log("lock begin is                :" +dateFtt(lockBegin)+ " diff: " +diff(lockBegin,unixTime) +" days");
      // console.log("lock begin is                :" +diff(lockBegin,unixTime) +" days");

    lock = await p.LockHistory(accounts[2],0);
    lockBegin = web3.utils.BN(lock[0]);
        console.log("lock begin is                :" +dateFtt(lockBegin)+ " diff: " +diff(lockBegin,unixTime) +" days");

    let teamLen = await p.getLockTeamBonusLen(target);
    let inviteLen = await p.getLockInviteBonusLen(target);

    for (var pp = 0;pp<teamLen; pp++){
      let teamresult = await p.LockTeamBonus(target,pp);
      console.log("team theDayLastSecond        :" +dateFtt(teamresult[0]));
      console.log("team theDayTeamBonus         :" +web3.utils.fromWei(teamresult[1],"ether"));
      console.log("team totalTeamBonus          :" +web3.utils.fromWei(teamresult[2],"ether"));
      console.log("team theDayRate              :" +web3.utils.BN(teamresult[3]));
    }

    for (var qq = 0;qq<inviteLen; qq++){
      let inviteresult = await p.LockInviteBonus(target,qq);
      console.log("invite theDayLastSecond  :" +dateFtt(inviteresult[0]));
      console.log("invite theDayTeamBonus   :" +web3.utils.fromWei(inviteresult[1],"ether"));
      console.log("invite totalTeamBonus    :" +web3.utils.fromWei(inviteresult[2],"ether"));
    }


    balance =await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("*                                      *");
    console.log("*                                      *");
    console.log("*                                      *");
    console.log("******************************************");
    console.log("before draw accounts balance is: "+balance);
    console.log("******************************************");
    console.log("*                                      *");
    console.log("*                                      *");
    console.log("*                                      *");
    let drawbonus = await d.withdrawCheck(true,{from:target});
    drawbonus = web3.utils.BN(drawbonus);
    drawbonus = web3.utils.fromWei(drawbonus,"ether");
      console.log("true drawbonus is        :"+drawbonus);

    drawbonus = await d.withdrawCheck(false,{from:target});
    drawbonus = web3.utils.BN(drawbonus);
    drawbonus = web3.utils.fromWei(drawbonus,"ether");
      console.log("false drawbonus is       :"+drawbonus);

    // await d.withdraw(true,{from:target});


    balance = await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("*                                      *");
    console.log("*                                      *");
    console.log("*                                      *");
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log("after draw accounts balance is: "+balance);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log("*                                      *");
    console.log("*                                      *");
    console.log("*                                      *");

    let drawtime = await d.DrawTime(target);
    drawtime = web3.utils.BN(drawtime);
      console.log("draw time is             :" +drawtime);
      console.log("draw human time is       :" +dateFtt(drawtime)+ " diff: " +diff(drawtime,unixTime) +" days");
    let teamLen2 = await p.getLockTeamBonusLen(target);
    let inviteLen2 = await p.getLockInviteBonusLen(target);

    for (var pp2 = 0;pp2<teamLen2; pp2++){
      let teamresult2 = await p.LockTeamBonus(target,pp2);
      console.log("team theDayLastSecond   :" +dateFtt(teamresult2[0]));
      console.log("team theDayTeamBonus    :" +web3.utils.fromWei(teamresult2[1],"ether"));
      console.log("team totalTeamBonus     :" +web3.utils.fromWei(teamresult2[2],"ether"));
      console.log("team theDayRate         :" +web3.utils.BN(teamresult2[3]));
    }

    for (var qq2 = 0;qq2<inviteLen2; qq2++){
      let inviteresult2 = await p.LockInviteBonus(target,qq2);
      console.log("invite theDayLastSecond :" +dateFtt(inviteresult2[0]));
      console.log("invite theDayTeamBonus  :" +web3.utils.fromWei(inviteresult2[1],"ether"));
      console.log("invite totalTeamBonus   :" +web3.utils.fromWei(inviteresult2[2],"ether"));
    }
    let self = await d.querySelfBonus(target);
      console.log("self Bonus              :" +web3.utils.fromWei(self,"ether"));




    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
