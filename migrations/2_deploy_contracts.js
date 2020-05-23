var KOLVote = artifacts.require("KOLVote");
var KOLA = artifacts.require("KOLADUSER");
module.exports = function(deployer) {
  deployer.deploy(KOLVote,{gas: 6700000});
  deployer.deploy(KOLA,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",{gasPrice:1000000000,gas: 6700000});
};
