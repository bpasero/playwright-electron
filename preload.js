const { ipcRenderer, contextBridge } = require("electron");

const promise = ipcRenderer.invoke('vscode:preload');

window.vscode = {
    waitForInvoke: () => {
        return promise;
    }
}