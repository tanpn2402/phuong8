const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const server = require('./server');
const path = require('path');
const isDev = require('electron-is-dev');
const { ipcMain, dialog } = require('electron');
const IS_PROD = true;
let mainWindow;

function createWindow() {
    if (IS_PROD) {
        server.start();
    }

    mainWindow = new BrowserWindow({
        fullscreen: false,
        title: 'Phuong 8'
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        // mainWindow.openDevTools({ mode: 'undocked' })
    }
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (IS_PROD) {
        server.stop();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC events
// ipcMain.on('load', (evt, args) => {
    // open new window

    // console.log(args);
    // console.log(evt);

    // setInterval(() => {
    //     mainWindow.webContents.send('push', {
    //         id: args,
    //         time: new Date().getTime()
    //     })
    // }, 100)
// })