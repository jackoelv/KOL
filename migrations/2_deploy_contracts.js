var KOLVote = artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
var KOLD = artifacts.require("KOLWithDraw");
module.exports = function(deployer) {
  // deployer.deploy(KOLVote,{gas: 6700000});
  // deployer.deploy(KOLP,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",1588867200,1607356800,{gasPrice:1000000000,gas: 6700000});
  // deployer.deploy(KOLD,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",{gasPrice:1000000000,gas: 6700000});
  // deployer.deploy(KOLP,"0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69","0x68bf941E428BcD731D678799bA9Da20E52244383",1589126400,1636560000,{gasPrice:30000000000,gas: 6700000});
  // deployer.deploy(KOLD,"0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69","0xbC664C8ECadbB9311325537DfA4609F877E04Ab6","0x68bf941E428BcD731D678799bA9Da20E52244383",{gasPrice:30000000000,gas: 6700000});
  //ropsten
  // deployer.deploy(KOLP,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",1589126400,1636560000,{gasPrice:2000000000,gas: 6700000});
  // deployer.deploy(KOLD,"0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154","0x294fEA742612eaDe03bA840c8dC98c32DAb5C9d2","0x1B49402eC48dfE0A54a085527d1F8125eacf6dcb",{gasPrice:2000000000,gas: 6700000});

};
