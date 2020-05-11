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


    let paddr = p.address;

    iCode=await p.RInviteCode(accounts[1]);
    iCode = web3.utils.BN(iCode);
    for (var m = 5; m<10; m++){
      console.log("m is: " + m + " iCode is: " + iCode);
      await sleep(3000);
      await p.register(iCode,{from:accounts[m]});
      // iCode= await p.getCode({from:accounts[m]});
      // iCode = web3.utils.BN(iCode);
      await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
      await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[m]});
      if ((m % 2) == 1){
        await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
      }
      else {
        await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
      }
    }

    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});