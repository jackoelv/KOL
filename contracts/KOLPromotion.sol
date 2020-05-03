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
  * title KOL Promotion contract
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
  * title KOL Promotion contract
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
  * title KOL Promotion contract
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

 /**
  * title KOL Promotion contract
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
  * title KOL Promotion contract
  * dev visit: https://github.com/jackoelv/KOL/
 */
 //测试说明，把一天改成1分钟。提现限制为5分钟。
contract KOLPro is Ownable{
  using SafeMath for uint256;
  string public name = "KOL Promotion";
  KOL public kol;
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

  //GAS优化

  event Registed(address _user,uint256 inviteCode);
  event GradeChanged(address _user,uint8 _oldLevel,uint8 _newLevel);
  event WithDraw(address _user,uint256 _amount);
  event WithDrawBalance(address _user,uint256 _balance);


  constructor(address _tokenAddress,address _reciever,uint256 _begin,uint256 _end) public {
    kol = KOL(_tokenAddress);
    begin = _begin;
    begin = _begin;
    end = _end;
    reciever = _reciever;
    InviteCode[0] = owner;
    levelRate[0] = 0;
    levelRate[1] = comLevel1;
    levelRate[2] = comLevel2;
    levelRate[3] = comLevel3;
  }

  function register(uint256 _fInviteCode) public {
    require(now <= end);
    require(RInviteCode[msg.sender] == 0);
    uint256 random = uint256(keccak256(now, msg.sender)) % 100;
    uint256 _myInviteCode = iCode.add(random);
    iCode = iCode.add(random);

    require(InviteCode[_myInviteCode] == address(0));
    require(InviteCode[_fInviteCode] != address(0));
    InviteCode[_myInviteCode] = msg.sender;
    RInviteCode[msg.sender] = _myInviteCode;
    emit Registed(msg.sender,iCode);
    totalRegister ++;
    address father = InviteCode[_fInviteCode];
    InviteRelation[msg.sender] = father;

    ChildAddrs[father].push(msg.sender);
    if (InviteList[msg.sender].length < 9){
      InviteList[msg.sender].push(father);
    }
    for (uint i = 0 ; i < InviteList[father].length; i++){
      if (InviteList[msg.sender].length < 9){
        InviteList[msg.sender].push(InviteList[father][i]);
      }else{
        break;
      }

    }

  }
  /**
   * title 转入KOL进行持仓生息
   * _usdtOrCoin, true:金本位; false:币本位
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function join(uint256 _amount,bool _usdtOrCoin) public {
    require(now <= end);
    if (LockBalance[msg.sender] == 0) USDTOrCoin[msg.sender] = _usdtOrCoin;
    kol.transferFrom(msg.sender,address(this),_amount);
    LockHistory[msg.sender].push(lock(now,_amount,0,false));
    uint256 oldBalance = LockBalance[msg.sender];
    LockBalance[msg.sender] = LockBalance[msg.sender].add(_amount);
    totalBalance = totalBalance.add(_amount);

    uint256 amount3;//amount*3/1000以后

    for (uint i = 0; i<InviteList[msg.sender].length; i++){
      if (i == maxlevel) break;
      if (LockHistory[msg.sender].length == 1){
        //给上面的人数+1
        TotalUsers[InviteList[msg.sender][i]] += 1;
      }else{
        if (oldBalance == 0) TotalUsers[InviteList[msg.sender][i]] += 1;
      }
      //给上面的加入团队总金额

      TotalLockingAmount[InviteList[msg.sender][i]] = TotalLockingAmount[InviteList[msg.sender][i]].add(_amount);
      queryAndSetLevelN(InviteList[msg.sender][i]);

      amount3 = calcuDiffAmount(msg.sender,InviteList[msg.sender][i],_amount);


      if (i<2){
        if (LockInviteBonus[InviteList[msg.sender][i]].length == 0){
          initInviteBonus(msg.sender,InviteList[msg.sender][i],amount3,i);
        }else{
          setTopInviteBonus(msg.sender,InviteList[msg.sender][i],amount3,i);
        }
      }

      if (i < maxlevel){
        if (LockTeamBonus[InviteList[msg.sender][i]].length == 0){
          initTeamBonus(msg.sender,InviteList[msg.sender][i],amount3);
        }else{
          setTopTeamBonus(msg.sender,InviteList[msg.sender][i],amount3);
        }
      }




    }
  }
  function calcuDiffAmount(address _selfAddr,address _topAddr,uint256 _amount) internal view returns(uint256){
    //计算网体收益加速额。
    uint256 topDayLockBalance = queryLockBalance(_topAddr,now);
    uint256 selfDayLockBalance = queryLockBalance(_selfAddr,now);
    uint256 minAmount;
    if (topDayLockBalance >= selfDayLockBalance){
      minAmount = _amount;
    }else{
      uint256 diff = selfDayLockBalance - topDayLockBalance;
      if (diff >= _amount){
        minAmount = 0;//完全烧伤
        return;
      }
      else{
        minAmount = diff;//部分烧伤
      }
    }
    return minAmount.mul(3).div(1000);
  }
  function initTeamBonus(address _selfAddr,address _topAddr,uint256 _minAmount) internal {
    uint256 tomorrowLastSecond = getYestodayLastSecond(now) + 2 * every;
    uint8 newRate = levelRate[isLevelN[_topAddr]];
    setTeamBonus(_selfAddr,_topAddr,_minAmount);
    LockTeamBonus[_topAddr].push(dayTeamBonus(tomorrowLastSecond,
                                          _minAmount,
                                          _minAmount * newRate / 100,
                                          newRate));
  }
  function initInviteBonus(address _selfAddr,address _topAddr,uint256 _minAmount,uint256 _index) internal {
    uint8 inviteRate;
    if (_index == 0){
      inviteRate = userLevel1;
    }else if(_index ==1){
      inviteRate = userLevel2;
    }else{
      return;
    }

    uint256 tomorrowLastSecond = getYestodayLastSecond(now) + 2 * every;

    setTeamBonus(_selfAddr,_topAddr,_minAmount);
    LockInviteBonus[_topAddr].push(dayInviteBonus(tomorrowLastSecond,
                                          _minAmount * inviteRate/100,
                                          _minAmount * inviteRate/100));



  }
  function setTopTeamBonus(address _selfAddr,address _topAddr,uint256 _minAmount) internal {
    uint256 tomorrowLastSecond = getYestodayLastSecond(now) + 2 * every;
    uint256 last = LockTeamBonus[_topAddr].length -1;

    uint256 lastDayLastSecond = LockTeamBonus[_topAddr][last].theDayLastSecond;
    uint256 lastDayTeamBonus = LockTeamBonus[_topAddr][last].theDayTeamBonus;
    uint256 lastDayTeamTotalBonus = LockTeamBonus[_topAddr][last].totalTeamBonus;
    uint8 lastDayRate = LockTeamBonus[_topAddr][last].theDayRate;

    uint256 lastingDays = (tomorrowLastSecond - lastDayLastSecond) % every +1;

    uint8 level = isLevelN[_topAddr];
    uint8 newRate = levelRate[level];
    uint256 newDayTeamBonus = _minAmount + lastDayTeamBonus;
    setTeamBonus(_selfAddr,_topAddr,_minAmount);
    uint256 newDayTeamTotalBonus = (lastingDays * lastDayTeamBonus * lastDayRate/100) + _minAmount * newRate / 100 + lastDayTeamTotalBonus;
      //必然就都是明天。
    if(lastDayLastSecond < tomorrowLastSecond){
      LockTeamBonus[_topAddr].push(dayTeamBonus(tomorrowLastSecond,
                                            newDayTeamBonus,
                                            newDayTeamTotalBonus,
                                            newRate));
    }else{
      LockTeamBonus[_topAddr][last].theDayTeamBonus = newDayTeamBonus;
      LockTeamBonus[_topAddr][last].totalTeamBonus = newDayTeamTotalBonus;
      LockTeamBonus[_topAddr][last].theDayRate = newRate;
    }

  }
  function setTopInviteBonus(address _selfAddr,address _topAddr,uint256 _minAmount,uint256 _index) internal {
    uint8 inviteRate;
    if (_index == 0){
      inviteRate = userLevel1;
    }else if(_index ==1){
      inviteRate = userLevel2;
    }else{
      return;
    }
    uint256 tomorrowLastSecond = getYestodayLastSecond(now) + 2 * every;
    uint256 last = LockInviteBonus[_topAddr].length -1;

    uint256 lastDayLastSecond = LockInviteBonus[_topAddr][last].theDayLastSecond;
    uint256 lastDayInviteBonus = LockInviteBonus[_topAddr][last].theDayInviteBonus;
    uint256 lastDayInviteTotalBonus = LockInviteBonus[_topAddr][last].totalInviteBonus;

    uint256 lastingDays = (tomorrowLastSecond - lastDayLastSecond) % every;
    uint256 newDayInviteBonus = _minAmount* inviteRate / 100 + lastDayInviteBonus;
    setInviteBonus(_selfAddr,_topAddr,_minAmount);
    uint256 newDayInviteTotalBonus = (lastingDays * lastDayInviteBonus * inviteRate / 100) + _minAmount * inviteRate /100 + lastDayInviteTotalBonus;
      //必然就都是明天。
    if(lastDayLastSecond < tomorrowLastSecond){
      LockInviteBonus[_topAddr].push(dayInviteBonus(tomorrowLastSecond,
                                            newDayInviteBonus,
                                            newDayInviteTotalBonus));
    }else{
      LockInviteBonus[_topAddr][last].theDayInviteBonus = newDayInviteBonus;
      LockInviteBonus[_topAddr][last].totalInviteBonus = newDayInviteTotalBonus;
    }

  }
  function setTeamBonus(address _selfAddr,address _topAddr,uint256 _amount) internal {
    ABTeamBonus[_selfAddr][_topAddr] += _amount;
  }
  function setInviteBonus(address _selfAddr,address _topAddr,uint256 _amount) internal {
    ABInviteBonus[_selfAddr][_topAddr] += _amount;
  }
  /**
   * title 查询并设置用户的身份级别
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function queryAndSetLevelN(address _addr) public{
    if ((TotalUsers[_addr] >= comLevel3Users) &&
              (TotalLockingAmount[_addr] >= comLevel3Amount) &&
              ChildAddrs[_addr].length>=inviteLevel3){
      if (isLevelN[_addr]!=3){
        emit GradeChanged(_addr,isLevelN[_addr],3);
        isLevelN[_addr] = 3;
        TeamRateList[_addr].push(teamRate(3,now));
      }
    }else if((TotalUsers[_addr] >= comLevel2Users) &&
              (TotalLockingAmount[_addr] >= comLevel2Amount) &&
              ChildAddrs[_addr].length>=inviteLevel2){
      if (isLevelN[_addr]!=2){
        emit GradeChanged(_addr,isLevelN[_addr],2);
        isLevelN[_addr] = 2;
        TeamRateList[_addr].push(teamRate(2,now));
      }
    }else if((TotalUsers[_addr] >= comLevel1Users) &&
              (TotalLockingAmount[_addr] >= comLevel1Amount) &&
              ChildAddrs[_addr].length>=inviteLevel1){
      if (isLevelN[_addr]!=1){
        emit GradeChanged(_addr,isLevelN[_addr],1);
        isLevelN[_addr] = 1;
        TeamRateList[_addr].push(teamRate(1,now));
      }
    }else{
      if (isLevelN[_addr]!=0){
        emit GradeChanged(_addr,isLevelN[_addr],0);
        isLevelN[_addr] = 0;
        TeamRateList[_addr].push(teamRate(0,now));
      }
    }
  }
  /**
   * title 查询指定时间用户的有效锁仓余额
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function queryLockBalance(address _addr,uint256 _queryTime) public view returns(uint256) {
    require(_queryTime <= end);
    uint256 dayLockBalance;
    for (uint j = 0; j<LockHistory[_addr].length; j++){
      if (LockHistory[_addr][j].withDrawed){
        //如果是已经提现的资金，那就要求计算日期是在起止时间内的。
        if ((_queryTime >= LockHistory[_addr][j].begin) && (_queryTime <= LockHistory[_addr][j].end)){
            dayLockBalance += LockHistory[_addr][j].amount;
        }
      }else{
        if (_queryTime >= LockHistory[_addr][j].begin ){
          //这个就要计入到当天的收益
          dayLockBalance += LockHistory[_addr][j].amount;
        }
      }
    }
    return dayLockBalance;
  }

  /**
   * title 根据给定时间计算出昨天的最后一秒
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getYestodayLastSecond(uint256 _queryTime) public view returns(uint256){
    //录入的价格为4位小数
    /* return (_queryTime.sub(_queryTime.sub(begin) % 86400) - 1); */
    //测试 上一分钟的最后一秒
    require(_queryTime <= (end + every));
    return (_queryTime.sub(_queryTime.sub(begin) % every) - 1);
  }
  /**
   * title 获得自己的邀请码
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getCode() public view returns(uint256) {
    return (RInviteCode[msg.sender]);
  }
  /**
   * title 查询自己的直推下级
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getTeam() public view returns(address[]) {
    return (ChildAddrs[msg.sender]);
  }
  function getFathers() public view returns(address[]) {
    return (InviteList[msg.sender]);
  }
  /**
   * title 查询自己的网体人数
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getTeamTotalUsers() public view returns(uint256) {
    return (TotalUsers[msg.sender]);
  }
  /**
   * title 查询自己的网体金额
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getTeamTotalAmount() public view returns(uint256) {
    return (TotalLockingAmount[msg.sender]);
  }
  /**
   * title 查询自己的锁仓历史
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getLockHistory(uint _index) public view returns(uint256,uint256,uint256,bool,uint256) {
    require( (_index<(LockHistory[msg.sender].length)) && (_index>=0) );
    return(LockHistory[msg.sender][_index].begin,
                LockHistory[msg.sender][_index].end,
                LockHistory[msg.sender][_index].amount,
                LockHistory[msg.sender][_index].withDrawed,
                LockHistory[msg.sender].length);
  }

  /**
   * title 查询自己过去每日的收益汇总。
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getHistoryTeamBonus(address _addr,uint256 _index) public view returns(uint256,uint256,uint256,uint256,uint256){
    //返回查询昨天的收益。
    if (LockTeamBonus[_addr].length > _index){
      return (LockTeamBonus[_addr][_index].theDayLastSecond,
              LockTeamBonus[_addr][_index].theDayTeamBonus,
              LockTeamBonus[_addr][_index].totalTeamBonus,
              LockTeamBonus[_addr][_index].theDayRate,
              LockTeamBonus[_addr].length);
    }else{
      return(0,0,0,0,0);
    }
  }
  function getHistoryInviteBonus(address _addr,uint256 _index) public view returns(uint256,uint256,uint256,uint256){
    //返回查询昨天的收益。
    if (LockInviteBonus[_addr].length > _index){
      return (LockInviteBonus[_addr][_index].theDayLastSecond,
              LockInviteBonus[_addr][_index].theDayInviteBonus,
              LockInviteBonus[_addr][_index].totalInviteBonus,
              LockInviteBonus[_addr].length);
    }else{
      return(0,0,0,0);
    }
  }

  /**
   * title 查询某个特定时间用户的等级
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getTeamRateList(address _addr,uint256 _index) public view returns(uint256,uint256,uint256){
    require(_index < TeamRateList[msg.sender].length);
    return(TeamRateList[msg.sender][_index].rate,
          TeamRateList[msg.sender][_index].changeTime,
          TeamRateList[msg.sender].length);
  }
  /**
   * title 录入KOL的收盘价
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function putClosePrice(uint256 price,uint256 _queryTime) onlyOwner public{
    //录入的价格为4位小数
    require(_queryTime <= end);
    uint256 yestodayLastSecond = getYestodayLastSecond(_queryTime);
    ClosePrice[yestodayLastSecond] = price;

  }
  function setReciever(address _addr) onlyOwner public{
    reciever = _addr;
  }

}
