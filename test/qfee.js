const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
contract("testjoin",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");
    let draw = "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651";

    // let re1 = await p.LockHistory(accounts[1],0);
    // let re2 = await p.LockHistory(accounts[1],1);
    let len = await p.getLockInviteBonusLen(accounts[1]);
    for (var i =0 ;i<len ;i++){
      let rr = await p.LockInviteBonus(accounts[1],i);

      console.log("theDayLastSecond is        :" + web3.utils.BN(rr[0]).toString());
      console.log("theDayInviteBonus is       :" + web3.utils.fromWei(rr[1],"ether"));
      console.log("totalInviteBonus is        :" + web3.utils.fromWei(rr[2],"ether"));
      console.log("******************************************");
      console.log("**                                      **");
      console.log("**                                      **");
    }



    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
