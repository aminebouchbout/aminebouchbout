const { chromium } = require('playwright');
const ids = require('./ids.json');
const B = 'http://127.0.0.1:5678';
const code = `// KPIs computed from the 3 sources
const [shop, ads, ga] = [0, 1, 2].map(i => $input.all()[i]?.json ?? {});
const sales   = shop.total_sales ?? 0;   // Shopify
const orders  = shop.orders ?? 0;
const spend   = ads.spend ?? 0;          // Meta Ads
const sessions = ga.sessions ?? 0;       // GA4
return [{ json: {
  roas: spend ? sales / spend : null,
  cpa: orders ? spend / orders : null,
  conversion_rate: sessions ? (orders / sessions) * 100 : null,
  delivery_rate: shop.confirmed ? (shop.delivered / shop.confirmed) * 100 : null,
} }];`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ storageState: 'state.json', viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  const r = ctx.request;
  const wf = (await (await r.get(`${B}/rest/workflows/${ids.cloud}`)).json()).data;
  wf.nodes.find(x => x.name === 'Calculate KPIs').parameters.jsCode = code;
  console.log('patch', (await r.patch(`${B}/rest/workflows/${ids.cloud}`, { data: { nodes: wf.nodes, versionId: wf.versionId } })).status());
  const p = await ctx.newPage();
  await p.goto(`${B}/workflow/${ids.cloud}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  await p.locator('[data-node-name="Calculate KPIs"]').first().dblclick({ force: true }); await p.waitForTimeout(2200);
  await p.screenshot({ path: 'cloud-ndv-kpis.png' });
  await b.close();
})();
