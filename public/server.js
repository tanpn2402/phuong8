const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');
const PORT = 33003;
const server = express()
server.use(bodyParser.json({ limit: '10mb' }));
server.use(bodyParser.urlencoded({ extended: true }));
const request = require('request');
const path = require('path');
const opn = require('opn');
const storage = require('node-persist');
const proxy = require('express-http-proxy');

const SERVER_ADDRESS = "http://167.179.65.8:33001/";

server.use(cors());

server.get('/api/ping', proxy(SERVER_ADDRESS));

server.use(express.static(path.join(__dirname, 'resource')));

server.get('/resource/*', async function (req, res) {
    // C:\Users\Pham Nhat Tan\Documents\Phuong 8 Data
    let rootPath = await storage.getItem('resourcePath');
    res.sendFile(req.path, { root: rootPath });
});

server.get('/script/*', async function (req, res) {
    let rootPath = await storage.getItem('resourcePath');
    res.sendFile(req.path, { root: rootPath });
});

server.post('/api/document/save', proxy(SERVER_ADDRESS));

server.post('/api/document/new', proxy(SERVER_ADDRESS));

server.post('/api/document/delete', proxy(SERVER_ADDRESS));

server.post('/api/document/get', proxy(SERVER_ADDRESS));

server.post('/api/document/getall', proxy(SERVER_ADDRESS));

server.post('/api/folder/get', proxy(SERVER_ADDRESS));

server.post('/api/folder/save', proxy(SERVER_ADDRESS));

server.post('/api/template/get', proxy(SERVER_ADDRESS));


// identity
server.post('/api/identity/get', proxy(SERVER_ADDRESS));

server.post('/api/identity/insert', proxy(SERVER_ADDRESS));

server.post('/api/identity/delete', proxy(SERVER_ADDRESS));

server.use('/api/identity/download', proxy(SERVER_ADDRESS));

server.post('/api/login', proxy(SERVER_ADDRESS));


server.post('/api/open', function (req, res) {
    opn(`http://127.0.0.1:${PORT}/app`);
});

// WEP APP
server.get('/app', async (req, res, next) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});
server.get('/static/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build/' + req.originalUrl));
});
server.get(['/favicon.ico', '/manifest.json', '/logo192.png'], function (req, res) {
    res.sendFile(path.join(__dirname, '../build/' + req.originalUrl));
});

server.get('*', function (req, res) {
    if (req.originalUrl.indexOf('static') > -1) {
        return res.sendFile(path.join(__dirname, '../build/' + req.originalUrl));
    }
    return res.sendFile(req.path, { root: path.join(__dirname, 'assets/page') });
});



// init persist
async function init() {
    await storage.init();

    // get config
    // connection.query(`SELECT * FROM MS_CONFIG`, function (error, results, fields) {
    //     if (error) {
    //         // error
    //     }
    //     else {
    //         if (results.length > 0) {
    //             // success
    //             results.map( async e => {
    //                 await storage.setItem(e.key, e.value);
    //             })
    //         }
    //         else {
    //         }
    //     }
    // });
    await storage.setItem('resourcePath', 'D:/\/Phuong 8 Data');
}

let app = null;
// app = server.listen(PORT, (err) => {
//     if (err) throw err;
//     init();
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
                    if (err) throw err;
                    init();
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