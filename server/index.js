const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');
const PORT = 33001;
const server = express()
server.use(bodyParser.json({ limit: '10mb' }));
server.use(bodyParser.urlencoded({ extended: true }));
var mysql = require('mysql');
const fs = require('fs');

var connection = mysql.createConnection({
    host: "167.179.65.8",
    user: "admin",
    // password: "12wqasxZ",
    database: 'MS_DOCUMENT'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("DB Connected!");
});

server.use(cors());

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
            if (e.fileId && e.fileId !== '') {
                arr += e.fileId + ', ';
            }
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
                    resp.data = [];

                    results.forEach(e => {
                        let t = list.filter(el => el.fileId == e.id)[0];

                        if (t) {
                            e.fileName = t.name;
                            e.created = t.created;
                            e.path = t.path;
                            e.actualPath = t.actualPath;

                            resp.data.push(e);
                        }
                    })

                    resp.total = resp.data;
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
                        if (e.type === 'file') {
                            list.push({
                                ...e,
                                actualPath: path.replace('/' + e.name, '')
                            });
                        }
                        else {
                            if (e.files && e.files.length > 0) {
                                e.files.map(el => {
                                    getFile(el, path + '/' + el.name);
                                })
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
                    console.log('parse folder data error', e);
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


// identity
server.post('/api/identity/get', function (req, res) {
    const { fileid } = req.body;

    connection.query(`SELECT * FROM MS_IDENTITY WHERE fileid=${fileid}`, function (error, results, fields) {
        let resp = {};
        resp.fileid = fileid;

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
            }
            else {
                resp.ok = 0;
                resp.data = [];
                resp.error = 'invalid file id';
            }
        }

        res.send(resp);
    });
});

server.post('/api/identity/insert', function (req, res) {
    const { fileid, value } = req.body;

    connection.query(`INSERT INTO MS_IDENTITY (fileid, value) VALUES('${fileid}', '${value}')`,
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

server.post('/api/identity/delete', function (req, res) {
    const { id } = req.body;

    connection.query(`DELETE FROM MS_DOCUMENT.MS_IDENTITY WHERE id=${id}`,
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

server.use('/api/identity/download', function (req, res) {
    let id = '';
    if (req.method === 'post' || req.method === 'POST') {
        id = req.body.id;
    }
    else {
        id = req.query.id;
    }

    connection.query(`SELECT * FROM MS_DOCUMENT.MS_IDENTITY WHERE id=${id}`,
        function (error, results, fields) {
            let resp = {};

            if (error) {
                // error
                resp.ok = 0;
                resp.error = error;

                res.send(resp);
            }
            else {
                if (results.length > 0) {
                    // success
                    let image = results[0].value;
                    var data = image.replace(/^data:image\/\w+;base64,/, '');
                    let id = (Math.random() * 100000000).toFixed(0) + '-' + new Date().getTime()
                    fs.writeFile(__dirname + '/temp/' + id + '.jpg', data, { encoding: 'base64' }, function (err) {
                        res.sendFile(__dirname + '/temp/' + id + '.jpg');
                        setTimeout(() => {
                            fs.unlink(__dirname + '/temp/' + id + '.jpg', (e) => {
                                // console.log(e);
                            });
                        }, 200)
                    });
                }
                else {
                    resp.ok = 0;
                    resp.data = [];
                    resp.error = 'invalid file id';

                    res.send(resp);
                }
            }
        }
    );
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

server.get('/api/ping', (req, res) => {
    res.send('pong');
});

server.listen(PORT, (err) => {
    if (err) throw err;
    console.log('> Server ready on http://0.0.0.0:' + PORT)
})