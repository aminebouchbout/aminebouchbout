// Workflows for the "Cloud for e-commerce" series (December)
let uid = 100;
const id = () => 'n' + (++uid).toString().padStart(4, '0') + '-0000-4000-8000-000000000000';
const N = (name, type, typeVersion, position, parameters = {}, extra = {}) => ({ id: id(), name, type, typeVersion, position, parameters, ...extra });
function conn(list) {
  const c = {};
  for (const [from, to, kind = 'main', outIdx = 0, inIdx = 0] of list) {
    c[from] ??= {}; c[from][kind] ??= [];
    while (c[from][kind].length <= outIdx) c[from][kind].push([]);
    c[from][kind][outIdx].push({ node: to, type: kind, index: inIdx });
  }
  return c;
}
module.exports = (cred) => {
  const W = [];
  // 1) Uptime monitor
  W.push({ key: 'uptime', name: 'Store uptime monitor', nodes: [
    N('Every 5 minutes', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 0], { rule: { interval: [{ field: 'minutes', minutesInterval: 5 }] } }),
    N('Check the store', 'n8n-nodes-base.httpRequest', 4.2, [240, 0], { url: 'https://your-store.com', options: { response: { response: { fullResponse: true, neverError: true } }, timeout: 10000 } }),
    N('Store is down?', 'n8n-nodes-base.if', 2.2, [480, 0], { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 }, conditions: [{ id: 'c1', leftValue: '={{ $json.statusCode }}', rightValue: 200, operator: { type: 'number', operation: 'notEquals' } }], combinator: 'and' }, options: {} }),
    N('Alert on Telegram', 'n8n-nodes-base.telegram', 1.2, [740, -100], { chatId: '123456789', text: '=⚠️ الـ Store ما راهوش يجاوب — Status: {{ $json.statusCode }}', additionalFields: {} }, { credentials: cred.telegram }),
    N('All good', 'n8n-nodes-base.noOp', 1, [740, 100]),
  ], connections: conn([
    ['Every 5 minutes', 'Check the store'], ['Check the store', 'Store is down?'],
    ['Store is down?', 'Alert on Telegram', 'main', 0], ['Store is down?', 'All good', 'main', 1],
  ]), pinData: { 'Check the store': [{ json: { statusCode: 200, statusMessage: 'OK' } }] } });

  // 2) New order -> Google Sheets for the confirmation team
  W.push({ key: 'sheets', name: 'New order → Confirmation sheet', nodes: [
    N('New Shopify order', 'n8n-nodes-base.shopifyTrigger', 1, [0, 0], { authentication: 'accessToken', topic: 'orders/create' }, { credentials: cred.shopify, webhookId: 'f3c1a2b4-1111-4222-8333-944455556666' }),
    N('Keep useful fields', 'n8n-nodes-base.set', 3.4, [260, 0], { assignments: { assignments: [
      { id: 'a1', name: 'order', value: '={{ $json.name }}', type: 'string' },
      { id: 'a2', name: 'customer', value: '={{ $json.shipping_address.name }}', type: 'string' },
      { id: 'a3', name: 'phone', value: '={{ $json.shipping_address.phone }}', type: 'string' },
      { id: 'a4', name: 'wilaya', value: '={{ $json.shipping_address.province }}', type: 'string' },
      { id: 'a5', name: 'total', value: '={{ $json.total_price }}', type: 'string' },
      { id: 'a6', name: 'status', value: 'جديدة', type: 'string' },
    ] }, options: {} }),
    N('Add row to Sheet', 'n8n-nodes-base.googleSheets', 4.6, [520, 0], { operation: 'append', documentId: { __rl: true, mode: 'id', value: 'SHEET_ID' }, sheetName: { __rl: true, mode: 'name', value: 'Commandes' }, columns: { mappingMode: 'autoMapInputData', value: {} }, options: {} }, { credentials: cred.sheets }),
    N('Notify the team', 'n8n-nodes-base.telegram', 1.2, [780, 0], { chatId: '-100123456789', text: '=🛒 طلبية جديدة {{ $json.order }} — {{ $json.wilaya }}', additionalFields: {} }, { credentials: cred.telegram }),
  ], connections: conn([
    ['New Shopify order', 'Keep useful fields'], ['Keep useful fields', 'Add row to Sheet'], ['Add row to Sheet', 'Notify the team'],
  ]), pinData: {
    'New Shopify order': [{ json: { name: '#1024', total_price: '6500.00', shipping_address: { name: 'مثال — Client', phone: '05 XX XX XX XX', province: 'Oran' } } }],
    'Add row to Sheet': [{ json: { order: '#1024', status: 'جديدة' } }],
    'Notify the team': [{ json: { ok: true } }],
  } });

  // 3) Nightly backup to Google Drive
  W.push({ key: 'backup', name: 'Nightly store backup → Google Drive', nodes: [
    N('Every night 02:00', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 100], { rule: { interval: [{ triggerAtHour: 2 }] } }),
    N('Get all products', 'n8n-nodes-base.shopify', 1, [260, 0], { authentication: 'accessToken', resource: 'product', operation: 'getAll', returnAll: true, additionalFields: {} }, { credentials: cred.shopify }),
    N('Get all orders', 'n8n-nodes-base.shopify', 1, [260, 200], { authentication: 'accessToken', operation: 'getAll', returnAll: true, options: {} }, { credentials: cred.shopify }),
    N('Products → CSV', 'n8n-nodes-base.convertToFile', 1.1, [520, 0], { options: { fileName: "={{ 'products-' + $now.toFormat('yyyy-MM-dd') + '.csv' }}" } }),
    N('Orders → CSV', 'n8n-nodes-base.convertToFile', 1.1, [520, 200], { options: { fileName: "={{ 'orders-' + $now.toFormat('yyyy-MM-dd') + '.csv' }}" } }),
    N('Upload to Drive', 'n8n-nodes-base.googleDrive', 3, [780, 100], { driveId: { __rl: true, mode: 'list', value: 'My Drive' }, folderId: { __rl: true, mode: 'id', value: 'BACKUP_FOLDER_ID' }, options: {} }, { credentials: cred.drive }),
  ], connections: conn([
    ['Every night 02:00', 'Get all products'], ['Every night 02:00', 'Get all orders'],
    ['Get all products', 'Products → CSV'], ['Get all orders', 'Orders → CSV'],
    ['Products → CSV', 'Upload to Drive'], ['Orders → CSV', 'Upload to Drive'],
  ]) });
  return W;
};
