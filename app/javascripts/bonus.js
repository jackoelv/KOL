app.post('/user/register', (req, res) => {
        let user = require('../controllers/user');
        let info = {
            name: req.body.username,
            password: req.body.password
        };
        user.register(info).then(result => {
            res.json(result);
        }).catch(err => {
            res.json(err);
        });
    });

class User {

    constructor() {
        this.db = require('../dao/connect');
    }

    register(json) {
        return new Promise((resolve, reject) => {
            this.db.select(['name'], 'user', { name: json.name }).then(result => {
                if (result.length === 0) {
                    this.db.insert(json, 'user').then(res => {
                        resolve({code: 0, msg: 'ok'});
                    }).catch(err => {
                        reject({code: -1, msg: 'error'});
                    });
                } else {
                    reject({code: -1, msg: '已经存在此账号'});
                }
            });
        });
    }

}

module.exports = new User();