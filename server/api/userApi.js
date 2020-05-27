var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

router.post('/putBonus', (req, res) => {
    var sql = $sql.user.putBonus;
    var params = req.query;
    console.log(params);
    var theTime = new Date();
    conn.query(sql, [params.addr, theTime], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

//student表的所有字段
router.post('/getBonus', (req,res) => {
    var sql=$sql.user.getBonus;
    console.log(sql);
    var params = req.query;
    conn.query(sql, [params.addr],function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/getLeftBonus', (req,res) => {
    var sql=$sql.user.getLeftBonus;
    console.log(sql);
    conn.query(sql,function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/getMyBonus', (req,res) => {
    var sql=$sql.user.getMyBonus;
    console.log(sql);
    var params = req.query;
    conn.query(sql, [params.addr],function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

module.exports = router;
