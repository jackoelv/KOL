function setTopTeamBonus(uint8 _maxRate,address _topAddr,uint256 _minAmount) public returns(uint8){
  uint8 newRate = levelRate[isLevelN[_topAddr]];
  dayTeamBonus memory theDayTB =dayTeamBonus(0,0,0,0);
  uint256 tomorrowLastSecond =getYestodayLastSecond(now) + (2 * every);

  uint8 diffRate;

  if(newRate > _maxRate){
    diffRate = newRate - _maxRate;
  }else{
    return _maxRate;
  }


  if (LockTeamBonus[_topAddr].length == 0){
    theDayTB.theDayLastSecond = tomorrowLastSecond;
    theDayTB.theDayTeamBonus = _minAmount * diffRate / newRate;
    theDayTB.totalTeamBonus = _minAmount * newRate / 100;
    theDayTB.theDayRate = newRate;
    LockTeamBonus[_topAddr].push(theDayTB);
  }else{
    uint256 last = LockTeamBonus[_topAddr].length -1;
    theDayTB = LockTeamBonus[_topAddr][last];

    uint256 lastingDays = (tomorrowLastSecond - theDayTB.theDayLastSecond) / every;

    theDayTB.totalTeamBonus = lastingDays * theDayTB.theDayTeamBonus * theDayTB.theDayRate/100;//这里不好解决啊
    theDayTB.totalTeamBonus += _minAmount * newRate / 100;
    theDayTB.theDayTeamBonus += _minAmount * diffRate / newRate;
    theDayTB.theDayRate = newRate;
      //必然就都是明天。
    if(theDayTB.theDayLastSecond < tomorrowLastSecond){
      theDayTB.theDayLastSecond = tomorrowLastSecond;
      LockTeamBonus[_topAddr].push(theDayTB);
    }else{
      LockTeamBonus[_topAddr][last]=theDayTB;
    }
  }
}
