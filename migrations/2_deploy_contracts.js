// var KOL = artifacts.require("KOL");
var KOLVote = artifacts.require("KOLVote");
// var KOLMission = artifacts.require("KOLMission");
// var KOLOffer = artifacts.require("KOLOffer");

module.exports = function(deployer) {
  // deployer.deploy(KOL,{gas: 6700000});
  deployer.deploy(KOLVote,{gas: 6700000});
  // deployer.deploy(KOLMission,{gas: 6700000});
  // deployer.deploy(KOLOffer,{gas: 7700000});
};
