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
    uint256 theDayAllBonus;
    uint256 leftBonus;
  }

  mapping (address => address[]) internal InviteList;
  mapping (address => address[]) internal ChildAddrs;
  mapping (address => teamRate[]) internal TeamRateList;
  mapping (address => lock[]) internal LockHistory;
  mapping (address => uint256) internal LockBalance;
  mapping (address => dayBonus[]) internal LockHistoryBonus;
  mapping (address => uint256) internal InviteHistoryBonus;
  mapping (address => uint256) internal InviteCurrentDayBonus;

  mapping (address => address) internal InviteRelation;//A=>B B is father;
  mapping (uint256 => uint256) public ClosePrice;//需要给个默认值，而且还允许修改，否则忘记就很麻烦了。
  mapping (address => uint256) internal TotalUsers;
  mapping (address => uint256) internal TotalLockingAmount;
  mapping (uint256 => address) public InviteCode;
  mapping (address => uint256) public RInviteCode;

  mapping (address => uint8) internal isLevelN;
  mapping (address => bool) public USDTOrCoin;

  mapping (address => uint256) internal WithDraws;
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
    settlement(0);
    require(LockHistoryBonus[msg.sender].length > 0);
    uint256 currentTime;
    if (now > end)
      currentTime = end;
    else
      currentTime = now;

    uint256 last = LockHistoryBonus[msg.sender].length - 1;
    uint256 leftBonus = LockHistoryBonus[msg.sender][last].leftBonus;
    if ((LockHistoryBonus[msg.sender][last].theDayLastSecond + every + 1) < currentTime){
      _type = true;
    }


    if (!_type) {
      //本息一起提
      //今天凌晨的时间
      //提本金，先判断是否符合条件，一旦提了本金就要注意给上级网体降级减少网体的加速。
      if ((TotalLockingAmount[msg.sender] < LockBalance[msg.sender].mul(withDrawRate)) &&
                                    (currentTime < LockHistory[msg.sender][0].begin + withDrawDays)){
          //没有达到提现要求
          return;
      }else{

        last = LockHistoryBonus[msg.sender].length - 1;
        leftBonus = LockHistoryBonus[msg.sender][last].leftBonus;
        for (uint j = 0; j<LockHistory[msg.sender].length; j++){
          LockHistory[msg.sender][j].end = currentTime;
          LockHistory[msg.sender][j].withDrawed = true;
        }
        balance = LockBalance[msg.sender];
        emit WithDrawBalance(msg.sender,balance);
        /* kol.transfer(msg.sender,balance); */
        LockBalance[msg.sender] = 0;
        afterDraw(msg.sender,balance);//提现以后需要对上级所有的网体人数和金额做减法。
      }

    }
    uint256 realWithdraw = leftBonus.mul(100-withDrawRate).div(100).add(balance);
    require(realWithdraw > 0);
    WithDraws[msg.sender] += realWithdraw;
    kol.transfer(msg.sender,realWithdraw);
    emit WithDraw(msg.sender,realWithdraw);
    kol.transfer(reciever,leftBonus.mul(withDrawRate).div(100));
    LockHistoryBonus[msg.sender][last].leftBonus = 0;
  }
  /**
   * title 提现以后上级的处理
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function afterDraw(address _addr,uint256 _amount) private{
    for (uint i = 0; i<InviteList[_addr].length; i++){
        require(TotalUsers[InviteList[_addr][i]] > 0);
        TotalUsers[InviteList[_addr][i]] -= 1;
        //给上面的加入团队总金额
        TotalLockingAmount[InviteList[_addr][i]] = TotalLockingAmount[InviteList[_addr][i]].sub(_amount);
        queryAndSetLevelN(InviteList[_addr][i]);
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
   * title 查询到指定时间点，当天用户的持币生息收益，建议输入时间为当天的11点59分
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function calcuBonus(address _addr,uint256 _queryTime) private view returns(uint256) {
    //输入参数为查询的时间。
    //返回值为截止到查询时间之前当天的静态收益。
    //金本位考虑进来。
    require(_queryTime <= end);
    uint256 tmpBonus;
    uint256 todayLastSecond;
    uint256 theDaylastSecond;
    uint256 tmpCalcu;
    if (LockHistory[_addr].length > 0){
      for (uint i = 0; i<LockHistory[_addr].length; i++){

        bool drawed = (LockHistory[_addr][i].withDrawed) &&
                    (_queryTime >= LockHistory[_addr][i].begin) &&
                    (_queryTime <= LockHistory[_addr][i].end);

        bool noDrawed = (!LockHistory[_addr][i].withDrawed) &&
                    (_queryTime >= LockHistory[_addr][i].begin);

        if (drawed || noDrawed){
            if (USDTOrCoin[_addr]){
              //金本位
              todayLastSecond = getYestodayLastSecond(_queryTime) + every;
              theDaylastSecond = getYestodayLastSecond(LockHistory[_addr][i].begin) + every;
              tmpCalcu = LockHistory[_addr][i].amount;
              tmpCalcu = tmpCalcu.mul(ClosePrice[theDaylastSecond]).mul(3).div(1000);
              tmpCalcu = tmpCalcu.div(ClosePrice[todayLastSecond]);
              tmpBonus += tmpCalcu;
            }else{
              //币本位
              tmpCalcu = LockHistory[_addr][i].amount;
              tmpCalcu = tmpCalcu.mul(3).div(1000);
              tmpBonus += tmpCalcu;
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
   * title 查询到指定时间点，计算用户当天的推广收益
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function calcuInviteBonus(address _addr,uint256 _queryTime) private view returns(uint256) {
    //直推，直推的直推，比较金额，计算佣金。
    //先计算直推的
    require(_queryTime <= end);
    address[] childUser = ChildAddrs[_addr];

    uint256 dayLockBalance;//先算出这一天他的有效锁仓余额是多少
    uint256 childLockBalance;
    uint256 child2LockBalance;

    uint256 level1Bonus;
    uint256 level2Bonus;

    dayLockBalance = queryLockBalance(_addr,_queryTime);

    for (uint i = 0; i<childUser.length; i++){
      //每个直推独立计算
      childLockBalance = queryLockBalance(childUser[i],_queryTime);
      if (dayLockBalance >= childLockBalance){
        level1Bonus += childLockBalance.mul(3).div(1000).mul(userLevel1).div(100);
      }else{
        level1Bonus += dayLockBalance.mul(3).div(1000).mul(userLevel1).div(100);
      }
      //再计算二级的
      address[] child2User = ChildAddrs[childUser[i]];
      for (uint j = 0; j<child2User.length; j++){
        child2LockBalance = queryLockBalance(child2User[j],_queryTime);
        if (dayLockBalance >= child2LockBalance){
          level2Bonus += childLockBalance.mul(3).div(1000).mul(userLevel2).div(100);
        }else{
          level2Bonus += dayLockBalance.mul(3).div(1000).mul(userLevel2).div(100);
        }
      }
    }
    return (level1Bonus.add(level2Bonus));

  }

  function calcuInviteBonusP(uint256 _queryTime) public view returns(uint256){
    return(calcuInviteBonus(msg.sender,_queryTime));
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
  function calcuTeamBonus(address _addr,uint256 _queryTime) private view returns(uint256) {
    require(_queryTime <= end);
    uint256 index = getTeamRateList(_addr,_queryTime);
    if (index == 0) return (0);
    uint8 rate = TeamRateList[_addr][index-1].rate;
    if (rate>0){
      //现在开始计算整个网体的奖励，从直推开始一路递归下去
      //有一个问题没有考虑到，就是升级以前的网体收益是不同的。！！！
      uint8 _rate;
      if (rate == 1){
        _rate = comLevel1;
      }else if(rate == 2 ){
        _rate = comLevel2;
      }else if(rate == 3 ){
        _rate = comLevel3;
      }
      uint256 dayLockBalance = queryLockBalance(_addr,_queryTime);
      return levelBonus(dayLockBalance,_rate,_addr,_queryTime);

    }else{
      return 0;
    }
  }
  function calcuTeamBonusP(uint256 _queryTime) public view returns(uint256){
    return(calcuTeamBonus(msg.sender,_queryTime));
  }
  /**
   * title 递归计算直推网体奖励
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function levelBonus(uint256 _ancientBalance,uint8 _rate,address _addr,uint256 _queryTime) private view returns(uint256){
    require(_queryTime <= end);
    uint256 bonus;

    if ( ChildAddrs[_addr].length > 0 ){
      for (uint i = 0; i<ChildAddrs[_addr].length; i++){
        uint256 childLockBalance = queryLockBalance(ChildAddrs[_addr][i],_queryTime);
        if (_ancientBalance >= childLockBalance) {
          bonus += childLockBalance.mul(3).div(1000).mul(_rate).div(100);
        }else{
          bonus += _ancientBalance.mul(3).div(1000).mul(_rate).div(100);
        }
        bonus += levelBonus(_ancientBalance,_rate,ChildAddrs[_addr][i],_queryTime);
      }
      return bonus;
    }else{
      return 0;
    }
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
   * title 把收益写入链上，在提现的时候好算账。
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function settlement(uint256 maxdays) public{
    require(LockHistory[msg.sender].length > 0);
    uint256 currentTime;
    if (now > end)
      currentTime = end;
    else
      currentTime = now;
    uint256 self;
    uint256 promotion;
    uint256 team;
    uint256 myBegin;
    uint256 last;
    if (LockHistoryBonus[msg.sender].length > 0){
      last = LockHistoryBonus[msg.sender].length - 1;
      myBegin = LockHistoryBonus[msg.sender][last].theDayLastSecond;//最后一次已经记过账的次日的凌晨0点0分0秒。
    }else{
      myBegin = LockHistory[msg.sender][0].begin;
      myBegin = getYestodayLastSecond(myBegin) + every;
    }
    myBegin = myBegin + 1;//这是我入金的当晚的凌晨0点0分0秒。或者是上次计算过的最后一次的利息的当晚的凌晨
    uint256 yestodayLastSecond = getYestodayLastSecond(currentTime);//昨天的最后一秒
    uint256 lastingDays;
    if (currentTime > myBegin){
      lastingDays = currentTime.sub(myBegin) % every;
      lastingDays = currentTime.sub(lastingDays).sub(myBegin);
      lastingDays = lastingDays.div(every);
    }
    if (lastingDays > 0){
      yestodayLastSecond -= (lastingDays-1) * every;
      if (maxdays == 0) maxdays = maxSettleDays;
      if (lastingDays > maxSettleDays) lastingDays = maxdays;//每次最多处理30天的数据，防止GAS超标。
      for (uint i = 0 ; i<lastingDays; i++) {
         uint256 yestodayAllBonus;
         if (LockHistoryBonus[msg.sender].length > 0){
           last = LockHistoryBonus[msg.sender].length - 1;
           yestodayAllBonus = LockHistoryBonus[msg.sender][last].leftBonus;
         }else{
           yestodayAllBonus = 0;
         }
         if (USDTOrCoin[msg.sender] && (ClosePrice[yestodayLastSecond] == 0)){
           //金本位但是没有价格信息，先暂停计算。就必须有个定时任务来跑这个价格信息上传上链。
             break;
         }
         self = calcuBonus(msg.sender,yestodayLastSecond);
         if (self > 0){
              if (ChildAddrs[msg.sender].length > 0){
                promotion = calcuInviteBonus(msg.sender,yestodayLastSecond);
              }
              if (TeamRateList[msg.sender].length > 0){
                 team = calcuTeamBonus(msg.sender,yestodayLastSecond);
              }

              LockHistoryBonus[msg.sender].push(dayBonus(yestodayLastSecond,
                                                         self+promotion+team,
                                                         yestodayAllBonus+self+promotion+team));
              totalBonus += self+promotion+team;

         }
         yestodayLastSecond = yestodayLastSecond.add(every);
      }
    }
  }
  /**
   * title 查询自己过去每日的收益汇总。
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getHistoryBonus(address _addr,uint256 _index) private view returns(uint256,uint256,uint256,uint256){
    //返回查询昨天的收益。
    if (LockHistoryBonus[_addr].length > _index){
      return (LockHistoryBonus[_addr][_index].theDayLastSecond,
              LockHistoryBonus[_addr][_index].theDayAllBonus,
              LockHistoryBonus[_addr][_index].leftBonus,
              LockHistoryBonus[_addr].length);
    }else{
      return(0,0,0,0);
    }
  }
  /**
   * title 查询自己过去每日的收益汇总。
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getMyHistoryBonus(uint256 _index) public view returns(uint256,uint256,uint256,uint256){
    //返回查询昨天的收益。
    return (getHistoryBonus(msg.sender,_index));
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
