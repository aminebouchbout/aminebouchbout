const { chromium } = require('playwright');
const ids = require('./ids.json');
const B = 'http://127.0.0.1:5678';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ storageState: 'state.json', viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const clip = { x: 200, y: 0, width: 1400, height: 900 };
  const fit = async () => { const z = p.locator('[data-test-id="zoom-to-fit"]'); if (await z.count()) await z.first().click({ force: true }); await p.waitForTimeout(1000); };
  for (const k of ['agent', 'report']) {
    await p.goto(`${B}/workflow/${ids[k]}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
    await p.locator('[data-test-id^="execute-workflow-button"]').first().click({ force: true });
    await p.waitForTimeout(7000); await fit();
    await p.mouse.move(1590, 890);
    await p.screenshot({ path: `${k}-exec.png`, clip });
  }
  for (const k of Object.keys(ids)) {
    await p.goto(`${B}/workflow/${ids[k]}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000); await fit(); await p.mouse.move(1590, 890);
    await p.screenshot({ path: `${k}-canvas.png`, clip });
  }
  // form
  await p.goto(`${B}/workflow/${ids.ads}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  await p.locator(`[data-node-name="Paste a competitor ad"]`).first().dblclick({ force: true }); await p.waitForTimeout(1500);
  const url = (await p.locator('text=/form-test\\//').first().innerText()).trim().replace('localhost', '127.0.0.1');
  const btn = p.locator('[data-test-id="node-execute-button"]');
  console.log('btns', await btn.count());
  const pagesBefore = ctx.pages().length;
  await btn.first().click({ force: true }); await p.waitForTimeout(3000);
  let f = ctx.pages().length > pagesBefore ? ctx.pages()[ctx.pages().length - 1] : await ctx.newPage();
  await f.setViewportSize({ width: 900, height: 1100 });
  if (!f.url().includes('form-test')) await f.goto(url, { waitUntil: 'networkidle' });
  await f.waitForTimeout(1500);
  const ta = f.locator('textarea').first();
  if (await ta.count()) {
    await ta.fill('ساعة كلاسيك فخمة ⌚ التوصيل لـ 58 ولاية والدفع عند الاستلام. اطلبها اليوم!');
    const ins = f.locator('input[type="text"]');
    if (await ins.count() > 0) await ins.nth(0).fill('4900 DA — التوصيل مجاني');
    if (await ins.count() > 1) await ins.nth(1).fill('Sac en cuir');
  }
  await f.screenshot({ path: 'ads-form.png' });
  console.log('form', f.url());
  await b.close();
})();
