
(async () => {
    const result = await vscode.waitForInvoke();

    const span = document.createElement('span');
    span.textContent = 'Result from invoke: ' + result;

    window.document.body.appendChild(span);
})();
