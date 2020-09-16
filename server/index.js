const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');

const server = express()
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ extended: true }));
var mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

let ARGV = {};
(process.argv).forEach(e => {
    let key = e.split(":")[0];
    let value = e.split(":")[1];

    if (key && value) {
        ARGV[key] = value;
    }
});

const PORT = process.env.PORT || ARGV.port || 33001;

var connection = mysql.createConnection({
    host: ARGV.dbhost || "66.42.48.254",
    port: ARGV.dbport || 3306,
    user: ARGV.dbuser || "dev",
    password: ARGV.dbpwd || "ypFcRhXBbctCQIW8",
    database: ARGV.dbname || 'MS_DOCUMENT_DEV'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("DB Connected!");
});

server.use(cors());
// 


async function folderGet() {
    let resp = await new Promise(resolve => {
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

            resolve(resp);
        });
    });

    return resp;
}
// APIs

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

/**
 * This api for Web only
 */
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

/**
 * This api for Mobile only
 */
server.post('/api/document/create', async function (req, res) {
    const { name, folder: path, data, source } = req.body;

    let folder = await folderGet();
    let linkArr = path.split("/").filter(e => e !== '');
    let linkPath = [];

    for (let i = 0; i < linkArr.length; i++) {
        linkPath.push([''].concat([...Array(i + 1).keys()].map(e => linkArr[e])).join("/"));
    }

    let checkFileExist = await new Promise(async resolve => {
        if (folder.ok === 1) {
            let filesInFolder = linkPath.reduce((obj, currPath) => {
                if (obj.files) {
                    let pathInfo = obj.files.filter(e => e.path === currPath)[0];
                    if (pathInfo) {
                        if (pathInfo.type === 'folder') {
                            return pathInfo;
                        }
                        else {
                            return {
                                ok: 0,
                                code: 'invalid_type'
                            }
                        }
                    }
                    else {
                        return {
                            ok: 0,
                            code: 'invalid_path'
                        }
                    }
                }
                else {
                    return obj;
                }
            }, { files: folder.data });


            if (filesInFolder.ok === 0) {
                resolve({
                    ok: 0,
                    code: filesInFolder.code
                })
            }
            else {
                let isExist = filesInFolder.files.filter(e => e.type === 'file' && e.name === name).length > 0;
                if (isExist) {
                    resolve({
                        ok: 0,
                        code: 'file_existed'
                    })
                }
                else {
                    resolve({
                        ok: 1,
                        folderNeedToAdd: filesInFolder
                    })
                }
            }
        }
        else {
            resolve({
                ok: 1
            })
        }
    });

    if (checkFileExist.ok === 1) {
        let insertDocResp = await new Promise(resolve => {
            connection.query(`INSERT INTO MS_DOCS (name, folder, data, source) VALUES('${name}', '${path}', '${data || '{}'}', '${source}')`,
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

                    resolve(resp);
                }
            );
        });

        if (insertDocResp.ok === 1) {
            // save file to folder
            const date = new Date();
            checkFileExist.folderNeedToAdd.files.push({
                "name": name,
                "type": "file",
                "path": path + '/' + name,
                "created": date.getHours() + "h" + date.getMinutes() + "m" + date.getSeconds() + "s-" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
                "files": [],
                "fileId": insertDocResp.insertId,
                "filePath": source
            });
            // update folder
            let sql = `UPDATE MS_FOLDER SET folder='${JSON.stringify(folder.data)}' where id=1`;
            let saveFolderResp = await new Promise(resolve => {
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

                    resolve(resp);
                });
            });

            if (saveFolderResp.ok === 1) {
                res.send(insertDocResp);
            }
            else {
                res.send({
                    ok: 0,
                    message: saveFolderResp.error
                });
            }
        }
        else {
            res.send(insertDocResp);
        }
    }
    else {
        res.send(checkFileExist);
    }
});

server.post('/api/document/delete', function (req, res) {
    const { id } = req.body;
    console.log(id);
    connection.query(`DELETE FROM MS_DOCS WHERE id=${id}`,
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

server.post('/api/folder/get', async function (req, res) {
    let resp = await folderGet();
    res.send(resp);
});

server.post('/api/folder/new', async function (req, res) {
    const { path } = req.body;

});

server.post('/api/folder/save', async function (req, res) {
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
    connection.query(`SELECT * FROM MS_TEMPLATE WHERE STATE='A'`, function (error, results, fields) {
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

    connection.query(`DELETE FROM MS_IDENTITY WHERE id=${id}`,
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

    connection.query(`SELECT * FROM MS_IDENTITY WHERE id=${id}`,
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

// http://127.0.0.1:33001/resource/Phieu_xac_minh_LLQS/Phieu_xac_minh_LLQS.html?id=98
server.get('/resource/:template/:file', (req, res) => {
    const { template, file } = req.params;
    let filePath = path.join(__dirname, "../resource", template, file);

    try {
        if (fs.lstatSync(filePath).isFile()) {
            return res.sendFile(filePath);
        }
        else {
            throw new Error("");
        }
    }
    catch (e) {
        return res.status(404).send("File không tồn tại!");
    }
});

server.get('/script/:folder/:file', (req, res) => {
    const { folder, file } = req.params;
    let filePath = path.join(__dirname, "../static/build/script", folder, file);

    try {
        if (fs.lstatSync(filePath).isFile()) {
            return res.sendFile(filePath);
        }
        else {
            throw new Error("");
        }
    }
    catch (e) {
        return res.status(404).send("File không tồn tại!");
    }
});

server.get('/export/:type', async (req, res) => {
    const { id } = req.query;
    const { type } = req.params;

    let documentData = await new Promise(resolve => {
        connection.query(`SELECT D.name, D.source, T.options FROM MS_DOCS D inner join MS_TEMPLATE T on D.source = T.path where D.id=${id}`, function (error, results, fields) {
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
                        resp.source = results[0].source;
                        resp.options = JSON.parse(results[0].options);
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

            resolve(resp);
        });
    });

    try {
        if (documentData.ok === 1) {
            let filePath = path.join(__dirname, "../", documentData.source);
            if (fs.lstatSync(filePath).isFile()) {
                if (type === 'html') {
                    return res.sendFile(filePath);
                }
                else if (type === 'pdf') {
                    const pdfFile = path.join(__dirname, "../export/", "file-" + new Date().getTime() + ".pdf");
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto('http://0.0.0.0:' + PORT + '/export/html?toolbar=false&id=' + documentData.id, { waitUntil: 'networkidle2' });
                    await page.pdf({ path: pdfFile, format: 'A4', landscape: documentData.options.landscape });
                    await browser.close();
                    let stream = fs.createReadStream(pdfFile);
                    stream.pipe(res).once("close", function () {
                        stream.destroy();
                        fs.unlinkSync(pdfFile);
                    });
                }
                else {
                    res.status(404).send("Invalid type. Accept html or pdf");
                }
            }
            else {
                throw new Error("");
            }
        }
        else {
            throw new Error("");
        }
    }
    catch (e) {
        console.log(e);
        return res.status(404).send("File không tồn tại!");
    }
});

server.get('/static/resource/:folder/:file', (req, res) => {
    const { folder, file } = req.params;
    let filePath = path.join(__dirname, "../resource", folder, file);

    try {
        if (fs.lstatSync(filePath).isFile()) {
            return res.sendFile(filePath);
        }
        else {
            throw new Error("");
        }
    }
    catch (e) {
        return res.status(404).send("File không tồn tại!");
    }
});

server.listen(PORT, (err) => {
    if (err) throw err;
    console.log('> Server ready on http://0.0.0.0:' + PORT)
})