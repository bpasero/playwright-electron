//@ts-check

// main.js
const { app, BrowserWindow, ipcMain, protocol, session } = require('electron');
const { join, resolve } = require('path');

protocol.registerSchemesAsPrivileged([
    {
        scheme: 'vscode-file',
        privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true }
    }
]);

app.whenReady().then(() => {
    session.defaultSession.protocol.registerFileProtocol('vscode-file', (request, callback) => {
        let urlPath = new URL(request.url).pathname;
        // Windows path comes with a prefixed "/", E.g. "/C:/Foo/bar", so we remove it here
        if (process.platform === 'win32') {
            urlPath = urlPath.substring(1);
        }
        callback({ path: resolve(decodeURIComponent(urlPath)) });
    });

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            additionalArguments: [`--vscode-window-config=askdakdkasdajkl`],
            v8CacheOptions: 'none',
            enableWebSQL: false,
            spellcheck: false,
            nativeWindowOpen: true,
            zoomFactor: 1,
            enableBlinkFeatures: 'HighlightAPI',
        }
    });
    win.loadURL(new URL(`vscode-file:/vscode-app/${join(__dirname, 'index.html')}`).toString());
});

ipcMain.handle('vscode:preload', async event => {
    const url = event.senderFrame.url;
    if (!url) {
        throw new Error('Invalid URL');
    }

    return url;
});
