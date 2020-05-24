const KK= artifacts.require("KOLVote");
var KOLA = artifacts.require("KOLADUSER");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
contract("testjoin",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let a = await KOLA.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");
    let addr = a.address;

    let txFee= web3.utils.toWei("0.002","ether");

    var iCode;
    await k.approve(addr,web3.utils.toWei('500','ether'),{from:accounts[1]});
    await a.go(0,true,{from:accounts[1],value:txFee});
    iCode = await a.RInviteCode(accounts[1]);
    iCode = web3.utils.BN(iCode);
    console.log(iCode);
    for (var i=2;i<11;i++){
      await k.approve(addr,web3.utils.toWei('500','ether'),{from:accounts[i]});
      await a.go(iCode,false,{from:accounts[i],value:txFee});
      // await sleep(3000);
      let balance = await a.UserBalance(accounts[i]);
      if (balance !=0){
        balance = web3.utils.fromWei(balance,"ether");
      }
      iCode = await a.RInviteCode(accounts[i]);
      // console.log("before     :"+iCode);
      if (iCode!=0){
        iCode = web3.utils.BN(iCode);
        // console.log("after     :"+iCode);
      }
      let level = await a.UserLevel(accounts[i]);
      if (level!=0){
        level = web3.utils.BN(level);
      }
      console.log("accounts "+i+" balance is  :"+balance);
      console.log("accounts "+i+" icode  is   :"+iCode);
      console.log("accounts "+i+" level  is   :"+level);
      
      await sleep(1000);
    }
    
    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
