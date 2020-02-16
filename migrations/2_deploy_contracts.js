var KOLVote = artifacts.require("KOLVote");
var TetherToken = artifacts.require("TetherToken");
var KOLUSDTFund = artifacts.require("KOLUSDTFund");

module.exports = function(deployer) {
  // deployer.deploy(KOLVote,{gas: 6700000});
  // deployer.deploy(TetherToken,200000000000,"Tether USD","USDT",6);
  deployer.deploy(KOLUSDTFund,
                 "0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69",
                 "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                 {gas: 2300000});
};
