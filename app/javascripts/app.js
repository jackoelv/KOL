import Web3 from "web3";
import KOLPro from '../../build/contracts/KOLPro.json';
import KOLWithDraw from '../../build/contracts/KOLWithDraw.json';
import KOLVote from '../../build/contracts/KOLVote.json';

const App = {
  web3: null,
  account: null,
  metaP: null,
  metaD: null,
  metaK:null,
  paddr: "0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2",
  daddr: "0x46Ba0c589c0E0531319809BcA37db878Eb4CC651",
  kaddr: "0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154",

  start: async function() {
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
      // this.initial();

      this.initial();
      // this.setmStatus("链上数据加载成功！");
    } catch (error) {
      // this.setmStatus("连接以太坊网络失败，请刷新重试");
      console.log("error");
    };

    console.log("finished");
  },
  diff: function(a,b){
    var df = parseInt(b) - parseInt(a);
    var df2 = df % 60;
    return ((df-df2)/60);
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

  initial: async function(){
    const { web3 } = this;
    const { LockBalance } = this.metaP.methods;
    const { withdrawCheck } = this.metaD.methods;
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

    console.log(this.account);

    var balance = await balanceOf(this.account).call();
    if (balance != 0){
      balance = web3.utils.fromWei(balance,"ether");
    }

    console.log("11111");

    var lock = await LockBalance(this.account).call();
    if (lock != 0){
      lock = web3.utils.fromWei(lock,"ether");
    }
    var bonusbb =0;
    try{
        bonusbb = await withdrawCheck(true).call();
        console.log(bonusbb);
        if (bonusbb != 0){
          bonusbb = web3.utils.fromWei(bonusbb,"ether");
        }
    }catch(e){
      console.log("xxxxx");
    }

    var self = await querySelfBonus(this.account).call();
    self = web3.utils.fromWei(self,"ether");

    var invite = await queryInviteBonus(this.account).call();
    invite = web3.utils.fromWei(invite,"ether");

    var team = await queryTeamBonus(this.account).call();
    team = web3.utils.fromWei(team,"ether");

    var bonus = Number(self) + Number(invite) + Number(team);


    var childs = await getChildsLen(this.account).call();


    var teamusers = await TotalUsers(this.account).call();

    var teamamount = await TotalLockingAmount(this.account).call();
    if (teamamount !=0 ){
      teamamount = web3.utils.fromWei(teamamount,"ether");
    }
    var level = await isLevelN(this.account).call();
    // level = web3.utils.BN(level);

    var iCode = await RInviteCode(this.account).call();
    console.log(iCode);



    var totaldraws = await TotalWithDraws(this.account).call();
    if (totaldraws !=0 ){
      totaldraws = web3.utils.fromWei(totaldraws,"ether");
    }



    var time = new Date();
    var unixTime = time.getTime();
    unixTime = Math.round(unixTime / 1000);
    var current = this.dateFtt(unixTime,1);

    var first;
    var lastingDays;
    try{
      first = await LockHistory(this.account,0).call();
      first = first[0];
      lastingDays = this.diff(first,unixTime);
      first = this.dateFtt(first,1);
    }catch(e){
      console.log("error 2");
    };



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
    $("input[name='lastingDays']").val(lastingDays);

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
      console.log("地址错误");
    }else{
      let gasPrice = await web3.eth.getGasPrice();
      let gaslimit = 6000000;
      let result = await register(iCode).send({from:this.account,
                                  gasPrice:gasPrice,
                                  gas:gaslimit});
      console.log(result.transactionHash);
      //取得这个txHash，然后去每隔一秒去取一下他的状态，如果成功了，就提示成功，否则就等待.

    }
  },

 // 授权合约转账
 approve: async function(){
   const { web3 } = this;
   let amount = $("input[name='joinAmount']").val();
   console.log(amount);
   amount = web3.utils.toWei(amount,"ether");
   let gasPrice = await web3.eth.getGasPrice();
   const { approve } = this.metaK.methods;
    try
    {
      let tran = await approve(this.paddr,amount).send({from: this.account,
                                                       gasPrice:gasPrice,
                                                       gas:80000});
      console.log(tran.transactionHash);
    }catch(error){
      console.log("授权异常，稍后检查确认一下是否已成功");
    }
 },
 join: async function(){
   const { web3 } = this;
   const { join } = this.metaP.methods;
   let amount = $("input[name='joinAmount']").val();
   amount = web3.utils.toWei(amount,"ether");
   let usdtorcoin = $("input[name='usdtcoin']:checked").val();
   let gasPrice = await web3.eth.getGasPrice();
   let gaslimit = 6000000;
   console.log(usdtorcoin);
   try
   {
     let result = await join(amount,usdtorcoin).send({from: this.account,
                                                      gasPrice:gasPrice,
                                                      gas:gaslimit});
     console.log(result.transactionHash);
   }catch(error){
     console.log("异常，稍后检查确认一下是否已成功");
   }
 },
 draw: async function(){
   const { web3 } = this;
   const { withdraw } = this.metaD.methods;
   let gasPrice = await web3.eth.getGasPrice();
   let gaslimit = 6000000;
   let allbonus = $("input[name='usdtcoin']:checked").val();
   console.log(allbonus);
   try
   {
     let result = await withdraw(!allbonus).send({from: this.account,
                                                      gasPrice:gasPrice,
                                                      gas:gaslimit});
     console.log(result);
   }catch(error){
     console.log("异常，稍后检查确认一下是否已成功");
   }


 },
 sleep: async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
},

};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
    console.log("haha");
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

  }
  App.start();
});
