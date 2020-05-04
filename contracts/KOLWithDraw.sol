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

   mapping (address => uint256) public WithDraws;
   mapping (address => mapping (address => uint256) ) public ABTeamBonus;//A是下级，B是上级，ABBonus就是A给B加速的总数。
   mapping (address => mapping (address => uint256) ) public ABInviteBonus;//A是下级，B是上级，ABBonus就是A给B加速的总数。
   mapping (address => bool) public contractAddr;

   //GAS优化

   event Registed(address _user,uint256 inviteCode);
   event GradeChanged(address _user,uint8 _oldLevel,uint8 _newLevel);
   event WithDraw(address _user,uint256 _amount);
   event WithDrawBalance(address _user,uint256 _balance);
   modifier onlyContract {
       require(contractAddr[msg.sender]);
       _;
   }
   function calcuDiffAmount(address _selfAddr,address _topAddr,uint256 _amount) public view returns(uint256);
   function queryAndSetLevelN(address _addr) public;
   function queryLockBalance(address _addr,uint256 _queryTime) public view returns(uint256);
   function getYestodayLastSecond(uint256 _queryTime) public view returns(uint256);
   function getCode() public view returns(uint256);
   function getTeam() public view returns(address[]);
   function getFathers() public view returns(address[]);
   function getTeamTotalUsers() public view returns(uint256);
   function getTeamTotalAmount() public view returns(uint256);
   function getLockHistory(address _addr,uint _index) public view returns(uint256,uint256,uint256,bool);
   function getLockLen(address _addr) public view returns(uint256);
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
   function getFathersLength(address _addr) public view returns(uint256);
   function getFather(address _addr,uint256 _index) public view returns(address);
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
  address public reciever;

  uint256 public begin;//2020年4月22日0点0分0秒
  uint256 public end;

  uint256 public iCode;
  uint256 public every = 10 seconds;//1 days;
  uint256 public maxSettleDays = 1;
  uint256 public totalRegister;
  uint256 public totalBalance;
  uint256 public totalBonus;



  uint8 public constant userLevel1 = 20;
  uint8 public constant userLevel2 = 10;
  uint8 public maxlevel = 9;

  /* uint16 public constant comLevel1Users = 100;
  uint16 public constant comLevel2Users = 300;
  uint16 public constant comLevel3Users = 500; */

  //测试的时候就把数字变小一点。
  uint16 public constant comLevel1Users = 2;
  uint16 public constant comLevel2Users = 3;
  uint16 public constant comLevel3Users = 4;

  uint256 public constant comLevel1Amount = 10000 * (10 ** 18);
  uint256 public constant comLevel2Amount = 30000 * (10 ** 18);
  uint256 public constant comLevel3Amount = 50000 * (10 ** 18);

  uint8 public constant comLevel1 = 3;
  uint8 public constant comLevel2 = 5;
  uint8 public constant comLevel3 = 10;
  uint8 public constant inviteLevel1 = 3;//直推3个才能升级网体1
  uint8 public constant inviteLevel2 = 5;
  uint8 public constant inviteLevel3 = 10;
  uint8 public constant withDrawRate = 5;
  uint8 public constant fee = 5;

  /* uint256 public constant withDrawDays = 30 days; */
  //测试限制5分钟
  uint256 public constant withDrawDays = 2 minutes;

  /* address[] private inviteAddr;// A->B->C: inviteAddr= B,A
  address[] private childAddr;// A-->B,A-->C,childAddr= B, C */



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

  mapping (address => uint256) public WithDraws;
  mapping (address => mapping (address => uint256) ) public ABTeamBonus;//A是下级，B是上级，ABBonus就是A给B加速的总数。
  mapping (address => mapping (address => uint256) ) public ABInviteBonus;//A是下级，B是上级，ABBonus就是A给B加速的总数。

  //上面是从原来的合约移植过来的，下面的是本合约自己需要的
  mapping (address => uint256) public DrawTime;
  mapping (address => uint256) public InviteDrawAmount;
  mapping (address => uint256) public TeamDrawAmount;
  //GAS优化

  constructor(address _kolAddress,address _kolpAddress) public {
    kol = KOL(_kolAddress);
    kolp = KOLP(_kolpAddress);
  }


  function querySelfBonus(address _addr) internal view returns(uint256){
    uint256 begin;
    uint256 end;
    uint256 amount;
    bool withDrawed;
    uint256 len = kolp.getLockLen(_addr);
    require(len > 0);
    uint256 selfBonus;
    for (uint i=0; i<len; i++){
      (begin,end,amount,withDrawed) = kolp.getLockHistory(_addr,i);
      if (!withDrawed){
        if (DrawTime[msg.sender] > begin) begin = DrawTime[msg.sender];
        uint256 lastingDays = (now - begin) % every;
        lastingDays = (now - lastingDays) / every;
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
    DrawTime[msg.sender] = now;
    return selfBonus;
  }
  function queryInviteBonus(address _addr) internal view returns(uint256){
    uint256 last = LockInviteBonus[_addr].length - 1;
    uint256 yestodayLastSecond = kolp.getYestodayLastSecond(now);
    uint256 lastDayLastSecond = LockInviteBonus[_addr][last].theDayLastSecond;
    uint256 lastDayInviteBonus = LockInviteBonus[_addr][last].theDayInviteBonus;
    uint256 lastDayInviteTotalBonus = LockInviteBonus[_addr][last].totalInviteBonus;
    uint256 lastingDays;
    uint256 newDayInviteTotalBonus;
    if (lastDayLastSecond < yestodayLastSecond){
      //计算 然后Push一条记录
      lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
      newDayInviteTotalBonus = (lastingDays * lastDayInviteBonus) + lastDayInviteTotalBonus;
      kolp.pushInvite(_addr,yestodayLastSecond,lastDayInviteBonus,0);
      return newDayInviteTotalBonus;
    }else{
      //就是当天，直接取结果
      kolp.setLastInvite(_addr,lastDayInviteBonus,0);
      return lastDayInviteTotalBonus;
    }

  }
  function queryTeamBonus(address _addr) internal view returns(uint256){
    uint256 last = LockTeamBonus[_addr].length - 1;
    uint256 yestodayLastSecond = kolp.getYestodayLastSecond(now);
    uint256 lastDayLastSecond = LockTeamBonus[_addr][last].theDayLastSecond;
    uint256 lastDayTeamBonus = LockTeamBonus[_addr][last].theDayTeamBonus;
    uint256 lastDayTeamTotalBonus = LockTeamBonus[_addr][last].totalTeamBonus;
    uint8 theDayRate = LockTeamBonus[_addr][last].theDayRate;
    uint256 lastingDays;
    uint256 newDayTeamTotalBonus;
    if (lastDayLastSecond < yestodayLastSecond){
      //计算 然后Push一条记录
      lastingDays = (yestodayLastSecond - lastDayLastSecond) / every;
      newDayTeamTotalBonus = (lastingDays * lastDayTeamBonus) + lastDayTeamTotalBonus;
      kolp.pushTeam(_addr,yestodayLastSecond,lastDayTeamBonus,0,theDayRate);
      return newDayTeamTotalBonus;
    }else{
      //就是当天，直接取结果
      kolp.setLastTeam(_addr,lastDayTeamBonus,0,theDayRate);
      return newDayTeamTotalBonus;
    }
  }
  function afterWithdraw(address _addr,uint256 _amount) internal {
    //网体重新设置一下。
    address father;
    uint256 fathersLen = kolp.getFathersLength(_addr);
    for (uint i = 0; i<fathersLen; i++){
      father = kolp.getFather(_addr,i);
      kolp.subTotalUsers(father);
      kolp.subTotalLockingAmount(father,_amount);
      kolp.queryAndSetLevelN(father);
    }

  }
  function withdraw(bool _onlyBonus) public{
    //true: Only Bonus;false:all;
    uint256 selfBonus;
    uint256 inviteBonus;
    uint256 teamBonus;
    uint256 balance;

    selfBonus = querySelfBonus(msg.sender);
    inviteBonus = queryInviteBonus(msg.sender);
    teamBonus = queryTeamBonus(msg.sender);

    uint256 allBonus = selfBonus.add(inviteBonus).add(teamBonus);
    if (!_onlyBonus){
      allBonus += LockBalance[msg.sender];
      afterWithdraw(msg.sender,LockBalance[msg.sender]);
      kolp.clearLock(msg.sender);
    }
    kol.transfer(msg.sender,allBonus);
  }

}
