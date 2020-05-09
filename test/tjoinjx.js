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


    var iCode;
    await p.register(0,{from:accounts[1]});
    iCode=await p.RInviteCode(accounts[1]);
    iCode = web3.utils.BN(iCode);
    await k.transfer(accounts[1],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    await k.approve(paddr,web3.utils.toWei('5000','ether'),{from:accounts[1]});
    await p.join(web3.utils.toWei('5000','ether'),false,{from:accounts[1]});

    for (var m = 2; m<12; m++){
      console.log("m is: " + m + " iCode is: " + iCode);
      await sleep(5000);
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
    iCode=await p.RInviteCode(accounts[2]);
    iCode = web3.utils.BN(iCode);
    for (var m = 12; m<18; m++){
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
    iCode=await p.RInviteCode(accounts[3]);
    iCode = web3.utils.BN(iCode);
    for (var m = 18; m<22; m++){
      console.log("m is: " + m + " iCode is: " + iCode);
      await sleep(3000);
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
    // iCode=await p.getCode({from:accounts[17]});
    // iCode = web3.utils.BN(iCode);
    // for (var m = 20; m<120; m++){
    //   console.log("m is: " + m + " iCode is: " + iCode);
    //   await sleep(500);
    //   await p.register(iCode,{from:accounts[m]});
    //   iCode= await p.getCode({from:accounts[m]});
    //   iCode = web3.utils.BN(iCode);
    //   await k.transfer(accounts[m],web3.utils.toWei('20000','ether'),{from:accounts[4]});
    //   await k.approve(paddr,web3.utils.toWei('1000','ether'),{from:accounts[m]});
    //   if ((m % 2) == 1){
    //     await p.join(web3.utils.toWei('1000','ether'),true,{from:accounts[m]});
    //   }
    //   else {
    //     await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[m]});
    //   }
    // }


    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
