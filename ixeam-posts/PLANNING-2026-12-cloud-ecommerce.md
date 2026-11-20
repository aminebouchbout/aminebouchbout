# Programme IXEAM — « الـ Cloud للتاجر » (mode sombre)

Publication : **chaque jour à 16:30, heure d'Algérie (Africa/Algiers)**. Cible : e-commerçants algériens.
Style : mode sombre IXEAM (fond bleu nuit, halos violet/cyan, cartes en verre). Chaque slide a un visuel explicatif : capture n8n réelle (thème sombre) ou schéma.

## Semaine 1 — produite (1 → 7 décembre)

| Date | Dossier | Sujet | Visuels | Mot-clé DM |
|---|---|---|---|---|
| Mar 01/12 | `2026-12-01-cloud-cest-quoi` | C'est quoi le cloud pour un store ? SaaS / PaaS / IaaS | Schéma client → cloud → store, PC vs cloud, pile SaaS/PaaS/IaaS | CLOUD |
| Mer 02/12 | `2026-12-02-traffic-scaling` | Promo / Black Friday : pourquoi le site tombe, scaling, CDN | Courbe de trafic (exemple), capacité fixe vs auto-scaling, CDN, **capture n8n : surveillance du site** | PROMO |
| Jeu 03/12 | `2026-12-03-sheets-confirmation` | Commandes → Google Sheets pour l'équipe de confirmation COD | **Capture n8n : Shopify → Sheets → Telegram**, maquette du Sheet (exemple) | SHEET |
| Ven 04/12 | `2026-12-04-backup-cloud` | Backup : règle 3-2-1, quoi sauvegarder, backup nocturne | Scénarios catastrophe, 3-2-1, **capture n8n : backup → Google Drive** | BACKUP |
| Sam 05/12 | `2026-12-05-securite-cloud` | Sécurité : responsabilité partagée, phishing, checklist | Provider vs toi, faux email annoté (exemple inventé) | SECURE |
| Dim 06/12 | `2026-12-06-ai-24-24` | L'agent IA tourne 24/24 dans le cloud ; n8n Cloud vs self-host | **Capture n8n : agent IA**, timeline 24 h, tableau comparatif, **capture rapport quotidien** | AGENT |
| Lun 07/12 | `2026-12-07-cloud-cout` | Mythe « le cloud est cher » : gratuit pour démarrer, coûts cachés, budget | Jauge, alertes budget (exemple) | (question en commentaire) |

Les workflows n8n utilisés sont exportés dans `_build/n8n-workflows/` (`uptime.json`, `sheets.json`, `backup.json`, `agent.json`, `report.json`), importables dans n8n.

## Semaines 2 à 4 — idées prêtes à produire

**Semaine 2 — Vitesse & expérience client**
1. La vitesse du site = des ventes : mesurer avec PageSpeed Insights (mobile).
2. Images WebP + compression automatique dans le cloud (workflow).
3. Le cloud pour les créas : organiser Drive (nommage, dossiers par produit/campagne).
4. Notifications client automatiques : commande confirmée / expédiée (WhatsApp, SMS, email).
5. Mythe vs réalité : « Shopify suffit, pas besoin de cloud ».
6. Astuce prompt : générer 50 descriptions produit en lot avec l'IA (et les relire).
7. Reel récap de la semaine.

**Semaine 3 — Données & décisions**
1. Une seule source de vérité : pourquoi centraliser commandes, ads, livraisons.
2. Suivi des livraisons COD : statut transporteur → Sheet → relances automatiques.
3. Dashboard Looker Studio en 15 min (ce qu'il faut afficher, ce qu'il faut éviter).
4. Alertes intelligentes : l'IA prévient quand le taux de confirmation chute.
5. Webhooks expliqués simplement (le « sonnette » entre deux outils).
6. Vector DB / RAG pour un chatbot qui connaît ton catalogue.
7. Reel récap.

**Semaine 4 — Passer à l'échelle**
1. Migrer d'un hébergement mutualisé vers le cloud : checklist.
2. Multi-store / multi-pays : synchroniser stock et prix.
3. Équipe à distance : rôles, accès, outils cloud (Sheets, Drive, Telegram).
4. Serverless expliqué : payer seulement quand le code tourne.
5. Plan de reprise : que faire si le store tombe (étapes, contacts, backups).
6. Coûts : audit mensuel des abonnements avec un workflow.
7. Bilan du mois + question à la communauté.

## Réponses DM prêtes (mots-clés)

### CLOUD
```
مرحبا 👋 باش تختار الـ Stack المناسب:
1. راك تبدا؟ ابقى في SaaS (Shopify + Google Sheets) — ما تسيّر حتى سيرفر
2. تحتاج Automation؟ زيد n8n (Cloud ولا VPS)
3. داتا بزاف؟ BigQuery + Looker Studio
4. Creatives؟ Google Drive منظم بالمنتج والحملة
5. ديما: 2FA + Backup
تحب نختارو معاك؟ قولنا شنو تبيع 🙌
```

### PROMO
```
مرحبا 👋 الـ Checklist قبل الـ Promo:
□ ضغط الصور (WebP) وأحجام صغار
□ Test السرعة على التليفون (PageSpeed Insights)
□ CDN + Cache مفعّلين
□ Monitoring: Alert أوتوماتيك كي يطيح الـ Site
□ Test الـ Checkout من الأول للآخر
□ الـ Stock والأسعار محدّثين
□ فريق التأكيد واجد للطلبيات الزايدين
```

### SHEET
```
مرحبا 👋 الأعمدة اللي ننصحو بيها:
الطلبية | التاريخ | الكليان | الهاتف | الولاية | المنتج | المجموع | الحالة | ملاحظة | شكون عيط
الحالة (Data validation): جديدة / مأكدة / ما ردش / ملغية / توصلات
والـ Workflow: Shopify Trigger → Set → Google Sheets (Append) → Telegram
تحب نركبوهولك؟ ابعثلنا 🙌
```

### BACKUP
```
مرحبا 👋 الـ Backup الليلي في n8n:
Schedule (02:00) → Shopify: Get all products + Get all orders → Convert to File (CSV) → Google Drive (Upload)
سمّي الملفات بالتاريخ، وخلي نسخة ثانية برّا (قاعدة 3-2-1).
وكل شهر جرّب ترجع ملف واحد باش تتأكد بلي الـ Backup يخدم.
```

### SECURE
```
مرحبا 👋 الـ Checklist تاع الأمان:
□ 2FA في Shopify، Meta، Google، n8n
□ كل خدام عندو Staff account تاعو (بلا Password مبارطاجي)
□ نحّي الـ Access نهار اللي يخرج الخدام
□ Password manager + Password مختلف لكل حساب
□ الـ API Tokens ما يبانوش في Screenshots ولا فيديوهات
□ ما تكليكيش على Links في Emails مستعجلة — روح للـ Site الرسمي بيدك
```

### AGENT
```
مرحبا 👋 n8n Cloud ولا Self-host؟
• n8n Cloud: Setup في دقايق، ما تسيّر حتى سيرفر، اشتراك شهري
• Self-host (VPS): تحكم كامل، تخلص السيرفر برك، بصح لازم تسيّر التحديثات والأمان
نصيحة: ابدا بالأسهل، وبدّل كي تكبر. تحب نديرولك Agent يخدم 24/24؟ 🙌
```

## Programmation automatique (Metricool)

Toujours aucun réseau connecté sur Metricool (brand id 8143049). Connecter Instagram : https://app.metricool.com/brands/connections?blogId=8143049
