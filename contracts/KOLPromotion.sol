pragma solidity ^0.4.23;
/*
 *             ╔═╗┌─┐┌─┐┬┌─┐┬┌─┐┬   ┌─────────────────────────┐ ╦ ╦┌─┐┌┐ ╔═╗┬┌┬┐┌─┐
 *             ║ ║├┤ ├┤ ││  │├─┤│   │ KOL Community Foundation│ │ ║║║├┤ ├┴┐╚═╗│ │ ├┤
 *             ╚═╝└  └  ┴└─┘┴┴ ┴┴─┘ └─┬─────────────────────┬─┘ ╚╩╝└─┘└─┘╚═╝┴ ┴ └─┘
 *   ┌────────────────────────────────┘                     └──────────────────────────────┐
 *   │    ┌─────────────────────────────────────────────────────────────────────────────┐  │
 *   └────┤ Dev:Jack Koe ├─────────────┤ Special for: KOL  ├───────────────┤ 20200406   ├──┘
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
contract KOLPromote is Ownable{
  using SafeMath for uint256;
  string public name = "KOL Promotion";
  KOL public kol;
  address public reciever;

  uint256 public begin = 1588262400;//2020年5月1日0点0分0秒
  uint256 public end;

  uint256 public iCode;



  uint8 public constant userLevel1 = 20;
  uint8 public constant userLevel2 = 10;

  uint16 public constant comLevel1Users = 100;
  uint16 public constant comLevel2Users = 300;
  uint16 public constant comLevel3Users = 500;

  uint256 public constant comLevel1Amount = 10000 * (10 ** 18);
  uint256 public constant comLevel2Amount = 30000 * (10 ** 18);
  uint256 public constant comLevel3Amount = 50000 * (10 ** 18);

  uint8 public constant comLevel1 = 3;
  uint8 public constant comLevel2 = 5;
  uint8 public constant comLevel3 = 10;
  uint8 public constant withDrawRate = 5;

  uint256 public constant withDrawDays = 30 days;


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

  mapping (address => address[]) internal InviteList;
  mapping (address => address[]) internal ChildAddrs;
  mapping (address => teamRate[]) internal TeamRateList;
  mapping (address => lock[]) internal LockHistory;
  mapping (address => uint256) internal LockBalance;
  mapping (address => uint256) internal LockHistoryBonus;
  mapping (address => uint256) internal InviteHistoryBonus;
  mapping (address => uint256) internal InviteCurrentDayBonus;

  mapping (address => address) internal InviteRelation;//A=>B B is father;
  mapping (uint256 => uint256) internal ClosePrice;
  mapping (address => uint256) internal TotalUsers;
  mapping (address => uint256) internal TotalLockingAmount;
  mapping (uint256 => address) public InviteCode;
  mapping (address => uint256) public RInviteCode;

  mapping (address => uint8) internal isLevelN;
  mapping (address => bool) public USDTOrCoin;

  mapping (address => uint256) public WithDraws;


  event Registed(address _user,uint256 inviteCode);
  event GradeChanged(address _user,uint8 _oldLevel,uint8 _newLevel);
  event WithDraw(address _user,uint256 _self,uint256 _promotion,uint256 _team);
  event WithDrawBalance(address _user,uint256 _balance);


  constructor(address _tokenAddress,address _reciever,uint256 _begin,uint256 _end) public {
    kol = KOL(_tokenAddress);
    begin = _begin;
    end = _end;
    reciever = _reciever;

  }

  modifier onlySuperNode() {
    require(kol.querySuperNode(msg.sender));
      _;
  }
  modifier onlyNode() {
      require(kol.queryNode(msg.sender));
      _;
  }
  modifier onlyNodes() {
      require(kol.querySuperNode(msg.sender)||kol.queryNode(msg.sender));
      _;
  }
  /**
   * title 提现KOL到自己的账户
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function withDraw(bool _type) public {
    //_type true，提利息，false，提本息
    //提现就把利息全部提走，只能提整数，不能提小数点。
    //如果是提现本金，需要判断一下用户是否满足自由提现的条件。
    require(LockBalance[msg.sender] > 0);
    uint256 self;
    uint256 promotion;
    uint256 team;
    uint256 balance;
    uint256 yestodayLastSecond = getYestodayLastSecond(now);//昨天的最后一秒
    uint256 lastingDays = now.sub(now.sub(begin) % 86400).div(86400);//除法刚好是整数
    for (uint i = 0 ; i<lastingDays; i++) {
       self += calcuBonus(msg.sender,yestodayLastSecond);
       promotion += calcuInviteBonus(msg.sender,yestodayLastSecond);
       team += calcuTeamBonus(msg.sender,yestodayLastSecond);
       yestodayLastSecond = yestodayLastSecond.sub(86400);
    }
    //应该把这个历史记录下来？爆出一个事件吧，不记录链上了。
    emit WithDraw(msg.sender,self,promotion,team);
    uint256 total = self.add(promotion).add(team);
    WithDraws[msg.sender] += total;

    if (!_type) {
      //提利息+奖励
      //今天凌晨的时间
      //提本金，先判断是否符合条件，一旦提了本金就要注意给上级网体降级减少网体的加速。
      if ((TotalLockingAmount[msg.sender] < LockBalance[msg.sender].mul(withDrawRate)) &&
                                    (now < LockHistory[msg.sender][0].begin + withDrawDays)){
          //没有达到提现要求
          return;
      }else{
        for (uint j = 0; j<LockHistory[msg.sender].length; j++){
          LockHistory[msg.sender][j].end = now;
          LockHistory[msg.sender][j].withDrawed = true;
        }
        balance = LockBalance[msg.sender];
        emit WithDrawBalance(msg.sender,balance);
        WithDraws[msg.sender] += balance;
        /* kol.transfer(msg.sender,balance); */
        LockBalance[msg.sender] = 0;
        afterDraw(msg.sender,balance);//提现以后需要对上级所有的网体人数和金额做减法。
      }

    }
    kol.transfer(msg.sender,total.mul(95).div(100).add(balance));
    kol.transfer(reciever,total.mul(5).div(100));

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
   * title 获得自己的邀请码
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getCode() public view returns(uint256) {
    return (RInviteCode[msg.sender]);
  }
  /**
   * title 注册并绑定邀请关系
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function register(uint256 _fInviteCode) public {
    uint256 random = uint256(keccak256(now, msg.sender)) % 100;
    uint256 _myInviteCode = iCode.add(random);
    iCode = iCode.add(random);

    require(InviteCode[_myInviteCode] == address(0));
    require(InviteCode[_fInviteCode] != address(0));
    InviteCode[_myInviteCode] = msg.sender;
    RInviteCode[msg.sender] = _myInviteCode;
    emit Registed(msg.sender,iCode);

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
    kol.transferFrom(msg.sender,address(this),_amount);
    LockHistory[msg.sender].push(lock(now,_amount,0,false));
    LockBalance[msg.sender] = LockBalance[msg.sender].add(_amount);

    USDTOrCoin[msg.sender] = _usdtOrCoin;

    for (uint i = 0; i<InviteList[msg.sender].length; i++){
      if (LockHistory[msg.sender].length == 1){
        //给上面的人数+1
        TotalUsers[InviteList[msg.sender][i]] += 1;
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
    uint256 tmpBonus;
    uint256 yestodayLastSecond;
    uint256 theDaylastSecond;
    uint256 tmpCalcu;
    if (LockHistory[_addr].length > 0){
      for (uint i = 0; i<LockHistory[_addr].length; i++){
        if (LockHistory[_addr][i].withDrawed){
          //如果是已经提现的资金，那就要求计算日期是在起止时间内的。
          if ((_queryTime >= LockHistory[_addr][i].begin) && (_queryTime <= LockHistory[_addr][i].end)){
              if (USDTOrCoin[_addr]){
                //金本位
                yestodayLastSecond = getYestodayLastSecond(_queryTime);
                theDaylastSecond = getYestodayLastSecond(LockHistory[_addr][i].begin);
                tmpCalcu = LockHistory[_addr][i].amount.mul(ClosePrice[theDaylastSecond]).mul(3).div(1000);
                tmpCalcu = tmpCalcu.div(ClosePrice[yestodayLastSecond]);
                tmpBonus += tmpCalcu;
              }else{
                //币本位
                tmpBonus += LockHistory[_addr][i].amount.mul(3).div(1000);
              }

          }
        }else{
          if (_queryTime >= LockHistory[_addr][i].begin ){
            //这个就要计入到当天的收益
            if (USDTOrCoin[_addr]){
              yestodayLastSecond = getYestodayLastSecond(_queryTime);
              theDaylastSecond = getYestodayLastSecond(LockHistory[_addr][i].begin);
              tmpCalcu = LockHistory[_addr][i].amount.mul(ClosePrice[theDaylastSecond]).mul(3).div(1000);
              tmpCalcu = tmpCalcu.div(ClosePrice[yestodayLastSecond]);
              tmpBonus += tmpCalcu;
            }else{
              tmpBonus += LockHistory[_addr][i].amount.mul(3).div(1000);
            }
          }
        }
      }
    }
    return tmpBonus;


  }
  /**
   * title 查询到指定时间点，计算用户当天的推广收益
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function calcuInviteBonus(address _addr,uint256 _queryTime) private view returns(uint256) {
    //直推，直推的直推，比较金额，计算佣金。
    //先计算直推的
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
        level1Bonus += childLockBalance.mul(userLevel1).div(100);
      }else{
        level1Bonus += dayLockBalance.mul(userLevel1).div(100);
      }
      //再计算二级的
      address[] child2User = ChildAddrs[childUser[i]];
      for (uint j = 0; j<child2User.length; j++){
        child2LockBalance = queryLockBalance(child2User[j],_queryTime);
        if (dayLockBalance >= child2LockBalance){
          level2Bonus += childLockBalance.mul(userLevel2).div(100);
        }else{
          level2Bonus += dayLockBalance.mul(userLevel2).div(100);
        }
      }
    }
    return (level1Bonus.add(level2Bonus));

  }
  /**
   * title 查询指定时间用户的有效锁仓余额
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function queryLockBalance(address _addr,uint256 _queryTime) private view returns(uint256) {
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
   * title 查询并计算用户的网体收益
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function calcuTeamBonus(address _addr,uint256 _queryTime) private view returns(uint256) {
    uint8 rate;
    if (TeamRateList[_addr].length == 0){
      return 0;
    }else{
      for (uint i = 0; i<TeamRateList[_addr].length; i++){
        if (i < TeamRateList[_addr].length -1){
          if (( _queryTime >= TeamRateList[_addr][i].changeTime ) &&
                    ( _queryTime <= TeamRateList[_addr][i+1].changeTime )){
            rate = TeamRateList[_addr][i].rate;
          }
        }else{
          if ( _queryTime >= TeamRateList[_addr][i].changeTime ){
            rate = TeamRateList[_addr][i].rate;
          }
        }

      }
    }

    if (rate>0){
      //现在开始计算整个网体的奖励，从直推开始一路递归下去
      //有一个问题没有考虑到，就是升级以前的网体收益是不同的。！！！
      uint256 dayLockBalance = queryLockBalance(_addr,_queryTime);
      return levelBonus(dayLockBalance,rate,_addr,_queryTime);

    }else{
      return 0;
    }

  }
  /**
   * title 递归计算直推网体奖励
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function levelBonus(uint256 _ancientBalance,uint8 _rate,address _addr,uint256 _queryTime) private view returns(uint256){
    uint256 bonus;

    if ( ChildAddrs[_addr].length > 0 ){
      for (uint i = 0; i<ChildAddrs[_addr].length; i++){
        uint256 childLockBalance = queryLockBalance(ChildAddrs[_addr][i],_queryTime);
        if (_ancientBalance >= childLockBalance) {
          bonus += childLockBalance.mul(_rate).div(100);
        }else{
          bonus += _ancientBalance.mul(_rate).div(100);
        }
        bonus += levelBonus(_ancientBalance,_rate,ChildAddrs[_addr][i],_queryTime);
      }
    }
    return 0;
  }
  /**
   * title 根据给定时间计算出昨天的最后一秒
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function getYestodayLastSecond(uint256 _queryTime) private view returns(uint256){
    //录入的价格为4位小数
    return (_queryTime.sub(_queryTime.sub(begin) % 86400) - 1);
  }



  /**
   * title 录入KOL的收盘价
   * dev visit: https://github.com/jackoelv/KOL/
  */
  function putClosePrice(uint256 price,uint256 _queryTime) onlyNodes public{
    //录入的价格为4位小数
    uint256 yestodayLastSecond = getYestodayLastSecond(_queryTime);
    ClosePrice[yestodayLastSecond] = price;

  }
  function setReciever(address _addr) onlyOwner public{
    reciever = _addr;
  }

}
