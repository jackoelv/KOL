import "../stylesheets/app.css";

import Web3 from "web3";
import kolvote_artifacts from '../../build/contracts/KOLVote.json';

const App = {
  web3: null,
  account: null,
  meta: null,

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

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
  setNode:async function(type){
    const { setNode } = this.meta.methods;
    const { setSuperNode } = this.meta.methods;
    let address = $("input[name='NODE']").val();
    if (type == 2){
      await setNode(address).send({ from: this.account });
    }else {
      await setSuperNode(address).send({ from: this.account });
    }
  },

  createMission: async function(){
    const { web3 } = this;
    const { createKolMission } = this.meta.methods;
    this.setStatus("MISS CREATING......");

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
    this.setStatus("MISSION COMPLETED!");
  },

  voteKol: async function(type){
    let missionId = $("input[name='MissionId']").val();
    let agree = ( $("input[name='Agree']").val());
    const { voteMission } = this.meta.methods;
    console.log(type);
    console.log(missionId);
    console.log(agree);
    await voteMission(type,missionId,agree).send({from: this.account});

  },
  addOffering: async function(){
    const { web3 } = this;
    const { addKolOffering } = this.meta.methods;
    let missionId = $("input[name='MissionId']").val();
    let target = $("input[name='target']").val();
    let _targetAmount = $("input[name='target']").val();
    let targetAmount = web3.utils.toWei(_targetAmount,'ether');
    console.log(missionId);
    console.log(target);
    console.log(targetAmount);
    await addKolOffering(missionId,target,targetAmount).send({ from: this.account });
  },
  excute: async function(){
    let missionId = $("input[name='excuteMissionId']").val();
    const { excuteVote } = this.meta.methods;
    await excuteVote(missionId).send({ from: this.account });
  },

  refreshBalance: async function() {
    const { web3 } = this;
    const { balanceOf } = this.meta.methods;
    const { querySuperNode } = this.meta.methods;
    const { queryNode } = this.meta.methods;
    const balance = await balanceOf(this.account).call();
    const supernode = await querySuperNode(this.account).call();
    const node = await queryNode(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    const supernodeElement = document.getElementsByClassName("supernode")[0];
    const nodeElement = document.getElementsByClassName("node")[0];

    balanceElement.innerHTML = balance;
    supernodeElement.innerHTML = supernode;
    nodeElement.innerHTML = node;


  },

  sendCoin: async function() {
    // console.log(web3);
    const { web3 } = this;
    const amount = document.getElementById("amount").value;
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { transfer } = this.meta.methods;

    await transfer(receiver, web3.utils.toWei(amount,'ether')).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    console.log("load kao");
    console.log(App.web3.version);
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
