import Web3 from "web3";
import KOLUSDTFund from '../../build/contracts/KOLUSDTFund.json';

const App = {
  web3: null,
  // accounts:null,
  account: null,
  // accountLength:0,
  // currentAccount:0,
  meta: null,
  // metabulk:null,
  processedList: null,
  processedList:null,
  targets:new Array(),
  eventsNum:new Array(),
  targetAddr:new Array(),
  targetSuper:new Array(),
  missionId:null,
  getNodesVotedNum:async function(currentMissionId){
    const { web3 } = this;
    const { getMission2 } = this.meta.methods;
    // const nodeVotedNum = document.getElementsByClassName("nodeVotedNum")[0];
    const superVotedNum = document.getElementsByClassName("superVotedNum")[0];
    const missionid = document.getElementsByClassName("missionid")[0];
    var knodeVotedNum = await getMission2(currentMissionId).call();
    // nodeVotedNum.innerHTML = knodeVotedNum[0].toString();
    superVotedNum.innerHTML = knodeVotedNum[0].toString();
    missionid.innerHTML = currentMissionId;

    const buttonDetail = document.getElementsByClassName("getDetail")[0];
    buttonDetail.innerHTML = "查询已完成";

  },

  createMission: async function(){
    const { web3 } = this;
    const { createKolMission } = this.meta.methods;

    let missionName = $("input[name='missionName']").val();
    let missionAmount = $("input[name='missionAmount']").val();
    let agree = $('input:radio[name="isKol"]:checked').val();
    console.log(missionAmount);

    var unit = 10 ** 18;
    var _agree = true;
    if (agree === "true"){
      unit = 10 ** 18;
      _agree = true
    }else {
      unit = 10 ** 6;
      _agree = false;
    }
    var BN = web3.utils.BN;
    let missionAmountNew = new BN(missionAmount).mul(new BN(unit.toString())).toString();
    missionName = web3.utils.fromAscii(missionName);
    let gasPrice = await web3.eth.getGasPrice();
    let addPrice = 2 * 10 ** 9;
    let price = new BN(gasPrice).add(new BN(addPrice)).toString();
    try
    {
        await createKolMission(missionName,missionAmountNew,_agree).send({from: this.account,
                                                    gasPrice:price,
                                                    gas:300000});
        this.setStatus("任务发起成功！");
    }catch(error){
        this.setStatus("任务发起异常，稍后检查确认一下是否已成功");
    }

  },

  addKolOffering: async function(){
    const { web3 } = this;
    const { getMission1 } = this.meta.methods;
    const { addKolOffering } = this.meta.methods;
    let offerMissionId = $("input[name='offerMissionId']").val();
    let offerMissionAddress = $("input[name='offerMissionAddress']").val();
    let offerMissionAmount = $("input[name='offerMissionAmount']").val();

    let result = await getMission1(offerMissionId).call();

    let isKol = result[0];

    var unit = 10 ** 18;

    if (isKol){
      unit = 10 ** 18;
    }else {
      unit = 10 ** 6;
    }
    var BN = web3.utils.BN;
    let newOfferMissionAmount = new BN(offerMissionAmount).mul(new BN(unit)).toString();
    let gasPrice = await web3.eth.getGasPrice();
    let addPrice = 2 * 10 ** 9;
    let price = new BN(gasPrice).add(new BN(addPrice)).toString();
    try
    {
        await addKolOffering(offerMissionId,offerMissionAddress,newOfferMissionAmount).send({from: this.account,
                                                    gasPrice:price,
                                                    gas:300000});
        this.setStatus("名单添加成功！");
    }catch(error){
        this.setStatus("名单添加异常，稍后检查确认一下是否已成功");
    }
  },


  start: async function() {
    const { web3 } = this;
    try {
      this.meta = new web3.eth.Contract(
        KOLUSDTFund.abi,
        "0x27750e6D41Aef99501eBC256538c6A13a254Ea15",
      );
      const { missionId } = this.meta.methods;
      let accounts = await web3.eth.getAccounts();
      let missionID = parseInt(await missionId().call());
      this.missionId = missionID;
      $("input[name='MissionId']").val(missionID-1);
      this.account = accounts[0];
      this.initial();
      this.setmStatus("链上数据加载成功！");
    } catch (error) {
      this.setmStatus("连接以太坊网络失败，请刷新重试");
    };

    console.log("finished");

  },


  voteKol: async function(){
    const { web3 } = this;
    this.setStatus("上链中，耐心等待窗口弹出......");
    let missionId = $("input[name='MissionId']").val();
    let agree = $('input:radio[name="yes"]:checked').val();
    let gasPrice = await web3.eth.getGasPrice();
    let addPrice = 3 * 10 ** 9;
    var BN = web3.utils.BN;
    let price = new BN(gasPrice).add(new BN(addPrice)).toString();

    // let price = new BN(gasPrice);
    let _agree = true;
    if (agree === "false"){
      _agree = false;
    }

    const { voteMission } = this.meta.methods;
    console.log(missionId);
    console.log(_agree);
    try
    {
        await voteMission(missionId,_agree).send({from: this.account,
                                                    gasPrice:price,
                                                    gas:300000});
        this.setStatus("投票成功！");
    }catch(error){
        this.setStatus("投票异常，稍后检查确认一下是否已投票成功");
    }

  },

  refreshBalance: async function() {
    let currentMissionId = $("input[name='MissionId']").val();
    const buttonDetail = document.getElementsByClassName("getDetail")[0];
    buttonDetail.innerHTML = "查询进行中...";
    const { web3 } = this;
    const { voted } = this.meta.methods;
    var ethBalance = await web3.eth.getBalance(this.account);
    ethBalance = web3.utils.fromWei(ethBalance,"ether");

    const votedresult = await voted(this.account,currentMissionId).call();
    const ethBalanceElement = document.getElementsByClassName("ethBalance")[0];
    const votedElement = document.getElementsByClassName("voted")[0];

    ethBalanceElement.innerHTML = ethBalance;

    if (votedresult)
      votedElement.innerHTML = "已投票";
    else
      votedElement.innerHTML = "没投票";

    this.getNodesVotedNum(currentMissionId);

  },

  initial:function(){
    const addrElement = document.getElementsByClassName("myAddress")[0];
    const myAddress = this.account;
    addrElement.innerHTML = myAddress;

  },

  setStatus: function(message) {
    const status = document.getElementsByClassName("status")[0];
    status.innerHTML = message;
  },

  setmStatus: function(message) {
    const mstatus = document.getElementsByClassName("startup")[0];
    mstatus.innerHTML = message;
  },
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
