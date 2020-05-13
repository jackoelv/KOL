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

    await k.transfer(accounts[99],web3.utils.toWei('10','ether'),{from:accounts[4]});
    await k.transfer(accounts[4],web3.utils.toWei('10','ether'),{from:accounts[99]});


    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
