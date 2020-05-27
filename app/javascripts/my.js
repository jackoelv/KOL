class Connect {

    static getInstance() {
        if (!Connect.instance) {
            Connect.instance = new Connect();
        }
        return Connect.instance;
    }

    constructor() {
        this.mysql = require('mysql');
        this.connection = this.mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'amituo',
            database: 'kolad'
        });
        this.connection.connect();
    }

    query(sql) {
        // sql = String
        return this._operation(sql);
    }

    select(array, table, where, link) {
        // array = Array
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        let sql = "SELECT ";
        array.forEach(((value, index) => {
            if (index === 0) {
                sql += value;
            } else {
                sql += ',' + value
            }
        }));
        sql += ' FROM ' + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }

    insert(info, table) {
        // info = { key: value }
        // table = String
        let sql = "INSERT INTO " + table + "(";
        let keyArray = [];
        let valueArray = [];
        Object.keys(info).forEach((key) => {
            keyArray.push(key);
            valueArray.push("'" + info[key] + "'");
        });
        let keyStr = keyArray.join(',');
        let valueStr = valueArray.join(',');
        sql += keyStr + ') ';
        sql += 'VALUES(' + valueStr + ')';
        return this._operation(sql);
    }

    update(info, table, where, link) {
        let sql = "UPDATE " + table + " SET ";
        let sqlArray = [];
        Object.keys(info).forEach((key) => {
            sqlArray.push(key + "='" + info[key] + "'");
        });
        sql += sqlArray.join(',');
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }

    delete(info, table, where, link) {
        // info = { key: value }
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        let sql = "DELETE FROM " + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }

    _operation(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (error, result, fields) => {
                if (error) {
                    console.log(error.message);
                    reject(error.message);
                } else {
                    resolve(result);
                }
            });
        })
    }

    _handleWhereString(where, link) {
        let str = "";
        let whereArray = [];
        Object.keys(where).forEach((key) => {
            whereArray.push(String(key + "='" + where[key] + "'"));
        });
        if (link) {
            let whereStr = whereArray.join(" " + link + " ");
            str += " WHERE " + whereStr;
        } else {
            let whereStr = whereArray.join(" AND ");
            str += " WHERE " + whereStr;
        }
        return str;
    }
}

module.exports = Connect.getInstance();