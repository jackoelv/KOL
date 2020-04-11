// var KOL = artifacts.require("KOL");
// var KOLMission = artifacts.require("KOLMission");
// var KOLOffer = artifacts.require("KOLOffer");
// var KolCoreTeam = artifacts.require("KolCoreTeam");
// var KolFund = artifacts.require("KolFund");
var KOLVote = artifacts.require("KOLVote");
var LockNode = artifacts.require("KOLLockNode");

module.exports = function(deployer) {
  // deployer.deploy(KOL,{gas: 6700000});

  // deployer.deploy(KOLMission,{gas: 6700000});
  // deployer.deploy(KOLOffer,{gas: 7700000});KolCoreTeam

  // deployer.deploy(KOLVote,{gas: 6700000});
  deployer.deploy(LockNode,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",{gas: 6700000});
  // deployer.deploy(LockNode,"0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",{gas: 6700000,gasPrice: 1000000000});
  // deployer.deploy(LockNode,"0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69",{gas: 6700000,gasPrice: 2000000000,nonce: '1937'});
  // deployer.deploy(KolFund,
  //                "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
  //                {gas: 7700000});
  // deployer.deploy(KolCoreTeam,
  //             "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
  //             {gas: 7700000});
};
