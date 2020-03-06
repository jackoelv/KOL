var KOLVote = artifacts.require("KOLVote");
var USDT = artifacts.require("TetherToken");
var BTT = artifacts.require("BTT");
module.exports = function(deployer) {
  // deployer.deploy(KOLVote,{gas: 6700000});
  // deployer.deploy(TetherToken,200000000000,"Tether USD","USDT",6);
  deployer.deploy(KOLVote,{gas: 6700000});
  deployer.deploy(USDT,200000000000,"Tether USD","USDT",6,{gas: 6700000});
  deployer.deploy(BTT,{gas: 2300000});
};
