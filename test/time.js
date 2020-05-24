const KK= artifacts.require("KOLVote");
var KOLP = artifacts.require("KOLPro");
var KOLD = artifacts.require("KOLWithDraw");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
contract("testjoin",accounts => {
    before(async () => {
    //构建合约(可以设置两种方式)
    //01
    let k = await KK.at("0xcb3aA0A1125f60cbb476eeF1daF17e49b9F3f154");
    let p = await KOLP.at("0xd9E4B0CC779dE12871527Cb21d5F55d7D7e611E2");
    let d = await KOLD.at("0x46Ba0c589c0E0531319809BcA37db878Eb4CC651");

    for (var i = 0; i<30; i++){
      await d.setNewBlock();
      console.log("waitting for 60s!!!")
      await sleep(60000);
    }

    });
    it('Check whether the contract has been issued successfully', async () => {
      console.log("测试合约的操作:");
    });
});

// var tx = Cookies.get('txHash');
// var operation = Cookies.get('operation');

// if (operation == "register"){
//   let registerResult = this.checkTx(tx);
//   if (registerResult == "pending"){
//     this.load = weui.loading('链上注册进行中...');
//     this.iCode = "链上注册进行中...";
//     this.loadData();
//     this.load.hide();
//   }
// }

function loadScript(url, callback){
  var script = document.createElement ("script") ;
　 script.type = "text/javascript";

   if (script.readyState){ //IE
     script.onreadystatechange = function(){
      if (script.readyState == "loaded" || script.readyState == "complete"){
       script.onreadystatechange = null;
       callback();
      }
     };
    }
    else { //Others
     script.onload = function(){ callback();};
   }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};
weui.loading("页面加载进行中");
loadScript("app.js", function(){ //调用
  weui.loading("页面加载完成");
});