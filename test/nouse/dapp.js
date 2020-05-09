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


    await k.setSuperNode(accounts[1]);
    await k.setSuperNode(accounts[2]);
    await k.setNode(accounts[3]);
    await k.setNode(accounts[4]);

    await k.createKolMission(4,web3.utils.fromAscii("Test Mission"),web3.utils.toWei('10000000','ether'),accounts[0],accounts[9],{from: accounts[1]});
    await k.voteMission(1,0,true,{from:accounts[1]});
    await k.addKolOffering(0,accounts[4],web3.utils.toWei('10000000','ether'),{from: accounts[2]});
    await k.voteMission(2,0,true,{from:accounts[3]});
    await k.excuteVote(0);

    let paddr = p.address;

    await k.transfer(paddr,web3.utils.toWei('1000000','ether'),{from:accounts[4]});
    await p.setContract(draw);

    for (var m = 1; m<10; m++){
      // await sleep(300);
      await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    }
    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
