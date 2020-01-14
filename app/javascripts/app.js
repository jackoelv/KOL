import "../stylesheets/app.css";

import Web3 from "web3";
import kolvote_artifacts from '../../build/contracts/KOLVote.json';
import kolcoreteam from '../../build/contracts/KolCoreTeam.json';
import usdt from '../../build/contracts/TetherToken.json';
// import bulk_artifacts from '../../build/contracts/xx.json';
// var fs = require("fs");
// import fs from "fs";
var BigNumber = require("bignumber.js");

const App = {
  web3: null,
  account: null,
  meta: null,
  // metabulk:null,
  processedList: null,
  processedList:null,
  targets:new Array(),
  eventsNum:new Array(),
  targetAddr:new Array(),
  targetSuper:new Array(),
  missionId:null,





  getNodesVotedNum:async function(){
    const { web3 } = this;
    const { getMission2 } = this.meta.methods;
    const nodeVotedNum = document.getElementsByClassName("nodeVotedNum")[0];
    const superVotedNum = document.getElementsByClassName("superVotedNum")[0];
    const missionid = document.getElementsByClassName("missionid")[0];
    var knodeVotedNum = await getMission2(this.missionId-1).call();
    nodeVotedNum.innerHTML = knodeVotedNum[0].toString();
    superVotedNum.innerHTML = knodeVotedNum[2].toString();
    missionid.innerHTML = this.missionId - 1;

    const buttonDetail = document.getElementsByClassName("getDetail")[0];
    buttonDetail.innerHTML = "查询已完成";

  },

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = kolvote_artifacts.networks[networkId];
      this.meta = new web3.eth.Contract(
        kolvote_artifacts.abi,
        deployedNetwork.address,
      );
      const { missionId } = this.meta.methods;
      const accounts = await web3.eth.getAccounts();

      let missionID = parseInt(await missionId().call());

      this.missionId = missionID;
      $("input[name='MissionId']").val(missionID-1);
      this.account = accounts[0];
      // this.refreshBalance();
      // this.getNodesVotedNum();
      this.setmStatus("链上数据加载成功！");
    } catch (error) {
      // console.error("Could not connect to contract or chain.");
      this.setmStatus("连接以太坊网络失败，请刷新重试");
    };

    console.log("finished");

  },


  voteKol: async function(type){
    this.setStatus("上链中，耐心等待窗口弹出......");
    let missionId = $("input[name='MissionId']").val();
    // let agree = ( $("input[name='Agree']").val());
    let agree = $('input:radio:checked').val();
    console.log(missionId);
    console.log(agree);
    console.log(type);
    const { voteMission } = this.meta.methods;
    try
    {
        await voteMission(type,missionId,agree).send({from: this.account});
        this.setStatus("投票成功！");
    }catch(error){
        this.setStatus("投票失败，刷新重来吧");
    }





  },

  refreshBalance: async function() {
    const buttonDetail = document.getElementsByClassName("getDetail")[0];
    buttonDetail.innerHTML = "查询进行中...";
    const { web3 } = this;
    const { balanceOf } = this.meta.methods;
    const { querySuperNode } = this.meta.methods;
    const { queryNode } = this.meta.methods;
    const { voted } = this.meta.methods;

    var balance = await balanceOf(this.account).call();
    balance = web3.utils.fromWei(balance,"ether");
    const supernode = await querySuperNode(this.account).call();
    const node = await queryNode(this.account).call();
    const votedresult = await voted(this.account,this.missionId-1).call();
    const myAddress = this.account;

    const addrElement = document.getElementsByClassName("myAddress")[0];
    const balanceElement = document.getElementsByClassName("balance")[0];
    const supernodeElement = document.getElementsByClassName("supernode")[0];
    const nodeElement = document.getElementsByClassName("node")[0];
    const votedElement = document.getElementsByClassName("voted")[0];

    if (node)
      nodeElement.innerHTML = "是";
    else
      nodeElement.innerHTML = "不是";

    if (supernode)
      supernodeElement.innerHTML = "是";
    else
      supernodeElement.innerHTML  = "不是";

    if (votedresult)
      votedElement.innerHTML = "已投票";
    else
      votedElement.innerHTML = "没投票";
    balanceElement.innerHTML = balance;
    addrElement.innerHTML = myAddress;

    this.getNodesVotedNum();

  },


  setStatus: function(message) {
    const status = document.getElementsByClassName("status")[0];
    status.innerHTML = message;
  },

  setmStatus: function(message) {
    console.log("woriaaa");
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
