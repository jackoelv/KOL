const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
contract("test",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0x71BD44324dDd12EEc5ff3e710ceb40fAF09FC0bd");
    let p = await KOLP.at("0x6Fb6c9225F4C98D897d81Bc15E7224e61d80C72f");


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
    // await k.transfer(paddr,web3.utils.toWei('1000000','ether'),{from:accounts[4]});


    var iCode;
    await p.register(0,{from:accounts[1]});
    iCode=await p.getCode({from:accounts[1]});
    iCode = web3.utils.BN(iCode);
    await k.transfer(accounts[1],web3.utils.toWei('2000','ether'),{from:accounts[4]});
    await k.approve(paddr,web3.utils.toWei('2000','ether'),{from:accounts[1]});
    await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[1]});
    for (var m = 2; m<300; m++){
      console.log("m is: " + m + " iCode is: " + iCode);
      await p.register(iCode,{from:accounts[m]});
      // iCode= await p.getCode({from:accounts[m]});
      // iCode = web3.utils.BN(iCode);
      await k.transfer(accounts[m],web3.utils.toWei('2000','ether'),{from:accounts[4]});
      await k.approve(paddr,web3.utils.toWei('2000','ether'),{from:accounts[m]});
      if ((m % 2) == 1){
        await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[m]});
      }
      else {
        await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[m]});
      }
    }


    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
