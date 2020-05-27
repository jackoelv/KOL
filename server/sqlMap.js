// sql语句
var sqlMap = {
    // 用户
    user: {
        putBonus: 'insert into ad0527(uid,addr,aid,getTime,getAmount) values (null,?,0,?,10)',
        getBonus:'select count(*) as total from ad0527 where aid=0 and addr=?',
        getMyBonus:'select sum(getAmount) as myBonus from ad0527 where addr=?',
        getLeftBonus:'select sum(getAmount) as leftBonus from ad0527'
    }
}

module.exports = sqlMap;
