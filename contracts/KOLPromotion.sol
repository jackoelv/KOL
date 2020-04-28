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
  struct dayBonus{
    uint256 theDayLastSecond;
    uint256 theDayTeamBonus;
    uint256 totalTeamBonus;
    uint256 theDayInviteBonus;
    uint256 totalInviteBonus;
    uint8 theDayRate;
  }
  mapping (address => address[]) internal InviteList;
  mapping (address => address[]) internal ChildAddrs;
  mapping (address => teamRate[]) internal TeamRateList;
  mapping (address => lock[]) internal LockHistory;
  mapping (address => uint256) internal LockBalance;
  mapping (address => dayBonus[]) internal LockTeamBonus;
  mapping (address => uint256) internal InviteHistoryBonus;
  mapping (address => uint256) internal InviteCurrentDayBonus;

  mapping (address => address) internal InviteRelation;//A=>B B is father;
  mapping (uint256 => uint256) public ClosePrice;//需要给个默认值，而且还允许修改，否则忘记就很麻烦了。
  mapping (address => uint256) internal TotalUsers;
  mapping (address => uint256) internal TotalLockingAmount;
  mapping (uint256 => address) public InviteCode;
  mapping (address => uint256) public RInviteCode;

  mapping (address => uint8) internal isLevelN;
  mapping (uint8 => uint8) internal levelRate;
  mapping (address => bool) public USDTOrCoin;

  mapping (address => uint256) internal WithDraws;
  mapping (address => mapping (address => uint256) ) ABTeamBonus;//A是下级，B是上级，ABBonus就是A给B加速的总数。
  mapping (address => mapping (address => uint256) ) ABInviteBonus;//A是下级，B是上级，ABBonus就是A给B加速的总数。

  //GAS优化

  event Registed(address _user,uint256 inviteCode);
  event GradeChanged(address _user,uint8 _oldLevel,uint8 _newLevel);
  event WithDraw(address _user,uint256 _amount);
  event WithDrawBalance(address _user,uint256 _balance);


  constructor(address _tokenAddress,address _reciever,uint256 _begin,uint256 _end) public {
    kol = KOL(_tokenAddress);
    begin = _begin;
    end = _end;
    reciever = _reciever;
    InviteCode[0] = owner;
    levelRate[0] = 0;
    levelRate[1] = comLevel1;
    levelRate[2] = comLevel2;
    levelRate[3] = comLevel3;
  }
  /**
   * title 提现KOL到自己的账户
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function withDraw(bool _type) public {
    //_type true，提利息，false，提本息
    //提现就把利息全部提走，只能提整数，不能提小数点。
    //如果是提现本金，需要判断一下用户是否满足自由提现的条件。
    uint256 balance;
    require(LockBalance[msg.sender] > 0);
    uint256 selfBonus = calcuBonus(msg.sender,now);
    uint256 teamBonus;
    uint256 inviteBonus;
    uint256 index;
    (teamBonus,  inviteBonus,  index) = calcuTeamBonus(msg.sender,now);
    uint256 allBonus = selfBonus + teamBonus + inviteBonus;

    uint256 currentTime;
    if (now > end)
      currentTime = end;
    else
      currentTime = now;

    /* require(LockHistoryBonus[msg.sender].length > 0);


    uint256 last = LockHistoryBonus[msg.sender].length - 1;
    uint256 leftBonus = LockHistoryBonus[msg.sender][last].leftBonus;
    if ((LockHistoryBonus[msg.sender][last].theDayLastSecond + every + 1) < currentTime){
      _type = true;
    } */


    if (!_type) {
      //本息一起提
      //今天凌晨的时间
      //提本金，先判断是否符合条件，一旦提了本金就要注意给上级网体降级减少网体的加速。
      if ((TotalLockingAmount[msg.sender] < LockBalance[msg.sender].mul(withDrawRate)) &&
                                    (currentTime < LockHistory[msg.sender][0].begin + withDrawDays)){
          //没有达到提现要求
          return;
      }else{

        /* last = LockHistoryBonus[msg.sender].length - 1;
        leftBonus = LockHistoryBonus[msg.sender][last].leftBonus; */
        for (uint j = 0; j<LockHistory[msg.sender].length; j++){
          LockHistory[msg.sender][j].end = currentTime;
          LockHistory[msg.sender][j].withDrawed = true;
        }
        balance = LockBalance[msg.sender];
        emit WithDrawBalance(msg.sender,balance);
        /* kol.transfer(msg.sender,balance); */
        LockBalance[msg.sender] = 0;
        afterDraw(msg.sender,balance,teamBonus,inviteBonus,index);//提现以后需要对上级所有的网体人数和金额做减法。
      }

    }
    uint256 realWithdraw = allBonus.mul(100-fee).div(100).add(balance);
    require(realWithdraw > 0);
    WithDraws[msg.sender] += realWithdraw;
    kol.transfer(msg.sender,realWithdraw);
    emit WithDraw(msg.sender,realWithdraw);
    kol.transfer(reciever,allBonus.mul(fee).div(100));
  }
  /**
   * title 提现以后上级的处理
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function afterDraw(address _addr,uint256 _amount,uint256 _teamBonus,uint256 _inviteBonus,uint256 _lockIndex) private{
    for (uint i = 0; i<InviteList[_addr].length; i++){
        require(TotalUsers[InviteList[_addr][i]] > 0);
        TotalUsers[InviteList[_addr][i]] -= 1;
        //给上面的加入团队总金额
        TotalLockingAmount[InviteList[_addr][i]] = TotalLockingAmount[InviteList[_addr][i]].sub(_amount);
        queryAndSetLevelN(InviteList[_addr][i]);
        LockTeamBonus[_addr][_lockIndex].totalTeamBonus = 0;
        LockTeamBonus[_addr][_lockIndex].totalInviteBonus =0;
        uint256 last = LockTeamBonus[_addr].length -1;
        //
        for (uint j = _lockIndex+1; j<=last; j++){
          LockTeamBonus[_addr][j].theDayTeamBonus -= ABTeamBonus[_addr][InviteList[_addr][i]];
          LockTeamBonus[_addr][j].totalTeamBonus -=_teamBonus;
          LockTeamBonus[_addr][j].theDayInviteBonus -= ABInviteBonus[_addr][InviteList[_addr][i]];
          LockTeamBonus[_addr][j].totalInviteBonus -=_inviteBonus;
        }
        ABTeamBonus[_addr][InviteList[_addr][i]] =0;
        ABInviteBonus[_addr][InviteList[_addr][i]] =0;
    }
  }
  /**
   * title 注册并绑定邀请关系
   * dev visit: https://github.com/jackoelv/KOL/
  */
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

    InviteList[msg.sender].push(father);
    for (uint i = 0 ; i < InviteList[father].length; i++){
      InviteList[msg.sender].push(InviteList[father][i]);
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

    for (uint i = 0; i<InviteList[msg.sender].length; i++){

      if (LockHistory[msg.sender].length == 1){
        //给上面的人数+1
        TotalUsers[InviteList[msg.sender][i]] += 1;
      }else{
        if (oldBalance == 0) TotalUsers[InviteList[msg.sender][i]] += 1;
      }
      //给上面的加入团队总金额
      TotalLockingAmount[InviteList[msg.sender][i]] = TotalLockingAmount[InviteList[msg.sender][i]].add(_amount);
      queryAndSetLevelN(InviteList[msg.sender][i]);
      calcuTopTeamBonus(msg.sender,InviteList[msg.sender][i],_amount,i);

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
  function calcuTopTeamBonus(address _selfAddr,address _topAddr,uint256 _amount,uint256 _index) internal {
    uint256 minAmount = calcuDiffAmount(_selfAddr,_topAddr,_amount);
    //准备好前后的数据
    //index = 0（上级），2（上级的上级），3（上级的上级以及上级）
    uint256 lastDayLastSecond;
    uint256 lastDayTeamBonus;
    uint256 lastDayTeamTotalBonus;
    uint256 lastDayInviteBonus;
    uint256 lastDayInviteTotalBonus;
    uint8 lastDayRate;
    uint8 inviteRate;
    bool isNew;
    uint256 lastingDays;
    uint256 tomorrowLastSecond = getYestodayLastSecond(now) + 2 * every;

    if (_index == 0){
      inviteRate = userLevel1;
    }else if(_index ==1){
      inviteRate = userLevel2;
    }else{
      inviteRate = 0;
    }

    if (LockTeamBonus[_topAddr].length == 0) {
      lastDayTeamBonus = 0;
      lastDayTeamTotalBonus=0;
      lastDayInviteBonus =0;
      lastDayInviteTotalBonus =0;
      lastDayRate =0;
      isNew = true;
    }else{
      uint256 last = LockTeamBonus[_topAddr].length -1;
      lastDayLastSecond = LockTeamBonus[_topAddr][last].theDayLastSecond;
      lastDayTeamBonus = LockTeamBonus[_topAddr][last].theDayTeamBonus;
      lastDayTeamTotalBonus = LockTeamBonus[_topAddr][last].totalTeamBonus;
      lastDayInviteBonus = LockTeamBonus[_topAddr][last].theDayInviteBonus;
      lastDayInviteTotalBonus =  LockTeamBonus[_topAddr][last].totalInviteBonus;
      lastDayRate = LockTeamBonus[_topAddr][last].theDayRate;
      if (lastDayLastSecond < tomorrowLastSecond){
        isNew = true;
        lastingDays = (tomorrowLastSecond - lastDayLastSecond) % every;
      }
    }
    uint8 newRate = levelRate[isLevelN[_topAddr]];
    uint256 newDayTeamBonus = minAmount + lastDayTeamBonus;
    ABTeamBonus[_selfAddr][_topAddr] += minAmount;
    uint256 newDayTeamTotalBonus = (lastingDays * lastDayTeamBonus * lastDayRate) + minAmount * newRate + lastDayTeamTotalBonus;
    uint256 newDayInviteBonus = minAmount * inviteRate + lastDayInviteBonus;
    ABInviteBonus[_selfAddr][_topAddr] += minAmount * inviteRate;
    uint256 newDayInviteTotalBonus = (lastingDays * lastDayInviteBonus) + minAmount * inviteRate + lastDayInviteTotalBonus;

    if (isNew){
      LockTeamBonus[_topAddr].push(dayBonus(tomorrowLastSecond,
                                                  newDayTeamBonus,
                                                  newDayTeamTotalBonus,
                                                  newDayInviteBonus,
                                                  newDayInviteTotalBonus,
                                                  newRate));

    }else{
      //必然就都是明天。
      LockTeamBonus[_topAddr][last].theDayTeamBonus = newDayTeamBonus;
      LockTeamBonus[_topAddr][last].totalTeamBonus = newDayTeamTotalBonus;
      LockTeamBonus[_topAddr][last].theDayInviteBonus = newDayInviteBonus;
      LockTeamBonus[_topAddr][last].totalInviteBonus = newDayInviteTotalBonus;
      LockTeamBonus[_topAddr][last].theDayRate = newRate;
    }

  }
  /**
   * title 查询并设置用户的身份级别
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function queryAndSetLevelN(address _addr) internal{
    if ((TotalUsers[_addr] >= comLevel3Users) && (TotalLockingAmount[_addr] >= comLevel3Amount)){
      if (isLevelN[_addr]!=3){
        emit GradeChanged(_addr,isLevelN[_addr],3);
        isLevelN[_addr] = 3;
        TeamRateList[_addr].push(teamRate(3,now));
      }
    }else if((TotalUsers[_addr] >= comLevel2Users) && (TotalLockingAmount[_addr] >= comLevel2Amount)){
      if (isLevelN[_addr]!=2){
        emit GradeChanged(_addr,isLevelN[_addr],2);
        isLevelN[_addr] = 2;
        TeamRateList[_addr].push(teamRate(2,now));
      }
    }else if((TotalUsers[_addr] >= comLevel1Users) && (TotalLockingAmount[_addr] >= comLevel1Amount)){
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
   * title 查询到指定时间点，用户累计的持币生息收益，建议输入时间为当天的11点59分
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function calcuBonus(address _addr,uint256 _queryTime) private view returns(uint256) {
    // 一会儿再来修改。-- 4.28输入参数为查询的时间。
    //返回值为截止到查询时间之前当天的静态收益。
    //金本位考虑进来。
    require(_queryTime <= end);
    uint256 tmpBonus;
    uint256 yestodayLastSecond;
    uint256 theDaylastSecond;
    uint256 tmpCalcu;
    if (LockHistory[_addr].length > 0){
      for (uint i = 0; i<LockHistory[_addr].length; i++){
        if  (!LockHistory[_addr][i].withDrawed){
          if (_queryTime > LockHistory[_addr][i].begin){
            uint256 lastingDays = (_queryTime - LockHistory[_addr][i].begin) % every;
            if (USDTOrCoin[_addr]){
              yestodayLastSecond = getYestodayLastSecond(_queryTime);
              theDaylastSecond = getYestodayLastSecond(LockHistory[_addr][i].begin) + every;
              for (uint j = theDaylastSecond; j<=yestodayLastSecond; j=j+every){
                tmpCalcu += LockHistory[_addr][i].amount * 3 / 1000 * ClosePrice[theDaylastSecond] / ClosePrice[j];
              }
            }else{
              tmpCalcu += lastingDays * LockHistory[_addr][i].amount * 3 / 1000;
            }
          }
        }

      }
    }
    return tmpBonus;
  }

  function calcuBonusP(uint256 _queryTime) public view returns(uint256){
    return(calcuBonus(msg.sender,_queryTime));
  }
  /**
   * title 查询指定时间用户的有效锁仓余额
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function queryLockBalance(address _addr,uint256 _queryTime) private view returns(uint256) {
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

  function queryLockBalanceP(uint256 _queryTime) public view returns(uint256){
    return(queryLockBalance(msg.sender,_queryTime));
  }
  /**
   * title 查询并计算用户的网体收益
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function calcuTeamBonus(address _addr,uint256 _queryTime) private view returns(uint256,uint256,uint256) {
    require(_queryTime <= end);
    dayBonus[] tmpStruct = LockTeamBonus[_addr];
    uint256 last =tmpStruct.length -1;
    uint256 yestodayLastSecond = getYestodayLastSecond(_queryTime);
    uint256 lastDayLastSecond;
    uint256 theDay;
    uint256 index;
    for (uint i=last; i>=0; i--){
      lastDayLastSecond=LockTeamBonus[_addr][i].theDayLastSecond;
      if (lastDayLastSecond<=yestodayLastSecond){
        theDay = lastDayLastSecond;
        index = i;
        break;
      }
    }
    if (theDay > 0){
      //找到了这样一条
      uint256 lastingDays = (yestodayLastSecond - theDay) % every;
      dayBonus theDayBonusStruct = LockTeamBonus[_addr][index];
      uint256 teamBonus = lastingDays * theDayBonusStruct.theDayTeamBonus +  theDayBonusStruct.totalTeamBonus;
      uint256 inviteBonus = lastingDays * theDayBonusStruct.theDayInviteBonus +  theDayBonusStruct.totalInviteBonus;
      /* LockTeamBonus[_addr][index].totalTeamBonus = 0;
      LockTeamBonus[_addr][index].totalInviteBonus =0;
      for (i = index+1; i<=last; i++){
        LockTeamBonus[_addr][i].totalTeamBonus -=teamBonus;
        LockTeamBonus[_addr][i].totalInviteBonus -=inviteBonus;
      } */
      return(teamBonus,inviteBonus,index);


    }else{
      return (0,0,0);
    }

  }
  function calcuTeamBonusP(uint256 _queryTime) public view returns(uint256,uint256,uint256){
    return(calcuTeamBonus(msg.sender,_queryTime));
  }
  /**
   * title 根据给定时间计算出昨天的最后一秒
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getYestodayLastSecond(uint256 _queryTime) private view returns(uint256){
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
  function getHistoryTeamBonus(address _addr,uint256 _index) private view returns(uint256,uint256,uint256,uint256,uint256){
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
  function getHistoryInviteBonus(address _addr,uint256 _index) private view returns(uint256,uint256,uint256,uint256,uint256){
    //返回查询昨天的收益。
    if (LockTeamBonus[_addr].length > _index){
      return (LockTeamBonus[_addr][_index].theDayLastSecond,
              LockTeamBonus[_addr][_index].theDayInviteBonus,
              LockTeamBonus[_addr][_index].totalInviteBonus,
              LockTeamBonus[_addr][_index].theDayRate,
              LockTeamBonus[_addr].length);
    }else{
      return(0,0,0,0,0);
    }
  }
  /**
   * title 查询自己过去每日的收益汇总。
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getMyHistoryBonus(uint256 _index,bool _type) public view returns(uint256,uint256,uint256,uint256,uint256){
    //返回查询昨天的收益。
    if (_type)
      return (getHistoryTeamBonus(msg.sender,_index));
    else
      return (getHistoryInviteBonus(msg.sender,_index));
  }

  /**
   * title 查询某个特定时间用户的等级
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getTeamRateList(address _addr,uint256 _queryTime) private view returns(uint256){
    require(_queryTime <= end);
    uint256 index;
    if (TeamRateList[_addr].length == 0){
      return (0);
    }else{
      for (uint i = 0; i<TeamRateList[_addr].length; i++){
        if (i < TeamRateList[_addr].length -1){
          if (( _queryTime >= TeamRateList[_addr][i].changeTime ) &&
                    ( _queryTime <= TeamRateList[_addr][i+1].changeTime )){
            index = i+1;
          }
        }else{
          if ( _queryTime >= TeamRateList[_addr][i].changeTime ){
            index = i+1;
          }
        }

      }
      return(index);
    }
  }

  function getMyTeamRateList(uint256 _queryTime) public view returns(uint8,uint256){
    uint256 index = getTeamRateList(msg.sender,_queryTime);
    if (index == 0) {
      return (0,0);
    }else{
      return(TeamRateList[msg.sender][index].rate,TeamRateList[msg.sender][index].changeTime);
    }
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
