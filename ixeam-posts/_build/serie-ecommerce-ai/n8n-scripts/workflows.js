// Real n8n workflows used for the screenshots of the AI x E-commerce series.
const C = {
  shopify: { shopifyAccessTokenApi: { id: 'cShopify', name: 'Shopify — my store' } },
  anthropic: { anthropicApi: { id: 'cAnthropic', name: 'Anthropic account' } },
  telegram: { telegramApi: { id: 'cTelegram', name: 'Telegram bot' } },
  sheets: { googleSheetsOAuth2Api: { id: 'cSheets', name: 'Google Sheets account' } },
};
let uid = 0;
const id = () => 'n' + (++uid).toString().padStart(4, '0') + '-0000-4000-8000-000000000000';
function N(name, type, typeVersion, position, parameters = {}, extra = {}) {
  return { id: id(), name, type, typeVersion, position, parameters, ...extra };
}
function conn(list) {
  const c = {};
  for (const [from, to, kind = 'main', outIdx = 0, inIdx = 0] of list) {
    c[from] ??= {}; c[from][kind] ??= [];
    while (c[from][kind].length <= outIdx) c[from][kind].push([]);
    c[from][kind][outIdx].push({ node: to, type: kind, index: inIdx });
  }
  return c;
}
const model = (pos) => N('Claude (Chat Model)', '@n8n/n8n-nodes-langchain.lmChatAnthropic', 1.3, pos,
  { model: { __rl: true, mode: 'id', value: 'claude-sonnet-4-5' }, options: {} }, { credentials: C.anthropic });

const DEMO_ORDERS = [
  { id: 1001, name: '#1001', total_price: '4900.00', currency: 'DZD', line_items: [{ title: 'Montre classique', quantity: 1 }], financial_status: 'pending', note: 'مثال' },
  { id: 1002, name: '#1002', total_price: '7800.00', currency: 'DZD', line_items: [{ title: 'Sac en cuir', quantity: 1 }, { title: 'Portefeuille', quantity: 1 }], financial_status: 'pending', note: 'مثال' },
  { id: 1003, name: '#1003', total_price: '4900.00', currency: 'DZD', line_items: [{ title: 'Montre classique', quantity: 1 }], financial_status: 'pending', note: 'مثال' },
];

const W = [];

// 1) AI Agent for the store (Instagram / Messenger)
{
  const nodes = [
    N('Instagram / Messenger DM', 'n8n-nodes-base.webhook', 2, [0, 0], { httpMethod: 'POST', path: 'ig-dm', options: {} }),
    N('AI Agent — Store support', '@n8n/n8n-nodes-langchain.agent', 2.2, [300, 0], {
      promptType: 'define', text: '={{ $json.body.message }}',
      options: { systemMessage: 'You are the support agent of the store. Use the tools to read real order and stock data. Never invent information. Any refund or price change must be approved by the owner.' },
    }),
    model([180, 260]),
    N('Memory', '@n8n/n8n-nodes-langchain.memoryBufferWindow', 1.3, [340, 260], { sessionIdType: 'customKey', sessionKey: '={{ $json.body.sender_id }}' }),
    N('Get order (Shopify)', 'n8n-nodes-base.shopifyTool', 1, [500, 260], { authentication: 'accessToken', operation: 'get', orderId: "={{ $fromAI('order_id', 'The order number') }}", options: {} }, { credentials: C.shopify }),
    N('Check stock (Shopify)', 'n8n-nodes-base.shopifyTool', 1, [660, 260], { authentication: 'accessToken', resource: 'product', operation: 'get', productId: "={{ $fromAI('product_id', 'The product id') }}", additionalFields: {} }, { credentials: C.shopify }),
    N('Reply to customer', 'n8n-nodes-base.httpRequest', 4.2, [700, 0], { method: 'POST', url: 'https://graph.facebook.com/v21.0/me/messages', options: {} }),
  ];
  W.push({ key: 'agent', name: 'AI Agent — Store support', nodes, connections: conn([
    ['Instagram / Messenger DM', 'AI Agent — Store support'],
    ['Claude (Chat Model)', 'AI Agent — Store support', 'ai_languageModel'],
    ['Memory', 'AI Agent — Store support', 'ai_memory'],
    ['Get order (Shopify)', 'AI Agent — Store support', 'ai_tool'],
    ['Check stock (Shopify)', 'AI Agent — Store support', 'ai_tool'],
    ['AI Agent — Store support', 'Reply to customer'],
  ]), pinData: {
    'Instagram / Messenger DM': [{ json: { body: { sender_id: 'demo-123', message: 'وين راهي الطلبية تاعي #1002؟' } } }],
    'AI Agent — Store support': [{ json: { output: 'مرحبا! الطلبية #1002 راهي في الطريق، توصلك غدوة إن شاء الله 🚚 (مثال)' } }],
    'Reply to customer': [{ json: { message_id: 'demo' } }],
  } });
}

// 2) Daily report Shopify -> Telegram
{
  const code = `// Totals are computed here, not by the LLM
const orders = $input.all().map(i => i.json);
const total = orders.reduce((s, o) => s + Number(o.total_price), 0);
const count = {};
for (const o of orders) for (const li of o.line_items)
  count[li.title] = (count[li.title] || 0) + li.quantity;
const top = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 3);
return [{ json: { orders: orders.length, total, top } }];`;
  const nodes = [
    N('Every day 08:00', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 0], { rule: { interval: [{ triggerAtHour: 8 }] } }),
    N("Get yesterday's orders", 'n8n-nodes-base.shopify', 1, [240, 0], { authentication: 'accessToken', operation: 'getAll', returnAll: true, options: { createdAtMin: "={{ $now.minus({ days: 1 }).startOf('day').toISO() }}" } }, { credentials: C.shopify }),
    N('Calculate totals', 'n8n-nodes-base.code', 2, [480, 0], { jsCode: code }),
    N('Write summary (AI)', '@n8n/n8n-nodes-langchain.chainLlm', 1.7, [720, 0], { promptType: 'define', text: `=راك محلل e-commerce.
هاذو الأرقام تاع البارح: {{ JSON.stringify($json) }}
اكتبلي ملخص قصير بالدارجة:
- عدد الطلبيات والمجموع
- أكثر 3 منتجات بيعا
- أي حاجة غريبة لازم نشوفها
ما تخترعش أرقام: استعمل غير الداتا اللي عطيتك.` }),
    model([720, 220]),
    N('Send to Telegram', 'n8n-nodes-base.telegram', 1.2, [1000, 0], { chatId: '123456789', text: '={{ $json.text }}', additionalFields: {} }, { credentials: C.telegram }),
  ];
  W.push({ key: 'report', name: 'Daily store report → Telegram', nodes, connections: conn([
    ['Every day 08:00', "Get yesterday's orders"], ["Get yesterday's orders", 'Calculate totals'],
    ['Calculate totals', 'Write summary (AI)'], ['Claude (Chat Model)', 'Write summary (AI)', 'ai_languageModel'],
    ['Write summary (AI)', 'Send to Telegram'],
  ]), pinData: {
    "Get yesterday's orders": DEMO_ORDERS.map(json => ({ json })),
    'Write summary (AI)': [{ json: { text: '📊 Rapport تاع البارح (مثال)\n• 3 طلبيات — 17 600 DA\n• أكثر منتج: Montre classique (2)\n• ما كاين حتى حاجة غريبة ✅' } }],
    'Send to Telegram': [{ json: { ok: true } }],
  } });
}

// 3) Cloud sync for the dashboard
{
  const nodes = [
    N('Every hour', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 200], { rule: { interval: [{ field: 'hours' }] } }),
    N('Shopify — orders', 'n8n-nodes-base.shopify', 1, [260, 0], { authentication: 'accessToken', operation: 'getAll', returnAll: true, options: {} }, { credentials: C.shopify }),
    N('Meta Ads — insights', 'n8n-nodes-base.httpRequest', 4.2, [260, 200], { url: 'https://graph.facebook.com/v21.0/act_ID/insights', options: {} }),
    N('GA4 — sessions', 'n8n-nodes-base.httpRequest', 4.2, [260, 400], { method: 'POST', url: 'https://analyticsdata.googleapis.com/v1beta/properties/ID:runReport', options: {} }),
    N('Merge sources', 'n8n-nodes-base.merge', 3.2, [520, 200], { numberInputs: 3 }),
    N('Calculate KPIs', 'n8n-nodes-base.code', 2, [760, 200], { jsCode: '// ROAS = sales / ad spend\n// CPA = ad spend / orders\n// Conversion rate = orders / sessions * 100\nreturn $input.all();' }),
    N('Save to Google Sheets', 'n8n-nodes-base.googleSheets', 4.6, [1000, 200], { operation: 'append', documentId: { __rl: true, mode: 'id', value: 'SHEET_ID' }, sheetName: { __rl: true, mode: 'name', value: 'dashboard' }, columns: { mappingMode: 'autoMapInputData', value: {} }, options: {} }, { credentials: C.sheets }),
  ];
  W.push({ key: 'cloud', name: 'Cloud sync → Dashboard (Looker Studio)', nodes, connections: conn([
    ['Every hour', 'Shopify — orders'], ['Every hour', 'Meta Ads — insights'], ['Every hour', 'GA4 — sessions'],
    ['Shopify — orders', 'Merge sources', 'main', 0, 0], ['Meta Ads — insights', 'Merge sources', 'main', 0, 1], ['GA4 — sessions', 'Merge sources', 'main', 0, 2],
    ['Merge sources', 'Calculate KPIs'], ['Calculate KPIs', 'Save to Google Sheets'],
  ]) });
}

// 4) Competitor ad analysis with AI
{
  const nodes = [
    N('Paste a competitor ad', 'n8n-nodes-base.formTrigger', 2.2, [0, 0], {
      formTitle: 'تحليل Ad تاع منافس', formDescription: 'حط الـ Text تاع الـ Ad والـ Offer، والـ AI يحللو',
      formFields: { values: [
        { fieldLabel: 'الـ Text تاع الـ Ad', fieldType: 'textarea', requiredField: true },
        { fieldLabel: 'الـ Offer (السومة، التوصيل…)', fieldType: 'text' },
        { fieldLabel: 'المنتج تاعك', fieldType: 'text', requiredField: true },
      ] }, options: {},
    }),
    N('Analyse the ad (AI)', '@n8n/n8n-nodes-langchain.chainLlm', 1.7, [280, 0], { promptType: 'define', text: `=راك خبير Performance Marketing.
هذا Ad تاع منافس: {{ $json['الـ Text تاع الـ Ad'] }}
الـ Offer: {{ $json['الـ Offer (السومة، التوصيل…)'] }}
حللي:
1. الـ Hook: شنو يوقف الكليان؟
2. الـ Angle: أي مشكل ولا رغبة يستهدف؟
3. الـ Offer والـ CTA
4. نقاط الضعف
من بعد اقترح 5 Hooks جداد للمنتج تاعي: {{ $json['المنتج تاعك'] }}
السوق: الجزائر، الدفع عند الاستلام. جاوبني في جدول.
ما تكوبيش الـ Ad.` }),
    model([280, 220]),
    N('Save insights (Sheets)', 'n8n-nodes-base.googleSheets', 4.6, [580, 0], { operation: 'append', documentId: { __rl: true, mode: 'id', value: 'SHEET_ID' }, sheetName: { __rl: true, mode: 'name', value: 'ads' }, columns: { mappingMode: 'autoMapInputData', value: {} }, options: {} }, { credentials: C.sheets }),
  ];
  W.push({ key: 'ads', name: 'Competitor ad analysis (AI)', nodes, connections: conn([
    ['Paste a competitor ad', 'Analyse the ad (AI)'], ['Claude (Chat Model)', 'Analyse the ad (AI)', 'ai_languageModel'], ['Analyse the ad (AI)', 'Save insights (Sheets)'],
  ]) });
}

// 5) Ask your store with MCP
{
  const nodes = [
    N('Chat with your store', '@n8n/n8n-nodes-langchain.chatTrigger', 1.1, [0, 0], { options: {} }),
    N('AI Agent — Store analyst', '@n8n/n8n-nodes-langchain.agent', 2.2, [300, 0], { options: { systemMessage: 'Answer only from the store data returned by the tools. Read only.' } }),
    model([160, 240]),
    N('Memory', '@n8n/n8n-nodes-langchain.memoryBufferWindow', 1.3, [330, 240], {}),
    N('Shopify MCP (read only)', '@n8n/n8n-nodes-langchain.mcpClientTool', 1.1, [500, 240], { sseEndpoint: 'https://your-store.myshopify.com/api/mcp' }),
  ];
  W.push({ key: 'mcp', name: 'Ask your store (MCP)', nodes, connections: conn([
    ['Chat with your store', 'AI Agent — Store analyst'], ['Claude (Chat Model)', 'AI Agent — Store analyst', 'ai_languageModel'],
    ['Memory', 'AI Agent — Store analyst', 'ai_memory'], ['Shopify MCP (read only)', 'AI Agent — Store analyst', 'ai_tool'],
  ]) });
}

// 6) Human in the loop
{
  const nodes = [
    N('Refund request', 'n8n-nodes-base.webhook', 2, [0, 0], { httpMethod: 'POST', path: 'refund', options: {} }),
    N('AI drafts a decision', '@n8n/n8n-nodes-langchain.chainLlm', 1.7, [240, 0], { promptType: 'define', text: '=Summarise this refund request for the owner and suggest a decision: {{ JSON.stringify($json.body) }}' }),
    model([240, 220]),
    N('Ask owner on Telegram', 'n8n-nodes-base.telegram', 1.2, [540, 0], { operation: 'sendAndWait', chatId: '123456789', message: '={{ $json.text }}', approvalOptions: { values: { approvalType: 'double' } }, options: {} }, { credentials: C.telegram }),
    N('Approved?', 'n8n-nodes-base.if', 2.2, [800, 0], { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 }, conditions: [{ id: 'c1', leftValue: '={{ $json.data.approved }}', rightValue: true, operator: { type: 'boolean', operation: 'true', singleValue: true } }], combinator: 'and' }, options: {} }),
    N('Create refund (Shopify API)', 'n8n-nodes-base.httpRequest', 4.2, [1060, -100], { method: 'POST', url: 'https://your-store.myshopify.com/admin/api/2025-07/orders/ORDER_ID/refunds.json', options: {} }),
    N('Tell customer: declined', 'n8n-nodes-base.httpRequest', 4.2, [1060, 100], { method: 'POST', url: 'https://graph.facebook.com/v21.0/me/messages', options: {} }),
  ];
  W.push({ key: 'hitl', name: 'Refund with human approval', nodes, connections: conn([
    ['Refund request', 'AI drafts a decision'], ['Claude (Chat Model)', 'AI drafts a decision', 'ai_languageModel'],
    ['AI drafts a decision', 'Ask owner on Telegram'], ['Ask owner on Telegram', 'Approved?'],
    ['Approved?', 'Create refund (Shopify API)', 'main', 0], ['Approved?', 'Tell customer: declined', 'main', 1],
  ]) });
}

module.exports = { W, credentials: [
  { id: 'cShopify', name: 'Shopify — my store', type: 'shopifyAccessTokenApi', data: { shopSubdomain: 'demo-store', accessToken: 'shpat_demo', appSecretKey: 'demo' } },
  { id: 'cAnthropic', name: 'Anthropic account', type: 'anthropicApi', data: { apiKey: 'sk-ant-demo' } },
  { id: 'cTelegram', name: 'Telegram bot', type: 'telegramApi', data: { accessToken: '123:demo' } },
  { id: 'cSheets', name: 'Google Sheets account', type: 'googleSheetsOAuth2Api', data: { clientId: 'demo', clientSecret: 'demo' } },
] };
