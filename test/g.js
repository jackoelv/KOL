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
    p.begin.call().then((result) => {
      console.log(web3.utils.BN(result).toString());
    });

  });
  it('Check whether the contract has been issued successfully', async () => {
    console.log("测试合约的操作:");
  });
});
