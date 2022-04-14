//@ts-check

const { _electron: electron } = require('@playwright/test');

(async () => {
    const electronApp = await electron.launch({ args: ['main.js'] });

    const window = await electronApp.firstWindow();
    window.on('console', e => console.log(`Playwright (Electron): window.on('console') [${e.text()}]`));
    window.on('pageerror', async (error) => console.log(`Playwright (Electron) ERROR: page error: ${error}`));
    window.on('crash', () => console.log('Playwright (Electron) ERROR: page crash'));
    window.on('close', () => console.log('Playwright (Electron): page close'));
    window.on('response', async (response) => {
        if (response.status() >= 400) {
            console.log(`Playwright (Electron) ERROR: HTTP status ${response.status()} for ${response.url()}`);
        }
    });

    await window.context().tracing.start({ name: 'ETracing', screenshots: true, snapshots: true });

    function getDriverHandle() {
        return window.evaluateHandle('window.driver');
    }

    async function evaluateWithDriver(pageFunction) {
        return window.evaluate(pageFunction, [await getDriverHandle()]);
    }

    function getTitle() {
        return evaluateWithDriver(([driver]) => driver.getTitle());
    };

    const title = await getTitle();
    console.log(title);


    await window.waitForTimeout(10000);
    await window.context().tracing.stop({ path: 'trace.zip' });

    await electronApp.close();
})();
