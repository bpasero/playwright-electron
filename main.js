// main.js
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });
    win.loadURL('data:text/html,<input type=checkbox></input>');
})

app.on('window-all-closed', e => e.preventDefault());