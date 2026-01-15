# 🔐 Configuration du Mot de Passe Organisateur

## Mot de Passe Ajouté

J'ai ajouté une protection par mot de passe pour la page de création de projet.

## Comment Configurer

### 1. Localement (Développement)

Créez un fichier `.env` à la racine du projet :

```bash
DATABASE_URL=votre_connection_string_postgresql
ORGANIZER_PASSWORD=votre_mot_de_passe_choisi
```

### 2. Sur Netlify (Production)

1. Allez sur https://app.netlify.com
2. Ouvrez votre site "mentoratentrepreneur"
3. Allez dans **Site settings** > **Environment variables**
4. Ajoutez une nouvelle variable :
   - **Key**: `ORGANIZER_PASSWORD`
   - **Value**: Votre mot de passe choisi (ex: `OrangeCorners2024!`)
5. Cliquez sur "Save"
6. Redéployez le site

## Mot de Passe par Défaut

Si vous ne configurez pas `ORGANIZER_PASSWORD`, le mot de passe par défaut est :
```
orangecorners2024
```

⚠️ **Important** : Changez ce mot de passe en production !

## Comment Ça Marche

### Pour les Organisateurs

1. Visitez `https://mentoratentrepreneur.netlify.app/`
2. Vous êtes redirigé vers `/login`
3. Entrez le mot de passe organisateur
4. Accédez à la page de création de projet
5. Créez vos projets et obtenez les liens

### Pour les Entrepreneurs

1. Reçoivent le lien public : `https://mentoratentrepreneur.netlify.app/booking/{slug}`
2. Pas besoin de mot de passe
3. Peuvent réserver directement

### Pour le Tableau de Bord Admin

1. Utilisent le lien admin : `https://mentoratentrepreneur.netlify.app/admin/{slug}?token={token}`
2. Protégé par le token unique (64 caractères)
3. Pas besoin du mot de passe organisateur

## Sécurité

- ✅ Mot de passe stocké dans les variables d'environnement
- ✅ Jamais exposé dans le code
- ✅ Session stockée localement (sessionStorage)
- ✅ Expire à la fermeture du navigateur
- ✅ Les liens publics restent accessibles sans mot de passe
- ✅ Les liens admin restent protégés par leur token unique

## Déconnexion

Pour se déconnecter :
1. Fermez le navigateur, ou
2. Ouvrez la console du navigateur et tapez :
   ```javascript
   sessionStorage.clear()
   ```

## Recommandations

### Mot de Passe Fort

Utilisez un mot de passe :
- D'au moins 12 caractères
- Avec majuscules, minuscules, chiffres et symboles
- Exemple : `OC-Mentor@2024!Secure`

### Partage Sécurisé

- Partagez le mot de passe uniquement avec votre équipe
- Utilisez un gestionnaire de mots de passe
- Ne l'envoyez pas par email non chiffré

### Changement Régulier

- Changez le mot de passe tous les 3-6 mois
- Changez-le si quelqu'un quitte l'équipe
- Changez-le en cas de suspicion de compromission

## Test

Après déploiement :
1. Visitez votre site
2. Vous devriez voir la page de connexion
3. Entrez le mot de passe
4. Vous accédez à la création de projet
5. Les liens publics fonctionnent toujours sans mot de passe

---

**Tout est prêt !** 🔒
