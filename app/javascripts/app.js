import Web3 from "web3";
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
  paddr: "0x74cA4B1B675773E679224f494a3a169EDBA14Fdf",
  daddr: "0x076B7197E9f23Cce5B116dF5D971574E9D74E2b7",
  //测试环境
  // kaddr: "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",
  // paddr: "0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2",
  // daddr: "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
  newUser: false,
  load: null,
  withDrawDays: 2592000,
  canDraw:false,
  diff: function(a,b){
    var begin =1589126400;
    var aNum=parseInt(a);
    var bNum=parseInt(b);
    var extra = (aNum-begin)% 86400;
    var aNight= aNum-extra;

    extra = (bNum-begin)% 86400;
    var bNight=bNum -extra;
    return ((bNight-aNight)/86400);
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

  start: async function() {
    this.load = weui.loading("链上数据加载进行中");
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

      await this.initial1();
      var iCode = this.GetQueryValue("iCode");


      $("input[name='iCodeRegister']").val(iCode);

      this.load.hide();
      weui.toast('链上数据加载成功', 3000);
    } catch (error) {
      weui.topTips('连接以太坊网络失败，请刷新重试');
      console.log("error? : " +error);
    };
    console.log("finished");
  },

  initial1: async function(){
    const { web3 } = this;
    const { RInviteCode } = this.metaP.methods;
    var iCode = await RInviteCode(this.account).call();
    if (iCode == 0){
      //首次注册
      document.getElementById("firstRegister").style.display="block";
      document.getElementById("firstHide").style.display="none";
      document.getElementById("joindrawpanel").style.display="none";
      this.newUser = true;
    }else{
      this.newUser = false;
      this.load = weui.loading('数据加载进行中...');
      this.initial();
      this.load.hide();
      document.getElementById("firstRegister").style.display="none";
    }
  },

  initial: async function(){
    const { web3 } = this;
    const { LockBalance } = this.metaP.methods;
    const { calcuAllBonus } = this.metaD.methods;
    const { getChildsLen } = this.metaP.methods;
    const { TotalUsers } = this.metaP.methods;
    const { TotalLockingAmount } = this.metaP.methods;
    const { RInviteCode } = this.metaP.methods;
    const { isLevelN } = this.metaP.methods;
    const { TotalWithDraws } = this.metaD.methods;
    const { balanceOf } = this.metaK.methods;

    const { querySelfBonus } = this.metaD.methods;
    const { queryInviteBonus } = this.metaD.methods;
    const { queryTeamBonus } = this.metaD.methods;

    const { LockHistory } = this.metaP.methods;

    var invite=0;
    var self =0;
    var team =0;
    var bonus =0;
    var childs =0;
    var teamusers =0;
    var teamamount =0;
    var level =0;
    var totaldraws =0;
    var time = new Date();
    var unixTime = time.getTime();
    unixTime = Math.round(unixTime / 1000);
    var current = this.dateFtt(unixTime,1);

    var first;
    var lastingDays=0;

    var iCode = await RInviteCode(this.account).call();
    if (iCode == 0){
      //首次注册
      document.getElementById("firstRegister").style.display="block";
      document.getElementById("firstHide").style.display="none";
      document.getElementById("joindrawpanel").style.display="none";
    }else{
      document.getElementById("firstRegister").style.display="none";
    }
    var lock = await LockBalance(this.account).call();
    if (lock != 0){
      lock = web3.utils.fromWei(lock,"ether");
      document.getElementById("ucfirst").style.display="none";
      const { USDTOrCoin } = this.metaP.methods;
      let usdtcoin = await USDTOrCoin(this.account).call();
      var ucflag;
      if(usdtcoin){
        ucflag = "金本位";
      }else{
        ucflag = "币本位";
      }
      $("input[name='ucflag']").val(ucflag);
      var joinbtn = document.getElementById("Join");
      joinbtn.innerHTML = "再次参与";
      try{
        self = await querySelfBonus(this.account).call({from:this.account});
        self = web3.utils.fromWei(self,"ether") * 0.95;
        self = NP.round(self,2);
      }catch(e){
        console.log("haha,jinbenwei");
      }


      try{
        invite = await queryInviteBonus(this.account).call({from:this.account});
        invite = web3.utils.fromWei(invite,"ether") * 0.95;
        invite = NP.round(invite,2);
      }catch(e){

      }

      try{
        team = await queryTeamBonus(this.account).call({from:this.account});
        team = web3.utils.fromWei(team,"ether") * 0.95;
        team = NP.round(team,2);
      }catch(e){

      }

      try{
        bonus = await calcuAllBonus(true).call({from:this.account});
        bonus = web3.utils.fromWei(bonus,"ether");
        bonus = NP.round(bonus,2);
      }catch(e){
      }


      childs = await getChildsLen(this.account).call();


      teamusers = await TotalUsers(this.account).call();

      teamamount = await TotalLockingAmount(this.account).call();
      if (teamamount !=0 ){
        teamamount = web3.utils.fromWei(teamamount,"ether");
      }



      level = await isLevelN(this.account).call();

      totaldraws = await TotalWithDraws(this.account).call();
      if (totaldraws !=0 ){
        totaldraws = web3.utils.fromWei(totaldraws,"ether");
      }

      try{
        const { DrawTime } = this.metaD.methods;
        let drawTime = await DrawTime(this.account).call();
        if (drawTime == 0){
          first = await LockHistory(this.account,0).call();
          first = first[0];

          let myself = lock*5;
          let diff = unixTime - first;
          if((teamamount < myself) && (diff<this.withDrawDays)){
            this.canDraw = false;
          }else{
            this.canDraw = true;
          }
          console.log(this.canDraw);
        }else{
          first = drawTime;
        }
        lastingDays = this.diff(first,unixTime);
        console.log(first);
        console.log("Locking Time is: " +this.dateFtt(first,1))
        first = this.dateFtt(first,1);

      }catch(e){
        console.log(e);
      };


    }else{
      document.getElementById("uc").style.display="none";
    }

    var balance = await balanceOf(this.account).call();
    if (balance != 0){
      balance = web3.utils.fromWei(balance,"ether");
    }


    var url = "https://b.kols.club/?iCode=" + iCode;
    $('#qrcode').html('').qrcode({
                        text: url});


    $("input[name='addr']").val(this.account);
    $("input[name='balance']").val(balance);
    $("input[name='lock']").val(lock);

    $("input[name='bonus']").val(bonus);


    $("input[name='self']").val(self);
    $("input[name='invite']").val(invite);
    $("input[name='team']").val(team);

    $("input[name='childs']").val(childs);
    $("input[name='teamusers']").val(teamusers);
    $("input[name='teamamount']").val(teamamount);
    $("input[name='level']").val(level);
    $("input[name='iCode']").val(iCode);
    $("input[name='totaldraws']").val(totaldraws);

    $("input[name='current']").val(current);
    $("input[name='lastingDays']").val(lastingDays+"天");

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
      weui.topTips('邀请码错误');
    }else{

      var loading = weui.loading('链上注册进行中...');
      let gasPrice = await this.getGasPrice();
      var gaslimit;
      try{
        gaslimit = await register(iCode).estimateGas();
        gaslimit = this.addGasLimit(gaslimit);
      }catch(e){
        gaslimit = 1000000;
      }


      let tran = await register(iCode).send({from:this.account,
                                  gasPrice:gasPrice,
                                  gas:gaslimit});
      // await checkTxHash(tran);
      var blockNumber = tran.blockNumber;
      var tx = tran.transactionHash;

      var time = 600000;
      while (((blockNumber == null)||(blockNumber == 0))&&(time>0)){
        let result = await web3.eth.getTransaction(tx);
        console.log(result);
        console.log("waitting");
        blockNumber = result.blockNumber;
        await sleep(5000);
        time -=5000;
      }
      loading.hide();
      weui.topTips('交易已确认');
      location.reload();
      //取得这个txHash，然后去每隔一秒去取一下他的状态，如果成功了，就提示成功，否则就等待.
    }
  },


 // 授权合约转账
 approve: async function(){
   const { web3 } = this;
   const { allowance } = this.metaK.methods;
   this.load = weui.loading('链上操作进行中...');
   let allowed = await allowance(this.account,this.paddr).call();
   this.load.hide();
   console.log("allowed"+allowed);
   if (allowed != 0){
     allowed = web3.utils.fromWei(allowed,"ether");
   }
   let amount = $("input[name='joinAmount']").val();
   console.log("allowed"+allowed);
   console.log("amount"+amount);
   if (parseFloat(allowed) >= parseFloat(amount)){
     this.join();
   }else{
     amount = web3.utils.toWei(amount,"ether");

     let gasPrice = await this.getGasPrice();
     const { approve } = this.metaK.methods;
     this.load = weui.loading('链上操作进行中...');
      try
      {
        let tran = await approve(this.paddr,amount).send({from: this.account,
                                                         gasPrice:gasPrice,
                                                         gas:80000});
        var blockNumber = tran.blockNumber;
        var tx = tran.transactionHash;

        var time = 300000;
        while (((blockNumber == null)||(blockNumber == 0))&&(time>0)){
          let result = await web3.eth.getTransaction(tx);
          console.log(result);
          console.log("waitting");
          blockNumber = result.blockNumber;
          await sleep(3000);
          time -=3000;
        }
        // loading.hide();
        weui.topTips('继续下一步完成操作！');
        this.join();
      }catch(error){
        weui.topTips('交易出现异常，请稍后重试');
      }

   }

 },
 join: async function(){
   const { web3 } = this;
   const { join } = this.metaP.methods;
   let amount = $("input[name='joinAmount']").val();
   amount = web3.utils.toWei(amount,"ether");
   var ck=document.getElementById("usdtcoin");
   let usdtorcoin = ck.checked;
   this.load = weui.loading('链上入金进行中...');

   let gasPrice = await this.getGasPrice();
   var gaslimit = 3000000;
   let txFee = web3.utils.toWei("0.002","ether");
   try
   {
     let tran = await join(amount,usdtorcoin).send({from: this.account,
                                                      gasPrice:gasPrice,
                                                      value:txFee,
                                                      gas:gaslimit});
     // await checkTxHash(tran);
     var blockNumber = tran.blockNumber;
     var tx = tran.transactionHash;

     var time = 600000;
     while (((blockNumber == null)||(blockNumber == 0))&&(time>0)){
       let result = await web3.eth.getTransaction(tx);
       console.log(result);
       console.log("waitting");
       console.log(time);
       blockNumber = result.blockNumber;
       await sleep(5000);
       time -=5000;
     }
     this.load.hide();
     weui.topTips('交易已确认');
     location.reload();
   }catch(e){
     weui.topTips('交易出现异常，请稍后重试');
   }
 },
 draw: async function(){

   const { web3 } = this;
   const { withdraw } = this.metaD.methods;
   var ck=document.getElementById("allbonus");
   let allbonus = ck.checked;//$("input[name='usdtcoin']:checked").val();
   if((!this.canDraw)&&(!allbonus)){
     weui.topTips('未达标自由提现，将扣除5%本金解约');
     weui.dialog({
          title: '将扣除5%手续费',
          content: '时间不足30天且网体未达自身5倍',
          className: 'custom-classname',
          buttons: [{
              label: '放弃',
              type: 'default',
              onClick: function () { return; }
          }, {
              label: '确认',
              type: 'primary',
              onClick: function () { alert('确定') }
          }]
      });

   }

   console.log(allbonus);
   let gasPrice = await this.getGasPrice();
   var gaslimit;
   try{
     gaslimit = await withdraw(allbonus).estimateGas();
     gaslimit = this.addGasLimit(gaslimit);
   }catch(e){
     gaslimit = 200000;
   }
   var loading = weui.loading('链上提现进行中...');
   let txFee = web3.utils.toWei("0.005","ether");
   try
   {
     let tran = await withdraw(allbonus).send({from: this.account,
                                                      gasPrice:gasPrice,
                                                      value:txFee,
                                                      gas:gaslimit});
     var blockNumber = tran.blockNumber;
     var tx = tran.transactionHash;
     var time = 600000;
     while (((blockNumber == null)||(blockNumber == 0))&&(time>0)){
       let result = await web3.eth.getTransaction(tx);
       console.log(result);
       console.log("waitting");
       console.log(time);
       blockNumber = result.blockNumber;
       await sleep(5000);
       time -=5000;
     }
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
