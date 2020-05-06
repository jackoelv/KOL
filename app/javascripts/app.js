import Web3 from "web3";
import KOLPro from '../../build/contracts/KOLPro.json';
import KOLWithDraw from '../../build/contracts/KOLWithDraw.json';
import KOLVote from '../../build/contracts/KOLVote.json';

const App = {
  web3: null,
  account: null,
  metaP: null,
  metaD: null,
  metaK:null,
  paddr: "0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2",
  daddr: "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
  kaddr: "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",

  start: async function() {
    const { web3 } = this;
    try {
      this.metaK = new web3.eth.Contract(
        KOLVote.abi,
        this.kaddr,
      );
      this.metaP = new web3.eth.Contract(
        KOLPro.abi,
        this.paddr,
      );
      this.metaD = new web3.eth.Contract(
        KOLWithDraw.abi,
        this.daddr,
      );
      let accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      // this.initial();

      // this.initial();
      // this.setmStatus("链上数据加载成功！");
    } catch (error) {
      // this.setmStatus("连接以太坊网络失败，请刷新重试");
      console.log("error");
    };

    console.log("finished");
  },

  initial: async function(){
    const { web3 } = this;
    const { LockBalance } = this.metaP.methods;
    const { withdrawCheck } = this.metaD.methods;
    const { getChildsLen } = this.metaP.methods;
    const { TotalUsers } = this.metaP.methods;
    const { TotalLockingAmount } = this.metaP.methods;
    const { RInviteCode } = this.metaP.methods;
    const { isLevelN } = this.metaP.methods;
    const { TotalWithDraws } = this.metaD.methods;

    var lock = await LockBalance(this.account).call();
    lock = web3.utils.BN(lock);
    lock = web3.utils.fromWei(lock,"ether");


    var bonus = await withdrawCheck(this.account).call();
    bonus = web3.utils.BN(bonus);
    bonus = web3.utils.fromWei(bonus,"ether");

    var childs = await getChildsLen(this.account).call();
    childs = web3.utils.BN(childs);


    var teamusers = await TotalUsers(this.account).call();
    teamusers = web3.utils.BN(teamusers);

    var teamamount = await TotalLockingAmount(this.account).call();
    teamamount = web3.utils.BN(teamamount);
    teamamount = web3.utils.fromWei(teamamount,"ether");

    var level = await isLevelN(this.account).call();
    level = web3.utils.BN(level);

    var iCode = await RInviteCode(this.account).call();
    iCode = web3.utils.BN(iCode);

    var totaldraws = await TotalWithDraws(this.account).call();
    totaldraws = web3.utils.BN(totaldraws);
    totaldraws = web3.utils.fromWei(totaldraws,"ether");





    $("input[name='addr']").val(this.account);
    $("input[name='lock']").val(lock);
    $("input[name='bonus']").val(bonus);
    $("input[name='childs']").val(childs);
    $("input[name='teamusers']").val(teamusers);
    $("input[name='teamamount']").val(teamamount);
    $("input[name='level']").val(level);
    $("input[name='iCode']").val(iCode);
    $("input[name='totaldraws']").val(totaldraws);

  },

  reg: async function(){
    //页面注册按钮，先检查输入的验证码是否正确有效，然后提示成功或者失败。
    var iCode = $("input[name='iCodeRegister']").val();
    const { web3 } = this;
    const { register } = this.metaP.methods;
    const { InviteCode } = this.metaP.methods;
    var address = await InviteCode(iCode).call();
    if (address == 0){
      //回头再来处理这个错误提示和显示的问题。
      console.log("地址错误");
    }else{
      let gasPrice = await web3.eth.getGasPrice();
      let gaslimit = 6000000;
      let result = await register(iCode).send({from:this.account,
                                  gasPrice:gasPrice,
                                  gas:gaslimit});
      console.log(result);
      //取得这个txHash，然后去每隔一秒去取一下他的状态，如果成功了，就提示成功，否则就等待.

    }
  },

 // 授权合约转账
 approve: async function(){
   if (this.ready){
     const { web3 } = this;
     var BN = web3.utils.BN;
     let amount = $("input[name='joinAmount']").val();
     amount = web3.utils.toWei(amount,"ether");

     let usdtorcoin = $("input[name='usdtcoin']").val();
     let gasPrice = await web3.eth.getGasPrice();
     const { approve } = this.metaK.methods;
      try
      {
        let tran = await approve(this.paddr,amount).send({from: this.account,
                                                         gasPrice:price,
                                                         gas:80000});
        if (tran === null){
          console.log("approve false,try again");
        }else{
          // console.log("transction is :" + tran.blockHash);
          // while (tran.blockHash === null){
          //   //waitting
          //   await sleep(1000);
          //   console.log("sleeping 1s... why? It`s impossible. no Useful");
          //
          // }
          this.setActionBtn();
          console.log("授权成功！");
        }

      }catch(error){
        console.log("授权异常，稍后检查确认一下是否已成功");
      }




   }


 },
 sleep: async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
    console.log("haha");
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

  }

  App.start();
});
