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


    await k.setSuperNode(accounts[1]);
    await k.setSuperNode(accounts[2]);
    await k.setNode(accounts[3]);
    await k.setNode(accounts[4]);
    
    await k.createKolMission(4,web3.utils.fromAscii("Test Mission"),web3.utils.toWei('10000000','ether'),accounts[0],accounts[9],{from: accounts[1]});
    await k.voteMission(1,0,true,{from:accounts[1]});
    await k.addKolOffering(0,accounts[4],web3.utils.toWei('10000000','ether'),{from: accounts[2]});
    await k.voteMission(2,0,true,{from:accounts[3]});
    await k.excuteVote(0);


    // let txFee= web3.utils.toWei("0.002","ether");
    for (var i=1;i<100;i++){
      await k.transfer(accounts[i],web3.utils.toWei('550','ether'),{from:accounts[4]});
    }
    

    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
