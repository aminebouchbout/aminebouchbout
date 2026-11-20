const { chromium } = require('playwright');
const ids = require('./ids.json');
const B = 'http://127.0.0.1:5678';
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ storageState: 'state.json', viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  // fix MCP node params
  const r = ctx.request;
  const wf = (await (await r.get(`${B}/rest/workflows/${ids.mcp}`)).json()).data;
  const n = wf.nodes.find(x => x.type.endsWith('mcpClientTool'));
  n.parameters = { endpointUrl: 'https://your-store.myshopify.com/api/mcp', serverTransport: 'httpStreamable', include: 'all' };
  console.log('patch', (await r.patch(`${B}/rest/workflows/${ids.mcp}`, { data: { nodes: wf.nodes, versionId: wf.versionId } })).status());
  const p = await ctx.newPage();
  const clip = { x: 200, y: 0, width: 1400, height: 900 };
  async function open(k) { await p.goto(`${B}/workflow/${ids[k]}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000); }
  async function ndv(k, name) {
    const node = p.locator(`[data-node-name="${name}"]`).first();
    await node.dblclick({ force: true }); await p.waitForTimeout(2200);
    await p.screenshot({ path: `${k}-ndv-${slug(name)}.png` });
    await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  }
  for (const k of ['agent', 'report']) {
    await open(k);
    await p.locator('[data-test-id^="execute-workflow-button"]').first().click({ force: true });
    await p.waitForTimeout(7000);
    await p.screenshot({ path: `${k}-exec.png`, clip });
    if (k === 'report') for (const nm of ["Get yesterday's orders", 'Calculate totals', 'Write summary (AI)', 'Send to Telegram']) await ndv(k, nm);
    else await ndv(k, 'AI Agent — Store support');
    console.log('exec', k);
  }
  await open('mcp'); await p.screenshot({ path: 'mcp-canvas.png', clip }); await ndv('mcp', 'Shopify MCP (read only)');
  // real form page
  await open('ads');
  const node = p.locator(`[data-node-name="Paste a competitor ad"]`).first();
  await node.dblclick({ force: true }); await p.waitForTimeout(1500);
  const url = (await p.locator('text=/form-test\\//').first().innerText()).trim();
  await p.getByRole('button', { name: /Execute step|Test step|Listen/i }).first().click({ force: true }).catch(e => console.log('listen', e.message));
  await p.waitForTimeout(2500);
  const f = await ctx.newPage(); await f.setViewportSize({ width: 900, height: 1000 });
  await f.goto(url.replace('localhost', '127.0.0.1'), { waitUntil: 'networkidle' }).catch(e => console.log('form', e.message));
  await f.waitForTimeout(1500);
  const ta = f.locator('textarea').first();
  if (await ta.count()) {
    await ta.fill('ساعة كلاسيك فخمة ⌚ التوصيل لـ 58 ولاية والدفع عند الاستلام. اطلبها اليوم!');
    const ins = f.locator('input[type="text"]');
    if (await ins.count() > 0) await ins.nth(0).fill('4900 DA — التوصيل مجاني');
    if (await ins.count() > 1) await ins.nth(1).fill('Sac en cuir');
  }
  await f.screenshot({ path: 'ads-form.png', fullPage: true });
  console.log('form', url);
  await b.close();
})();
