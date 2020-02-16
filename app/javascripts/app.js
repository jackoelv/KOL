import "../stylesheets/app.css";

import Web3 from "web3";
import KOLUSDTFund from '../../build/contracts/KOLUSDTFund.json';
var BigNumber = require("bignumber.js");

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

  createKolMission: async function(){
    const { web3 } = this;
    const { createKolMission } = this.meta.methods;
    let missionName = $("input[name='missionName']").val();
    let missionAmount = $("input[name='missionAmount']").val();
    let agree = $('input:radio[name="isKol"]:checked').val();
    var unit = 0;
    if (agree) {
      unit = 10 * (10 ** 18);
    }else {
      unit = 10 * (10 ** 6);
    }
    var BN = web3.utils.BN;
    missionAmount = new BN(missionAmount).mul(new BN(unit)).toString();
    missionName = web3.utils.fromAscii(missionName);
    try
    {
        await createKolMission(missionName,missionAmount,agree).send({from: this.account,
                                                    gasPrice:price,
                                                    gas:300000});
        this.setStatus("任务发起成功！");
    }catch(error){
        this.setStatus("任务发起异常，稍后检查确认一下是否已成功");
    }

  },

  start: async function() {
    console.log("111");
    const { web3 } = this;
    try {
      this.meta = new web3.eth.Contract(
        KOLUSDTFund.abi,
        "0x27750e6D41Aef99501eBC256538c6A13a254Ea15",
      );
      console.log("222");
      const { missionId } = this.meta.methods;
      let accounts = await web3.eth.getAccounts();
      let missionID = parseInt(await missionId().call());
      console.log("333");
      this.missionId = missionID;
      $("input[name='MissionId']").val(missionID-1);
      this.account = accounts[0];
      this.initial();
      // this.refreshBalance();
      // this.getNodesVotedNum();
      this.setmStatus("链上数据加载成功！");
    } catch (error) {
      // console.error("Could not connect to contract or chain.");
      this.setmStatus("连接以太坊网络失败，请刷新重试");
    };

    console.log("finished");

  },


  voteKol: async function(){
    const { web3 } = this;
    this.setStatus("上链中，耐心等待窗口弹出......");
    let missionId = $("input[name='MissionId']").val();
    // let agree = ( $("input[name='Agree']").val());
    let agree = $('input:radio[name="yes"]:checked').val();
    let gasPrice = await web3.eth.getGasPrice();
    let addPrice = 3 * 10 ** 9;
    var BN = web3.utils.BN;
    let price = new BN(gasPrice).add(new BN(addPrice)).toString();

    // let price = new BN(gasPrice);

    const { voteMission } = this.meta.methods;
    try
    {
        await voteMission(missionId,agree).send({from: this.account,
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
    // const { getMission1 } = this.meta.methods;
    // const { getMission2 } = this.meta.methods;
    // const { getOfferings } = this.meta.methods;
    const { voted } = this.meta.methods;

    // var balance = await balanceOf(this.account).call();
    // balance = web3.utils.fromWei(balance,"ether");
    var ethBalance = await web3.eth.getBalance(this.account);
    ethBalance = web3.utils.fromWei(ethBalance,"ether");

    // const supernode = await querySuperNode(this.account).call();
    // const node = await queryNode(this.account).call();
    const votedresult = await voted(this.account,currentMissionId).call();
    // const myAddress = this.account;

    // const addrElement = document.getElementsByClassName("myAddress")[0];
    // const balanceElement = document.getElementsByClassName("balance")[0];
    const ethBalanceElement = document.getElementsByClassName("ethBalance")[0];
    // const supernodeElement = document.getElementsByClassName("supernode")[0];
    // const nodeElement = document.getElementsByClassName("node")[0];
    const votedElement = document.getElementsByClassName("voted")[0];

    // balanceElement.innerHTML = balance;
    ethBalanceElement.innerHTML = ethBalance;

    // if (node)
    //   nodeElement.innerHTML = "是";
    // else
    //   nodeElement.innerHTML = "不是";

    // if (supernode)
    //   supernodeElement.innerHTML = "是";
    // else
    //   supernodeElement.innerHTML  = "不是";

    if (votedresult)
      votedElement.innerHTML = "已投票";
    else
      votedElement.innerHTML = "没投票";

    // addrElement.innerHTML = myAddress;

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
    console.log("load 111");
    App.web3 = new Web3(window.ethereum);
    console.log("load 222");
    window.ethereum.enable(); // get permission to access accounts
    console.log("load 333");
  } else {
    console.log("load error");
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

  }

  App.start();
});
