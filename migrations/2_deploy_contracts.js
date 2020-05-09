var KOLVote = artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
var KOLD = artifacts.require("KOLWithDraw");
module.exports = function(deployer) {
  deployer.deploy(KOLVote,{gas: 6700000});
  deployer.deploy(KOLP,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",1588867200,1607356800,{gas: 6700000});
  deployer.deploy(KOLD,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",{gas: 6700000});
  //deployer.deploy(KOLVote,{gas: 6700000});
  //deployer.deploy(USDT,200000000000,"Tether USD","USDT",6,{gas: 6700000});
  // deployer.deploy(BTT,{gas: 2300000});
};
