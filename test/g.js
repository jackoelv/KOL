const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
contract("test",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    // let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    // let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");
    // it("should put 10000 MetaCoin in the first account", () =>
    // KK.deployed().then(k => k.address)
    // );
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");

    var time = new Date();
    var unixTime = time.getTime();
    unixTime = Math.round(unixTime / 1000) - 10;

    var every = 10;

    let begin =1587870449;
    let target = accounts[5];
    for (var i = begin; i< unixTime; i=i+every){
      await p.calcuBonusP(i,{from:target}).then((result) => {
        console.log("I is: " + i);
        console.log("今天的持币收益是："+web3.utils.fromWei(result,"ether").toString());
      });
    }


  });
  it('Check whether the contract has been issued successfully', async () => {
    console.log("测试合约的操作:");
  });
});
