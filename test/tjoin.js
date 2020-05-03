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


    var iCode;
    await p.register(0,{from:accounts[1]});
    iCode=await p.getCode({from:accounts[1]});
    iCode = web3.utils.BN(iCode);
    await k.transfer(accounts[1],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[1]});
    await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[1]});

    for (var m = 2; m<12; m++){
      console.log("m is: " + m + " iCode is: " + iCode);
      await sleep(3500);
      await p.register(iCode,{from:accounts[m]});
      // iCode= await p.getCode({from:accounts[m]});
      // iCode = web3.utils.BN(iCode);
      await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
      await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[m]});
      if ((m % 2) == 1){
        await p.join(web3.utils.toWei('5000','ether'),true,{from:accounts[m]});
      }
      else {
        await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
      }
    }
    iCode=await p.getCode({from:accounts[2]});
    iCode = web3.utils.BN(iCode);
    for (var m = 12; m<15; m++){
      console.log("m is: " + m + " iCode is: " + iCode);
      await sleep(9000);
      await p.register(iCode,{from:accounts[m]});
      // iCode= await p.getCode({from:accounts[m]});
      // iCode = web3.utils.BN(iCode);
      await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
      await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[m]});
      if ((m % 2) == 1){
        await p.join(web3.utils.toWei('5000','ether'),true,{from:accounts[m]});
      }
      else {
        await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[m]});
      }
    }
    iCode=await p.getCode({from:accounts[3]});
    iCode = web3.utils.BN(iCode);
    for (var m = 15; m<18; m++){
      console.log("m is: " + m + " iCode is: " + iCode);
      await sleep(8000);
      await p.register(iCode,{from:accounts[m]});
      // iCode= await p.getCode({from:accounts[m]});
      // iCode = web3.utils.BN(iCode);
      await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
      await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[m]});
      if ((m % 2) == 1){
        await p.join(web3.utils.toWei('5000','ether'),true,{from:accounts[m]});
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
