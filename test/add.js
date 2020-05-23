const KK= artifacts.require("KOLVote");
var KOLA = artifacts.require("KOLADUSER");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
contract("testjoin",accounts => {
    before(async () => {
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let a = await KOLA.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");
    let addr = a.address;
    let txFee= web3.utils.toWei("0.002","ether");

    var iCode;
    for (var j = 1;j<3;j++){
      await a.go(0,{from:accounts[6],value:txFee});
    }
    // await a.go(0,{from:accounts[7],value:txFee});
    // await a.drawKol({from:accounts[5],value:txFee});
    for (var i=0;i<11;i++){
      let balance = await a.UserBalance(accounts[i]);
      if (balance !=0){
        balance = web3.utils.fromWei(balance,"ether");
      }
      iCode = await a.RInviteCode(accounts[i]);
      if (iCode!=0){
        iCode = web3.utils.BN(iCode);
      }
      let level = await a.UserLevel(accounts[i]);
      if (level!=0){
        level = web3.utils.BN(level);
      }
      let kolb = await k.balanceOf(accounts[i]);
      if (kolb!=0){
        kolb = web3.utils.fromWei(kolb,"ether");
      }
      let maxDeep = await a.maxDeep(accounts[i]);
      if (maxDeep!=0){
        maxDeep = web3.utils.BN(maxDeep);
      }
      let totalUsers = await a.TotalUsers(accounts[i]);
      if (totalUsers!=0){
        totalUsers = web3.utils.BN(totalUsers);
      }
      console.log("accounts "+i+" kol balance is    :"+kolb);
      console.log("accounts "+i+" join balance is   :"+balance);
      console.log("accounts "+i+" icode  is         :"+iCode);
      console.log("accounts "+i+" level  is         :"+level);
      console.log("accounts "+i+" maxDeep is        :"+maxDeep);
      console.log("accounts "+i+" totalUsers is     :"+totalUsers);
      console.log("**********************************************");
      console.log("*                                            *");
      console.log("*                                            *");
    }
    
    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
