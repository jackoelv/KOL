const KK= artifacts.require("KOLVote");
const KOLP = artifacts.require("KOLPro");
const KOLD = artifacts.require("KOLWithDraw");
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
    let d = await KOLD.at("0x46Ba0c589c0E0531319809BcA37db878Eb4CC651");

    let pro = "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154";
    let draw = "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651";

    let target = pro;
    let balance =await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("########################################");
    console.log("pro balance is: "+balance);
    console.log("########################################");

    target = draw;
    balance =await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("########################################");
    console.log("draw  balance is: "+balance);
    console.log("########################################");

    let teamLen = await p.getLockTeamBonusLen(accounts[1]);
    let inviteLen = await p.getLockInviteBonusLen(accounts[1]);

    for (var pp = 0;pp<teamLen; pp++){
      let teamresult = await p.LockTeamBonus(accounts[1],pp);
      console.log("team theDayLastSecond :" +web3.utils.BN(teamresult[0]));
      console.log("team theDayTeamBonus :" +web3.utils.fromWei(teamresult[1],"ether"));
      console.log("team totalTeamBonus :" +web3.utils.fromWei(teamresult[2],"ether"));
      console.log("team theDayRate :" +web3.utils.BN(teamresult[3]));
    }

    for (var qq = 0;qq<inviteLen; qq++){
      let inviteresult = await p.LockInviteBonus(accounts[1],qq);
      console.log("invite theDayLastSecond :" +web3.utils.BN(inviteresult[0]));
      console.log("invite theDayTeamBonus :" +web3.utils.fromWei(inviteresult[1],"ether"));
      console.log("invite totalTeamBonus :" +web3.utils.fromWei(inviteresult[2],"ether"));
    }

    target = accounts[1];
    balance =await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("******************************************");
    console.log("before draw accounts balance is: "+balance);
    console.log("******************************************");
    let drawbonus = await d.withdrawCheck(true,{from:accounts[1]});
    drawbonus = web3.utils.BN(drawbonus);
    drawbonus = web3.utils.fromWei(drawbonus,"ether");
    console.log("true drawbonus is: "+drawbonus);

    drawbonus = await d.withdrawCheck(false,{from:accounts[1]});
    drawbonus = web3.utils.BN(drawbonus);
    drawbonus = web3.utils.fromWei(drawbonus,"ether");
    console.log("false drawbonus is: "+drawbonus);

    await d.withdraw(true,{from:accounts[1]});


    balance = await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log("after draw accounts balance is: "+balance);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    let drawtime = await d.DrawTime(accounts[1]);
    drawtime = web3.utils.BN(drawtime);
    console.log("draw time is: " +drawtime);
    console.log("draw human time is: " +dateFtt(drawtime));

    let teamLen2 = await p.getLockTeamBonusLen(accounts[1]);
    let inviteLen2 = await p.getLockInviteBonusLen(accounts[1]);

    for (var pp2 = 0;pp2<teamLen2; pp2++){
      let teamresult2 = await p.LockTeamBonus(accounts[1],pp2);
      console.log("team theDayLastSecond :" +web3.utils.BN(teamresult2[0]));
      console.log("team theDayTeamBonus :" +web3.utils.fromWei(teamresult2[1],"ether"));
      console.log("team totalTeamBonus :" +web3.utils.fromWei(teamresult2[2],"ether"));
      console.log("team theDayRate :" +web3.utils.BN(teamresult2[3]));
    }

    for (var qq2 = 0;qq2<inviteLen2; qq2++){
      let inviteresult2 = await p.LockInviteBonus(accounts[1],qq2);
      console.log("invite theDayLastSecond :" +web3.utils.BN(inviteresult2[0]));
      console.log("invite theDayTeamBonus :" +web3.utils.fromWei(inviteresult2[1],"ether"));
      console.log("invite totalTeamBonus :" +web3.utils.fromWei(inviteresult2[2],"ether"));
    }




    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
