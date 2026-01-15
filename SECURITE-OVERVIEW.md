# 🔐 Système de Sécurité - Vue d'Ensemble

## Architecture de Sécurité

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEURS                              │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ ORGANISATEUR │   │ ENTREPRENEUR │   │    ADMIN     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 🔒 MOT DE    │   │ ✅ LIEN      │   │ 🔐 TOKEN     │
│    PASSE     │   │    PUBLIC    │   │    UNIQUE    │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ /login       │   │ /booking/    │   │ /admin/      │
│ /create      │   │ {slug}       │   │ {slug}?token │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Niveaux de Protection

### 1️⃣ Niveau Organisateur (Nouveau ✨)

**Pages Protégées:**
- `/` → Redirige vers `/login`
- `/create` → Création de projets

**Protection:**
- 🔒 Mot de passe unique
- 📝 Stocké dans `ORGANIZER_PASSWORD` (env variable)
- ⏱️ Session expire à la fermeture du navigateur
- 🔄 Mot de passe par défaut: `orangecorners2024`

**Accès:**
```
1. Visite https://mentoratentrepreneur.netlify.app/
2. Redirection automatique vers /login
3. Entre le mot de passe organisateur
4. Accès à la création de projets
```

### 2️⃣ Niveau Entrepreneur (Public)

**Pages Accessibles:**
- `/booking/:slug` → Réservation de créneaux

**Protection:**
- ✅ Slug unique aléatoire (10 caractères)
- ✅ Impossible à deviner
- ✅ 1 réservation par email par projet
- ✅ Pas de mot de passe requis

**Accès:**
```
1. Reçoit le lien: https://mentoratentrepreneur.netlify.app/booking/abc123xyz
2. Clique et accède directement
3. Réserve un créneau
```

### 3️⃣ Niveau Admin (Haute Sécurité)

**Pages Protégées:**
- `/admin/:slug?token=xxx` → Tableau de bord

**Protection:**
- 🔐 Token de 64 caractères (crypto.randomBytes)
- 🔐 Unique par projet
- 🔐 Impossible à deviner
- 🔐 Vérifié côté serveur

**Accès:**
```
1. Reçoit le lien: https://mentoratentrepreneur.netlify.app/admin/abc123?token=64chars
2. Token vérifié automatiquement
3. Accès au tableau de bord
```

## Flux Complet

### Scénario 1: Création d'un Projet

```
Organisateur
    │
    ├─> Visite le site
    │
    ├─> 🔒 Page de login
    │   └─> Entre le mot de passe
    │
    ├─> ✅ Authentifié
    │
    ├─> Accède à /create
    │
    ├─> Crée un projet avec créneaux
    │
    └─> Reçoit 2 liens:
        ├─> Lien Public (pour entrepreneurs)
        └─> Lien Admin (pour lui-même)
```

### Scénario 2: Réservation par Entrepreneur

```
Entrepreneur
    │
    ├─> Reçoit le lien public par email/WhatsApp
    │
    ├─> Clique sur le lien
    │
    ├─> ✅ Accès direct (pas de login)
    │
    ├─> Voit les créneaux disponibles
    │
    ├─> Sélectionne un créneau
    │
    ├─> Remplit le formulaire
    │
    └─> ✅ Réservation confirmée
```

### Scénario 3: Suivi par Organisateur

```
Organisateur
    │
    ├─> Clique sur le lien admin (reçu lors de la création)
    │
    ├─> 🔐 Token vérifié automatiquement
    │
    ├─> ✅ Accès au tableau de bord
    │
    ├─> Voit:
    │   ├─> Statistiques
    │   ├─> Liste des réservations
    │   └─> Détails des participants
    │
    └─> Peut exporter en CSV
```

## Configuration Requise

### Sur Netlify

Ajoutez ces variables d'environnement :

```
DATABASE_URL=postgresql://...
ORGANIZER_PASSWORD=VotreMotDePasseSecurise2024!
```

### Recommandations de Mot de Passe

✅ **BON:**
- `OrangeCorners@2024!Secure`
- `Mentor-OC-2024#Strong`
- `OC!Mentorat$2024`

❌ **MAUVAIS:**
- `password`
- `123456`
- `orangecorners`

## Sécurité Technique

### Côté Frontend
- ✅ Session stockée dans `sessionStorage`
- ✅ Expire à la fermeture du navigateur
- ✅ Pas de cookies
- ✅ Pas de localStorage (moins sécurisé)

### Côté Backend
- ✅ Mot de passe jamais exposé dans le code
- ✅ Stocké dans variables d'environnement
- ✅ Comparaison côté serveur
- ✅ Token admin de 64 caractères
- ✅ Validation stricte

### Base de Données
- ✅ Contrainte unique sur (project_id, participant_email)
- ✅ Prévention des doublons
- ✅ Index pour performance
- ✅ Pas de données sensibles exposées

## FAQ

### Q: Que se passe-t-il si j'oublie le mot de passe ?
**R:** Vous pouvez le changer dans les variables d'environnement Netlify.

### Q: Les entrepreneurs ont-ils besoin d'un mot de passe ?
**R:** Non, ils utilisent le lien public directement.

### Q: Le lien admin est-il sécurisé ?
**R:** Oui, il contient un token de 64 caractères impossible à deviner.

### Q: Puis-je avoir plusieurs organisateurs ?
**R:** Oui, ils partagent le même mot de passe organisateur.

### Q: Comment changer le mot de passe ?
**R:** Modifiez `ORGANIZER_PASSWORD` dans Netlify et redéployez.

### Q: La session expire-t-elle ?
**R:** Oui, à la fermeture du navigateur.

---

**Système de sécurité à 3 niveaux maintenant actif !** 🔐✨
