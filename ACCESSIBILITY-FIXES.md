# Script de Correction des Formulaires pour l'Accessibilité

## Problèmes Identifiés
1. Champs de formulaire sans `id` ou `name`
2. Labels non associés aux champs (`htmlFor` manquant)
3. Pas d'attributs `autoComplete` pour l'autofill du navigateur

## Corrections Appliquées

### Login.tsx ✅
- Ajouté `id="password"` et `name="password"`
- Ajouté `htmlFor="password"` au label
- Ajouté `autoComplete="current-password"`

### À Corriger

#### BookingPage.tsx
- participant_name
- participant_project_name
- participant_email
- participant_phone

#### CreateProject.tsx
- title
- description
- organizer_name
- organizer_email
- Champs dynamiques des slots (start_datetime, duration_minutes, note)

## Attributs autoComplete Recommandés

```typescript
// Informations personnelles
name → autoComplete="name"
email → autoComplete="email"
tel → autoComplete="tel"
organization → autoComplete="organization"

// Dates
datetime-local → autoComplete="off" (pas de suggestion)
```
