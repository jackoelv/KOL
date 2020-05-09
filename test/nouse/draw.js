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

    target = accounts[1];
    balance =await k.balanceOf(target);
    balance = web3.utils.BN(balance);
    balance = web3.utils.fromWei(balance,"ether");
    console.log("******************************************");
    console.log("before draw accounts balance is: "+balance);
    console.log("******************************************");
    // await d.withdraw(true,{from:accounts[1]});

    // var time = new Date();
    // var unixTime = time.getTime();
    // unixTime = Math.round(unixTime / 1000);
    // console.log("now is :" +unixTime);
    // let lock = await p.LockHistory(accounts[1],0);
    // let lockbegin = lock[0];
    // console.log("first lock is: "+lockbegin);
    // let every = 10;
    // let days = Math.round((unixTime-lockbegin)/every);
    // console.log("days is :" + days);

    // let drawAmounts = await d.querySelfBonus2(accounts[1]);
    // drawAmount = web3.utils.BN(drawAmounts[0]);
    // console.log(" you could draw self is:" + web3.utils.fromWei(drawAmount,"ether"));
    // drawAmount = web3.utils.BN(drawAmounts[1]);
    // console.log(" lastingDays is:" + web3.utils.BN(drawAmount));

    let drawAmount = await d.querySelfBonus(accounts[1],false);
    drawAmount = web3.utils.BN(drawAmount);
    let total = Number(web3.utils.fromWei(drawAmount,"ether"));
    console.log(" you could draw self is:" + web3.utils.fromWei(drawAmount,"ether"));

    drawAmount = await d.queryInviteBonus(accounts[1],false);
    drawAmount = web3.utils.BN(drawAmount);
    total += Number(web3.utils.fromWei(drawAmount,"ether"));
    console.log(" you could draw invite is:" + web3.utils.fromWei(drawAmount,"ether"));
    //
    drawAmount = await d.queryTeamBonus(accounts[1],false);
    drawAmount = web3.utils.BN(drawAmount);
    total += Number(web3.utils.fromWei(drawAmount,"ether"));
    console.log(" you could draw team is:" + web3.utils.fromWei(drawAmount,"ether"));

    drawAmount = await d.withdraw(true,false,{from:accounts[1]});
    drawAmount = web3.utils.BN(drawAmount);
    console.log(" you could draw all is:" + web3.utils.fromWei(drawAmount,"ether"));
    console.log(" all bonus is : " + total);
    // var allChild = 0;
    // for (var j=2;j<12;j++){
    //   let childBegin = await p.LockHistory(accounts[j],0);
    //   let ch = web3.utils.BN(childBegin[0]);
    //   let cdays = Math.round((unixTime-ch)/every) - 1;
    //   let bonus = cdays * 0.6;
    //   console.log("bonus is : "+bonus);
    //   allChild += Number(bonus);
    // }
    // console.log("invite bonus is : " + allChild);


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

    // let targetTeamLen = await p.getLockTeamBonusLen(target);
    // targetTeamLen =web3.utils.BN(targetTeamLen);
    // var rate3begin;
    // var totalleft;
    // for (var i=0;i<targetTeamLen;i++){
    //   let result = await p.LockTeamBonus(target,i);
    //   if (i == targetTeamLen -1 ){
    //     rate3begin=web3.utils.BN(result[0]);
    //     totalleft =  web3.utils.fromWei(result[2],"ether");
    //   }
    //   console.log("************i is: " + i);
    //   console.log("theDayLastSecond is: " + web3.utils.BN(result[0]));
    //   console.log("human time is: " + dateFtt(web3.utils.BN(result[0])));
    //   console.log("theDayTeamBonus is : " + web3.utils.fromWei(result[1],"ether"));
    //   console.log("totalTeamBonus is : " + web3.utils.fromWei(result[2],"ether"));
    //   console.log("theDayRate is : " + web3.utils.BN(result[3]));
    // }
    // let daysteam = Math.round((unixTime-rate3begin)/every) -1;
    // let daysall = Number(daysteam * 0.9) + Number(totalleft);
    // console.log("team bonus all is : " +daysall);

    //
    // let targetInviteLen = await p.getLockInviteBonusLen(target);
    // targetInviteLen =web3.utils.BN(targetInviteLen);
    // var invitebegin;
    // for (var m=0;m<targetInviteLen;m++){
    //   let result = await p.LockInviteBonus(target,m);
    //   if (m == targetInviteLen -1 ){
    //     invitebegin=web3.utils.BN(result[0]);
    //     totalleft =  web3.utils.fromWei(result[2],"ether");
    //   }
    //   console.log("************m is: " + i);
    //   console.log("theDayLastSecond is: " + web3.utils.BN(result[0]));
    //   console.log("human time is: " + dateFtt(web3.utils.BN(result[0])));
    //   console.log("theDayInviteBonus is : " + web3.utils.fromWei(result[1],"ether"));
    //   console.log("totalInviteBonus is : " + web3.utils.fromWei(result[2],"ether"));
    // }
    // let daysinvite = Math.round((unixTime-invitebegin)/every) -1;
    // let daysallinvite = Number(daysinvite * 6) + Number(totalleft);
    // console.log("invite bonus all is : " +daysallinvite);
    // console.log("invite bonus all is : " +totalleft);
    // console.log("invite bonus all is : " +daysinvite);







    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
