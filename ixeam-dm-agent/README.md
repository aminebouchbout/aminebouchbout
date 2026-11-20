# IXEAM DM Agent — l'assistant IA qui répond aux messages de la page

Cet agent répond automatiquement aux messages privés **Instagram (@ixeam_01)** et **Facebook Messenger** de la page IXEAM AI Labs, 24h/24, avec Claude (Anthropic).

## Ce qu'il fait

- **Répond dans la langue du client** : darija (lettres arabes ou latines « 3arbizi »), français, arabe, anglais.
- **Explique nos services** : vidéos pub avec l'IA, scénarios (Hook + produit + CTA), design et créatifs, photos produit (« envoie-nous tes photos, on fait tout »), landing page, lancement des Ads, agents IA et automatisation.
- **Regarde les photos de produit** que le client envoie : il reconnaît le produit, propose une idée de pub et donne des conseils si la photo est mauvaise.
- **Récupère les infos du client** petit à petit : nom, téléphone/WhatsApp, produit, client cible, services voulus, budget, ville.
- **Passe la main à un humain** quand le client veut un devis, est prêt à commander, se plaint ou demande à parler à quelqu'un. Le bot se met alors en pause pour ce client (12 h par défaut) et peut vous prévenir sur Telegram.
- **S'efface quand vous répondez vous-même** : si quelqu'un de l'équipe répond à la main depuis la boîte de réception, le bot se tait pour ce client (12 h par défaut).
- **Regroupe les messages rapides** (« salam » / « bghit nsowel » / photo) et répond une seule fois.
- **N'invente jamais de prix** : tant que vous ne les écrivez pas dans la fiche, il dit que l'équipe envoie un devis.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `knowledge/ixeam.md` | **La fiche de l'agent : services, process, prix, contacts. C'est le fichier à modifier.** |
| `prompt.py` | Les règles de comportement (ton, langue, quand passer la main…) |
| `agent.py` | L'appel à Claude (réponse structurée : message + infos client + passage à un humain) |
| `app.py` | Le serveur webhook qui reçoit les messages de Meta et répond |
| `meta.py` | Envoi des messages Instagram/Messenger, téléchargement des photos, notification Telegram |
| `store.py` | Base SQLite : historique des conversations, leads, pauses |
| `chat.py` | Tester l'agent dans le terminal, sans Instagram |

---

## Étape 1 — Tester l'agent sur votre ordinateur (5 minutes)

```bash
cd ixeam-dm-agent
python -m venv .venv
source .venv/bin/activate            # Windows : .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # puis mettez votre ANTHROPIC_API_KEY dans .env
python chat.py                       # discutez comme un client
python chat.py --photo mon-produit.jpg   # testez avec une photo de produit
```

La clé API se crée sur https://platform.claude.com (rubrique *API keys*).

Si une réponse ne vous plaît pas : modifiez `knowledge/ixeam.md` (les faits) ou `prompt.py` (le comportement), puis relancez.

## Étape 2 — Mettre le serveur en ligne

Meta doit pouvoir appeler votre serveur sur une adresse **HTTPS publique**. Le plus simple : Render, Railway ou Fly.io avec le `Dockerfile` fourni.

1. Poussez le dossier `ixeam-dm-agent` sur un dépôt GitHub.
2. Sur Render : *New → Web Service → votre dépôt → Docker*.
3. Dans *Environment*, ajoutez les variables de `.env.example` (avec vos vraies valeurs).
4. Ajoutez un **disque persistant** et mettez `DB_PATH=/data/ixeam_agent.db`, pour ne pas perdre l'historique à chaque redémarrage.
5. Vous obtenez une adresse comme `https://ixeam-agent.onrender.com` : l'URL du webhook sera `https://ixeam-agent.onrender.com/webhook`.

## Étape 3 — Brancher Instagram et Facebook (Meta)

Prérequis : le compte Instagram @ixeam_01 doit être un compte **Professionnel** relié à votre **Page Facebook**.

1. Sur Instagram (application) : *Paramètres → Confidentialité → Messages → Outils connectés → **Autoriser l'accès aux messages*** : activez-le.
2. Allez sur https://developers.facebook.com → *Mes apps → Créer une app* (type **Business**).
3. Ajoutez les produits **Messenger** et **Instagram** (API Instagram avec connexion Facebook).
4. Dans *Messenger → Paramètres de l'API* : connectez votre Page et **générez le token d'accès de la Page** → mettez-le dans `PAGE_ACCESS_TOKEN`.
5. Dans *Paramètres de l'app → Base* : copiez la **clé secrète** → `META_APP_SECRET`.
6. Configurez le **webhook** (pour Messenger ET pour Instagram) :
   - URL de rappel : `https://VOTRE-SERVEUR/webhook`
   - Token de vérification : la même valeur que `META_VERIFY_TOKEN`
   - Abonnements Messenger : `messages`, `messaging_postbacks`, `message_echoes`
   - Abonnements Instagram : `messages`, `messaging_postbacks`
7. Permissions nécessaires : `pages_messaging`, `pages_manage_metadata`, `instagram_basic`, `instagram_manage_messages`.
8. **Important** : tant que l'app est en mode *Développement*, seuls les comptes ajoutés comme testeurs/admins de l'app reçoivent des réponses. Testez avec votre propre compte, puis demandez l'**accès avancé** (*App Review*) pour ces permissions afin que tous les clients reçoivent les réponses.

Les écrans de Meta changent souvent : si un nom de menu ne correspond pas, cherchez « Instagram Messaging webhook » dans la documentation Meta.

## Étape 4 — Utilisation au quotidien

- **Voir les leads** (infos récupérées par l'agent) :
  ```bash
  curl -H "Authorization: Bearer VOTRE_ADMIN_TOKEN" https://VOTRE-SERVEUR/admin/leads
  ```
- **Notification Telegram** quand un client doit être repris : créez un bot avec @BotFather, puis remplissez `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID`.
- **Reprendre la main** : répondez simplement au client depuis Instagram/Meta Business Suite ; le bot se met en pause pour ce client.
- **Relancer le bot pour un client** avant la fin de la pause :
  ```bash
  curl -X POST -H "Authorization: Bearer VOTRE_ADMIN_TOKEN" https://VOTRE-SERVEUR/admin/resume/instagram:ID_DU_CLIENT
  ```

## Réglages (`.env`)

| Variable | Défaut | Effet |
|---|---|---|
| `AGENT_MODEL` | `claude-opus-5-5` | Modèle Claude utilisé. `claude-sonnet-5-5` coûte environ deux fois moins cher. |
| `AGENT_EFFORT` | `low` | Profondeur de réflexion (`low` = rapide et économique, suffisant pour des DM) |
| `DEBOUNCE_SECONDS` | `4` | Temps d'attente pour regrouper plusieurs messages rapides |
| `HANDOFF_PAUSE_HOURS` | `12` | Pause du bot après un passage à un humain |
| `HUMAN_REPLY_PAUSE_HOURS` | `12` | Pause du bot quand l'équipe répond à la main |
| `HISTORY_LIMIT` | `30` | Nombre de messages précédents que l'agent relit |
| `GRAPH_API_VERSION` | `v24.0` | Version de l'API Meta |

## À savoir

- **Coût** : chaque réponse est un appel à l'API Claude, facturé selon les tokens (quelques centimes au plus par message avec une photo, moins sans photo).
- **Meta n'autorise une réponse automatique que dans les 24 h** après le dernier message du client. L'agent ne fait que répondre, il n'envoie jamais de message de lui-même.
- Les photos ne sont pas gardées : seule une description courte est conservée dans l'historique.
