import Web3 from "web3";
import BTT from '../../build/contracts/BTT.json';
import Token from '../../build/contracts/StandardToken.json';

const App = {
  web3: null,
  account: null,
  meta: null,
  metaToken: null,
  metaKOL:null,
  contractAddr: "0xdFeA88Ee964354d72F8e0E5bb5b809fC7Ad6b982",
  tokenAddress: null,
  decimal: null,
  targetAddress: new Array(),
  targetAmount: new Array(),
  targetAmountWei: new Array(),
  totalTokens: null,
  ready:false,
  confirmList:null,


  start: async function() {
    const { web3 } = this;
    try {
      this.meta = new web3.eth.Contract(
        BTT.abi,
        this.contractAddr,
      );
      let accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      // this.initial();
      // this.setmStatus("链上数据加载成功！");
    } catch (error) {
      // this.setmStatus("连接以太坊网络失败，请刷新重试");
      console.log("error");
    };

    console.log("finished");
  },

  confirmList: function(){

  },
  setDiv: function(address,amount){
    var div = '  <div class="weui-cell weui-cell_access">'
        +'<div class="weui-cell__bd" style="text-align:left;font-size:12px">'
        + address
        +'</div>'
        +'<div class="weui-cell__ft" style="font-size: 0">'
        +'    <span style="vertical-align:middle; font-size: 12px;text-align:right">'
        + amount
        +'</span>'
        +'</div>'
        +'</div>';
    return div
  },
  setApproveBtn: function(){
    var div = '<div class="weui-btn-area">'
              +'<a class="weui-btn weui-btn_primary" id="showTooltips" onclick="App.approve()">第二步：确认名单并授权合约转账</a>'
              +'</div>';
    var html = "";
    html += div;
    var list = document.getElementById("list");
    list.innerHTML = this.confirmList + html;

  },
  setFailBtn: function(){
    var div = '<div class="weui-btn-area">'
              +'<a class="weui-btn weui-btn_disabled weui-btn_warn" id="showTooltips" onclick="App.approve()">请确保钱包持有10个KOL</a>'
              +'</div>';
    var list = document.getElementById("list");
    list.innerHTML = div;
  },
  setActionBtn: function(){
    var div = '<div class="weui-btn-area">'
              +'<a class="weui-btn weui-btn_primary" id="showTooltips" onclick="App.batchToken()">第三步：执行合约转账</a>'
              +'</div>';
    var html = "";
    html += div;
    var list = document.getElementById("list");
    list.innerHTML = this.confirmList + html;

  },
  setFinishedBtn: function(){
    var div = '<div class="weui-btn-area">'
              +'<a  class="weui-btn weui-btn_disabled weui-btn_warn" onclick="App.back()">转账执行完毕，点击返回</a>'
              +'</div>';
    var html = "";
    html += div;
    var list = document.getElementById("list");
    list.innerHTML = this.confirmList + html;

  },
  back: function(){
    var list = document.getElementById("list");
    list.innerHTML = "";
    $("textarea[name='addressList']").val("");
  },

  setWaitting: function(){
    var div = '<div class="weui-loadmore">'
             +'    <i class="weui-loading"></i>'
             +'    <span class="weui-loadmore__tips">正在加载</span>'
             +'</div>';
    var list = document.getElementById("list");
    list.innerHTML = this.confirmList + div;
    console.log("yes wait");
  },

  getList: function(){
    this.confirmList = '';

    for (var i = 1; i<this.targetAddress.length; i++){
      this.confirmList += this.setDiv(this.targetAddress[i],this.targetAmount[i]);
    }
    this.confirmList += this.setDiv("合约",this.tokenAddress);
    this.confirmList += this.setDiv("位数精度",this.decimal);
    this.confirmList += this.setDiv("地址总数",this.targetAmount.length-1);
    this.confirmList += this.setDiv("代币总数",this.totalTokens);
    var list = document.getElementById("list");
    list.innerHTML = this.confirmList;
  },

  readTarget: function(){
    const { web3 } = this;
    var BN = web3.utils.BN;
    this.tokenAddress = $("input[name='tokenAddress']").val();
    this.decimal = $("input[name='decimal']").val();
    this.totalTokens = 0;
    let addresslist = ( $("textarea[name='addressList']").val());
    var uidArr = addresslist.split(/[(\r\n)\r\n]+/);
    this.targetAddress.length = 0;
    this.targetAmount.length = 0;
    this.targetAddress[0] = '0x0000000000000000000000000000000000000000';
    this.targetAmount[0] = 0;
    this.targetAmountWei[0] = 0;
    var targets = new Array();
    var unit = 10 ** parseInt(this.decimal);
    for(var i = 0; i<uidArr.length; i++){
      targets = uidArr[i].split(",");
      if (targets.length != 2){
        console.log("no data, should abort the app and throw errors");
         break;

      }
      this.targetAddress[i+1] = targets[0];
      this.targetAmount[i+1] = targets[1];
      this.targetAmountWei[i+1] = new BN(targets[1]).mul(new BN(unit.toString())).toString();


      this.totalTokens += Number(this.targetAmount[i+1]);
      if(!web3.utils.isAddress(this.targetAddress[i+1]))
      {
          console.log("error exit,should abort the app and throw errors");
      }

    };

    this.targetAmountWei[0] = new BN(this.totalTokens).mul(new BN(unit.toString())).toString();
    this.getList();
    this.setApproveBtn();
    this.checkData();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });


  },
  // 检查所有的数据输入是否合法
  checkData: async function(){
   //tokenAddress correct?
   //
   const { web3 } = this;
   if (!web3.utils.isAddress(this.tokenAddress)){
     console.log("Error Token Address");
     this.ready = false;
     return;
   }
   var decimal = parseInt(this.decimal);
   this.decimal = decimal;
   if (this.decimal > 18) {
     console.log("Error Token decimal");
     this.ready = false;
     return;
   }
   try {
     this.metaKOL = new web3.eth.Contract(
       Token.abi,
       "0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69",
     );
     let accounts = await web3.eth.getAccounts();
     const { balanceOf } = this.metaKOL.methods;
     let kolBalance = await balanceOf(accounts[0]).call();
     kolBalance = web3.utils.fromWei(kolBalance,"ether");
     if (kolBalance < 10){
       this.ready = false;
     }

     // this.initial();
     // this.setmStatus("链上数据加载成功！");
     } catch (error) {
       // this.setmStatus("连接以太坊网络失败，请刷新重试");
       console.log("error");
     };
   this.ready = true;


 },


  // 执行转账
  batchToken: async function(){
    this.setWaitting();

    const { web3 } = this;
    const { batchToken } = this.meta.methods;


    var BN = web3.utils.BN;
    let gasPrice = await web3.eth.getGasPrice();
    let addPrice = 2 * 10 ** 9;
    let price = new BN(gasPrice).add(new BN(addPrice.toString())).toString();
    let length = Number(this.targetAddress.length)-Number("1");
    let unitFee = 3;
    var unit = 10000;
    //let txFee = new BN("0.0001").mul(new BN(length));//Number("0.0001")*(Number(this.targetAddress.length)-1);
    // console.log("txFee is : " + length);
    let gasAll = 80000 * (Number(this.targetAddress.length)-1);

    let txFee = web3.utils.toWei(length.toString(),"ether");
    txFee = new BN(txFee).mul(new BN(unitFee)).div(new BN(unit));
    // console.log("then txFee is : " + txFee);
    // console.log("gasAll"+ gasAll);
    try{
      await batchToken(this.tokenAddress,
                            this.targetAddress,
                            this.targetAmountWei).send({from: this.account,
                                                       gasPrice:price,
                                                       value:txFee,
                                                       gas:gasAll});

      //haha

      this.setFinishedBtn();

    }catch(e){
      console.log("error in send Token");

    }


  },



 // 授权合约转账
 approve: async function(){
   if (this.ready){
     const { web3 } = this;
     var BN = web3.utils.BN;
     let amount = this.targetAmountWei[0];
     let gasPrice = await web3.eth.getGasPrice();
     let addPrice = 1 * 10 ** 9;
     let price = new BN(gasPrice).add(new BN(addPrice.toString())).toString();
     this.setWaitting();

     try {
       this.metaToken = new web3.eth.Contract(
         Token.abi,
         this.tokenAddress,
       );
       let accounts = await web3.eth.getAccounts();
       this.account = accounts[0];
       // this.initial();
       // this.setmStatus("链上数据加载成功！");
       } catch (error) {
         // this.setmStatus("连接以太坊网络失败，请刷新重试");
         console.log("error");
       };
      const { approve } = this.metaToken.methods;

      try
      {

        let tran = await approve(this.contractAddr,amount).send({from: this.account,
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
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

  }

  App.start();
});
