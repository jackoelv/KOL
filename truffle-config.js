// Allows us to use ES6 in our migrations and tests.
require('babel-register')
// const HDWalletProvider = require("@truffle/hdwallet-provider");
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privKeys = ["00ed7b1e78729d70a86b3a0f828b48357b961750ddb88f8e30d9c025794ba03e","cfae8f1845862a84e5c45f90405567ee3787fb0a8a2cce46a082a712e9b63926","29753c9c142a75cf0206cdaf44351e5b5f6b44707d777b37e39ac33bf790a654","9ea63cb0537cb745f97f1e31be1492432c5676fbaa8d46fa562e35e786604ac3","76e9d6f32772063e5afc2d793c2f63cc70b7f4d0b7994cbadea40b56c359d087","dffe9996c8c2c6280efc7fc7b12110b15da822b57a4e5e244ffac7d8b101006a","937b11ec7c80f855aaa0c8af063de94b6a5f6f3b694e09537bcffcacf905c0f1"];
const privKeysmainnet =  ["13B153BF7AF87395C895AED7503E1077106713CFD4776BF031CB6DEB9AB27384"];
// var infura_apikey = "82497b84999f430db6fe21f4406cab29";
// var mnemonic = "manual shop measure found twelve above pluck congress east kiwi delay kid";
module.exports = {
  networks: {
    develop: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 80000000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(privKeys, "https://ropsten.infura.io/v3/b1fb153dd7e44bef9cb4d9b661071583");
      },
      network_id: 3,
      networkCheckTimeout:20000,
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(privKeysmainnet, "https://mainnet.infura.io/v3/b1fb153dd7e44bef9cb4d9b661071583");
      },
      network_id: 1,
      networkCheckTimeout:200000,
    }

  },
  compilers: {
    solc: {
      version: "0.4.23"
    }
  },
}
