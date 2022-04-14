const { _electron: electron } = require('@playwright/test');

(async () => {
    const electronApp = await electron.launch({ args: ['main.js'] });

    const window = await electronApp.firstWindow();

    await window.context().tracing.start({ name: 'ETracing', screenshots: true, snapshots: true });
    await window.waitForTimeout(10000);
    await window.context().tracing.stop({ path: 'trace.zip' });

    await electronApp.close();
})();