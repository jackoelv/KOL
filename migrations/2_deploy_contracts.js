var KOLVote = artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
module.exports = function(deployer) {
  deployer.deploy(KOLVote,{gas: 6700000});
  deployer.deploy(KOLP,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0x095F979C8f89BbC137391d3cA0C64597002A5a18",1587682800,1590274800,{gas: 6700000});
  // deployer.deploy(TetherToken,200000000000,"Tether USD","USDT",6);
  //deployer.deploy(KOLVote,{gas: 6700000});
  //deployer.deploy(USDT,200000000000,"Tether USD","USDT",6,{gas: 6700000});
  // deployer.deploy(BTT,{gas: 2300000});
};
