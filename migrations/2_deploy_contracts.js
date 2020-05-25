var KOLVote = artifacts.require("KOLVote");
var KOLA = artifacts.require("KOLADUSER");
module.exports = function(deployer) {
  deployer.deploy(KOLVote,{gas: 6700000});
  deployer.deploy(KOLA,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",{gasPrice:1000000000,gas: 6700000});
  // deployer.deploy(KOLA,"0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69","0x592B58c423398a18621d96b29044ab168d36704d",{gasPrice:22000000000,gas: 3500000});

};
