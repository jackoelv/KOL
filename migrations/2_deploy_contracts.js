// var KOL = artifacts.require("KOL");
var KOLVote = artifacts.require("KOLVote");
// var KOLMission = artifacts.require("KOLMission");
// var KOLOffer = artifacts.require("KOLOffer");
var KolCoreTeam = artifacts.require("KolCoreTeam");
var KolFund = artifacts.require("KolFund");

module.exports = function(deployer) {
  // deployer.deploy(KOL,{gas: 6700000});

  // deployer.deploy(KOLMission,{gas: 6700000});
  // deployer.deploy(KOLOffer,{gas: 7700000});KolCoreTeam

  // deployer.deploy(KOLVote,{gas: 6700000});
  // deployer.deploy(KolFund,
  //                "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
  //                {gas: 7700000});
  deployer.deploy(KolCoreTeam,
              "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
              {gas: 7700000});
};
