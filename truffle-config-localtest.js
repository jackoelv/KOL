// Allows us to use ES6 in our migrations and tests.
require('babel-register')
// const HDWalletProvider = require("@truffle/hdwallet-provider");
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
// const privKeys = ["00ed7b1e78729d70a86b3a0f828b48357b961750ddb88f8e30d9c025794ba03e","cfae8f1845862a84e5c45f90405567ee3787fb0a8a2cce46a082a712e9b63926","29753c9c142a75cf0206cdaf44351e5b5f6b44707d777b37e39ac33bf790a654","9ea63cb0537cb745f97f1e31be1492432c5676fbaa8d46fa562e35e786604ac3","76e9d6f32772063e5afc2d793c2f63cc70b7f4d0b7994cbadea40b56c359d087","dffe9996c8c2c6280efc7fc7b12110b15da822b57a4e5e244ffac7d8b101006a","937b11ec7c80f855aaa0c8af063de94b6a5f6f3b694e09537bcffcacf905c0f1"];
const privKeys = ["5ebff7539338f265abe4d9cd30933e9b82352b0cbfd205ada28be9d9cd508df8","a9d205025292370d1fbca60f4f350bd04670e7445f31f7355fef056e8d26f28e","952e6efb1392d50fecc2427a25ad74ce9b2a37a7d8d71acf9408809b416e49ae","0ffbaa93e699466de1ba60950fe7e1a34d1dd5f9503463617d6055a445f838fe","15455a0c1b25a5702add1a306d8268785798b3104a6b964da390310969ce431a","44febd5ae8967142f78b4febc8def8ffb629aea6cead06743b0cb278217e633c","21a699b08cd126388e88ea0f11c7e62098642dbf41ec95f146e6e8bfefffe40d","0794948440d6d35639f54b88d45cfb78f31eab57e022ec194ec29b539e4805ff","191f066073fc59dcd85238588a478f20555b1a75eb93a0baa537133da71e741d","22c53265b22e46a5cdd647c706b453d31bc6829d2b39329bb882c85696ff2eba"];
const privKeysmainnet =  ["2DEC3A54D8741D9FD8C9476933C797E1045E7C6F90D80A92A740F9485E47FE79"];
// var infura_apikey = "82497b84999f430db6fe21f4406cab29";
// var mnemonic = "manual shop measure found twelve above pluck congress east kiwi delay kid";
module.exports = {
  networks: {
    develop: {
      accounts: 100,
      defaultEtherBalance: 100,
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 80000000
    },
    develop1: {
      host: '192.168.2.49',
      port: 8545,
      network_id: '*',
      gas: 80000000
    },
    gan: {
      host: 'localhost',
      port: 7545,
      network_id: '5777',
      gas: 6700000
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
    },
    localgeth: {
      provider: function() {
        return new HDWalletProvider(privKeysmainnet, "http://192.168.2.198:8545");
      },
      network_id: 1,
      networkCheckTimeout:200000,
      gasPrice: 3000000000,
      gas: 2300000
    }


  },
  compilers: {
    solc: {
      version: "0.4.23"
    }
  },
}
