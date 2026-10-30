# Hogwarts Academy — TypeScript Mini Project (TAF)

Projet TypeScript mettant en pratique les concepts avancés demandés dans le **TAF (Travail À Faire)** :

- **Generics et contraintes génériques** (`Repository<T extends { id: number }>`)
- **Utility Types** : `Omit`, `Pick`, `Partial`, `Record`, `Extract`, `Exclude`
- **Types Conditionnels et `infer`** (`SpellOutput`, `ArrayElement`)
- **Indexed Access Types** (`Wizard["house"]`)
- **Type Guards et prédicats de type** (`isHouse`, `isWizard`)
- **Legacy Method Decorators** (`@Log`, `@MeasureTime`, `@ValidateSpellPower`, `@Cache`)

---

## 📋 Réalisation des Exercices du TAF

| Exercice | Objectif | Emplacement |
| :--- | :--- | :--- |
| **Exercice 1** | Enregistrer un sorcier à l'aide de `NewWizard` (`Omit<Wizard, "id">`) avec assignation automatique d'identifiant. | [src/repository.ts](file:///src/repository.ts) |
| **Exercice 2** | Filtrer par maison via type à accès indexé (`findByHouse(house: Wizard["house"])`). | [src/repository.ts](file:///src/repository.ts) |
| **Exercice 3** | Définir `SpellCastEvent` via `Extract<AcademyEvent, { type: "spell-cast" }>` et implémenter `handleSpellCast`. | [src/types.ts](file:///src/types.ts), [src/main.ts](file:///src/main.ts) |
| **Exercice 4** | Créer le décorateur `@ValidateSpellPower` (rejet si `power < 0`) et l'appliquer à `SpellRepository.add`. | [src/decorators.ts](file:///src/decorators.ts), [src/repository.ts](file:///src/repository.ts) |
| **Exercice 5** | Créer le décorateur `@Cache` (mise en cache par instance avec `WeakMap` et `Map`) et tester sur `SpellCalculator`. | [src/decorators.ts](file:///src/decorators.ts), [src/main.ts](file:///src/main.ts) |
| **Exercice 6** | Renforcer les Type Guards avec `isHouse(value)` (4 maisons autorisées) et mettre à jour `isWizard(value)`. | [src/main.ts](file:///src/main.ts) |

---

## 🏰 Structure du Projet

Conforme à la structure demandée par le professeur dans les consignes du TAF :

```text
hogwarts-academy/
├── src/
│   ├── types.ts          # Définition des types, utility types et SpellCastEvent
│   ├── repository.ts     # Repository générique, WizardRepository et SpellRepository
│   ├── decorators.ts     # Décorateurs @Log, @MeasureTime, @ValidateSpellPower, @Cache
│   └── main.ts           # Type guards, SpellCalculator, AcademyService et exécution des tests
├── tsconfig.json         # Configuration TypeScript stricte avec experimentalDecorators
├── package.json          # Scripts npm et dépendances
└── README.md             # Documentation du projet
```

---

## 🚀 Installation et Exécution

### 1. Installer les dépendances
```bash
npm install
```

### 2. Vérification des types TypeScript
```bash
npm run typecheck
```

### 3. Exécuter le projet
```bash
npm start
```
