import Web3 from "web3";
import Cookies from 'js-cookie';
import KOLPro from '../../build/contracts/KOLPro.min.json';
import KOLWithDraw from '../../build/contracts/KOLWithDraw.min.json';
import KOLVote from '../../build/contracts/StandardToken.min.json';

const App = {
  web3: null,
  account: null,
  metaP: null,
  metaD: null,
  metaK:null,

  //线上环境
  kaddr: "0x0946e36C2887025c389EF85Ea5f9150E0BEd4D69",
  paddr: "0xbC664C8ECadbB9311325537DfA4609F877E04Ab6",
  daddr: "0x9190d289E7054DaB91a2F5Ed77a7d57fE8381Def",
  //ROPSTEN网络环境
  // kaddr: "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",
  // paddr: "0x294fEA742612eaDe03bA840c8dC98c32DAb5C9d2",
  // daddr: "0x6eC655cE7fc364D27Bb046627f37520A76775ed3",
  //本地测试环境
  // kaddr: "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",
  // paddr: "0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2",
  // daddr: "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
  // newUser: false,
  load: null,
  canDraw:false,
  //变量都设置在这里好了。

  lBonus:0,

  balance:0,
  ethBalance:0,
  current:0,
  lastingDays:0,

  lock:0,
  bonus:0,
  self:0,
  invite:0,
  team:0,

  childs:0,
  teamusers:0,
  teamamount:0,
  level:0,

  ucflag:"币本位",
  iCode:0,
  totaldraws:0,



  setInput: function(){
    $("input[name='addr']").val(this.account);
    $("input[name='balance']").val(this.balance);
    $("input[name='ethBalance']").val(this.ethBalance);
    $("input[name='lock']").val(this.lock);

    $("input[name='bonus']").val(this.bonus);


    $("input[name='self']").val(this.self);
    $("input[name='invite']").val(this.invite);
    $("input[name='team']").val(this.team);

    $("input[name='childs']").val(this.childs);
    $("input[name='teamusers']").val(this.teamusers);
    $("input[name='teamamount']").val(this.teamamount);
    $("input[name='level']").val(this.level);
    $("input[name='iCode']").val(this.iCode);
    $("input[name='totaldraws']").val(this.totaldraws);

    $("input[name='current']").val(this.current);

    $("input[name='lastingDays']").val(this.lastingDays+" 天");



    $("input[name='ucflag']").val(this.ucflag);

    var lb = document.getElementById("leftBonus");
    lb.innerHTML = "总奖池："+ this.lBonus + " KOL";
    var url = "https://b.kols.club/?iCode=" + this.iCode;
    $('#qrcode').html('').qrcode({
                        text: url});

    if (this.lock==0){
      document.getElementById("uc").style.display="none";
      document.getElementById("ucfirst").style.display="block";
    }else{
      document.getElementById("uc").style.display="block";
      document.getElementById("ucfirst").style.display="none";
    }
  },
  diff: function(a,b){
    var every = 86400;
    var begin =1589126400;
    var aNum=parseInt(a);
    var bNum=parseInt(b);
    var extra = (aNum-begin)% every;
    var aNight= aNum-extra;

    extra = (bNum-begin)% every;
    var bNight=bNum -extra;
    return ((bNight-aNight)/every);
  },
  formatDecimal: function(num, decimal) {
    num = num.toString();
    var index = num.indexOf('.');
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1);
      console.log(decimal + index + 1);
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
    console.log("newGas is:" +newGas);
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
  setMsg: function(msg){
    var msgDiv = document.getElementById("msg");
    if (msg == "none"){
      msgDiv.style = "display:none";
    }else{
      msgDiv.innerHTML = msg;
      msgDiv.style = "background-color:#7A2D59;color:rgb(255, 255, 255);font-size:20px";
    }
  },

  start: async function() {
    this.load = weui.loading("连接以太坊网络");
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

      await this.firstInitial();
      var iCode = this.GetQueryValue("iCode");
      $("input[name='iCodeRegister']").val(iCode);

      this.load.hide();
      weui.toast('以太坊连接成功',1000);
    } catch (error) {
      this.load.hide();
      weui.topTips(error);
      weui.toast('版本号V2.0.0516',1000);
      console.log("error? : " +error);
    };
    console.log("finished");
  },

  firstInitial: async function(){
    const { web3 } = this;
    const { RInviteCode } = this.metaP.methods;
    this.iCode = await RInviteCode(this.account).call();
    if (this.iCode == 0){
      //首次注册
      var tx = Cookies.get('txHash');
      var operation = Cookies.get('operation');

      if (operation == "register"){
        let registerResult = checkTx(tx);
        if (registerResult == "pending"){
          this.load = weui.loading('链上注册进行中...');
          this.iCode = "链上注册进行中...";
          this.loadData();
          this.load.hide();
        }
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
    this.balance = await balanceOf(this.account).call();
    if (this.balance != 0){
      this.balance = web3.utils.fromWei(this.balance,"ether");
      this.balance = formatDecimal(this.balance,2);
    }
    this.setInput();
    this.ethBalance = await web3.eth.getBalance(this.account);
    if (this.ethBalance != 0){
      this.ethBalance = web3.utils.fromWei(this.ethBalance,"ether");
      this.ethBalance = formatDecimal(this.ethBalance,5);
    }
    this.setInput();
  },
  loadTop: async function(){
    const { web3 } = this;
    const { leftBonus } = this.metaD.methods;
    const { LockHistory } = this.metaP.methods;
    const { getLockLen } = this.metaP.methods;

    var time = new Date();
    var unixTime = time.getTime();
    unixTime = Math.round(unixTime / 1000);
    this.current = this.dateFtt(unixTime,1);
    var first;
    this.lBonus = await leftBonus().call();
    if (this.lBonus!=0){
      this.lBonus = web3.utils.fromWei(this.lBonus,"ether");
      this.lBonus = formatDecimal(this.lBonus,2);

    }
    try{
      const { DrawTime } = this.metaD.methods;
      let drawTime = await DrawTime(this.account).call();
      if (drawTime == 0){
        let len = await getLockLen(this.account).call();
        if (len > 0){
          first = await LockHistory(this.account,0).call();
          first = first[0];
          console.log("Locking Time is: " +this.dateFtt(first,1));
        }else{
          first = unixTime;
        }
      }else{
        console.log("Draw Time is: " +this.dateFtt(drawTime,1));
        first = drawTime;
      }
      this.lastingDays = this.diff(first,unixTime);
      first = this.dateFtt(first,1);
    }catch(e){
      // this.lastingDays = 0;
      console.log(e);
    };
    this.setInput();

  },
  loadDashBoard: async function(){
    const { web3 } = this;
    const { LockBalance } = this.metaP.methods;
    const { calcuAllBonus } = this.metaD.methods;
    const { querySelfBonus } = this.metaD.methods;
    const { queryInviteBonus } = this.metaD.methods;
    const { queryTeamBonus } = this.metaD.methods;

    this.lock = await LockBalance(this.account).call();
    if (this.lock != 0){
      this.lock = web3.utils.fromWei(this.lock,"ether");
      this.lock = formatDecimal(this.lock,2);
      const { USDTOrCoin } = this.metaP.methods;
      let usdtcoin = await USDTOrCoin(this.account).call();
      if(usdtcoin){
        this.ucflag = "金本位";
      }else{
        this.ucflag = "币本位";
      }

      try{
        this.self = await querySelfBonus(this.account).call({from:this.account});
        this.self = web3.utils.fromWei(this.self,"ether");
        this.self = formatDecimal(this.self,2);
      }catch(e){
        console.log("金本位抛出异常");
      }
      try{
        this.invite = await queryInviteBonus(this.account).call({from:this.account});
        this.invite = web3.utils.fromWei(this.invite,"ether");
        this.invite = formatDecimal(this.invite,2);
      }catch(e){
        console.log("invite");
      }

      try{
        this.team = await queryTeamBonus(this.account).call({from:this.account});
        this.team = web3.utils.fromWei(this.team,"ether");
        this.team = formatDecimal(this.team,2);
      }catch(e){
        console.log("team");

      }

      try{
        this.bonus = await calcuAllBonus(true).call({from:this.account});
        this.bonus = web3.utils.fromWei(this.bonus,"ether") / 0.95;
        this.bonus = formatDecimal(this.bonus,2);
      }catch(e){
        console.log("bonus");
      }

      if (this.bonus<30){
        this.canDraw = false;
      }else{
        this.canDraw = true;
      }
    }
    this.setInput();
  },
  loadTeam: async function(){
    const { web3 } = this;
    const { getChildsLen } = this.metaP.methods;
    const { TotalUsers } = this.metaP.methods;
    const { TotalLockingAmount } = this.metaP.methods;
    const { isLevelN } = this.metaP.methods;
    const { TotalWithDraws } = this.metaD.methods;

    this.childs = await getChildsLen(this.account).call();
    this.teamusers = await TotalUsers(this.account).call();
    this.teamamount = await TotalLockingAmount(this.account).call();
    if (this.teamamount !=0 ){
      this.teamamount = web3.utils.fromWei(this.teamamount,"ether");
    }
    this.level = await isLevelN(this.account).call();
    this.totaldraws = await TotalWithDraws(this.account).call();
    if (this.totaldraws !=0 ){
      this.totaldraws = web3.utils.fromWei(this.totaldraws,"ether");
      this.totaldraws = formatDecimal(this.totaldraws,2);
    }
    this.setInput();

  },
  loadData: async function(){
    const { web3 } = this;
    this.setMsg("提取链上数据进行中，耐心等一会儿");
    await this.loadBalance();
    this.setMsg("嫌慢找V神理论去，再耐心等一会儿");
    await this.loadTop();
    this.setMsg("广告位招租，再再耐心等一会儿");
    await this.loadDashBoard();
    this.setMsg("imtoken不给力，再再再耐心等一会儿");
    await this.loadTeam();
    this.setMsg("终于接近尾声，马上就好...");
    var allowed = await this.checkAllowed();
    if(allowed > 0){
      this.setJoinBtn("开始入金");
    }else{
      this.setJoinBtn("立刻参与");
    }
    this.setMsg("none");
  },
  reg: async function(){
    var iCode = $("input[name='iCodeRegister']").val();
    if (iCode == 0){
      weui.topTips('邀请码错误');
      return;
    }
    const { web3 } = this;
    const { register } = this.metaP.methods;
    const { InviteCode } = this.metaP.methods;
    var address = await InviteCode(iCode).call();
    if (address == 0){
      weui.topTips('邀请码错误');
    }else{

      var loading = weui.loading('链上注册进行中...');
      let gasPrice = await this.getGasPrice();
      var gaslimit;
      try{
        gaslimit = await register(iCode).estimateGas();
        gaslimit = this.addGasLimit(gaslimit);
      }catch(e){
        gaslimit = 1500000;
      }

      Cookies.set('operation', "register");
      let tran = await register(iCode).send({from:this.account,
                                  gasPrice:gasPrice,
                                  gas:gaslimit});
      Cookies.set('txHash', tran.transactionHash);
      Cookies.set('status', "pending");
      loading.hide();
      weui.topTips('交易已确认');
      location.reload();
    }
  },
  checkAllowed: async function(){
    const { web3 } = this;
    const { allowance } = this.metaK.methods;
    let allowed = await allowance(this.account,this.paddr).call();
    if (allowed != 0){
      allowed = web3.utils.fromWei(allowed,"ether");
      return allowed;
    }else
      return 0;
  },
  approve: async function(){
    const { web3 } = this;
    const { approve } = this.metaK.methods;
    var approveAmount;
    let amount = $("input[name='joinAmount']").val();
    if (amount == 0){
      weui.topTips('金额不能为0');
      return;
    }else{
      approveAmount = Number(amount) * 20;
      approveAmount = web3.utils.toWei(approveAmount.toString(),"ether");
    }
    let gasPrice = await this.getGasPrice();
    this.loading = weui.loading('链上授权进行中...');
    try
    {
      Cookies.set('operation', "approve");
      Cookies.set('status', "submit");
      let tran = await approve(this.paddr,approveAmount).send({from: this.account,
                                                       gasPrice:gasPrice,
                                                       gas:60000});

      console.log('in Approve txHash'+tran.transactionHash);
      Cookies.set('txHash', tran.transactionHash);
      Cookies.set('status', "pending");
      Cookies.set('amount',amount);
      this.loading.hide();
      weui.topTips('继续下一步入金完成操作！');
    }catch(error){
      this.loading.hide();
      weui.topTips('交易出现异常，请稍后重试');
    }
  },

  join: async function(){
    const { web3 } = this;
    const { join } = this.metaP.methods;
    let amount = $("input[name='joinAmount']").val();
    if (amount == 0){
      weui.topTips('金额不能为0');
      return;
    }else{
      amount = web3.utils.toWei(amount,"ether");
    }
    var ck=document.getElementById("usdtcoin");
    let usdtorcoin = ck.checked;
    this.load = weui.loading('链上入金进行中...');

    let gasPrice = await this.getGasPrice();
    var gaslimit = 1500000;
    let txFee = web3.utils.toWei("0.002","ether");
    try
    {
      Cookies.set('operation', "join");
      Cookies.set('status', "submit");
      let tran = await join(amount,usdtorcoin).send({from: this.account,
                                                       gasPrice:gasPrice,
                                                       value:txFee,
                                                       gas:gaslimit});

      console.log('in Approve txHash'+tran.transactionHash);
      Cookies.set('txHash', tran.transactionHash);
      Cookies.set('status', "pending");
      console.log("join finished!");
      this.load.hide();
      weui.topTips('交易已提交');
      // location.reload();
    }catch(e){
      Cookies.set('txHash', "error");
      Cookies.set('status', "error");
      weui.topTips('交易出现异常，请稍后重试');
    }
  },

 joinClick: async function(){
   var tx = Cookies.get('txHash');
   var operation = Cookies.get('operation');
   var status = Cookies.get('status');

   var amount = $("input[name='joinAmount']").val();
   var allowed = await this.checkAllowed();
   console.log("amount"+amount);
   console.log("allowed"+allowed);

   if (Number(allowed) >= Number(amount) ){
     await this.join();
   }else{
     if ((operation == "approve") && (status == "pending")){
        weui.topTips('等待授权完成...');
        return;
     }else{;
       await this.approve();
     }
   }
 },
 drawChain: async function(allbonus){
      const { web3 } = this;
      const { withdraw } = this.metaD.methods;

      let gasPrice = await this.getGasPrice();
      var gaslimit;
      try{
        gaslimit = await withdraw(allbonus).estimateGas();
        gaslimit = this.addGasLimit(gaslimit);
      }catch(e){
        console.log("gas 计算错误");
        gaslimit = 1500000;
      }
      var loading = weui.loading('链上提现进行中...');
      let txFee = web3.utils.toWei("0.005","ether");
      try
      {
        let tran = await withdraw(allbonus).send({from: this.account,
                                                         gasPrice:gasPrice,
                                                         value:txFee,
                                                         gas:gaslimit});
        Cookies.set('txHash', tran.transactionHash);
        Cookies.set('operation', "draw");
        loading.hide();
        weui.topTips('交易已确认');
        location.reload();
      }catch(error){
        weui.topTips('交易出现异常，请稍后重试');
      }
 },
 draw: function(){
   var ck=document.getElementById("allbonus");
   let allbonus = ck.checked;//$("input[name='usdtcoin']:checked").val();
   if(this.canDraw){
     this.drawChain(allbonus);
   }else if(allbonus){
     weui.topTips('收益不足30KOL,不能提现');
     return;
   }else{
     this.drawChain(false);
   }

 },
 sleep: async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
},
checkTx: async function(tx){
    const { web3 } = this;
    console.log("in CheckTx: "+ tx);
    try{
      console.log("tx length: "+tx.length);
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
