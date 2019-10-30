const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');
const PORT = 33003;
const server = express()
server.use(bodyParser.json({ limit: '10mb' }));
server.use(bodyParser.urlencoded({ extended: true }));
const request = require('request');
const moment = require('moment');
const path = require('path');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "104.197.193.208",
    user: "root",
    password: "Concacne1!",
    database: 'MS_DOCUMENT'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("DB Connected!");
});


server.use(cors());

server.use('/api/ping', async (req, res, next) => {
    res.send('pong');
});

server.use(express.static(path.join(__dirname, 'resource')));

server.get('/resource/*', function (req, res) {
    res.sendFile(req.path, { root: path.join(__dirname) });
});

server.get('/script/*', function (req, res) {
    res.sendFile(req.path, { root: path.join(__dirname) });
});

server.post('/api/document/save', function (req, res) {
    const { id, data, name, photo } = req.body;
    let sql = `UPDATE MS_DOCS SET`;

    if (name) {
        sql += ` name='${name}'`;
    }

    if (data) {
        if (name) {
            sql += ',';
        }
        sql += ` data='${data}'`;
    }

    if (photo) {
        if (name || data) {
            sql += ',';
        }
        sql += ` photo='${photo}'`;
    }

    sql += ` where id=${id}`;

    connection.query(sql, function (error, results, fields) {
        let resp = {};

        if (error) {
            // error
            resp.ok = 0;
            resp.error = error;
        }
        else {
            let { insertId, affectedRows } = results;
            if (affectedRows > 0) {
                // success
                resp.ok = 1;
                resp.insertId = insertId;
            }
            else {
                resp.ok = 0;
                resp.error = 'bla';
            }
        }

        res.send(resp);
    });
});

server.post('/api/document/new', function (req, res) {
    const { name, folder, data, source } = req.body;

    connection.query(`INSERT INTO MS_DOCS (name, folder, data, source) VALUES('${name}', '${folder}', '${data || '{}'}', '${source}')`,
        function (error, results, fields) {
            let resp = {};

            if (error) {
                // error
                resp.ok = 0;
                resp.error = error;
            }
            else {
                let { insertId, affectedRows } = results;
                if (affectedRows > 0) {
                    // success
                    resp.ok = 1;
                    resp.insertId = insertId;
                }
                else {
                    resp.ok = 0;
                    resp.error = 'bla';
                }
            }

            res.send(resp);
        }
    );
});

server.post('/api/document/delete', function (req, res) {
    const { id } = req.body;

    connection.query(`DELETE FROM MS_DOCUMENT.MS_DOCS WHERE id=${id}`,
        function (error, results, fields) {
            let resp = {};

            if (error) {
                // error
                resp.ok = 0;
                resp.error = error;
            }
            else {
                let { insertId, affectedRows } = results;
                if (affectedRows > 0) {
                    // success
                    resp.ok = 1;
                    resp.insertId = insertId;
                }
                else {
                    resp.ok = 0;
                    resp.error = 'bla';
                }
            }

            res.send(resp);
        }
    );
});

server.post('/api/document/get', function (req, res) {
    const { id } = req.body;

    connection.query(`SELECT * FROM MS_DOCS WHERE id=${id}`, function (error, results, fields) {
        let resp = {};
        resp.id = id;

        if (error) {
            // error
            resp.ok = 0;
            resp.error = error;
        }
        else {
            if (results.length > 0) {
                // success
                resp.ok = 1;
                try {
                    resp.photo = results[0].photo;
                    resp.data = JSON.parse(results[0].data);
                }
                catch (e) {
                    resp.data = {};
                }
            }
            else {
                resp.ok = 0;
                resp.error = 'invalid id';
            }
        }

        res.send(resp);
    });
});

server.post('/api/document/getall', function (req, res) {


    const getFileData = (list) => {
        if (list.length === 0) {
            res.send({
                ok: 1,
                data: []
            })
            return;
        }

        let arr = '';
        list.forEach(e => {
            arr += e.fileId + ', ';
        })
        arr = arr.substr(0, arr.length - 2);

        connection.query(`SELECT id, data, source FROM MS_DOCS WHERE id in (${arr})`, function (error, results, fields) {
            let resp = {};

            if (error) {
                // error
                resp.ok = 0;
                resp.error = error;
            }
            else {
                if (results.length > 0) {
                    // success
                    resp.ok = 1;
                    resp.data = results;
                    resp.total = results.length;

                    resp.data = resp.data.map(e => {
                        let t = list.filter(el => el.fileId === e.id)[0]
                        if (t) {
                            e.fileName = t.name;
                            e.created = t.created;
                            e.path = t.path;
                            e.actualPath = t.actualPath;
                        }

                        return e;
                    })
                }
                else {
                    resp.ok = 0;
                    resp.error = 'bla bla';
                }
            }

            res.send(resp);
        });
    }



    connection.query(`SELECT * FROM MS_FOLDER WHERE id=1`, function (error, results, fields) {
        let resp = {};
        if (error) {
            // error
            resp.ok = 0;
            resp.error = error;
        }
        else {
            if (results.length > 0) {
                // success
                resp.ok = 1;
                try {
                    let data = JSON.parse(results[0].folder);
                    let list = [];


                    const getFile = (e, path) => {
                        if (e.files && e.files.length > 0) {
                            e.files.map(el => {
                                getFile(el, path + '/' + el.name);
                            })
                        }
                        else {
                            if (e.type === 'file') {
                                list.push({
                                    ...e,
                                    actualPath: path.replace('/' + e.name, '')
                                });
                            }
                        }
                    }

                    data.map(e => {
                        getFile(e, e.name);
                    })

                    getFileData(list);
                }
                catch (e) {
                    resp.data = [];
                }
            }
            else {
                resp.ok = 0;
                resp.error = 'invalid id';
            }
        }
    });
});

server.post('/api/folder/get', function (req, res) {
    connection.query(`SELECT * FROM MS_FOLDER WHERE id=1`, function (error, results, fields) {
        let resp = {};
        if (error) {
            // error
            resp.ok = 0;
            resp.error = error;
        }
        else {
            if (results.length > 0) {
                // success
                resp.ok = 1;
                try {
                    resp.data = JSON.parse(results[0].folder);
                }
                catch (e) {
                    resp.data = [];
                }
            }
            else {
                resp.ok = 0;
                resp.error = 'invalid id';
            }
        }

        res.send(resp);
    });
});


server.post('/api/folder/save', function (req, res) {
    const { data } = req.body;
    let sql = `UPDATE MS_FOLDER SET folder='${data}' where id=1`;

    connection.query(sql, function (error, results, fields) {
        let resp = {};

        if (error) {
            // error
            resp.ok = 0;
            resp.error = error;
        }
        else {
            let { insertId, affectedRows } = results;
            if (affectedRows > 0) {
                // success
                resp.ok = 1;
                resp.insertId = insertId;
            }
            else {
                resp.ok = 0;
                resp.error = 'bla';
            }
        }

        res.send(resp);
    });
});


server.post('/api/template/get', function (req, res) {
    connection.query(`SELECT * FROM MS_TEMPLATE`, function (error, results, fields) {
        let resp = {};
        if (error) {
            // error
            resp.ok = 0;
            resp.error = error;
        }
        else {
            resp.ok = 1;
            resp.data = results;
        }

        res.send(resp);
    });
});


server.post('/api/login', function (req, res) {
    const { username, password } = req.body;

    connection.query(`SELECT * FROM MS_LOGIN WHERE username='${username}' AND password='${password}'`, function (error, results, fields) {
        let resp = {};

        if (error) {
            // error
            resp.ok = 0;
            resp.error = error;
        }
        else {
            if (results.length > 0) {
                // success
                resp.ok = 1;
            }
            else {
                resp.ok = 0;
            }
        }

        res.send(resp);
    });
});


let app = null;
// app = server.listen(PORT, (err) => {
//     if (err) throw err
//     console.log('> CWM Proxy ready on http://localhost:' + PORT)
// })
module.exports = {
    start: () => {
        request.get({
            headers: {
                "Content-Type": "application/json",
            },
            url: `http://127.0.0.1:${PORT}/api/ping`
        }, async (error, response, body) => {
            if (response && response.statusCode === 200 && body === 'pong') {
                console.log('> CWM already start at http://localhost:' + PORT)
            }
            else {
                app = server.listen(PORT, (err) => {
                    if (err) throw err
                    console.log('> CWM Proxy ready on http://localhost:' + PORT)
                })
            }
        });
    },
    stop: () => {
        if (app) {
            app.close(() => {
                console.log('> CWM Proxy terminated')
            })
        }
    }
}