
import Web3 from "web3";
import lockNode_artifacts from '../../build/contracts/KOLLockNode.json';
import kolvote_artifacts from '../../build/contracts/KOLVote.json';

const App = {
  web3: null,
  // accounts:null,
  account: null,
  // accountLength:0,
  // currentAccount:0,
  metaLock:null,
  meta: null,
  // metabulk:null,
  processedList: null,
  processedList:null,
  targets:new Array(),
  eventsNum:new Array(),
  targetAddr:new Array(),
  targetSuper:new Array(),
  missionId:null,



  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      this.metaLock = new web3.eth.Contract(
        lockNode_artifacts.abi,
        "0x0017a04A2E182376235530D501Bc3Fbe7CA07a5b",
      );
      this.meta = new web3.eth.Contract(
        kolvote_artifacts.abi,
        "0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69",
      );
      const { missionId } = this.metaLock.methods;
      let accounts = await web3.eth.getAccounts();

      let missionID = parseInt(await missionId().call());

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


  voteKol: async function(type){
    const { web3 } = this;
    this.setStatus("上链中，耐心等待窗口弹出......");
    let missionId = $("input[name='MissionId']").val();
    // let agree = ( $("input[name='Agree']").val());
    let agree = $('input:radio:checked').val();
    let price = await web3.eth.getGasPrice();
    // let addPrice = 3 * 10 ** 9;
    // var BN = web3.utils.BN;
    // let price = new BN(gasPrice).add(new BN(addPrice)).toString();

    // let price = new BN(gasPrice);

    const { voteMission } = this.metaLock.methods;
    try
    {
        await voteMission(type,missionId,agree).send({from: this.account,
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
    const { querySuperNode } = this.meta.methods;
    const { queryNode } = this.meta.methods;
    const { voted } = this.metaLock.methods;



    // console.log("2");

    var ethBalance = await web3.eth.getBalance(this.account);
    ethBalance = web3.utils.fromWei(ethBalance,"ether");

    // console.log("3");
    const supernode = await querySuperNode(this.account).call();
    const node = await queryNode(this.account).call();
    const votedresult = await voted(this.account,currentMissionId).call();
    // console.log("4");

    const ethBalanceElement = document.getElementsByClassName("ethBalance")[0];
    const supernodeElement = document.getElementsByClassName("supernode")[0];
    const nodeElement = document.getElementsByClassName("node")[0];
    const votedElement = document.getElementsByClassName("voted")[0];
    // console.log("5");

    ethBalanceElement.innerHTML = ethBalance;

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

    // addrElement.innerHTML = myAddress;
    // console.log("6");
    // this.getNodesVotedNum(0);//测试临时用一下
    this.getNodesVotedNum(currentMissionId);
    console.log("7");

  },
  getNodesVotedNum:async function(currentMissionId){
    const { web3 } = this;
    const { getMission1 } = this.metaLock.methods;
    const { getMission2 } = this.metaLock.methods;
    const { getOfferings } = this.metaLock.methods;
    const { queryBalance } = this.metaLock.methods;


    console.log("11");
    const nodeVotedNum = document.getElementsByClassName("nodeVotedNum")[0];
    const superVotedNum = document.getElementsByClassName("superVotedNum")[0];
    const missionid =     document.getElementsByClassName("missionid")[0];
    const missionName =   document.getElementsByClassName("missionName")[0];
    const missionEndTime =  document.getElementsByClassName("missionEndTime")[0];
    const missionAmount = document.getElementsByClassName("missionAmount")[0];

    const nodeRate = document.getElementsByClassName("nodeRate")[0];
    console.log("12");
    var misstionDetail = await getMission1(currentMissionId).call();
    var knodeVotedNum = await getMission2(currentMissionId).call();
    console.log("13");
    nodeRate.innerHTML = misstionDetail[4].toString();
    let amount = 0;
    console.log(misstionDetail);
    try {
      amount = web3.utils.fromWei(misstionDetail[2],"ether");
      console.log(amount);
      console.log("yes?");
    } catch (e) {
      amount = 0;
      console.log(e);
      console.log("no?");
    } finally {

    }


    missionAmount.innerHTML = amount + " KOL";

    // console.log("1");
    console.log(this.account);
    try {
      console.log("kao 11");
      var bothbalance = await queryBalance(this.account).call({from:this.account});
      console.log("kao");

      console.log(bothbalance);
      var balance = web3.utils.fromWei(bothbalance[0],"ether");
      var releasedKOL = web3.utils.fromWei(bothbalance[1],"ether");
      var freeBalance = Number(balance) * Number(misstionDetail[4]) / 100 - Number(releasedKOL);
    } catch (e) {
      console.log("no");
      console.log(e);
      balance = 0;
      releasedKOL = 0;
      freeBalance = 0;
    } finally {

    }
    const balanceElement = document.getElementsByClassName("balance")[0];
    const freeBalanceElement = document.getElementsByClassName("freeBalance")[0];
    const releasedKOLElement = document.getElementsByClassName("releasedKOL")[0];

    balanceElement.innerHTML = balance;
    freeBalanceElement.innerHTML = freeBalance;
    releasedKOLElement.innerHTML = releasedKOL;


    // try{
    //   var offering = await getOfferings(currentMissionId,0).call();
    //   var offeringLength = parseInt(offering[2]);
    //   if (offeringLength == 1) {
    //     let offeringAmount = web3.utils.fromWei(offering[1]);
    //     missionAddress.innerHTML = offering[0] ;
    //     offerAmount.innerHTML = offeringAmount + " KOL";
    //   }else {
    //
    //   }
    // }catch(e){
    //   console.log("error is: "+e);
    //   missionAddress.innerHTML = "无有效名单数据";
    //   offerAmount.innerHTML = "无有效名单数据";
    // }
    nodeVotedNum.innerHTML = knodeVotedNum[0].toString();
    superVotedNum.innerHTML = knodeVotedNum[2].toString();
    missionid.innerHTML = currentMissionId;
    missionName.innerHTML = web3.utils.hexToAscii(misstionDetail[5]);

    var time = misstionDetail[1];
    var unixTimestamp = new Date(time*1000);
    missionEndTime.innerHTML = unixTimestamp.toLocaleString();
    console.log("14");


    const buttonDetail = document.getElementsByClassName("getDetail")[0];
    buttonDetail.innerHTML = "查询已完成";
    if (freeBalance > 0) {
      this.displayHideRleaseBtn(true);
    }else {
      this.displayHideRleaseBtn(false);
    }



  },

  getKOL:async function(){
    const { web3 } = this;
    this.setStatus("上链中，耐心等待窗口弹出......");
    let price = await web3.eth.getGasPrice();
    const { getKOL } = this.metaLock.methods;

    try
    {
        await getKOL().send({from: this.account,
                                  gasPrice:price,
                                  gas:300000});
        this.setStatus("释放成功！");
    }catch(error){
        this.setStatus("释放异常，稍后检查确认一下是否已成功");
    }


  },
  displayHideRleaseBtn:function(show){
    var releaseBtn =document.getElementById("releaseBtn");
    if (show) {
      releaseBtn.style.display="";
    }else {
      releaseBtn.style.display="none";
    }

  },


  initial:function(){
    const addrElement = document.getElementsByClassName("myAddress")[0];
    const myAddress = this.account;
    addrElement.innerHTML = myAddress;

  },
  // changeWallet:function(){
  //   console.log(this.accountLength);
  //   if(this.accountLength == this.currentAccount + 1 )
  //     this.currentAccount = 0;
  //   else {
  //     this.currentAccount++;
  //   }
  //   this.account = this.accounts[this.currentAccount];
  //   this.initial();
  // },

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
