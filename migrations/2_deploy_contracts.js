var KOLVote = artifacts.require("KOLVote");
// var USDT = artifacts.require("TetherToken");
// var BTT = artifacts.require("BTT");
var KOLP = artifacts.require("KOLPro");
module.exports = function(deployer) {
  deployer.deploy(KOLVote,{gas: 6700000});
  deployer.deploy(KOLP,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0xe2ec44549b3ec410b4a41491b4c45541efbd7b8b",1587682800,1590274800,{gas: 6700000});
  // deployer.deploy(TetherToken,200000000000,"Tether USD","USDT",6);
  //deployer.deploy(KOLVote,{gas: 6700000});
  //deployer.deploy(USDT,200000000000,"Tether USD","USDT",6,{gas: 6700000});
  // deployer.deploy(BTT,{gas: 2300000});
};
