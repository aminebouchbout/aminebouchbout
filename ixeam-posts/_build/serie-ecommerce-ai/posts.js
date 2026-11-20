// Série "AI × E-commerce" v2 — chaque slide avec une vraie capture n8n
const L = { n8n: 'n8n · workflow', ndv: 'n8n · node', form: 'n8n · form' };
module.exports = [
{
  dir: '2026-11-24-ai-agent-store',
  slides: [
    {type:'hookshot', badge:'للتجار أونلاين', title:'خلي *AI Agent* يعاونك تسيّر الـ Store', size:'md', sub:'هذا Agent حقيقي بنيناه في n8n 👇', img:'img/agent-exec.jpg', imgLabel:L.n8n, h:470},
    {type:'shot', counter:'1/4', tag:'CHATBOT VS AGENT', title:'Chatbot ولا *Agent*؟', img:'img/agent-output.jpg', imgLabel:'n8n · AI Agent output', h:470, rows:[
      ['p','الـ Chatbot','يجاوب على الأسئلة برك'],
      ['g','الـ Agent','يفهم، يقرر، ويستعمل Tools'],
      ['c','الـ Tools','يقرا الطلبية من الـ Store قبل ما يجاوب'],
      ['v','في الصورة','الجواب اللي خرج من الـ Agent (مثال)'],
    ]},
    {type:'shot', counter:'2/4', tag:'ARCHITECTURE', title:'الـ 4 قطع تاع أي *Agent*', img:'img/agent-zoom.jpg', imgLabel:L.n8n, h:560, rows:[
      ['v','LLM','المخ: يفهم ويقرر (هنا Claude)'],
      ['c','Tools','اليدين: Get order، Check stock'],
      ['g','Memory','يتفكر الكونفيرساسيون'],
      ['p','System Prompt','القواعد: واش يقدر يدير'],
    ]},
    {type:'shot', counter:'3/4', tag:'HUMAN IN THE LOOP', tagColor:'a', title:'القرارات المهمة تبقى *عندك*', img:'img/hitl.jpg', imgLabel:L.n8n, h:420, rows:[
      ['a','مثال','طلب Refund: الـ AI يحضّر القرار'],
      ['v','الموافقة','توصلك في Telegram: Approve ولا Decline'],
      ['g','النتيجة','حتى Action حساس ما يتدار بلا موافقتك'],
    ]},
    {type:'shot', counter:'4/4', tag:'USE CASES', title:'شنو يقدر يدير في *الـ Store*', img:'img/report-exec.jpg', imgLabel:L.n8n, h:360, rows:[
      ['g','Support','يجاوب على حالة الطلبية'],
      ['c','Reporting','ملخص المبيعات كل صباح (الصورة)'],
      ['p','Stock','ينبهك كي منتج قرب يخلاص'],
    ]},
    {type:'cta', title:'تحب *Agent* للـ Store تاعك؟', items:['Agent للميساجات Instagram / Messenger','Agent موصول بالـ Store','Reporting أوتوماتيك']},
  ],
  story_poll: ['عندك Agent في الـ Store؟','إيه','مازال'],
},
{
  dir: '2026-11-25-spy-tools-ai',
  slides: [
    {type:'hookshot', badge:'Spy Tools × AI', title:'شوف واش *يخدم* عند المنافسين', size:'md', sub:'وخلي الـ AI يحلل بلاصتك 👇', img:'img/ads.jpg', imgLabel:L.n8n, h:470},
    {type:'shot', counter:'1/3', tag:'FREE + OFFICIAL', tagColor:'g', title:'جمع الـ Ads *بالمجان*', side:true, img:'img/form.jpg', imgLabel:L.form, h:640, rows:[
      ['g','Meta Ad Library','الـ Ads اللي راهم Active في Facebook و Instagram'],
      ['g','TikTok Creative Center','الـ Top Ads والـ Trends'],
      ['g','Google Trends','واش الناس يقلبو عليه في الجزائر'],
      ['v','في الصورة','Form تحط فيه الـ Ad والـ Offer'],
    ]},
    {type:'shot', counter:'2/3', tag:'WORKFLOW', title:'الـ AI يحلل *في ثواني*', img:'img/ads.jpg', imgLabel:L.n8n, h:420, rows:[
      ['v','1','الـ Form: تحط الـ Ad تاع المنافس'],
      ['c','2','الـ AI يطلّع الـ Hook، الـ Angle، الـ Offer'],
      ['g','3','كلش يتسجل في Google Sheets'],
    ], note:['a','تنبيه','الـ AI يقدر يغلط: راجع بعينيك']},
    {type:'shot', counter:'3/3', tag:'CHECKLIST', title:'واش تشوف في *كل Ad*', side:true, img:'img/form.jpg', imgLabel:L.form, h:640, rows:[
      ['g','تاريخ البداية','Ad قديم ومازال يدور = غالبا يجيب نتيجة'],
      ['v','الـ Hook','شنو قال في أول 3 ثواني؟'],
      ['c','الـ Offer','السومة، التوصيل، الضمان؟'],
      ['p','الكومنتارات','شنو يسقسو الناس؟ على واش يشكيو؟'],
    ], note:['p','القاعدة','خوذ الفكرة، ماشي الـ Copy']},
    {type:'cta', title:'تحب نحللو *المنافسين* تاعك؟', items:['تحليل الـ Ads تاع المنافسين','Hooks و Angles جداد بالـ AI','Creative جاهز للـ Ads']},
  ],
  story_poll: ['تستعمل Spy Tools؟','دايما','عمري'],
},
{
  dir: '2026-11-26-connect-store-ai',
  slides: [
    {type:'hookshot', badge:'Shopify × AI', title:'كيفاش *تربط* الـ Store تاعك بالـ AI', size:'md', sub:'Agent يقرا الـ Store عبر MCP 👇', img:'img/mcp.jpg', imgLabel:L.n8n, h:470},
    {type:'shot', counter:'1/3', tag:'3 WAYS', title:'3 طرق باش *تربط*', side:true, img:'img/report-input.jpg', imgLabel:'Shopify → n8n', h:640, rows:[
      ['g','Apps جاهزين','الأسهل: تركّب الـ App وتبدا'],
      ['v','API + n8n','Workflow يقرا ويكتب في الـ Store'],
      ['c','MCP','الـ AI يستعمل Tools تاع الـ Store مباشرة'],
      ['p','في الصورة','طلبيات Shopify كيما توصل لـ n8n (مثال)'],
    ]},
    {type:'shot', counter:'2/3', tag:'MCP', title:'الـ MCP *كيفاش يخدم*', side:true, img:'img/mcp-ndv.jpg', imgLabel:'n8n · MCP Client', h:640, rows:[
      ['v','1','تسقسي: «شحال بعت هاد السيمانة؟»'],
      ['c','2','الـ AI يختار الـ Tool المناسب'],
      ['g','3','الـ MCP Server يجيب الداتا من الـ Store'],
      ['p','4','الجواب بالأرقام تاعك، ماشي بالتخمين'],
    ]},
    {type:'shot', counter:'3/3', tag:'SECURITY', tagColor:'p', title:'الأمان *قبل كلش*', side:true, img:'img/hitl-ndv.jpg', imgLabel:'n8n · Telegram', h:640, rows:[
      ['g','Read only','يقرا برك قبل ما تعطيه يكتب'],
      ['v','Scopes','غير الصلاحيات اللي يحتاجها'],
      ['a','Human in the loop','Refund يستنى Approve تاعك (الصورة)'],
      ['p','Access Token','ما تبارطاجيهش مع حتى واحد'],
    ]},
    {type:'cta', title:'نربطولك الـ Store *بالـ AI*', items:['ربط Shopify بالـ AI','Workflows أوتوماتيك بـ n8n','Setup آمن بالصلاحيات الصحيحة']},
  ],
  story_poll: ['الـ Store تاعك موصول بالـ AI؟','إيه','لا'],
},
{
  dir: '2026-11-27-cloud-dashboard',
  slides: [
    {type:'hookshot', badge:'Cloud × Data', title:'الأرقام تاعك *مفرقة*؟', sub:'جمعهم أوتوماتيك في الـ Cloud 👇', img:'img/cloud.jpg', imgLabel:L.n8n, h:520},
    {type:'shot', counter:'1/3', tag:'SOURCES', title:'كل مصدر *يتجمع* وحدو', img:'img/cloud-sources.jpg', imgLabel:L.n8n, h:470, rows:[
      ['v','Shopify','الطلبيات والمبيعات'],
      ['c','Meta Ads','الـ Spend والنتائج'],
      ['g','GA4','الزوار والمصادر'],
    ], note:['p','النتيجة','تشوف الربح الحقيقي في بلاصة وحدة']},
    {type:'shot', counter:'2/3', tag:'KPIs', title:'الـ KPIs *يتحسبو* وحدهم', img:'img/kpi-code.jpg', imgLabel:'n8n · Calculate KPIs', h:340, rows:[
      ['v','ROAS','المبيعات ÷ مصروف الـ Ads'],
      ['c','CPA','مصروف الـ Ads ÷ عدد الطلبيات'],
      ['g','Conversion Rate','الطلبيات ÷ الزوار × 100'],
      ['a','Delivery Rate','اللي توصلات ÷ المأكدة (COD)'],
    ]},
    {type:'shot', counter:'3/3', tag:'CLOUD', title:'الـ Stack *في الـ Cloud*', img:'img/cloud.jpg', imgLabel:L.n8n, h:460, rows:[
      ['v','Sync','n8n يخدم كل ساعة وحدو'],
      ['c','Database','Google Sheets ولا BigQuery'],
      ['g','Dashboard','Looker Studio: تشوفو من التليفون'],
    ]},
    {type:'cta', title:'تحب *Dashboard* للـ Store تاعك؟', items:['Dashboard: Store + Ads + Traffic','Sync أوتوماتيك في الـ Cloud','Rapport يومي بالـ AI']},
  ],
  story_poll: ['وين تتبع الأرقام تاعك؟','Dashboard','في راسي 😅'],
},
{
  dir: '2026-11-28-n8n-daily-report',
  slides: [
    {type:'hookshot', badge:'n8n Workflow', title:'*Rapport* الـ Store يوصلك كل صباح', size:'md', sub:'Workflow حقيقي: Shopify → AI → Telegram 👇', img:'img/report-exec.jpg', imgLabel:L.n8n, h:420},
    {type:'shot', counter:'1/4', tag:'STEP 1', title:'يجيب الطلبيات *تاع البارح*', side:true, img:'img/report-input.jpg', imgLabel:'n8n · Shopify', h:640, rows:[
      ['v','Schedule Trigger','يشعل وحدو كل يوم 08:00'],
      ['g','Shopify','Get many orders'],
      ['c','في الصورة','الطلبيات كيما يرجعو من الـ Store (مثال)'],
    ]},
    {type:'shot', counter:'2/4', tag:'STEP 2', title:'الحساب في *الـ Code*', img:'img/report-code.jpg', imgLabel:'n8n · Code node', h:330, rows:[
      ['a','علاش','الـ LLM يقدر يغلط في الحساب'],
      ['g','النتيجة','3 طلبيات — 17600 DA (مثال)'],
    ], note:['v','القاعدة','الحساب للـ Code، الكتابة للـ AI']},
    {type:'prompt', counter:'3/4', tag:'STEP 3', title:'الـ Prompt تاع *الملخص*', file:'daily-report.txt', lines:[
      'راك محلل e-commerce.',
      'هاذو الأرقام تاع البارح: [stats]',
      '',
      'اكتبلي ملخص قصير بالدارجة:',
      '~- عدد الطلبيات والمجموع',
      '~- أكثر 3 منتجات بيعا',
      '~- أي حاجة غريبة لازم نشوفها',
      '',
      'ما تخترعش أرقام: استعمل غير الداتا اللي عطيتك.',
    ], note:['v','مثال','[stats] = النتيجة تاع الـ Code node']},
    {type:'shot', counter:'4/4', tag:'STEP 4', title:'يوصلك في *Telegram*', side:true, img:'img/telegram-ndv.jpg', imgLabel:'n8n · Telegram', h:640, rows:[
      ['v','Send message','الملخص يتبعث للـ Chat تاعك'],
      ['g','Credentials','الـ Token محفوظ في n8n'],
      ['p','Error Workflow','باش تعرف كي يطيح'],
    ]},
    {type:'cta', title:'تحب *Workflow* كيما هذا؟', items:['Rapport يومي أوتوماتيك','Workflows مخصصين بـ n8n','Telegram ولا WhatsApp ولا Email']},
  ],
  story_poll: ['تحب Rapport أوتوماتيك كل صباح؟','إيه 🔥','لا'],
},
{
  dir: '2026-11-29-myths-ai-ecommerce',
  slides: [
    {type:'hookshot', badge:'Myth vs Reality', title:'*5 أفكار غالطة* على الـ AI في الـ E-commerce', size:'md', sub:'واش صح وواش لا 👇', img:'img/agent-exec.jpg', imgLabel:L.n8n, h:440},
    {type:'shot', counter:'1/3', tag:'MYTH 1 + 2', title:'«الـ AI يسيّر *وحدو*»', side:true, img:'img/agent-ndv.jpg', imgLabel:'n8n · System Prompt', h:640, rows:[
      ['g','الحقيقة','يدير المهام المتكررة، والقرارات عندك'],
      ['p','«ما يغلطش»','يقدر يغلط ويخترع — Hallucination'],
      ['v','الحل','اربطو بالداتا الحقيقية + قواعد واضحة'],
    ]},
    {type:'shot', counter:'2/3', tag:'MYTH 3 + 4', title:'«لازم تكون *Developer*»', img:'img/report-exec.jpg', imgLabel:L.n8n, h:340, rows:[
      ['g','الحقيقة','أدوات Low-code كيما n8n تبسّط بزاف'],
      ['p','«Spy = تكوبي»','لا: تفهم السوق، والـ Creative تاعك'],
    ]},
    {type:'shot', counter:'3/3', tag:'MYTH 5', title:'«الـ Cloud *خطير*»', side:true, img:'img/hitl-ndv.jpg', imgLabel:'n8n · Approval', h:640, rows:[
      ['g','الحقيقة','الخطر: Passwords ضعاف وصلاحيات بزاف'],
      ['v','الحل','2FA وصلاحيات محدودة'],
      ['a','والـ Actions','Approve قبل أي حاجة حساسة (الصورة)'],
    ], note:['v','القاعدة','الـ AI مساعد قوي، ماشي بديل للتاجر']},
    {type:'cta', title:'شكون فيهم *كنت تامن* بيه؟', sub:'قولنا في الكومنتار 👇', items:['AI Agents للـ Store','Workflows بـ n8n','Dashboards في الـ Cloud']},
  ],
  story_poll: ['الـ AI يقدر يسيّر الـ Store وحدو؟','إيه','لا'],
},
{
  dir: '2026-11-30-prompt-analyse-ads',
  slides: [
    {type:'hookshot', badge:'Prompt Tip', title:'*Prompt* واحد يحلل أي Ad تاع منافس', size:'md', sub:'Copy / Paste وجربو اليوم 👇', img:'img/ads.jpg', imgLabel:L.n8n, h:470},
    {type:'shot', counter:'1/3', tag:'BEFORE', title:'قبل الـ Prompt: *جمع*', side:true, img:'img/form.jpg', imgLabel:L.form, h:640, rows:[
      ['v','الـ Text','من Meta Ad Library'],
      ['c','الـ Creative','Screenshot ولا وصف للفيديو'],
      ['g','الـ Offer','السومة، التوصيل، الـ Landing Page'],
    ]},
    {type:'prompt', counter:'2/3', tag:'PROMPT', title:'الـ Prompt *كامل*', file:'ad-analysis.txt', lines:[
      'راك خبير Performance Marketing.',
      'هذا Ad تاع منافس: [ad]',
      '',
      'حللي:',
      '~1. الـ Hook: شنو يوقف الكليان؟',
      '~2. الـ Angle: أي مشكل ولا رغبة يستهدف؟',
      '~3. الـ Offer والـ CTA',
      '~4. نقاط الضعف',
      '',
      'من بعد اقترح 5 Hooks جداد للمنتج تاعي: [product]',
      'ما تكوبيش الـ Ad.',
    ], note:['g','DM','اكتب PROMPT في الكومنتار ونبعثهولك']},
    {type:'shot', counter:'3/3', tag:'PRO TIPS', title:'باش تكون النتيجة *أحسن*', img:'img/ads.jpg', imgLabel:L.n8n, h:380, rows:[
      ['v','الكونتكست','السوق الجزائري، الدفع عند الاستلام'],
      ['c','الـ Format','«جاوبني في جدول»'],
      ['g','الـ Test','اختار 2 ولا 3 Angles وجربهم'],
      ['a','القاعدة','الـ AI يقترح، وانت تقرر'],
    ]},
    {type:'cta', title:'تحب نخدمو *الـ Creative* معاك؟', items:['تحليل المنافسين بالـ AI','Hooks و Scripts للـ Ads','فيديوهات إشهارية بالـ AI']},
  ],
  story_poll: ['تستعمل الـ AI باش تحلل الـ Ads؟','إيه','مازال'],
},
];
