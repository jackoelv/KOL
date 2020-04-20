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
  * @title KOL Promotion contract
  * @dev visit: https://github.com/jackoelv/KOL/
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
  * @title KOL Promotion contract
  * @dev visit: https://github.com/jackoelv/KOL/
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
  * @title KOL Promotion contract
  * @dev visit: https://github.com/jackoelv/KOL/
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
  * @title KOL Promotion contract
  * @dev visit: https://github.com/jackoelv/KOL/
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
  * @title KOL Promotion contract
  * @dev visit: https://github.com/jackoelv/KOL/
 */
contract KOLPromote is Ownable{
  using SafeMath for uint256;
  string public name = "KOL Promotion";
  KOL public token;

  uint256 public begin;
  uint256 public end;

  uint256 public iCode;



  uint8 public constant userLevel1 = 20;
  uint8 public constant userLevel2 = 10;

  uint8 public constant comLevel1 = 3;
  uint8 public constant comLevel2 = 5;
  uint8 public constant comLevel3 = 10;


  address[] private inviteAddr;// A->B->C: inviteAddr= B,A
  address[] private childAddr;// A-->B,A-->C,childAddr= B, C

  mapping (address => inviteAddr) InviteList;
  mapping (address => childAddr) ChildAddrs;

  struct lock{
    uint256 time;
    uint256 amount;
  };


  mapping (address => lock[]) internal LockBalance;
  mapping (address => address) internal InviteRelation;//A=>B B is father;
  mapping (uint256 => uint256) internal ClosePrice;
  mapping (address => uint256) internal TotalUsers;
  mapping (address => uint256) internal TotalLockingAmount;
  mapping (uint256 => address) public InviteCode;
  mapping (address => uint256) public RInviteCode;


  event Registed(address _user,uint256 inviteCode);


  constructor(address _tokenAddress) public {
    token = KOL(_tokenAddress);
  }

  modifier onlySuperNode() {
    require(token.querySuperNode(msg.sender));
      _;
  }
  modifier onlyNode() {
      require(token.queryNode(msg.sender));
      _;
  }
  modifier onlyNodes() {
      require(token.querySuperNode(msg.sender)||token.queryNode(msg.sender));
      _;
  }

  function withDraw() public {

  }

  /**
   * @title 获得自己的邀请码
   * @dev visit: https://github.com/jackoelv/KOL/
  */
  function getCode() public view returns(uint256) {
    return (RInviteCode[msg.sender]);
  }
  /**
   * @title 注册并绑定邀请关系
   * @dev visit: https://github.com/jackoelv/KOL/
  */
  function register(uint256 _fInviteCode) private {
    uint256 random = uint256(keccak256(now, msg.sender)) % 100;
    uint256 _myInviteCode = iCode.add(random);
    iCode = iCode.add(random);

    require(InviteCode[_myInviteCode] == address(0));
    require(InviteCode[_fInviteCode] != address(0))
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
  function join(uint256 _amount) public {

    LockBalance[msg.sender].push(now,_amount);
  }

  function sumLocks() public view returns(uint256){
    uint256 totalLocks;
    for (uint i = 0 ; i< LockBalance[msg.sender].length; i++) {
      totalLocks.add(LockBalance[msg.sender][i].amount);
    }
    return (totalLocks);
  }

  function upgrate() {

  }




}
