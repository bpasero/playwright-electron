//@ts-check

// main.js
const { app, BrowserWindow, ipcMain, protocol, session } = require('electron');
const { join } = require('path');

protocol.registerSchemesAsPrivileged([
    {
        scheme: 'vscode-file',
        privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true }
    }
]);

app.whenReady().then(() => {
    session.defaultSession.protocol.registerFileProtocol('vscode-file', (request, callback) => {
        console.log(new URL(request.url));
        callback({ path: new URL(request.url).pathname });
    });

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadURL(new URL(`vscode-file:/vscode-app/${join(__dirname, 'index.html')}`).toString());
});

ipcMain.handle('vscode:preload', async event => {
    const url = event.senderFrame.url;

    return url;
});