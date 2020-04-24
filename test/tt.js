const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
contract("test",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");


    await k.setSuperNode(accounts[1]);
    await k.setSuperNode(accounts[2]);
    await k.setNode(accounts[3]);
    await k.setNode(accounts[4]);

    await k.createKolMission(4,web3.utils.fromAscii("Test Mission"),web3.utils.toWei('600000','ether'),accounts[0],accounts[9],{from: accounts[1]});
    await k.voteMission(1,0,true,{from:accounts[1]});
    await k.addKolOffering(0,accounts[4],web3.utils.toWei('600000','ether'),{from: accounts[2]});
    await k.voteMission(2,0,true,{from:accounts[3]});
    await k.excuteVote(0);

    let paddr = p.address;
    await k.transfer(paddr,web3.utils.toWei('100000','ether'),{from:accounts[4]});

    var a1Code;
    var a2Code;
    var a3Code;
    var a4Code;

    await p.register(0,{from:accounts[1]});
    await p.getCode({from:accounts[1]}).then((result) => {
        a1Code=web3.utils.BN(result).toString();
      });
    console.log("a1Code:",a1Code);

    await p.register(a1Code,{from:accounts[2]});
    await p.getCode({from:accounts[2]}).then((result) => {
        a2Code=web3.utils.BN(result).toString();
      });
    console.log("a2Code:",a2Code);

    await p.register(a2Code,{from:accounts[3]});
    await p.getCode({from:accounts[3]}).then((result) => {
        a3Code=web3.utils.BN(result).toString();
      });
    console.log("a3Code:",a3Code);

    await p.register(a3Code,{from:accounts[4]});
    await p.getCode({from:accounts[4]}).then((result) => {
          a4Code=web3.utils.BN(result).toString();
        });
    console.log("a4Code:",a4Code);

    await p.register(a4Code,{from:accounts[5]});
    await p.getCode({from:accounts[5]}).then((result) => {
          console.log("a5Code:",web3.utils.BN(result).toString());
        });

    // console.log("合约地址:",k.address);
    // console.log("合约地址:",p.address);
    // console.log(accounts);

    await k.transfer(accounts[1],web3.utils.toWei('10000','ether'),{from:accounts[4]});
    await k.transfer(accounts[2],web3.utils.toWei('10000','ether'),{from:accounts[4]});
    await k.transfer(accounts[3],web3.utils.toWei('10000','ether'),{from:accounts[4]});
    await k.transfer(accounts[5],web3.utils.toWei('10000','ether'),{from:accounts[4]});
    await k.transfer(accounts[6],web3.utils.toWei('10000','ether'),{from:accounts[4]});
    await k.transfer(accounts[7],web3.utils.toWei('10000','ether'),{from:accounts[4]});
    await k.transfer(accounts[8],web3.utils.toWei('10000','ether'),{from:accounts[4]});
    await k.transfer(accounts[9],web3.utils.toWei('10000','ether'),{from:accounts[4]});

    await k.approve(paddr,web3.utils.toWei('100000','ether'),{from:accounts[1]});
    await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[1]});

    await k.approve(paddr,web3.utils.toWei('100000','ether'),{from:accounts[2]});
    await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[2]});


    await k.approve(paddr,web3.utils.toWei('100000','ether'),{from:accounts[3]});
    await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[3]});

    await k.approve(paddr,web3.utils.toWei('100000','ether'),{from:accounts[4]});
    await p.join(web3.utils.toWei('8000','ether'),false,{from:accounts[4]});

    await k.approve(paddr,web3.utils.toWei('100000','ether'),{from:accounts[5]});
    await p.join(web3.utils.toWei('1000','ether'),false,{from:accounts[5]});

    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});
