const { chromium } = require('playwright');
const ids = require('./ids.json');
const plan = {
  agent: { exec: true, ndv: ['AI Agent — Store support'] },
  report: { exec: true, ndv: ['Calculate totals', 'Write summary (AI)', 'Send to Telegram', "Get yesterday's orders"] },
  cloud: { ndv: ['Save to Google Sheets'] },
  ads: { ndv: ['Analyse the ad (AI)', 'Paste a competitor ad'] },
  mcp: { ndv: ['Shopify MCP (read only)'] },
  hitl: { ndv: ['Ask owner on Telegram'] },
};
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ storageState: 'state.json', viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const clip = { x: 200, y: 0, width: 1400, height: 900 };
  for (const [k, cfg] of Object.entries(plan)) {
    await p.goto(`http://127.0.0.1:5678/workflow/${ids[k]}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2000);
    await p.mouse.click(900, 300); await p.keyboard.press('1'); await p.waitForTimeout(900);
    await p.screenshot({ path: `${k}-canvas.png`, clip });
    if (cfg.exec) {
      await p.getByRole('button', { name: /Execute workflow/i }).first().click().catch(e => console.log('exec btn', e.message));
      await p.waitForTimeout(6000);
      await p.mouse.click(900, 250); await p.keyboard.press('1'); await p.waitForTimeout(900);
      await p.screenshot({ path: `${k}-exec.png`, clip });
    }
    for (const n of cfg.ndv || []) {
      const node = p.locator(`[data-node-name="${n}"]`).first();
      if (await node.count()) await node.dblclick(); else await p.getByText(n, { exact: true }).first().dblclick();
      await p.waitForTimeout(2200);
      await p.screenshot({ path: `${k}-ndv-${slug(n)}.png` });
      await p.keyboard.press('Escape'); await p.waitForTimeout(800);
    }
    console.log('done', k);
  }
  await b.close();
})();
