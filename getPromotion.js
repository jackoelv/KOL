var Web3 = require("web3");
var fs = require("fs");
var FastCsv = require("fast-csv");
var BigNumber = require("bignumber.js");
var abifile = "./build/contracts/KOLPro.json";
var Tx = require('ethereumjs-tx');
var result = JSON.parse(fs.readFileSync(abifile));
var abi = result.abi;
var resultList = "result.csv";
var content = {};
var contentLen = 0;

// var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/b1fb153dd7e44bef9cb4d9b661071583"));
var web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.2.198:8545"));

var fromAddress = "0x451cD3eFB91d73Cdb1724547dB3bcd6be7bd1765";
var contractAddr = "0xbC664C8ECadbB9311325537DfA4609F877E04Ab6";
var token = new web3.eth.Contract(abi,contractAddr);
let addr = fromAddress;
console.log("begin");
// var number = 1118.907;
// var n2 = formatDecimal(number,2);
// console.log(n2);

getEvents();
// getAllAddrs(addr).then(() => {
//   saveToFile();
//   console.log("finished");
// });


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
}
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
    for (var i = 0;i < contentLen-1; i++){
      out.write(content[i]+"\n");
    }
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
