# Guide de Déploiement Netlify

## 📋 Prérequis

Avant de déployer, vous devez avoir :
1. ✅ Code poussé sur GitHub (fait !)
2. ⏳ Une base de données PostgreSQL (Neon recommandé)
3. ⏳ Un compte Netlify

---

## 🗄️ Étape 1 : Créer la Base de Données

### Option A : Neon (Recommandé - Gratuit)

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Copiez votre **Connection String** (format: `postgresql://user:password@host/database`)
5. Exécutez le schéma SQL :

```bash
# Depuis votre terminal local
psql "votre-connection-string" < database/schema.sql
```

Ou utilisez l'interface SQL de Neon pour copier-coller le contenu de `database/schema.sql`

### Option B : Supabase (Alternative gratuite)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un projet
3. Allez dans SQL Editor
4. Collez le contenu de `database/schema.sql`
5. Exécutez
6. Récupérez votre connection string dans Settings > Database

---

## 🚀 Étape 2 : Déployer sur Netlify

### Via l'Interface Web (Plus Simple)

1. **Connectez-vous à Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Créez un compte ou connectez-vous

2. **Importez le Projet**
   - Cliquez sur "Add new site" → "Import an existing project"
   - Choisissez "Deploy with GitHub"
   - Autorisez Netlify à accéder à votre GitHub
   - Sélectionnez le repository `blackpanthere/mentorat`

3. **Configurez le Build**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
   
   (Ces valeurs devraient être détectées automatiquement grâce au `netlify.toml`)

4. **Ajoutez les Variables d'Environnement**
   - Avant de déployer, cliquez sur "Advanced build settings"
   - Ou allez dans Site settings > Environment variables
   - Ajoutez :
     ```
     Key: DATABASE_URL
     Value: votre_connection_string_postgresql
     ```
   - ⚠️ Assurez-vous que la connection string se termine par `?sslmode=require`

5. **Déployez !**
   - Cliquez sur "Deploy site"
   - Attendez 2-3 minutes
   - Votre site sera disponible sur une URL comme `https://random-name-123.netlify.app`

### Via Netlify CLI (Alternative)

```bash
# Installez Netlify CLI
npm install -g netlify-cli

# Connectez-vous
netlify login

# Initialisez le projet
netlify init

# Suivez les instructions :
# - Choisissez "Create & configure a new site"
# - Sélectionnez votre équipe
# - Donnez un nom au site (ex: orange-corners-mentorat)

# Ajoutez la variable d'environnement
netlify env:set DATABASE_URL "votre_connection_string"

# Déployez
netlify deploy --prod
```

---

## ✅ Étape 3 : Vérifier le Déploiement

1. **Testez l'Application**
   - Ouvrez l'URL de votre site Netlify
   - Créez un projet de test
   - Vérifiez que les liens fonctionnent
   - Testez une réservation

2. **Vérifiez les Functions**
   - Dans Netlify Dashboard > Functions
   - Vous devriez voir 4 fonctions :
     - `create-project`
     - `projects-slug`
     - `slots-slotId-book`
     - `projects-slug-admin`

3. **Vérifiez les Logs**
   - Si quelque chose ne fonctionne pas
   - Allez dans Netlify Dashboard > Logs
   - Regardez les erreurs de build ou de runtime

---

## 🔧 Dépannage

### Erreur : "Database connection failed"

- Vérifiez que `DATABASE_URL` est bien configurée dans Netlify
- Assurez-vous que la connection string contient `?sslmode=require`
- Testez la connexion depuis votre terminal : `psql "votre_connection_string"`

### Erreur : "Functions not found"

- Vérifiez que `netlify.toml` est bien dans le repository
- Vérifiez que le dossier `netlify/functions` existe
- Redéployez : Netlify Dashboard > Deploys > Trigger deploy

### Erreur de Build

- Vérifiez les logs de build dans Netlify
- Assurez-vous que `package.json` contient toutes les dépendances
- Essayez de builder localement : `npm run build`

### Les API ne fonctionnent pas

- Vérifiez que les redirections sont configurées (dans `netlify.toml`)
- Testez les endpoints directement : `https://votre-site.netlify.app/api/projects/test`
- Regardez les logs des Functions dans Netlify Dashboard

---

## 🎨 Personnalisation Post-Déploiement

### Changer le Nom de Domaine

1. Dans Netlify Dashboard > Domain settings
2. Cliquez sur "Options" > "Edit site name"
3. Changez pour quelque chose comme `orange-corners-mentorat`
4. Votre URL devient : `https://orange-corners-mentorat.netlify.app`

### Ajouter un Domaine Personnalisé

1. Dans Netlify Dashboard > Domain settings
2. Cliquez sur "Add custom domain"
3. Entrez votre domaine (ex: `mentorat.orangecorners.ma`)
4. Suivez les instructions pour configurer les DNS
5. Netlify fournira automatiquement un certificat SSL

---

## 📊 Monitoring

### Voir les Statistiques

- Netlify Dashboard > Analytics
- Nombre de visiteurs
- Utilisation des Functions
- Bande passante

### Logs en Temps Réel

```bash
# Via CLI
netlify dev
# ou
netlify functions:log
```

---

## 🔄 Mises à Jour Futures

Chaque fois que vous poussez du code sur GitHub :

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Netlify redéploiera automatiquement ! 🎉

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs Netlify
2. Consultez la [documentation Netlify](https://docs.netlify.com)
3. Vérifiez que la base de données est accessible
4. Testez localement avec `netlify dev`

---

## ✨ Votre Site est Prêt !

Une fois déployé, vous aurez :
- ✅ URL publique pour créer des projets
- ✅ API serverless fonctionnelle
- ✅ Base de données connectée
- ✅ Déploiement automatique sur chaque push
- ✅ HTTPS gratuit
- ✅ CDN mondial

**Prochaine étape** : Créez votre premier projet de mentorat ! 🚀
