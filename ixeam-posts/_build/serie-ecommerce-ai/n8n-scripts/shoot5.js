const { chromium } = require('playwright');
const ids = require('./ids.json');
const B = 'http://127.0.0.1:5678';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ storageState: 'state.json', viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  const r = ctx.request;
  const wf = (await (await r.get(`${B}/rest/workflows/${ids.ads}`)).json()).data;
  const ft = wf.nodes.find(x => x.type.endsWith('formTrigger'));
  ft.parameters.formTitle = 'تحليل إعلان منافس';
  ft.parameters.formDescription = 'حط نص الإعلان والعرض، والذكاء الاصطناعي يحللو';
  ft.parameters.formFields.values = [
    { fieldLabel: 'نص الإعلان', fieldType: 'textarea', requiredField: true },
    { fieldLabel: 'العرض (السومة، التوصيل…)', fieldType: 'text' },
    { fieldLabel: 'المنتج تاعك', fieldType: 'text', requiredField: true },
  ];
  ft.parameters.options = { customCss: "* { direction: rtl; text-align: right; font-family: 'Cairo', sans-serif !important; letter-spacing: 0 !important; }\n.n8n-link, .test-notice, button { text-align: center; }" };
  const llm = wf.nodes.find(x => x.name === 'Analyse the ad (AI)');
  llm.parameters.text = llm.parameters.text.replace("$json['الـ Text تاع الـ Ad']", "$json['نص الإعلان']").replace("$json['الـ Offer (السومة، التوصيل…)']", "$json['العرض (السومة، التوصيل…)']");
  console.log('patch', (await r.patch(`${B}/rest/workflows/${ids.ads}`, { data: { nodes: wf.nodes, versionId: wf.versionId } })).status());
  const p = await ctx.newPage();
  await p.goto(`${B}/workflow/${ids.ads}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  await p.locator(`[data-node-name="Paste a competitor ad"]`).first().dblclick({ force: true }); await p.waitForTimeout(1500);
  const n0 = ctx.pages().length;
  await p.locator('[data-test-id="node-execute-button"]').first().click({ force: true }); await p.waitForTimeout(3000);
  const f = ctx.pages().length > n0 ? ctx.pages()[ctx.pages().length - 1] : await ctx.newPage();
  await f.setViewportSize({ width: 900, height: 1100 }); await f.waitForTimeout(1500);
  await f.locator('textarea').first().fill('ساعة كلاسيك فخمة ⌚ التوصيل لـ 58 ولاية والدفع عند الاستلام. اطلبها اليوم!');
  const ins = f.locator('input[type="text"]');
  await ins.nth(0).fill('4900 دج — التوصيل مجاني'); await ins.nth(1).fill('حقيبة جلد');
  await f.mouse.click(5, 5);
  await f.screenshot({ path: 'ads-form.png', clip: { x: 190, y: 10, width: 520, height: 600 } });
  await b.close();
})();
