~(function(root, factory) {
if (typeof define === "function" && define.amd) {
define([], factory);
} else if (typeof module === "object" && module.exports) {
module.exports = factory();
} else {
root.NP = factory();
}
}(this, function() {
'use strict';
/**
* @ file 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
* 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
*/

return {
/**
* 把错误的数据转正
* strip(0.09999999999999998)=0.1
*/
strip: function (num, precision = 12) {
return +parseFloat(num.toPrecision(precision));
},

/**
* Return digits length of a number
* @ param {*number} num Input number
*/
digitLength: function (num) {
// Get digit length of e
const eSplit = num.toString().split(/[eE]/);
const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
return len > 0 ? len : 0;
},

/**
* 精确加法
*/
plus: function (num1, num2) {
const baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
return (num1 * baseNum + num2 * baseNum) / baseNum;
},

/**
* 精确减法
*/
minus: function (num1, num2) {
const baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
return (num1 * baseNum - num2 * baseNum) / baseNum;
},
/**
* 精确乘法
*/
times: function (num1, num2) {
const num1Changed = Number(num1.toString().replace('.', ''));
const num2Changed = Number(num2.toString().replace('.', ''));
const baseNum = this.digitLength(num1) + this.digitLength(num2);
return num1Changed * num2Changed / Math.pow(10, baseNum);
},

/**
* 精确除法
*/
divide: function (num1, num2) {
const num1Changed = Number(num1.toString().replace('.', ''));
const num2Changed = Number(num2.toString().replace('.', ''));
return this.times((num1Changed / num2Changed), Math.pow(10, this.digitLength(num2) - this.digitLength(num1)));
},

/**
* 四舍五入
*/
round: function (num, ratio) {
const base = Math.pow(10, ratio);
return this.divide(Math.round(this.times(num, base)), base);
}
};
}));

var Web3 = require("web3");
var fs = require("fs");
var FastCsv = require("fast-csv");
var BigNumber = require("bignumber.js");
var abifile = "./build/contracts/KOLPro.json";
var drawfile = "./build/contracts/KOLWithDraw.json";
var Tx = require('ethereumjs-tx');
var result = JSON.parse(fs.readFileSync(abifile));
var drawResult = JSON.parse(fs.readFileSync(drawfile));
var abi = result.abi;
var drawabi = drawResult.abi;
var resultList = "result.csv";
var content = {};
var contentLen = 0;
var totalAmount = 0;
var totalUsers = 0;

// var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/b1fb153dd7e44bef9cb4d9b661071583"));
var web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.2.198:8545"));

var fromAddress = "0x451cD3eFB91d73Cdb1724547dB3bcd6be7bd1765";
var contractAddr = "0xbC664C8ECadbB9311325537DfA4609F877E04Ab6";
var drawAddr = "0x9190d289E7054DaB91a2F5Ed77a7d57fE8381Def";
var token = new web3.eth.Contract(abi,contractAddr);
var drawtoken = new web3.eth.Contract(drawabi,drawAddr);
let addr = fromAddress;
console.log("begin");
// var number = 1118.907;
// var n2 = formatDecimal(number,2);
// console.log(n2);

// getEvents();
// getAllAddrs(addr).then(() => {
//   saveToFile();
//   console.log("finished");
// });
getClosePrice();


async function getAddressFromiCode(iCode){
  const { InviteCode } = token.methods;
  var addr = await InviteCode(iCode).call();
  return addr;
};
async function getiCode(addr){
  const { RInviteCode } = token.methods;
  var iCode = await RInviteCode(addr).call();
  return iCode;
};
async function getChildsLen(addr){
  const { getChildsLen } = token.methods;
  var len = await getChildsLen(addr).call();
  return len;
};
async function getChild(addr,index){
  const { ChildAddrs } = token.methods;
  var child = await ChildAddrs(addr,index).call();
  return child;
};
async function getLock(addr){
  const { LockBalance } = token.methods;
  var balance = await LockBalance(addr).call();
  return balance;
};
async function getFather(addr){
  const { InviteList } = token.methods;
  var father = await InviteList(addr,0).call();
  return father;
};
async function getTeamUsers(addr){
  const { TotalUsers } = token.methods;
  var teamUsers = await TotalUsers(addr).call();
  return teamUsers;
};
async function getTeamAmount(addr){
  const { TotalLockingAmount } = token.methods;
  var teamAmount = await TotalLockingAmount(addr).call();
  return teamAmount;
};
function lastsecond(time){
  var begin = 1589126400;
  return(time - (time-begin) % 86400-1);
};
async function getClosePrice(){
  const { ClosePrice } = token.methods;
  var time = new Date();
  var unixTimeNow = time.getTime();
  unixTimeNow = Math.round(unixTimeNow / 1000);
  var begin = 1589126400 + 2*86400;
  let theDay = lastsecond(unixTimeNow);
  for (var i = theDay;i>begin;i-=86400){
    let price = await ClosePrice(i).call();
    console.log("the day is       :" +dateFtt(i,1));
    console.log("the price is     :" + price);
  };


};
function writefs(addr,fatherAddr,lockBalance,iCode,childsLen,teamUsers,teamAmount){
  content[contentLen]=addr+","+fatherAddr+","+lockBalance+","+iCode+","+childsLen+","+teamUsers+","+teamAmount;
  contentLen ++;
  console.log(addr+","+lockBalance+","+iCode+","+childsLen);
};
async function getAllAddrs(addr){
  // var addr = await getAddressFromiCode(iCode);
  var iCode = await getiCode(addr);
  var fatherAddr = 0;
  if (addr != fromAddress){
      fatherAddr = await getFather(addr);
  }
  var lockBalance = await getLock(addr);
  if(lockBalance!=0){
    lockBalance = web3.utils.fromWei(lockBalance,"ether");
    totalAmount +=parseFloat(lockBalance);
    totalUsers++;
  }
  var childsLen = await getChildsLen(addr);
  var teamUsers = await getTeamUsers(addr);
  var teamAmount = await getTeamAmount(addr);
  if(teamAmount!=0){
    teamAmount = web3.utils.fromWei(teamAmount,"ether");
  }
  writefs(addr,fatherAddr,lockBalance,iCode,childsLen,teamUsers,teamAmount);
  for (var i = 0;i<childsLen;i++){
    var child = await getChild(addr,i);
    await getAllAddrs(child);
  }
};
function saveToFile()
{
    console.log("file saving");
    var out = fs.createWriteStream(resultList);

    out.write("总有效参与人数,"+ totalUsers +"\n");
    out.write("总锁仓金额,"+ formatDecimal(totalAmount,3) +"\n");
    out.write("地址,上级,入金,邀请码,直推,网体,网体金额"+"\n");
    for (var i = 0;i < contentLen-1; i++){
      out.write(content[i]+"\n");
    }
    console.log("总有效参与人数,"+ totalUsers);
    console.log("总锁仓金额,"+ totalAmount);
    out.on("end", function() {
      out.end();
    });
};
async function getEvents(){
  let addr = "0x3551c688613331862408A361e0D3E3F14969221A";
  token.getPastEvents('Joined', {
    fromBlock: 10058101,
    toBlock: 'latest'
    }, (error, events) => {
      console.log(events.length);
      for (var i = 0; i < events.length; i++){
        let rr = events[i];
        if (rr.returnValues[0] == addr){
          console.log("***************i is : "+ i+ " ***************");
          console.log(rr);
          console.log(rr.returnValues[1]);
          console.log(web3.utils.fromWei(rr.returnValues[2],"ether"));
        }

      }
    }
  );
  token.getPastEvents('Registed', {
    fromBlock: 10058101,
    toBlock: 'latest'
    }, (error, events) => {
      console.log(events.length);
      for (var i = 0; i < events.length; i++){
        let rr = events[i];
        if (rr.returnValues[0] == addr){
          console.log("##############i is : "+ i+ " ***************");
          console.log(rr);
          // console.log(rr.returnValues[1]);10071095
          // console.log(web3.utils.BN(rr.returnValues[1]).toString());
        }
      }
    }
  );
  drawtoken.getPastEvents('WithDrawed', {
    fromBlock: 10058101,
    toBlock: 'latest'
    }, (error, events) => {
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$");
      console.log(events);
      // for (var i = 0; i < events.length; i++){
      //   let rr = events[i];
      //   console.log("withDrawed");
      //   console.log(rr);
      // }
    }
  );
};
function dateFtt(dd,current){ //author: meizz
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
};
function formatDecimal(num, decimal) {
  num = num.toString();
  var index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
    console.log(decimal + index + 1);
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
};
