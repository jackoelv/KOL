var KOLVote = artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
var KOLD = artifacts.require("KOLWithDraw");
module.exports = function(deployer) {
  // deployer.deploy(KOLVote,{gas: 6700000});
  // deployer.deploy(KOLP,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",1588867200,1607356800,{gasPrice:1000000000,gas: 6700000});
  deployer.deploy(KOLD,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0x3779B8EEbAf4737681007E88C2a99cc99043A590","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",{gasPrice:1000000000,gas: 6700000});
  //deployer.deploy(KOLVote,{gas: 6700000});
  //deployer.deploy(USDT,200000000000,"Tether USD","USDT",6,{gas: 6700000});
  // deployer.deploy(BTT,{gas: 2300000});
};
