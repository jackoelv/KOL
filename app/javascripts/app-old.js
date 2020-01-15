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

  readCSV: function(){
    let addresslist = ( $("textarea[name='addresslist']").val());
    var uidArr = addresslist.split(/[(\r\n)\r\n]+/);
    for(var i = 0; i<uidArr.length; i++){
      this.targets[i] = uidArr[i].split(",");
      if(!web3.isAddress(this.targets[i][1]))
      {
          terminate("Invalid address: " + this.targets[i][1]);
          process.exit(1);
      }
    };
    console.log('Parsing finished');
  },
  readSuperCSV: function(type){
    var addresslist = "";
    if (type == 1){
      //超级节点
      addresslist = ( $("textarea[name='superlist']").val());
    }else if(type ==2){
      // 节点
      addresslist = ( $("textarea[name='nodelist']").val());
    }
    var uidArr = addresslist.split(/[(\r\n)\r\n]+/);
    this.targetSuper.length = 0;
    for(var i = 0; i<uidArr.length; i++){
      this.targetSuper[i] = uidArr[i].split(",");
      if(!web3.isAddress(this.targetSuper[i][1]))
      {
          terminate("Invalid address: " + this.targetSuper[i][1]);
          process.exit(1);
      }
    };

    // let addresslist = ( $("textarea[name='superlist']").val());

    console.log('Parsing supernode address finished');
  },
  readAddr: function(){
    const { web3 } = this;
    let addresslist = ( $("textarea[name='target']").val());
    var uidArr = addresslist.split(/[(\r\n)\r\n]+/);
    for(var i = 0; i<uidArr.length; i++){
      this.targetAddr[i] = uidArr[i];
      if(!web3.utils.isAddress(this.targetAddr[i]))
      {
          terminate("Invalid address: " + this.targetAddr[i]);
          process.exit(1);
      }
    };
    console.log('Parsing finished');
  },

  getEvents:async function(name,address){
    const { web3 } = this;
    console.log("events begin");
    this.meta.getPastEvents('Transfer', {
        filter: {from: address},
        fromBlock: 9144560,
        toBlock: 'latest'
        }, (error, events) => {
          // console.log(events);
          // console.log(events.length);
          // this.putEventNums(name,events.length);
          this.putEventsAndBalance(name,address,events.length);
          // if (address == '0xD9A474FB80885aE0b6742d1861bCcEC4ae23CF24'){
          //   console.log(events);
          // }
        }
      );
      // this.metabulk.getPastEvents('Transfer', {
      //     filter: {from: address,to:"0xd1917932a7db6af687b523d5db5d7f5c2734763f"},
      //     fromBlock: 9144560,
      //     toBlock: 'latest'
      //     }, (error, events) => {
      //       if (events.length > 0) {
      //         //去另一个合约监听。0xd1917932a7db6af687b523d5db5d7f5c2734763f
      //         console.log(events);
      //       }
      //     }
      //   );
    // console.log("events ended");
    // this.getBalances(name,address);
  },
  getBikiEvents:async function(){
    const { web3 } = this;
    console.log("events begin");
    // let address = "0x6efb20f61b80f6a7ebe7a107bace58288a51fb34";//biki
    let address = "0x6cc5f688a315f3dc28a7781717a9a798a59fda7b";//99ex

    this.meta.getPastEvents('Transfer', {
        filter: {to: address},
        fromBlock: 9144560,
        toBlock: 'latest'
        }, (error, events) => {
          console.log(events.length);
          console.log(events);
        }
      );
  },
  get99Events:async function(){
    const { web3 } = this;
    console.log("events begin");
    // let address = "0x6efb20f61b80f6a7ebe7a107bace58288a51fb34";//biki
    let address = "0x6cc5f688a315f3dc28a7781717a9a798a59fda7b";//99ex

    this.metausdt.getPastEvents('Transfer', {
        filter: {from:fromAddr,to: address},
        fromBlock: 9233100,
        toBlock: 'latest'
        }, (error, events) => {
          console.log("usdt transfer");
          console.log(events.length);
          console.log(events);
        }
      );
  },
  getMission:async function(){
    const { web3 } = this;
    const { getMission1 } = this.meta.methods;
    const { getMission2 } = this.meta.methods;
    var result1 = await getMission1(8).call();
    console.log("8");
    console.log(result1);
    var result2 = await getMission2(8).call();
    console.log("8");
    console.log(result2);

  },
  getBalances:async function(name,address){
    const { web3 } = this;
    const { balanceOf } = this.meta.methods;
    var balance = await balanceOf(address).call();
    balance = web3.utils.fromWei(balance);
    this.putEventNums(name,balance);

  },
  putEventNums:function(name,nums){
    console.log("put Begin");
    let old = $("textarea[name='eventnums']").val();
    var txt = old + name + "," + nums + "\r\n";
    $("textarea[name='eventnums']").val(txt);
  },

  putEventsAndBalance:async function(name,address,nums){
    const { web3 } = this;
    const { balanceOf } = this.meta.methods;
    var balance = await balanceOf(address).call();
    balance = web3.utils.fromWei(balance);
    console.log("put Begin");
    let old = $("textarea[name='eventnums']").val();
    var txt = old + name + "," + balance + "," + nums + "\r\n";
    $("textarea[name='eventnums']").val(txt);

  },
  putBalance:async function(){
    const { web3 } = this;
    const { balanceOf } = this.meta.methods;
    $("textarea[name='targetBalance']").val("");
    this.readAddr();
    for (var i = 0; i< this.targetAddr.length; i++){
      var balance = await balanceOf(this.targetAddr[i]).call();
      balance = web3.utils.fromWei(balance);
      console.log("put Begin");
      let old = $("textarea[name='targetBalance']").val();
      var txt = old + this.targetAddr[i] + "," + balance + "\r\n";
      $("textarea[name='targetBalance']").val(txt);
    }

  },

  batchTransfer:async function(){

    const { web3 } = this;
    var gasPrice = await web3.eth.getGasPrice();
    var addPrice = 5 * 10 ** 9;
    console.log(gasPrice);
    // gasPrice = gasPrice.plus(addPrice)
    // console.log(gasPrice);
    var gasLimit = 90000;
    const { transfer } = this.meta.methods;

    this.readAddr();
    for(var i = 0; i<this.targetAddr.length; i++){
      // gasPrice = await web3.eth.getGasPrice();
      // console.log(gasPrice);
      // gasPrice = gasPrice.plus(addPrice);
      // console.log(gasPrice);
      // gasPrice = gasPrice.plus(addPrice)
      // console.log(gasPrice);
      // var gasLimit = 90000;
      console.log(this.targetAddr[i]);
      if(!web3.utils.isAddress(this.targetAddr[i]))
      {
          terminate("Invalid address: " + this.targetAddr[i]);
          process.exit(1);
      }else{
        await transfer(this.targetAddr[i],web3.utils.toWei("10","ether")).send({ from: this.account});
      }

    };
    console.log('Address Parsing finished');


  },

  getBalanceAndNums: async function(){
    this.readCSV();
    // this.setStatus(this.targets[1][0]);
    $("textarea[name='eventnums']").val("");
    console.log("being");
    for (var j = 0; j<this.targets.length; j++){
      await this.getEvents(this.targets[j][0],this.targets[j][1]);
    };
    console.log("end");
  },

  findVoted:async function(type){
    const { web3 } = this;
    const { voted } = this.meta.methods;
    this.readSuperCSV(type);
    var missionId = $("input[id='missionid']").val();;//设置任务ID
    console.log("findVoted begin");
    $("textarea[name='targetSuper']").val("");
    var txt = "已投票";
    var sum = 0;
    for (var i = 0; i< this.targetSuper.length; i++){
      var supervoted = await voted(this.targetSuper[i][1],missionId).call();
      if (supervoted){
        txt = "已投票";
        // console.log("put Begin");
        // let old = $("textarea[name='targetSuper']").val();
        // var txt = old + this.targetSuper[i][0] + "," + txt + "\r\n";
        // $("textarea[name='targetSuper']").val(txt);
        // sum++;
      }
      else {
        txt = "未投票";
        console.log("put Begin");
        let old = $("textarea[name='targetSuper']").val();
        var txt = old + this.targetSuper[i][0] + "," + txt + "\r\n";
        $("textarea[name='targetSuper']").val(txt);
        sum++;
      };
    };
    if (type == 1){
      txt = "第  " + missionId + "号任务 共计有： " + sum.toString() + " 个超级节点未完成投票";
    }else {
      txt = "第  " + missionId + "号任务 共计有： " + sum.toString() + " 个节点未完成投票";
    }

    let old = $("textarea[name='targetSuper']").val();
    var txt = old + txt + "\r\n";
    $("textarea[name='targetSuper']").val(txt);




  },

  getNodesVotedNum:async function(){
    const { web3 } = this;
    const { getMission2 } = this.meta.methods;
    const nodeVotedNum = document.getElementsByClassName("nodeVotedNum")[0];
    const superVotedNum = document.getElementsByClassName("superVotedNum")[0];
    var knodeVotedNum = await getMission2(5).call();
    console.log(knodeVotedNum);
    nodeVotedNum.innerHTML = knodeVotedNum[0].toString();
    superVotedNum.innerHTML = knodeVotedNum[2].toString();
  },
  findWho:async function(address){
    const { web3 } = this;
    console.log("events begin");
    this.meta.getPastEvents('Transfer', {
        filter: {to: address},
        fromBlock: 9144560,
        toBlock: 'latest'
        }, (error, events) => {
          console.log(events);
        }
      );
  },

  queryCore:async function(){
    const { web3 } = this;
    const { queryCore } = this.metacore.methods;
    let addr1 = "";
    let addr2 = "0xd3437FF6aAE773d500aa7fB8A60E158621172A6b";
    let addr3 = "0x6A689cE4AeC0b8064DB29cEBe4b33Ee65ED5e39b";
    var result = await queryCore(addr2).call();
    console.log("addr is :" + addr2);
    console.log(result);

    result = await queryCore(addr3).call();
    console.log("addr is :" + addr3);
    console.log(result);

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
      this.metacore = new web3.eth.Contract(
        kolcoreteam.abi,
        "0x40F03D575Dd6ad846de86A12cdA20eCAFDBe59Bd",
      );
      this.metausdt = new web3.eth.Contract(
        usdt.abi,
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
      );
      // this.metabulk = new web3.eth.Contract(
      //   bulk_artifacts,
      //   "0xd1917932A7Db6Af687B523D5Db5d7f5c2734763F",
      // );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      this.getMission();
      this.refreshBalance();
      this.getNodesVotedNum();

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    };

    console.log("finished");
    this.queryCore();

  },
  setNode:async function(type){
    this.setStatus("设置节点任务进行中... (请稍等)");
    const { setNode } = this.meta.methods;
    const { setSuperNode } = this.meta.methods;
    let address = $("input[name='NODE']").val();
    console.log(address);
    if (type == 2){
      await setNode(address).send({ from: this.account});
      this.setStatus("节点设置完毕");
    }else {
      await setSuperNode(address).send({ from: this.account});
      this.setStatus("超级节点设置完毕");
    }
  },

  createMission: async function(){
    this.setStatus("任务发起进行中......");
    const { web3 } = this;
    const { createKolMission } = this.meta.methods;
    let type = $('input:radio:checked').val();
    let nameo = $("input[name='MissionName']").val();
    let _name = web3.utils.fromAscii(nameo);
    let totalAmount = $("input[name='TotalAmount']").val();
    let _totalAmount = web3.utils.toWei(totalAmount,'ether');
    let oldAddr = $("input[name='OldNode']").val();
    let newAddr = $("input[name='NewNode']").val();
    console.log(nameo);
    console.log(oldAddr);
    console.log(newAddr);
    await createKolMission(type,_name,_totalAmount,oldAddr,newAddr).send({ from: this.account });
    this.setStatus("任务发起完毕!");
  },

  voteKol: async function(type){
    this.setStatus("投票任务执行进行中......");
    let missionId = $("input[name='MissionId']").val();
    let agree = ( $("input[name='Agree']").val());
    const { voteMission } = this.meta.methods;
    await voteMission(type,missionId,agree).send({from: this.account});
    this.setStatus("投票完毕！");

  },
  addOffering: async function(){
    this.setStatus("增加名单进行中");
    const { web3 } = this;
    const { addKolOffering } = this.meta.methods;
    let missionId = $("input[name='MissionId']").val();
    let target = $("input[name='target']").val();
    let _targetAmount = $("input[name='target']").val();
    let targetAmount = web3.utils.toWei(_targetAmount,'ether');
    await addKolOffering(missionId,target,targetAmount).send({ from: this.account });
    this.setStatus("名单提交完毕");
  },
  excute: async function(){
    this.setStatus("任务开始执行......");
    let missionId = $("input[name='excuteMissionId']").val();
    const { excuteVote } = this.meta.methods;
    await excuteVote(missionId).send({ from: this.account });
    this.setStatus("任务执行完毕！");
  },

  refreshBalance: async function() {
    const { web3 } = this;
    const { balanceOf } = this.meta.methods;
    const { querySuperNode } = this.meta.methods;
    const { queryNode } = this.meta.methods;
    var balance = await balanceOf(this.account).call();
    balance = web3.utils.fromWei(balance,"ether");
    const supernode = await querySuperNode(this.account).call();
    const node = await queryNode(this.account).call();
    const myAddress = this.account;

    const addrElement = document.getElementsByClassName("myAddress")[0];
    const balanceElement = document.getElementsByClassName("balance")[0];
    const supernodeElement = document.getElementsByClassName("supernode")[0];
    const nodeElement = document.getElementsByClassName("node")[0];

    balanceElement.innerHTML = balance;
    supernodeElement.innerHTML = supernode;
    nodeElement.innerHTML = node;
    addrElement.innerHTML = myAddress;


  },

  sendCoin: async function() {
    this.setStatus("交易进行中... (请稍等)");
    const { web3 } = this;
    const amount = document.getElementById("amount").value;
    const receiver = document.getElementById("receiver").value;
    const { transfer } = this.meta.methods;
    await transfer(receiver, web3.utils.toWei(amount,'ether')).send({ from: this.account });
    this.setStatus("交易完毕!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  loadProcessedList:function(){
    var duplicates = [];

    var lines = fs.readFileSync(processedListFile, 'utf-8')
        .split('\n')
        .filter(Boolean);

    lines.forEach(function(line){

        var trimLine = line.trim().toLowerCase();

        if(typeof(processedList[trimLine]) !== 'undefined')
        {
            duplicates.push(trimLine);
        }

        processedList[trimLine] = 1;
    });

    console.log("Duplicates in proccessed list: ");
    console.log(duplicates);
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
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
