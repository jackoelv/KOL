pragma solidity ^0.4.23;
/*
 *             ╔═╗┌─┐┌─┐┬┌─┐┬┌─┐┬   ┌─────────────────────────┐ ╦ ╦┌─┐┌┐ ╔═╗┬┌┬┐┌─┐
 *             ║ ║├┤ ├┤ ││  │├─┤│   │ KOL Community Foundation│ │ ║║║├┤ ├┴┐╚═╗│ │ ├┤
 *             ╚═╝└  └  ┴└─┘┴┴ ┴┴─┘ └─┬─────────────────────┬─┘ ╚╩╝└─┘└─┘╚═╝┴ ┴ └─┘
 *   ┌────────────────────────────────┘                     └──────────────────────────────┐
 *   │    ┌─────────────────────────────────────────────────────────────────────────────┐  │
 *   └────┤ Dev:Jack Koe ├─────────────┤ Special for: KOL  ├───────────────┤ 20200422   ├──┘
 *        └─────────────────────────────────────────────────────────────────────────────┘
 */

 library SafeMath {
   function mul(uint a, uint b) internal pure  returns (uint) {
     uint c = a * b;
     require(a == 0 || c / a == b);
     return c;
   }
   function div(uint a, uint b) internal pure returns (uint) {
     require(b > 0);
     uint c = a / b;
     require(a == b * c + a % b);
     return c;
   }
   function sub(uint a, uint b) internal pure returns (uint) {
     require(b <= a);
     return a - b;
   }
   function add(uint a, uint b) internal pure returns (uint) {
     uint c = a + b;
     require(c >= a);
     return c;
   }
   function max64(uint64 a, uint64 b) internal  pure returns (uint64) {
     return a >= b ? a : b;
   }
   function min64(uint64 a, uint64 b) internal  pure returns (uint64) {
     return a < b ? a : b;
   }
   function max256(uint256 a, uint256 b) internal  pure returns (uint256) {
     return a >= b ? a : b;
   }
   function min256(uint256 a, uint256 b) internal  pure returns (uint256) {
     return a < b ? a : b;
   }
 }

 /**
  * title KOL Promotion Withdraw contract
  * dev visit: https://github.com/jackoelv/KOL/
 */

 contract ERC20Basic {
   uint public totalSupply;
   function balanceOf(address who) public constant returns (uint);
   function transfer(address to, uint value) public;
   event Transfer(address indexed from, address indexed to, uint value);
 }

 contract ERC20 is ERC20Basic {
   function allowance(address owner, address spender) public constant returns (uint);
   function transferFrom(address from, address to, uint value) public;
   function approve(address spender, uint value) public;
   event Approval(address indexed owner, address indexed spender, uint value);
 }

 /**
  * title KOL Promotion Withdraw contract
  * dev visit: https://github.com/jackoelv/KOL/
 */

 contract BasicToken is ERC20Basic {

   using SafeMath for uint;

   mapping(address => uint) balances;

   function transfer(address _to, uint _value) public{
     balances[msg.sender] = balances[msg.sender].sub(_value);
     balances[_to] = balances[_to].add(_value);
     emit Transfer(msg.sender, _to, _value);
   }

   function balanceOf(address _owner) public constant returns (uint balance) {
     return balances[_owner];
   }
 }

 /**
  * title KOL Promotion Withdraw contract
  * dev visit: https://github.com/jackoelv/KOL/
 */

 contract StandardToken is BasicToken, ERC20 {
   mapping (address => mapping (address => uint)) allowed;
   uint256 public userSupplyed;

   function transferFrom(address _from, address _to, uint _value) public {
     balances[_to] = balances[_to].add(_value);
     balances[_from] = balances[_from].sub(_value);
     allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
     emit Transfer(_from, _to, _value);
   }

   function approve(address _spender, uint _value) public{
     require((_value == 0) || (allowed[msg.sender][_spender] == 0)) ;
     allowed[msg.sender][_spender] = _value;
     emit Approval(msg.sender, _spender, _value);
   }

   function allowance(address _owner, address _spender) public constant returns (uint remaining) {
     return allowed[_owner][_spender];
   }
 }
 contract KOL is StandardToken {
   function queryNode(address _addr) public view returns(bool);
   function querySuperNode(address _addr) public view returns(bool);
 }
 contract KOLP is StandardToken {

   address public draw;
   struct lock{
     uint256 begin;
     uint256 amount;
     uint256 end;
     bool withDrawed;
   }
   struct teamRate{
     uint8 rate;
     uint256 changeTime;

   }
   struct inviteBonus{
     uint256 begin;//网体开始时间
     uint256 dayBonus;//网体当日加速
     uint256 hisTotalBonus;
   }
   struct withDraws{
     uint256 time;
     uint256 amount;
   }
   struct dayTeamBonus{
     uint256 theDayLastSecond;
     uint256 theDayTeamBonus;
     uint256 totalTeamBonus;
     uint8 theDayRate;
   }
   struct dayInviteBonus{
     uint256 theDayLastSecond;
     uint256 theDayInviteBonus;
     uint256 totalInviteBonus;
   }
   mapping (address => dayTeamBonus[]) public LockTeamBonus;
   mapping (address => dayInviteBonus[]) public LockInviteBonus;


   mapping (address => address[]) public InviteList;
   mapping (address => address[]) public ChildAddrs;
   mapping (address => teamRate[]) public TeamRateList;
   mapping (address => lock[]) public LockHistory;
   mapping (address => uint256) public LockBalance;

   mapping (address => uint256) public InviteHistoryBonus;
   mapping (address => uint256) public InviteCurrentDayBonus;

   mapping (address => address) public InviteRelation;//A=>B B is father;
   mapping (uint256 => uint256) public ClosePrice;//需要给个默认值，而且还允许修改，否则忘记就很麻烦了。
   mapping (address => uint256) public TotalUsers;
   mapping (address => uint256) public TotalLockingAmount;
   mapping (uint256 => address) public InviteCode;
   mapping (address => uint256) public RInviteCode;

   mapping (address => uint8) public isLevelN;
   mapping (uint8 => uint8) public levelRate;
   mapping (address => bool) public USDTOrCoin;

   mapping (address => bool) public contractAddr;

   //GAS优化

   event Registed(address _user,uint256 inviteCode);
   event GradeChanged(address _user,uint8 _oldLevel,uint8 _newLevel);
   event WithDraw(address _user,uint256 _amount);
   event WithDrawBalance(address _user,uint256 _balance);
   modifier onlyContract {
       require(msg.sender == draw);
       _;
   }
   function calcuDiffAmount(address _selfAddr,address _topAddr,uint256 _amount) public view returns(uint256);
   function queryAndSetLevelN(address _addr) public;
   function queryLockBalance(address _addr,uint256 _queryTime) public view returns(uint256);
   function getYestodayLastSecond(uint256 _queryTime) public view returns(uint256);
   function getHistoryTeamBonus(address _addr,uint256 _index) public view returns(uint256,uint256,uint256,uint256,uint256);
   function getHistoryInviteBonus(address _addr,uint256 _index) public view returns(uint256,uint256,uint256,uint256);
   function getTeamRateList(address _addr,uint256 _index) public view returns(uint256,uint256,uint256);
   function clearLock(address _addr) onlyContract public ;
   function pushInvite(address _addr,
                       uint256 _theDayLastSecond,
                       uint256 _theDayInviteBonus,
                       uint256 _totalInviteBonus) onlyContract public ;
   function setLastInvite(address _addr,
                       uint256 _theDayInviteBonus,
                       uint256 _totalInviteBonus) onlyContract public ;
   function pushTeam(address _addr,
                       uint256 _theDayLastSecond,
                       uint256 _theDayTeamBonus,
                       uint256 _totalTeamBonus,
                       uint8 _theDayRate) onlyContract public ;
   function setLastTeam(address _addr,
                       uint256 _theDayTeamBonus,
                       uint256 _totalTeamBonus,
                       uint8 _theDayRate) onlyContract public ;

   function subTotalUsers(address _addr) onlyContract public ;
   function subTotalLockingAmount(address _addr,uint256 _amount) onlyContract public ;
   function getLockLen(address _addr) public view returns(uint256);
   function getFathersLength(address _addr) public view returns(uint256);
   function getLockTeamBonusLen(address _addr) public view returns(uint256);
   function getLockInviteBonusLen(address _addr) public view returns(uint256);
}

 /**
  * title KOL Promotion Withdraw contract
  * dev visit: https://github.com/jackoelv/KOL/
 */

 contract Ownable {
     address public owner;

     constructor() public{
         owner = msg.sender;
     }

     modifier onlyOwner {
         require(msg.sender == owner);
         _;
     }
     function transferOwnership(address newOwner) onlyOwner public{
         if (newOwner != address(0)) {
             owner = newOwner;
         }
     }
 }
 /**
  * title KOL Promotion Withdraw contract
  * dev visit: https://github.com/jackoelv/KOL/
 */
 //测试说明，把一天改成1分钟。提现限制为5分钟。
contract KOLWithDraw is Ownable{
  using SafeMath for uint256;
  string public name = "KOL Promotion";
  KOL public kol;
  KOLP public kolp;

  uint256 public every = 5 minutes;//1 days;
  address public reciever;

  /* uint16 public constant comLevel1Users = 100;
  uint16 public constant comLevel2Users = 300;
  uint16 public constant comLevel3Users = 500; */

  //测试的时候就把数字变小一点。


  uint256 public constant comLevel1Amount = 10000 * (10 ** 18);
  uint256 public constant comLevel2Amount = 30000 * (10 ** 18);
  uint256 public constant comLevel3Amount = 50000 * (10 ** 18);


  uint8 public constant withDrawRate = 5;
  uint8 public constant fee = 5;

  /* uint256 public constant withDrawDays = 30 days; */
  //测试限制5分钟
  uint256 public constant withDrawDays = 20 minutes;

  mapping (address => uint256) public TotalWithDraws;

  mapping (address => uint256) public DrawTime;
  event WithDrawed(address _user,uint256 _amount);

  constructor(address _kolAddress,address _kolpAddress,address _reciever) public {
    kol = KOL(_kolAddress);
    kolp = KOLP(_kolpAddress);
    reciever = _reciever;
  }
  /*
  *
  * 上线之前这段代码是要去掉的。
  * 下面
  */

  mapping (address => uint256) public ForTest;
  function getBlockTime() public view returns(uint256){
    return now;
  }
  function setNewBlock() public{
    ForTest[msg.sender] = now;
  }

  /*
  *  上面
  * 上线之前这段代码是要去掉的。
  *
  */
  function setReciever(address _addr) onlyOwner public{
    reciever = _addr;
  }

  function querySelfBonus(address _addr) public view returns(uint256){
    uint256 len = kolp.getLockLen(_addr);
    uint256 selfBonus;
    if(len >0){
      uint256 begin;
      uint256 end;
      uint256 amount;
      bool withDrawed;
      for (uint i=0; i<len; i++){
        (begin,amount,end,withDrawed) = kolp.LockHistory(_addr,i);
        if (!withDrawed){
          if (DrawTime[_addr] > begin) begin = DrawTime[_addr];
          uint256 lastingDays = (now - begin) % every;
          lastingDays = (now - lastingDays - begin) / every;
          if (kolp.USDTOrCoin(_addr)){
            begin = kolp.getYestodayLastSecond(begin) + every;
            for (uint j=0;j<lastingDays;j++){
              uint256 theTime = begin + j*every;
              selfBonus += amount * 3 / 1000 * kolp.ClosePrice(begin) / kolp.ClosePrice(theTime);
            }
          }else{
            selfBonus += lastingDays * amount * 3 / 1000;
          }
        }
      }
    }
    return (selfBonus);

  }

  function queryInviteBonus(address _addr) public view returns(uint256){
    uint256 last = kolp.getLockInviteBonusLen(_addr);
    if(last>0){
      last = last -1;
      uint256 yestodayLastSecond = kolp.getYestodayLastSecond(now);
      uint256 lastDayLastSecond;
      uint256 lastDayInviteBonus;
      uint256 lastDayInviteTotalBonus;
      (lastDayLastSecond,lastDayInviteBonus,lastDayInviteTotalBonus) = kolp.LockInviteBonus(_addr,last);
      uint256 lastingDays;
      uint256 newDayInviteTotalBonus;
      if (lastDayLastSecond < yestodayLastSecond){
        lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
        newDayInviteTotalBonus = (lastingDays * lastDayInviteBonus) + lastDayInviteTotalBonus;
        return (newDayInviteTotalBonus);
      }else{
        return (lastDayInviteTotalBonus);
      }

    }else return 0;

  }
  function queryTeamBonus(address _addr) public view returns(uint256){
    uint256 last = kolp.getLockTeamBonusLen(_addr);
    if(last>0){
      last = last-1;
      uint256 yestodayLastSecond = kolp.getYestodayLastSecond(now);
      uint256 lastDayLastSecond;
      uint256 lastDayTeamBonus;
      uint256 lastDayTeamTotalBonus;
      uint8 theDayRate;
      (lastDayLastSecond,lastDayTeamBonus,lastDayTeamTotalBonus,theDayRate) = kolp.LockTeamBonus(_addr,last);

      uint256 lastingDays;
      uint256 newDayTeamTotalBonus;
      if (lastDayLastSecond < yestodayLastSecond){
        lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
        newDayTeamTotalBonus = (lastingDays * lastDayTeamBonus * theDayRate / 100 ) + lastDayTeamTotalBonus;
        return (newDayTeamTotalBonus);
      }else{
        return (lastDayTeamTotalBonus);
      }

    }else return 0;

  }
  function afterWithdraw(address _addr,uint256 _amount) internal {
    //网体重新设置一下。
    address father;
    uint256 fathersLen = kolp.getFathersLength(_addr);
    for (uint i = 0; i<fathersLen; i++){
      father = kolp.InviteList(_addr,i);
      kolp.subTotalUsers(father);
      kolp.subTotalLockingAmount(father,_amount);
      kolp.queryAndSetLevelN(father);
    }

  }
  function checkDraw(address _addr) private view returns(bool) {
    uint256 teamAmount = kolp.TotalLockingAmount(_addr) ;
    uint256 myBalance = kolp.LockBalance(_addr) * withDrawRate;
    if (myBalance == 0) return false;
    uint256 myBegin;
    uint256 amount;
    uint256 end;
    bool withDrawed;
    ( myBegin, amount, end, withDrawed) = kolp.LockHistory(_addr,0);
    uint256 diff = now - myBegin;
    if ((myBalance <= teamAmount) || (diff > withDrawDays)) {
      return true;
    }else{
      return false;
    }

  }
  function withdraw(bool _onlyBonus) public{
    //true: Only Bonus;false:all;
    uint256 bonus = querySelfBonus(msg.sender);
    DrawTime[msg.sender] = now;
    uint256 last = kolp.getLockInviteBonusLen(msg.sender);
    if(last>0){
      last = last -1;
      uint256 yestodayLastSecond = kolp.getYestodayLastSecond(now);
      uint256 lastDayLastSecond;
      uint256 lastDayBonus;
      uint256 lastDayTotalBonus;
      (lastDayLastSecond,lastDayBonus,lastDayTotalBonus) = kolp.LockInviteBonus(msg.sender,last);
      uint256 lastingDays;
      if (lastDayLastSecond < yestodayLastSecond){
        //计算 然后Push一条记录
        lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
        bonus += (lastingDays * lastDayBonus) + lastDayTotalBonus;
        kolp.pushInvite(msg.sender,yestodayLastSecond,lastDayBonus,0);
      }else{
        kolp.setLastInvite(msg.sender,lastDayBonus,0);
        bonus += lastDayTotalBonus;
      }
    }
    last = kolp.getLockTeamBonusLen(msg.sender);
    if(last>0){
      last = last -1;
      uint8 theDayRate;
      (lastDayLastSecond,lastDayBonus,lastDayTotalBonus,theDayRate) = kolp.LockTeamBonus(msg.sender,last);
      if (lastDayLastSecond < yestodayLastSecond){
        lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
        bonus  += (lastingDays * lastDayBonus * theDayRate / 100 ) + lastDayTotalBonus;
        kolp.pushTeam(msg.sender,yestodayLastSecond,lastDayBonus,0,theDayRate);
      }else{
        kolp.setLastTeam(msg.sender,lastDayBonus,0,theDayRate);
        bonus += lastDayTotalBonus;
      }
    }
    bonus=bonus*(100-fee)/100;
    uint256 tax = bonus*fee/100;
    if (!_onlyBonus){
      require(checkDraw(msg.sender));
      uint256 balance = kolp.LockBalance(msg.sender);
      bonus += balance;
      afterWithdraw(msg.sender,balance);
      kolp.clearLock(msg.sender);
    }
    kol.transfer(msg.sender,bonus);
    kol.transfer(reciever,tax);
    TotalWithDraws[msg.sender] += bonus;
    emit WithDrawed(msg.sender,bonus);
  }
  function calcuAllBonus(bool _onlyBonus) public view returns(uint256){
    uint256 bonus = querySelfBonus(msg.sender);
    uint256 last = kolp.getLockInviteBonusLen(msg.sender);

    if(last > 0){
      last = last -1;
      uint256 yestodayLastSecond = kolp.getYestodayLastSecond(now);
      uint256 lastDayLastSecond;
      uint256 lastDayBonus;
      uint256 lastDayTotalBonus;
      (lastDayLastSecond,lastDayBonus,lastDayTotalBonus) = kolp.LockInviteBonus(msg.sender,last);
      uint256 lastingDays;
      if (lastDayLastSecond < yestodayLastSecond){
        lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
        bonus += (lastingDays * lastDayBonus) + lastDayTotalBonus;
      }else
        bonus += lastDayTotalBonus;
    }


    last = kolp.getLockTeamBonusLen(msg.sender);
    if(last > 0){
      last = last -1;
      uint8 theDayRate;
      (lastDayLastSecond,lastDayBonus,lastDayTotalBonus,theDayRate) = kolp.LockTeamBonus(msg.sender,last);
      if (lastDayLastSecond < yestodayLastSecond){
        lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
        bonus  += (lastingDays * lastDayBonus * theDayRate / 100 ) + lastDayTotalBonus;
      }else
        bonus += lastDayTotalBonus;
    }


    bonus = bonus * (100-fee) /100;

    if (!_onlyBonus){
      uint256 balance = kolp.LockBalance(msg.sender);
      bonus += balance;
    }
    return bonus;
  }
}
