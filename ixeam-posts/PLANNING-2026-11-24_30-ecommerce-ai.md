# Série « AI × E-commerce » — 24 → 30 novembre 2026

Cible : e-commerçants (Algérie). Publication : **chaque jour à 16:30, heure d'Algérie (Africa/Algiers)**.
Chaque dossier contient les slides `ixeam-1.jpg … ixeam-N.jpg` (1080×1350), `story.jpg` (1080×1920) et `caption.md` (caption, commentaire épinglé, sondage story).

| Date | Dossier | Sujet | Pilier | Mot-clé DM |
|---|---|---|---|---|
| Mar 24/11 | `2026-11-24-ai-agent-store` | AI Agent pour gérer le store (Chatbot vs Agent, 4 composants, cas d'usage) | Architecture | AGENT |
| Mer 25/11 | `2026-11-25-spy-tools-ai` | Spy tools (Meta Ad Library, TikTok Creative Center, Google Trends) + analyse par l'IA | E-commerce & Ads | SPY |
| Jeu 26/11 | `2026-11-26-connect-store-ai` | Relier le store à l'IA : Apps, API + n8n, MCP, sécurité | Concept | MCP |
| Ven 27/11 | `2026-11-27-cloud-dashboard` | Stats dans le cloud : stack Sync → Sheets/BigQuery → Looker Studio + KPIs (ROAS, CPA, CR, Delivery Rate COD) | Architecture | DASHBOARD |
| Sam 28/11 | `2026-11-28-n8n-daily-report` | Workflow n8n : rapport quotidien Shopify → Telegram | Astuce n8n | RAPPORT |
| Dim 29/11 | `2026-11-29-myths-ai-ecommerce` | 5 idées fausses sur l'IA en e-commerce | Mythe vs réalité | (question en commentaire) |
| Lun 30/11 | `2026-11-30-prompt-analyse-ads` | Un prompt pour analyser n'importe quelle pub concurrente | Astuce prompt | PROMPT |

## Réponses DM prêtes (pour les mots-clés)

### AGENT
```
مرحبا 👋 هاذي الـ Checklist باش تبدا Agent للـ Store تاعك:
1. اختار مهمة وحدة متكررة (مثال: الجواب على «وين راهي الطلبية؟»)
2. حدد الـ Tools اللي يحتاجهم (Shopify API، Google Sheets…)
3. اكتب الـ System Prompt: واش يقدر يدير وواش ممنوع
4. ابدا بصلاحيات Read only
5. أي Action مهم (طلبية، Refund) يستنى الموافقة تاعك
6. جرب مع كليان قلال قبل ما تحلو للكل
تحب نبنيوهولك؟ قولنا شنو تبيع 🙌
```

### SPY / PROMPT
```
مرحبا 👋 هاهو الـ Prompt:

راك خبير Performance Marketing.
هذا Ad تاع منافس: [حط الـ Text + وصف ولا Screenshot تاع الـ Creative + الـ Offer]
حللي:
1. الـ Hook: شنو يوقف الكليان؟
2. الـ Angle: أي مشكل ولا رغبة يستهدف؟
3. الـ Offer والـ CTA
4. نقاط الضعف
من بعد اقترح 5 Hooks جداد للمنتج تاعي: [المنتج]
السوق: الجزائر، الدفع عند الاستلام. جاوبني في جدول.
ما تكوبيش الـ Ad.
```

### MCP
```
مرحبا 👋 الخطوات باش تربط الـ Store بالـ AI:
1. اختار الطريقة: App جاهز، API + n8n، ولا MCP (مثال: Claude + Shopify)
2. اعطي صلاحيات Read only في البداية
3. اختار غير الـ Scopes اللي تحتاجهم
4. جرب بأسئلة بسيطة: «شنو أكثر منتج بعت هاد الشهر؟»
5. أي تبديل (سومة، Refund) يستنى الموافقة تاعك
6. الـ Access Token ما تبارطاجيهش مع حتى واحد
تحب نديروهولك؟ ابعثلنا 🙌
```

### DASHBOARD
```
مرحبا 👋 الـ KPIs مع الحسابات:
• ROAS = المبيعات ÷ مصروف الـ Ads
• CPA = مصروف الـ Ads ÷ عدد الطلبيات
• Conversion Rate = الطلبيات ÷ الزوار × 100
• Confirmation Rate (COD) = الطلبيات المأكدة ÷ كل الطلبيات
• Delivery Rate (COD) = الطلبيات اللي توصلات ÷ الطلبيات المأكدة
• AOV = المبيعات ÷ عدد الطلبيات
تحب Dashboard أوتوماتيك؟ ابعثلنا 🙌
```

### RAPPORT
```
مرحبا 👋 هاهو الـ Prompt تاع الملخص (في الـ LLM node):

راك محلل e-commerce.
هاذو الأرقام تاع البارح: {{ $json.stats }}
اكتبلي ملخص قصير بالدارجة:
- عدد الطلبيات والمجموع
- أكثر 3 منتجات بيعا
- أي حاجة غريبة لازم نشوفها
ما تخترعش أرقام: استعمل غير الداتا اللي عطيتك.

نصيحة: دير الحسابات في Code node قبل الـ LLM.
```

## Programmation automatique (Metricool)

Le compte Metricool (brand id 8143049) n'a encore **aucun réseau connecté**. Pour programmer automatiquement à 16:30, il faut d'abord y connecter Instagram :
https://app.metricool.com/brands/connections?blogId=8143049
