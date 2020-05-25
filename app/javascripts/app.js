import Web3 from "web3";
import Cookies from 'js-cookie';
import KOLA from '../../build/contracts/KOLADUSER.min.json';
import KOLVote from '../../build/contracts/StandardToken.min.json';

const App = {
  web3: null,
  account: null,
  metaA: null,
  metaK:null,

  //线上环境
  kaddr: "0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69",
  aaddr: "0x6f9E56FD2DB80ba69C29a004576B59f088290255",
  //ROPSTEN网络环境
  // kaddr: "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",
  // aaddr: "0x5aDA52E9D4196B02E738132e50D9B8a0Ae968b6A",
  //本地测试环境
  // kaddr: "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",
  // aaddr: "0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2",
  // newUser: false,
  load: null,
  //变量都设置在这里好了。

  kolBalance:0,
  ethBalance:0,
  userLevel:0,
  totalBonus:0,

  childs:0,
  teamNum:0,
  maxDeep:0,
  iCode:0,
  inviteCode:0,
  totaldraws:0,
  canDrawAmount:0,
  childsList:null,
  level:1,

  setInput: function(){
    $("input[name='addr']").val(this.account);
    $("input[name='kolBalance']").val(this.kolBalance);
    $("input[name='ethBalance']").val(this.ethBalance);

    $("input[name='userLevel']").val(this.userLevel);
    $("input[name='userLevel2']").val(this.userLevel);

    $("input[name='totalBonus']").val(this.totalBonus);
    $("input[name='childs']").val(this.childs);
    $("input[name='teamNum']").val(this.teamNum);

    $("input[name='maxDeep']").val(this.maxDeep);
    $("input[name='totaldraws']").val(this.totaldraws);
    $("input[name='canDrawAmount']").val(this.canDrawAmount);

    $("input[name='iCode']").val(this.iCode);

    var url = "https://ad.kols.club/?iCode=" + this.iCode;
    $('#qrcode').html('').qrcode({
                        text: url});

  },
  formatDecimal: function(num, decimal) {
    num = num.toString();
    var index = num.indexOf('.');
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1);
    } else {
      num = num.substring(0);
    }
    return parseFloat(num).toFixed(decimal);
  },
  dateFtt: function(dd,current){ //author: meizz
     dd = dd +"000";
     var fmt = "yyyy-MM-dd hh:mm:ss";
     var date
     if (current == 0){
       date = new Date();
     }else{
       date = new Date(parseInt(dd));
     }
     var o = {
     "M+" : date.getMonth()+1,     //月份
     "d+" : date.getDate(),     //日
     "h+" : date.getHours(),     //小时
     "m+" : date.getMinutes(),     //分
     "s+" : date.getSeconds(),     //秒
     "q+" : Math.floor((date.getMonth()+3)/3), //季度
     "S" : date.getMilliseconds()    //毫秒
     };
     if(/(y+)/.test(fmt))
     fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
     for(var k in o)
     if(new RegExp("("+ k +")").test(fmt))
     fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
     return fmt;
  },
  getGasPrice: async function(){
    const { web3 } = this;
    var BN = web3.utils.BN;
    let gasPrice = await web3.eth.getGasPrice();
    let addGas = 10**9;
    let newGas = new BN(gasPrice).add(new BN(addGas)).toString();
    return newGas;
  },
  addGasLimit: function(gas){
    const { web3 } = this;
    var BN = web3.utils.BN;
    let addGas = 100000;
    let newGas = new BN(gas).add(new BN(addGas)).toString();
    let maxGas = 6000000;
    if (maxGas.cmp(newGas) === -1){
      return maxGas;
    }else{
      return newGas;
    }
  },
  setJoinBtn: function(btnTxt){
    var joinBtn = document.getElementById("Join");
    joinBtn.innerHTML = btnTxt;
  },
  setRegBtn: function(btnTxt){
    var joinBtn = document.getElementById("Register");
    joinBtn.innerHTML = btnTxt;
  },
  setMsg: function(msg){
    var msgDiv = document.getElementById("msg");
    if (msg == "none"){
      msgDiv.style = "display:none";
    }else{
      msgDiv.innerHTML = msg;
      msgDiv.style = "background-color:#28103B;color:#EFC638;font-size:20px";
    }
  },
  setChildsList:async function(address){
    console.log("address:");
    console.log(address);
    if (address == this.account){
      this.level = 1;
    }else{
      this.level++;
    }
    if (this.level == 10){
      this.level = 1;
      address = this.account;
    }
    if (address == "无"){

    }else{
      const { web3 } = this;
      const { ChildAddrs } = this.metaA.methods;
      const { getChildsLen } = this.metaA.methods;
      const { UserLevel } = this.metaA.methods;
      var childsLen = await getChildsLen(address).call();
      console.log(childsLen);
      this.childsList = this.setHeadDiv(this.level);
      if(childsLen > 0){
        for (var i = 0; i<childsLen; i++){
          let child = await ChildAddrs(address,i).call();
          let userLevel = await UserLevel(child).call();
          this.childsList += this.setDiv(child,userLevel);
        }
      }else{
        this.childsList = this.setHeadDiv(this.level);
        this.childsList += this.setDiv(this.account,"下面没有了");
        console.log("meiyou?");
        // this.setDiv("无","无");
      }
    }

    this.childsList += this.setBottomDiv();
    var childs = document.getElementById("childs");
    childs.innerHTML = this.childsList;
    window.scrollTo({
      top: 3000,
      behavior: "smooth"
    });
  },
  setHeadDiv: function(level){
    var div =
        '<div class="weui-cells__title">'
        +level
        +'代下级清单 地址：级别：</div>'
        +'<div class="weui-cells">'
    return div
  },
  setBottomDiv: function(){
    var div = '</div>';
    return div
  },
  setDiv:function(address,userLevel){
    console.log("in set Div:"+address);
    var div =
        '<a class="weui-cell weui-cell_access" href="javascript:App.setChildsList(\''
        +address
        +'\');">'
        +'<div class="weui-cell__bd"><p>'
        +'0x***'+address.substring(36)
        +'</p></div>'
        +userLevel
        +'<div class="weui-cell__ft">'
        +'</div></a>';
    return div
  },
  start: async function() {
    this.load = weui.loading("连接以太坊网络V1.0525");
    const { web3 } = this;
    try {
      this.metaK = new web3.eth.Contract(
        KOLVote.abi,
        this.kaddr,
      );
      this.metaA = new web3.eth.Contract(
        KOLA.abi,
        this.aaddr,
      );
      let accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      this.inviteCode = this.GetQueryValue("iCode");
      if (this.inviteCode == null) this.inviteCode = 0;
      await this.loadBalance();
      var cookiejoinAll = Cookies.get('joinAll');
      if (cookiejoinAll == "yes"){
        console.log(document.getElementById("joinAll").checked);
        document.getElementById("joinAll").checked = true;
        document.getElementById("joinAllTitle").innerHTML = "捐赠500KOL成为金牌代理商";
        this.joinAll = true;
      }else{
        document.getElementById("joinAllTitle").innerHTML = "捐赠100KOL获链上终身会员";
        this.joinAll = false;
      }
      $("input[name='iCodeRegister']").val(this.inviteCode);
      await this.firstInitial();


      this.load.hide();
      weui.toast('以太坊连接成功V1.0525',2000);
    } catch (error) {
      this.load.hide();
      weui.topTips(error);
      weui.toast('发生错误的版本号：V1.0525',5000);
    };
    console.log("finished");
  },

  firstInitial: async function(){
    const { web3 } = this;
    const { RInviteCode } = this.metaA.methods;
    this.iCode = await RInviteCode(this.account).call();
    if (this.iCode == 0){
      //首次注册
      var allowed = await this.checkAllowed();
      if(allowed > 0){
        this.setJoinBtn("升级");
        this.setRegBtn("注册");
      }else{
        weui.topTips('首次参与前需要先进行合约授权');
        this.setJoinBtn("首次授权");
        this.setRegBtn("授权");
      }

      document.getElementById("firstRegister").style.display="block";
      document.getElementById("firstHide").style.display="none";
      document.getElementById("joindrawpanel").style.display="none";
    }else{
      this.load = weui.loading('数据加载进行中...');
      this.loadData();
      this.load.hide();
      document.getElementById("firstRegister").style.display="none";
    }
  },
  loadBalance: async function(){
    const { web3 } = this;
    const { balanceOf } = this.metaK.methods;
    this.setInput();
    this.kolBalance = await balanceOf(this.account).call();
    if (this.kolBalance != 0){
      this.kolBalance = web3.utils.fromWei(this.kolBalance,"ether");
      this.kolBalance = this.formatDecimal(this.kolBalance,2);
    }
    this.setInput();
    this.ethBalance = await web3.eth.getBalance(this.account);
    if (this.ethBalance != 0){
      this.ethBalance = web3.utils.fromWei(this.ethBalance,"ether");
      this.ethBalance = this.formatDecimal(this.ethBalance,5);
    }
    this.setInput();
  },
  loadDashBoard: async function(){
    const { web3 } = this;
    const { UserLevel } = this.metaA.methods;
    const { UserBalance } = this.metaA.methods;
    const { UserDrawedBalance } = this.metaA.methods;
    const { getChildsLen } = this.metaA.methods;
    const { TotalUsers } = this.metaA.methods;
    const { maxDeep } = this.metaA.methods;

    this.userLevel = await UserLevel(this.account).call();

    this.canDrawAmount = await UserBalance(this.account).call();
    if(this.canDrawAmount!=0){
      this.canDrawAmount = web3.utils.fromWei(this.canDrawAmount,"ether");
    }
    this.totaldraws = await UserDrawedBalance(this.account).call();
    if(this.totaldraws!=0){
      this.totaldraws = web3.utils.fromWei(this.totaldraws,"ether");
    }
    this.totalBonus = parseFloat(this.canDrawAmount) + parseFloat(this.totaldraws);

    this.totalBonus = this.formatDecimal(this.totalBonus,2);
    this.totaldraws = this.formatDecimal(this.totaldraws,2);
    this.canDrawAmount = this.formatDecimal(this.canDrawAmount,2);

    this.childs = await getChildsLen(this.account).call();
    this.teamNum = await TotalUsers(this.account).call();
    this.maxDeep = await maxDeep(this.account).call();
    this.setInput();
  },

  loadData: async function(){
    const { web3 } = this;
    this.setMsg("提取链上数据进行中...");

    // this.setMsg("广告位招租未完待续...");
    await this.loadDashBoard();
    this.setMsg("马上就好...");
    var allowed = await this.checkAllowed();
    if(this.userLevel < 9){
      if(allowed > 0){
        this.setJoinBtn("升级");
        this.setRegBtn("注册");
      }else{
        weui.topTips('首次参与前需要先进行合约授权');
        this.setJoinBtn("首次授权");
        this.setRegBtn("授权");
      }
    }else{
        this.setJoinBtn("已升级到最高级别");
    }

    this.setMsg("none");
  },
  go: async function(){
    const { web3 } = this;
    const { go } = this.metaA.methods;
    const { InviteCode } = this.metaA.methods;
    this.inviteCode = $("input[name='iCodeRegister']").val();
    this.joinAll=document.getElementById("joinAll").checked;
    if ((this.userLevel == 0) && (this.inviteCode ==0)){
      weui.topTips('邀请码错误');
      return;
    }
    if (this.iCode == 0){
      var address = await InviteCode(this.inviteCode).call();
      if (address == 0){
        weui.topTips('邀请码错误');
        return;
      }
      this.load = weui.loading('链上注册进行中...');
      Cookies.set('operation', "register");
    }else{
      this.load = weui.loading('链上升级进行中...');
    }
    let gasPrice = await this.getGasPrice();
    var gaslimit;
    try{
      gaslimit = await go(this.inviteCode,this.joinAll).estimateGas();
      gaslimit = this.addGasLimit(gaslimit);
    }catch(e){
      gaslimit = 1000000;
    }
    let txFee = web3.utils.toWei("0.002","ether");
    console.log("this.inviteCode: "+this.inviteCode);
    let tran = await go(this.inviteCode,this.joinAll).send({from:this.account,
                                gasPrice:gasPrice,
                                value:txFee,
                                gas:gaslimit});

    this.load.hide();
    Cookies.set('status', "pending");
    Cookies.set('tx', tran.transactionHash);
    weui.topTips('交易已确认');
    location.reload();
  },
  checkAllowed: async function(){
    const { web3 } = this;
    const { allowance } = this.metaK.methods;
    let allowed = await allowance(this.account,this.aaddr).call();
    if (allowed != 0){
      allowed = web3.utils.fromWei(allowed,"ether");
      return allowed;
    }else
      return 0;
  },
  approve: async function(){
    const { web3 } = this;
    const { approve } = this.metaK.methods;
    let approveAmount = web3.utils.toWei("500","ether");
    let gasPrice = await this.getGasPrice();
    this.loading = weui.loading('链上授权进行中...');
    try
    {
      let tran = await approve(this.aaddr,approveAmount).send({from: this.account,
                                                       gasPrice:gasPrice,
                                                       gas:60000});

      this.loading.hide();
      weui.topTips('继续下一步注册完成操作！');
      location.reload();
    }catch(error){
      this.loading.hide();
      weui.topTips('交易出现异常，请稍后重试');
    }
  },
  balanceCheck: function(){
    if(this.userLevel == 0){
      if (this.joinAll == true){
        if (Number(this.kolBalance) < 500){
          weui.topTips('KOL余额不足500！');
          return false;
        }
      }else if(Number(this.kolBalance) < 100){
        weui.topTips('KOL余额不足100！');
        return false;
      }
    }else{
      if(Number(this.kolBalance) < 50){
        weui.topTips('KOL余额不足50！');
        return false;
      }
    }
    return true;
  },
  ethBCheck:async function(gasLimit){
    const { web3 } = this;
    var BN = web3.utils.BN;
    if(gasLimit == 0) gasLimit = 1000000;
    let gasPrice = await web3.eth.getGasPrice();
    let result = new BN(gasPrice).mul(new BN(gasLimit));
    if (result !=0){
      result = web3.utils.fromWei(result,"ether");
    }
    result = parseFloat(result)+0.003;
    result = NP.strip(result);
    console.log("result "+result);
    if (parseFloat(this.ethBalance)>parseFloat(result)){
      return true;
    }else{
      weui.topTips('ETH余额不足，预估需要'+result+' ether');
      return false;
    }
    return result;
  },
 regClick: async function(){
   if(this.balanceCheck()){
     var allowed = await this.checkAllowed();
     if (this.userLevel == 9){
       weui.topTips('您已是最高级别');
       return;
     }else{

       if (Number(allowed) > 0){
         if (await this.ethBCheck(1000000)){
           await this.go();
         }
       }else{
         if (await this.ethBCheck(60000)){
           await this.approve();
         }
       }
     }
   };

 },
 drawKol: async function(){
      const { web3 } = this;
      const { drawKol } = this.metaA.methods;

      let gasPrice = await this.getGasPrice();
      var gaslimit;
      try{
        gaslimit = await drawKol(allbonus).estimateGas();
        gaslimit = this.addGasLimit(gaslimit);
      }catch(e){
        console.log("gas 计算错误");
        gaslimit = 1500000;
      }
      var loading = weui.loading('链上提现进行中...');
      let txFee = web3.utils.toWei("0.005","ether");
      try
      {
        let tran = await drawKol().send({from: this.account,
                                         gasPrice:gasPrice,
                                         value:txFee,
                                         gas:gaslimit});
        loading.hide();
        weui.topTips('交易已确认');
        location.reload();
      }catch(error){
        weui.topTips('交易出现异常，请稍后重试');
      }
 },
 sleep: async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
},
checkTx: async function(tx){
    const { web3 } = this;
    try{
      if (tx.length == 66){
        let result = await web3.eth.getTransaction(tx);
        let blockNumber = result.blockNumber;
        if (blockNumber > 0){
          Cookies.set('status', "finished");
          return "finished";
        }else{
          Cookies.set('status', "pending");
          return "pending";
        }
      }else{
        Cookies.set('status', "error");
        return "error";
      }

    }catch(e){
      console.log("error");
      Cookies.set('status', "error");
      console.log(e);
    }

},
GetQueryValue: function(queryName) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
     for (var i = 0; i < vars.length; i++) {
         var pair = vars[i].split("=");
         if (pair[0] == queryName) { return pair[1]; }
     }
     return null;
 },
 invite: function(){
   document.getElementById("qr").style.display="block";
 },
 getCookie: function(name){
   return Cookies.get(name);
 },
 setCookie: function(name,content){
   Cookies.set(name, content);
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
