const { chromium } = require('playwright');
const ids = require('./ids.json');
const B = 'http://127.0.0.1:5678';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ storageState: 'state.json', viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
  await ctx.addInitScript(() => { try { localStorage.setItem('N8N_THEME', 'dark'); } catch (e) {} });
  const p = await ctx.newPage();
  const clip = { x: 200, y: 0, width: 1400, height: 900 };
  const fit = async () => { const z = p.locator('[data-test-id="zoom-to-fit"]'); if (await z.count()) await z.first().click({ force: true }); await p.waitForTimeout(900); await p.mouse.move(1500, 120); await p.waitForTimeout(600); };
  const ndv = async (k, name, file) => { await p.locator(`[data-node-name="${name}"]`).first().dblclick({ force: true }); await p.waitForTimeout(2200); await p.screenshot({ path: `dark/${file}.png` }); await p.keyboard.press('Escape'); await p.waitForTimeout(700); };
  const plan = { uptime: { exec: 1 }, sheets: { exec: 1, ndv: [['Keep useful fields', 'sheets-set']] }, backup: {}, agent: { exec: 1 }, report: { exec: 1 } };
  for (const [k, cfg] of Object.entries(plan)) {
    await p.goto(`${B}/workflow/${ids[k]}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2200); await fit();
    await p.screenshot({ path: `dark/${k}-canvas.png`, clip });
    if (cfg.exec) {
      await p.locator('[data-test-id^="execute-workflow-button"]').first().click({ force: true }).catch(e => console.log(k, 'exec', e.message.slice(0, 80)));
      await p.waitForTimeout(7000); await fit();
      await p.screenshot({ path: `dark/${k}-exec.png`, clip });
    }
    for (const [n, f] of cfg.ndv || []) await ndv(k, n, f);
    console.log('done', k);
  }
  await b.close();
})();
