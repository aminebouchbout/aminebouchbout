// Série "الـ Cloud للتاجر" — 1 → 7 décembre 2026, mode sombre, 16:30
const D = 'img-dark/';
const S = (k, label) => ({ img: D + k + '.jpg', imgLabel: label || 'n8n · workflow' });
const lat = s => `<bdi>${s}</bdi>`;

// ---------- visuals (HTML) ----------
const vFlow3 = `<div class="vz-row" style="padding:10px 6px">
  <div class="vz-col"><div class="vz-ic pk">📱</div><div class="vz-t">الكليان</div><div class="vz-d">يفتح الـ ${lat('Store')}</div></div>
  <div class="vz-ar"></div>
  <div class="vz-col"><div class="vz-ic" style="width:150px;height:150px;font-size:76px">☁️</div><div class="vz-t">الـ ${lat('Cloud')}</div><div class="vz-d">سيرفرات تخدم ${lat('24/24')}</div></div>
  <div class="vz-ar"></div>
  <div class="vz-col"><div class="vz-ic cy">🏪</div><div class="vz-t">الـ ${lat('Store')}</div><div class="vz-d">صور، طلبيات، داتا</div></div>
</div>`;

const vPcCloud = `<div class="vz-row" style="align-items:stretch;gap:22px">
  <div class="vz-box bad"><div class="vz-row" style="justify-content:flex-start;gap:16px;margin-bottom:12px"><div class="vz-ic pk sm">💻</div><div class="vz-t">الـ ${lat('PC')} تاعك</div></div>
    <div class="vz-li">✕ يطفى ولا يتكسر</div><div class="vz-li">✕ قوة محدودة</div><div class="vz-li">✕ لازم تكون قدامو</div></div>
  <div class="vz-box good"><div class="vz-row" style="justify-content:flex-start;gap:16px;margin-bottom:12px"><div class="vz-ic gr sm">☁️</div><div class="vz-t">الـ ${lat('Cloud')}</div></div>
    <div class="vz-li">✓ يخدم ${lat('24/24')}</div><div class="vz-li">✓ يكبر وقت الحاجة</div><div class="vz-li">✓ توصلو من التليفون</div></div>
</div>`;

const layer = (t, you) => `<div style="height:62px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:23px;${you ? 'background:rgba(244,114,182,.18);color:#f9a8d4;border:2px solid rgba(244,114,182,.45)' : 'background:rgba(34,211,238,.13);color:#67e8f9;border:2px solid rgba(34,211,238,.4)'}"><span>${t}</span></div>`;
const stackCol = (name, ex, yous) => `<div style="flex:1;display:flex;flex-direction:column;gap:10px">
  <div class="vz-t vz-mono" style="text-align:center;font-size:34px;background:linear-gradient(90deg,#8b5cf6,#22d3ee);-webkit-background-clip:text;color:transparent">${name}</div>
  ${['الـ App', 'الداتا', 'الـ Runtime', 'الـ OS', 'السيرفرات'].map((l, i) => layer(l.replace(/(App|Runtime|OS)/, m => lat(m)), yous[i])).join('')}
  <div class="vz-d" style="text-align:center;margin-top:4px">${ex}</div></div>`;
const vStack = `<div class="vz-row" style="align-items:flex-start;gap:18px">
  ${stackCol('SaaS', lat('Shopify') + '، ' + lat('Google Sheets'), [0, 1, 0, 0, 0])}
  ${stackCol('PaaS', lat('Cloud Run') + '، ' + lat('Heroku'), [1, 1, 0, 0, 0])}
  ${stackCol('IaaS', lat('VPS') + '، ' + lat('AWS EC2'), [1, 1, 1, 1, 0])}
</div>
<div class="vz-row" style="justify-content:center;gap:30px;margin-top:20px">
  <span class="vz-tag c-p">انت تسيّر</span><span class="vz-tag c-c">الـ ${lat('Provider')} يسيّر</span></div>`;

// traffic chart (illustrative)
const vTraffic = (withCap) => `<div style="position:relative">
<svg viewBox="0 0 880 400" width="100%" style="display:block">
  <defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
  <linearGradient id="tf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".35"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>
  ${[80, 160, 240, 320].map(y => `<line x1="20" x2="860" y1="${y}" y2="${y}" stroke="rgba(147,160,199,.15)" stroke-dasharray="4 8"/>`).join('')}
  <path d="M20 330 C120 320 180 310 260 300 C330 290 360 280 400 230 C430 150 450 60 490 50 C530 45 550 120 590 200 C630 260 700 290 860 300 L860 360 L20 360Z" fill="url(#tf)"/>
  <path d="M20 330 C120 320 180 310 260 300 C330 290 360 280 400 230 C430 150 450 60 490 50 C530 45 550 120 590 200 C630 260 700 290 860 300" fill="none" stroke="url(#tg)" stroke-width="7" stroke-linecap="round"/>
  ${withCap ? `<line x1="20" x2="860" y1="190" y2="190" stroke="#f472b6" stroke-width="5" stroke-dasharray="14 10"/>
  <path d="M20 300 L340 300 L340 250 L420 250 L420 130 L450 130 L450 40 L560 40 L560 150 L620 150 L620 260 L860 260" fill="none" stroke="#34d399" stroke-width="5"/>
  <rect x="422" y="52" width="150" height="138" fill="rgba(244,114,182,.18)"/>` : ''}
  <circle cx="490" cy="50" r="12" fill="#22d3ee"/><circle cx="490" cy="50" r="26" fill="none" stroke="#22d3ee" stroke-opacity=".4" stroke-width="4"/>
</svg>
<div style="position:absolute;top:6px;right:24px" class="vz-tag c-c">${lat('Promo / Black Friday')}</div>
<div style="position:absolute;bottom:0;left:16px" class="vz-tag c-v">مثال</div>
</div>
${withCap ? `<div class="vz-row" style="justify-content:center;gap:22px;margin-top:16px">
  <span class="vz-tag c-v">الزوار</span><span class="vz-tag c-p">حد السيرفر الثابت</span><span class="vz-tag c-g">الـ ${lat('Cloud')} يكبر وحدو</span></div>` : ''}`;

const vCdn = `<div class="vz-row" style="align-items:stretch;gap:20px">
  <div class="vz-box bad" style="text-align:center"><div class="vz-ic pk sm" style="margin:0 auto 10px">🌍</div><div class="vz-t">بلا ${lat('CDN')}</div>
    <div class="vz-d" style="margin-top:8px">كل صورة تجي من سيرفر واحد بعيد</div><div class="vz-t vz-mono" style="margin-top:14px;color:#f9a8d4">🐢 slow</div></div>
  <div class="vz-box good" style="text-align:center"><div class="vz-ic gr sm" style="margin:0 auto 10px">⚡</div><div class="vz-t">مع ${lat('CDN')}</div>
    <div class="vz-d" style="margin-top:8px">نسخة من الصور في سيرفرات قريبة من الكليان</div><div class="vz-t vz-mono" style="margin-top:14px;color:#6ee7b7">🚀 fast</div></div>
</div>`;

const st = (t, c) => `<span class="vz-tag ${c}" style="font-size:21px">${t}</span>`;
const vSheet = `<div style="direction:rtl">
  <div class="vz-row" style="margin-bottom:14px"><div class="vz-t">📗 ${lat('Commandes')}</div><span class="vz-tag c-v">مثال</span></div>
  <table style="width:100%;border-collapse:separate;border-spacing:0 8px;font-weight:700;font-size:24px;color:#dfe5ff">
    <tr style="color:#93a0c7;font-size:21px"><td>الطلبية</td><td>الولاية</td><td>المجموع</td><td>الحالة</td></tr>
    ${[['#1024', 'وهران', '6 500', st('جديدة', 'c-v')], ['#1023', 'الجزائر', '4 900', st('مأكدة', 'c-g')], ['#1022', 'سطيف', '7 800', st('ما ردش', 'c-a')], ['#1021', 'باتنة', '4 900', st('ملغية', 'c-p')], ['#1020', 'تلمسان', '9 800', st('مأكدة', 'c-g')]]
      .map(r => `<tr style="background:rgba(17,24,64,.8)"><td style="padding:14px 16px;border-radius:0 14px 14px 0" class="vz-mono">${r[0]}</td><td>${r[1]}</td><td class="vz-mono">${r[2]} DA</td><td style="border-radius:14px 0 0 14px">${r[3]}</td></tr>`).join('')}
  </table></div>`;

const vBackup = `<div class="vz-row" style="align-items:stretch;gap:18px">
  <div class="vz-box" style="text-align:center"><div style="font-size:70px;font-weight:900;background:linear-gradient(90deg,#8b5cf6,#22d3ee);-webkit-background-clip:text;color:transparent" class="vz-mono">3</div><div class="vz-t">نسخ</div><div class="vz-d">الأصل + 2 ${lat('Backups')}</div><div style="font-size:40px;margin-top:8px">📄📄📄</div></div>
  <div class="vz-box" style="text-align:center"><div style="font-size:70px;font-weight:900;background:linear-gradient(90deg,#8b5cf6,#22d3ee);-webkit-background-clip:text;color:transparent" class="vz-mono">2</div><div class="vz-t">أنواع تخزين</div><div class="vz-d">مثال: ${lat('PC')} + ${lat('Cloud')}</div><div style="font-size:40px;margin-top:8px">💽☁️</div></div>
  <div class="vz-box good" style="text-align:center"><div style="font-size:70px;font-weight:900;color:#6ee7b7" class="vz-mono">1</div><div class="vz-t">برّا</div><div class="vz-d">نسخة بعيدة على الـ ${lat('Store')}</div><div style="font-size:40px;margin-top:8px">🛡️</div></div>
</div>`;

const vShared = `<div class="vz-row" style="align-items:stretch;gap:20px">
  <div class="vz-box" style="border-color:rgba(34,211,238,.5)"><div class="vz-row" style="justify-content:flex-start;gap:14px;margin-bottom:10px"><div class="vz-ic cy sm">🏢</div><div class="vz-t">الـ ${lat('Provider')}</div></div>
    <div class="vz-li">🔒 الـ ${lat('Data center')}</div><div class="vz-li">🔒 السيرفرات والشبكة</div><div class="vz-li">🔒 تحديثات الـ ${lat('Platform')}</div></div>
  <div class="vz-box" style="border-color:rgba(244,114,182,.55)"><div class="vz-row" style="justify-content:flex-start;gap:14px;margin-bottom:10px"><div class="vz-ic pk sm">🧑‍💻</div><div class="vz-t">انت</div></div>
    <div class="vz-li">🔑 الـ ${lat('Passwords')} والـ ${lat('2FA')}</div><div class="vz-li">👥 شكون عندو الـ ${lat('Access')}</div><div class="vz-li">🗝️ الـ ${lat('API Tokens')}</div></div>
</div>`;

const hours = (on) => `<div style="display:flex;gap:4px;direction:ltr">${Array.from({ length: 24 }, (_, h) => `<div style="flex:1;height:44px;border-radius:6px;${on(h) ? 'background:linear-gradient(180deg,#34d399,#0f9f72);box-shadow:0 0 12px rgba(52,211,153,.45)' : 'background:rgba(147,160,199,.15)'}"></div>`).join('')}</div>`;
const v247 = `<div style="display:flex;flex-direction:column;gap:26px">
  <div><div class="vz-row" style="margin-bottom:10px"><div class="vz-t">💻 على الـ ${lat('Laptop')}</div><span class="vz-tag c-p">يخدم غير كي يكون مشعول</span></div>${hours(h => h >= 9 && h < 19)}</div>
  <div><div class="vz-row" style="margin-bottom:10px"><div class="vz-t">☁️ في الـ ${lat('Cloud')}</div><span class="vz-tag c-g">${lat('24/24')}</span></div>${hours(() => true)}</div>
  <div class="vz-row vz-mono" style="color:#93a0c7;font-size:20px;direction:ltr"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
  <div class="vz-d" style="text-align:center">🌙 الكليان يبعث على ${lat('02:00')}؟ الـ ${lat('Agent')} يجاوب</div>
</div>`;

const vCompare = `<table style="width:100%;border-collapse:separate;border-spacing:0 10px;font-weight:700;font-size:25px;color:#dfe5ff">
  <tr><td></td><td class="vz-t" style="text-align:center;font-size:28px">${lat('n8n Cloud')}</td><td class="vz-t" style="text-align:center;font-size:28px">${lat('Self-host · VPS')}</td></tr>
  ${[['السيرفر', '✓ هوما يسيّروه', 'انت تسيّرو'], ['الـ Setup', '✓ دقايق', 'يحتاج خبرة'], ['السومة', 'اشتراك شهري', 'السيرفر برك'], ['التحكم', 'محدود شوية', '✓ كامل']]
    .map(r => `<tr style="background:rgba(17,24,64,.8)"><td style="padding:16px;border-radius:0 14px 14px 0;color:#93a0c7">${r[0]}</td><td style="text-align:center">${r[1]}</td><td style="text-align:center;border-radius:14px 0 0 14px">${r[2]}</td></tr>`).join('')}
</table>`;

const vMeter = `<div style="text-align:center">
<svg viewBox="0 0 600 330" width="78%" style="display:block;margin:0 auto">
  <defs><linearGradient id="mg" x1="0" x2="1"><stop offset="0" stop-color="#34d399"/><stop offset=".55" stop-color="#fbbf24"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs>
  <path d="M60 300 A240 240 0 0 1 540 300" fill="none" stroke="rgba(147,160,199,.18)" stroke-width="42" stroke-linecap="round"/>
  <path d="M60 300 A240 240 0 0 1 540 300" fill="none" stroke="url(#mg)" stroke-width="42" stroke-linecap="round" stroke-dasharray="754" stroke-dashoffset="0" opacity=".9"/>
  <line x1="300" y1="300" x2="190" y2="130" stroke="#eef2ff" stroke-width="10" stroke-linecap="round"/>
  <circle cx="300" cy="300" r="22" fill="#eef2ff"/>
</svg>
<div class="vz-row" style="justify-content:center;gap:20px;margin-top:6px"><span class="vz-tag c-g">تبدا صغير</span><span class="vz-tag c-a">تكبر على قد الحاجة</span><span class="vz-tag c-p">ما تنساش الـ ${lat('Budget')}</span></div></div>`;

const bar = (label, pct, c) => `<div style="margin-bottom:16px"><div class="vz-row" style="margin-bottom:6px"><span class="vz-t" style="font-size:27px">${label}</span><span class="vz-mono" style="color:#93a0c7;font-size:22px">${pct}%</span></div>
  <div style="height:26px;border-radius:13px;background:rgba(147,160,199,.15);direction:ltr;overflow:hidden"><div style="height:100%;width:${pct}%;border-radius:13px;background:${c}"></div></div></div>`;
const vBudget = `<div>${bar('الـ ' + lat('Budget') + ' تاع الشهر', 62, 'linear-gradient(90deg,#8b5cf6,#22d3ee)')}
  <div style="position:relative;height:0"><div style="position:absolute;top:-58px;left:${100 - 80}%;"></div></div>
  ${bar('تنبيه على ' + lat('80%'), 80, 'linear-gradient(90deg,#fbbf24,#f59e0b)')}
  ${bar('الحد الأقصى', 100, 'linear-gradient(90deg,#f472b6,#ec4899)')}
  <div class="vz-row"><span class="vz-d">🔔 يوصلك ${lat('Email')} قبل ما تفوت الحد</span><span class="vz-tag c-v">مثال</span></div></div>`;


const vDisaster = `<div style="display:flex;flex-direction:column;gap:16px">
  ${[['pk','💥','تعديل في الـ ' + lat('Theme') + ' كسّر الـ ' + lat('Site')],['pk','🗑️','منتجات تمسحو بالغلط'],['pk','🔐','حساب تسرق ولا تبدل']].map(r=>`<div class="vz-box bad" style="display:flex;align-items:center;gap:18px;padding:16px 22px"><div class="vz-ic ${r[0]} sm">${r[1]}</div><div class="vz-t" style="font-size:30px">${r[2]}</div></div>`).join('')}
  <div class="vz-box good" style="display:flex;align-items:center;gap:18px;padding:16px 22px"><div class="vz-ic gr sm">🛡️</div><div class="vz-t" style="font-size:30px">مع ${lat('Backup')}: ترجع في دقايق</div></div>
</div>`;
const flag = (n) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#f472b6;color:#0b1030;font-weight:900;font-size:22px;margin-inline-start:10px" class="vz-mono">${n}</span>`;
const vPhish = `<div style="direction:ltr;text-align:left;border-radius:20px;background:#f8fafc;color:#0f172a;padding:22px 26px;font-family:Inter,Arial,sans-serif;box-shadow:0 0 0 3px rgba(244,114,182,.5)">
  <div style="font-size:21px;color:#64748b">From: <b style="color:#0f172a">Store Support</b> &lt;<span style="color:#be185d;font-weight:700;background:#fde4f1;padding:1px 6px;border-radius:6px">security@st0re-verify.help</span>&gt; ${flag(1)}</div>
  <div style="font-size:27px;font-weight:800;margin-top:12px">⚠️ URGENT: Your store will be suspended in 24h ${flag(2)}</div>
  <div style="font-size:21px;color:#334155;margin-top:10px;line-height:1.5">We detected unusual activity. Verify your account now to avoid losing your store.</div>
  <div style="margin-top:16px;display:flex;align-items:center"><span style="background:#2563eb;color:#fff;font-weight:800;font-size:22px;padding:10px 22px;border-radius:10px">Verify my account</span>
  <span style="font-size:18px;color:#be185d;margin-left:14px;font-family:'JetBrains Mono'">→ http://login-st0re.help/x</span>${flag(3)}</div>
</div>
<div class="vz-row" style="justify-content:center;margin-top:14px"><span class="vz-tag c-v">مثال مخترع — ماشي Email حقيقي</span></div>`;

module.exports = [
{
  dir: '2026-12-01-cloud-cest-quoi', theme: 'dark',
  slides: [
    {type:'hookshot', size:'md', badge:'سلسلة: الـ Cloud للتاجر', title:'الـ Store تاعك *راهو في الـ Cloud*… وانت ما تعرفش؟', sub:'شرح بسيط، بلا تعقيد 👇', html: vFlow3},
    {type:'shot', counter:'1/3', tag:'WHAT IS CLOUD', title:'الـ Cloud = *PC تاع واحد آخر*', html: vPcCloud, rows:[
      ['v','الفكرة','تكري قوة السيرفرات بلاصة ما تشريها'],
      ['g','السومة','تخلص على قد ما تستعمل'],
    ]},
    {type:'shot', counter:'2/3', tag:'SAAS · PAAS · IAAS', title:'3 أنواع، *شكون يسيّر واش*', html: vStack, rows:[
      ['c','القاعدة','كل ما تهبط لـ IaaS، تسيّر أكثر وتتحكم أكثر'],
    ]},
    {type:'grid', counter:'3/3', tag:'FOR YOUR STORE', title:'واش يدير الـ Cloud *للـ Store تاعك*', items:[
      {i:'🏪', t:'Hosting', d:'الـ Store يخدم ويتحمل الزوار', c:'v'},
      {i:'🖼️', t:'Storage', d:'الصور، الفيديوهات، الـ Creatives', c:'c'},
      {i:'📊', t:'Data', d:'الطلبيات والأرقام في Sheets ولا BigQuery', c:'g'},
      {i:'🤖', t:'Automation + AI', d:'Workflows و Agents يخدمو وحدهم', c:'p'},
    ], note:['v','هاد السيمانة','كل يوم نشرحو جزء — تابع السلسلة']},
    {type:'cta', title:'تحب تحط الـ Store *في الـ Cloud*؟', items:['نختارو معاك الـ Stack المناسب','Automation و AI في الـ Cloud','Setup آمن ومنظم']},
  ],
  story_poll: ['تعرف شنو هو الـ Cloud؟','إيه','لا، شرحولي'],
},
{
  dir: '2026-12-02-traffic-scaling', theme: 'dark',
  slides: [
    {type:'hookshot', size:'md', badge:'Promo · Black Friday', title:'الزوار *يطلعو*… والـ Site يطيح؟', sub:'هنا يبان الفرق تاع الـ Cloud 👇', html: vTraffic(false)},
    {type:'shot', counter:'1/4', tag:'SCALING', title:'علاش الـ Site *يطيح*؟', html: vTraffic(true), rows:[
      ['p','Hosting ثابت','قوة محدودة: كي يفوت الحد، يطيح'],
      ['g','Cloud','يزيد السيرفرات وقت الحاجة (Auto-scaling)'],
    ]},
    {type:'shot', counter:'2/4', tag:'CDN', title:'الـ CDN: *الصور قريبة* من الكليان', html: vCdn, rows:[
      ['c','النتيجة','الـ Site يتحمل أسرع والسيرفر يرتاح'],
      ['v','مثال','Cloudflare، ولا CDN اللي مع الـ Platform'],
    ]},
    {type:'shot', counter:'3/4', tag:'MONITORING', title:'اعرف قبل *الكليان*', ...S('uptime-exec','n8n · uptime monitor'), h:430, rows:[
      ['v','كل 5 دقايق','n8n يشيكي الـ Site'],
      ['p','إذا طاح','Alert يوصلك في Telegram'],
      ['g','في الصورة','الـ Site جاوب 200 → All good'],
    ]},
    {type:'grid', counter:'4/4', tag:'CHECKLIST', title:'قبل أي *Promo* كبيرة', items:[
      {i:'🗜️', t:'ضغط الصور', d:'WebP وأحجام صغار', c:'v'},
      {i:'⏱️', t:'Test السرعة', d:'PageSpeed Insights على التليفون', c:'c'},
      {i:'⚡', t:'CDN + Cache', d:'الملفات قريبة من الكليان', c:'g'},
      {i:'🚨', t:'Monitoring', d:'Alert أوتوماتيك كي يطيح', c:'p'},
    ]},
    {type:'cta', title:'الـ Site تاعك *واجد للـ Promo*؟', items:['Audit تاع السرعة','Monitoring + Alerts','Setup Cloud يتحمل الضغط']},
  ],
  story_poll: ['الـ Site تاعك طاح في Promo؟','إيه 😩','لا'],
},
{
  dir: '2026-12-03-sheets-confirmation', theme: 'dark',
  slides: [
    {type:'hookshot', size:'md', badge:'COD · فريق التأكيد', title:'الطلبيات توصل *للفريق* وحدها', sub:'Shopify → Google Sheets → Telegram 👇', ...S('sheets-exec','n8n · real workflow'), h:340},
    {type:'shot', counter:'1/3', tag:'THE SHEET', title:'Sheet واحد، *الفريق كامل*', html: vSheet, rows:[
      ['v','كل طلبية','سطر جديد أوتوماتيك'],
      ['g','الفريق','يعيط ويبدل الحالة من التليفون'],
    ]},
    {type:'flow', counter:'2/3', tag:'HOW IT WORKS', title:'كيفاش *يخدم*', nodes:[
      {t:'طلبية جديدة في الـ Store', d:'Shopify Trigger', chip:'orders/create'},
      {t:'ناخذو غير واش نحتاجو', d:'الاسم، الهاتف، الولاية، المجموع', key:true},
      {t:'سطر جديد في الـ Sheet', d:'Google Sheets — Append'},
      {t:'إشعار للفريق', d:'Telegram: «طلبية جديدة #1024 — وهران»', key:true},
    ], note:['g','بعدها','Workflow ثاني يرجّع الحالة للـ Store']},
    {type:'grid', counter:'3/3', tag:'GOOGLE SHEETS', title:'4 حوايج *لازم تفعّلهم*', items:[
      {i:'🔽', t:'Data validation', d:'الحالة من List: مأكدة، ما ردش، ملغية', c:'v'},
      {i:'🔒', t:'Protected ranges', d:'الفريق ما يقدرش يمسح الأعمدة المهمة', c:'p'},
      {i:'🕘', t:'Version history', d:'ترجع لأي نسخة قديمة', c:'c'},
      {i:'👥', t:'Sharing', d:'Viewer / Commenter / Editor حسب الدور', c:'g'},
    ]},
    {type:'cta', title:'تحب *Sheet أوتوماتيك* لفريقك؟', items:['Shopify → Google Sheets','إشعارات Telegram للفريق','Dashboard تاع نسبة التأكيد']},
  ],
  story_poll: ['فريق التأكيد تاعك يخدم بـ…','Excel / ورقة','Google Sheets'],
},
{
  dir: '2026-12-04-backup-cloud', theme: 'dark',
  slides: [
    {type:'hookshot', size:'md', badge:'Backup', title:'يوم يطيح كلش… *عندك Backup*؟', sub:'3 سيناريوهات تصرى لأي Store 👇', html: vDisaster},
    {type:'shot', counter:'1/3', tag:'3-2-1 RULE', title:'قاعدة *3-2-1*', html: vBackup, rows:[
      ['g','الهدف','حتى مشكل واحد ما يضيّعلك كلش'],
    ]},
    {type:'grid', counter:'2/3', tag:'WHAT TO SAVE', title:'شنو لازم *تحفظ*', items:[
      {i:'📦', t:'المنتجات', d:'Export CSV: الأسعار، الوصف، الصور', c:'v'},
      {i:'🧾', t:'الطلبيات والكليان', d:'Export CSV ولا Workflow', c:'c'},
      {i:'🎨', t:'الـ Theme', d:'Duplicate قبل أي تعديل', c:'p'},
      {i:'🎬', t:'الـ Creatives', d:'الصور والفيديوهات في Drive', c:'g'},
    ], note:['a','مهم','Shopify ما يعطيكش Restore كامل جاهز: CSV ولا App']},
    {type:'shot', counter:'3/3', tag:'AUTOMATION', title:'كل ليلة، *وحدو*', ...S('backup-canvas','n8n · nightly backup'), h:380, rows:[
      ['v','02:00','n8n يجيب المنتجات والطلبيات'],
      ['c','CSV','يحولهم لملفات بالتاريخ'],
      ['g','Drive','يرفعهم لـ Google Drive'],
    ], note:['p','القاعدة','Backup ما جربتش ترجعو = ماشي Backup']},
    {type:'cta', title:'تحب *Backup أوتوماتيك*؟', items:['Backup يومي للـ Store','قاعدة 3-2-1 في الـ Cloud','Test تاع الـ Restore']},
  ],
  story_poll: ['عندك Backup تاع الـ Store؟','إيه','لا 😬'],
},
{
  dir: '2026-12-05-securite-cloud', theme: 'dark',
  slides: [
    {type:'hookshot', size:'md', badge:'Security', title:'الـ Cloud *آمن*… وانت؟', sub:'الأمان مسؤولية مقسومة 👇', html: vShared},
    {type:'shot', counter:'1/3', tag:'PHISHING', tagColor:'p', title:'كيفاش تعرف *Email مزور*؟', html: vPhish, rows:[
      ['p','1','الـ Domain غريب: حروف مبدلة ولا Domain ماشي رسمي'],
      ['a','2','الاستعجال: «حسابك يتسكر في 24h»'],
      ['v','3','الـ Link ما يروحش للـ Site الرسمي'],
    ]},
    {type:'grid', counter:'2/3', tag:'THREATS', tagColor:'p', title:'4 أخطاء *يدفعو الثمن*', items:[
      {i:'🎣', t:'Phishing', d:'Email «Meta» ولا «Shopify» مزور', c:'p'},
      {i:'🔁', t:'Password مكرر', d:'نفس الـ Password في كل بلاصة', c:'a'},
      {i:'👤', t:'حساب قديم', d:'خدام خرج ومازال عندو Access', c:'v'},
      {i:'📸', t:'Token في Screenshot', d:'API Key باينة في صورة ولا فيديو', c:'c'},
    ]},
    {type:'grid', counter:'3/3', tag:'CHECKLIST', tagColor:'g', title:'الـ Checklist *تاع اليوم*', items:[
      {i:'📲', t:'2FA', d:'في Shopify، Meta، Google، n8n', c:'g'},
      {i:'👥', t:'Staff accounts', d:'كل واحد حسابو، بلا Password مبارطاجي', c:'v'},
      {i:'🚪', t:'نحّي الـ Access', d:'نهار اللي يخرج فيه الخدام', c:'p'},
      {i:'🗝️', t:'Password manager', d:'Password قوي ومختلف لكل حساب', c:'c'},
    ]},
    {type:'cta', title:'تحب *Audit أمان* للـ Store؟', items:['Audit تاع الحسابات والـ Access','2FA وصلاحيات صحيحة','Tokens محفوظين في بلاصتهم']},
  ],
  story_poll: ['فعّلت 2FA في كل حساباتك؟','إيه ✅','مازال'],
},
{
  dir: '2026-12-06-ai-24-24', theme: 'dark',
  slides: [
    {type:'hookshot', size:'md', badge:'AI × Cloud', title:'الـ Laptop مسكّر… *والـ Agent يخدم* 🌙', sub:'Agent حقيقي في n8n 👇', ...S('agent-exec','n8n · AI Agent'), h:470},
    {type:'shot', counter:'1/3', tag:'24/24', title:'علاش *في الـ Cloud*؟', html: v247},
    {type:'shot', counter:'2/3', tag:'2 OPTIONS', title:'n8n Cloud ولا *Self-host*؟', html: vCompare, rows:[
      ['v','نصيحة','ابدا بالأسهل، وبدّل كي تكبر'],
    ]},
    {type:'shot', counter:'3/3', tag:'ALWAYS ON', title:'يخدم *وحدو* كل صباح', ...S('report-exec','n8n · daily report'), h:380, rows:[
      ['v','Schedule','يشعل وحدو على 08:00'],
      ['c','Webhook','يستقبل الميساجات حتى في الليل'],
      ['g','في الصورة','Workflow خدم من الأول للآخر'],
    ]},
    {type:'cta', title:'تحب *Agent يخدم 24/24*؟', items:['Agent للميساجات في الليل','Workflows في الـ Cloud','Setup n8n Cloud ولا VPS']},
  ],
  story_poll: ['شحال من ميساج يجيك في الليل؟','بزاف 😅','قليل'],
},
{
  dir: '2026-12-07-cloud-cout', theme: 'dark',
  slides: [
    {type:'hookshot', size:'md', badge:'Myth vs Reality', title:'«الـ Cloud *غالي*»… صح ولا لا؟', sub:'الحقيقة في 3 slides 👇', html: vMeter},
    {type:'grid', counter:'1/3', tag:'START FREE', tagColor:'g', title:'تقدر تبدا *بالمجان*', items:[
      {i:'📗', t:'Google Sheets + Drive', d:'15 GB مجانية في حساب Google', c:'g'},
      {i:'📈', t:'Looker Studio', d:'Dashboards مجانية', c:'c'},
      {i:'⚙️', t:'n8n Community', d:'مجاني، تخلص غير السيرفر', c:'v'},
      {i:'💳', t:'Pay as you go', d:'تخلص على قد ما تستعمل', c:'a'},
    ]},
    {type:'grid', counter:'2/3', tag:'HIDDEN COSTS', tagColor:'p', title:'وين *تهرب* الدراهم', items:[
      {i:'🧩', t:'Apps شهرية', d:'Apps تتراكم وما تستعملهمش', c:'p'},
      {i:'🗄️', t:'Storage', d:'فيديوهات وملفات تكبر كل شهر', c:'a'},
      {i:'🌐', t:'Traffic', d:'نقل الداتا للخارج يتخلص', c:'c'},
      {i:'💤', t:'موارد منسية', d:'سيرفر خدمت بيه مرة ومازال يخدم', c:'v'},
    ]},
    {type:'shot', counter:'3/3', tag:'CONTROL', title:'تحكّم في *الـ Budget*', html: vBudget, rows:[
      ['v','Budget alerts','في Google Cloud و AWS'],
      ['g','كل شهر','راجع الاشتراكات ونحّي اللي ما تخدمش'],
    ]},
    {type:'cta', title:'تحب *Stack Cloud* على قد الـ Budget؟', items:['Audit تاع الاشتراكات','Stack مجاني ولا رخيص للبداية','Alerts على المصاريف']},
  ],
  story_poll: ['شحال تخلص في الشهر على الـ Apps؟','قليل','بزاف 💸'],
},
];
