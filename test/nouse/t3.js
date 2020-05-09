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
contract("test",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01

    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");
    var balanceBefore;
    var balanceAfter;
    k.balanceOf(accounts[4]).then((result) => {
      console.log("提现之前的余额是："+ (web3.utils.fromWei(result,'ether')));
      balanceBefore = web3.utils.fromWei(result,'ether');
    });
    await p.withDraw(true,{from:accounts[4]});

    k.balanceOf(accounts[4]).then((result) => {
      console.log("提现之后的余额是："+ (web3.utils.fromWei(result,'ether')));
      balanceAfter = web3.utils.fromWei(result,'ether');
    });

    let draw = Number(balanceAfter) - Number(balanceBefore);
    console.log("本次提现金额是：" + draw);


    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
  });
