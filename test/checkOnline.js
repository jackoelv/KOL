const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
var KOLD= artifacts.require("KOLWithDraw");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function formatDecimal(num, decimal) {
  num = num.toString();
  var index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}
contract("testjoin",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69");
    let p = await KOLP.at("0xbC664C8ECadbB9311325537DfA4609F877E04Ab6");
    let d = await KOLD.at("0x9190d289E7054DaB91a2F5Ed77a7d57fE8381Def");
    let paddr = p.address;
    var addr = "0x3551c688613331862408A361e0D3E3F14969221A";

    //检查授权。
    var number = 1118.907;
    var n2 = formatDecimal(number,2);
    console.log(n2);
    var balance = await web3.eth.getBalance(addr);
    if (balance !=0){
      balance = web3.utils.fromWei(balance,"ether");
    }
    var kolBalance = await k.balanceOf(addr);
    if (kolBalance !=0){
      kolBalance = web3.utils.fromWei(kolBalance,"ether");
    }
    var allow = await k.allowance(addr,paddr);
    if (allow != 0){
      allow = web3.utils.fromWei(allow,"ether");
    }
    //检查邀请码
    var iCode = await p.RInviteCode(addr);

    //检查入金
    var lock = await p.LockBalance(addr);

    var fathersLen = await p.getFathersLength(addr);

    var father = await p.InviteList(addr,0);
    var fatheriCode = await p.RInviteCode(father);

    console.log("ethBalance         :"+balance);
    console.log("kolBalance         :"+kolBalance);
    console.log("allow              :"+allow);
    console.log("iCode              :"+iCode);
    console.log("lock               :"+lock);
    console.log("fathersLen         :"+fathersLen);
    console.log("father             :"+father);
    console.log("fatheriCode        :"+fatheriCode);

    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
