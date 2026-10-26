# Hogwarts Academy 🧙‍♂️✨

Système de gestion et de simulation magique pour l'école de sorcellerie de Poudlard, développé en **TypeScript strict** selon les **principes SOLID** et les meilleures pratiques de conception logicielle (Design Patterns, Generic Repositories, Décorateurs, Type Guards).

---

## 📋 Table des Matières

- [Architecture du Projet](#-architecture-du-projet)
- [Fonctionnalités & Réalisation du TAF](#-fonctionnalités--réalisation-du-taf)
- [Concepts TypeScript Avancés](#-concepts-typescript-avancés)
- [Principes SOLID & Modélisation POO](#-principes-solid--modélisation-poo)
- [Installation et Exécution](#-installation-et-exécution)
- [Suite de Tests Automatisés](#-suite-de-tests-automatisés)
- [Auteur](#-auteur)

---

## 🏰 Architecture du Projet

Le projet adopte une séparation stricte des responsabilités (Layered Architecture) :

```text
hogwarts-academy/
├── src/
│   ├── types/
│   │   └── types.ts                 # Types de base, Utility Types, Conditional Types
│   ├── guards/
│   │   └── guards.ts                # Type Guards personnalisés (isHouse, isWizard, isSpell)
│   ├── interfaces/
│   │   ├── actions.interface.ts     # Interfaces ISP (ISpellCaster, IDamageable, ILearner...)
│   │   └── repository.interface.ts  # Contrat d'abstraction IRepository<T> (DIP)
│   ├── models/
│   │   ├── character.model.ts       # Classe abstraite Character (LSP)
│   │   ├── wizard.model.ts          # Modèle WizardCharacter complet
│   │   ├── professor.model.ts       # Modèle ProfessorCharacter
│   │   └── spell.model.ts           # Hiérarchie polymorphe (Attack, Defense, Healing)
│   ├── decorators/
│   │   └── decorators.ts            # Décorateurs de méthode (@Log, @MeasureTime, @ValidateSpellPower, @Cache)
│   ├── repositories/
│   │   ├── in-memory.repository.ts  # Implémentation générique en mémoire
│   │   ├── wizard.repository.ts     # WizardRepository avec findByHouse
│   │   └── spell.repository.ts      # SpellRepository avec validation par décorateur
│   ├── services/
│   │   ├── house.service.ts         # Gestion des points de maison et classements
│   │   └── duel.service.ts          # Moteur de duels magiques au tour par tour et événements
│   └── main.ts                      # Point d'entrée de démonstration complet
├── tests/
│   ├── guards.test.ts               # Tests unitaires des Type Guards
│   ├── decorators.test.ts           # Tests unitaires des Décorateurs (@Cache, @ValidateSpellPower)
│   ├── repositories.test.ts         # Tests des opérations CRUD et filtres indexés
│   ├── models.test.ts               # Tests du polymorphisme, sorts et consommation de mana
│   └── services.test.ts             # Tests des services métier et duels
├── tsconfig.json                    # Configuration TypeScript en mode strict
├── package.json                     # Scripts npm et dépendances
└── README.md                        # Documentation technique du projet
```

---

## 🎯 Fonctionnalités & Réalisation du TAF

Le projet répond rigoureusement à l'ensemble des exercices demandés dans le sujet du **TAF** :

| Exercice | Objectif | Fichiers d'implémentation |
| :--- | :--- | :--- |
| **Exercice 1** | Enregistrement d'un sorcier sans fournir d'ID (`NewWizard = Omit<Wizard, "id">`) avec assignation automatique. | [wizard.repository.ts](file:///src/repositories/wizard.repository.ts) |
| **Exercice 2** | Filtrage par maison via type à accès indexé (`findByHouse(house: Wizard["house"])`). | [wizard.repository.ts](file:///src/repositories/wizard.repository.ts) |
| **Exercice 3** | Gestionnaire d'événements typé via `Extract<AcademyEvent, { type: 'spell-cast' }>`. | [duel.service.ts](file:///src/services/duel.service.ts), [main.ts](file:///src/main.ts) |
| **Exercice 4** | Décorateur de méthode `@ValidateSpellPower` rejetant les sorts dont la puissance est négative (`power < 0`). | [decorators.ts](file:///src/decorators/decorators.ts), [spell.repository.ts](file:///src/repositories/spell.repository.ts) |
| **Exercice 5** | Décorateur de méthode `@Cache` avec mise en cache par instance via `WeakMap` et `Map`. | [decorators.ts](file:///src/decorators/decorators.ts) |
| **Exercice 6** | Type Guards stricts `isHouse(value)` et `isWizard(value)` validant les 4 maisons autorisées de Poudlard. | [guards.ts](file:///src/guards/guards.ts) |

---

## ⚡ Concepts TypeScript Avancés

1. **Utility Types** :
   - `Omit<Wizard, "id">` : définition de `NewWizard` pour création d'entités sans clé primaire.
   - `Pick<Wizard, "id" | "name" | "house">` : définition de vues synthétiques `WizardSummary`.
   - `Partial<Wizard>` : mise à jour souple de propriétés existantes.
   - `Record<House, number>` : typage fort de la table des scores `HousePoints`.
   - `Extract<T, U>` et `Exclude<T, U>` : filtrage précis des unions discriminées.

2. **Types Conditionnels & `infer`** :
   ```typescript
   export type SpellOutput<T extends SpellCategory> =
     T extends "attack" ? number :
     T extends "defense" ? boolean :
     T extends "healing" ? string :
     never;

   export type ArrayElement<T> =
     T extends (infer Item)[] ? Item : never;
   ```

3. **Types à Accès Indexé (Indexed Access Types)** :
   - Utilisation de `Wizard["house"]` dans `findByHouse` garantissant la concordance avec le modèle sans duplication de type.

4. **Type Guards & Prédicats de type** :
   - Fonctions `value is House`, `value is Wizard` et `value is Spell` offrant un narrowing sûr au compilateur.

5. **Décorateurs de Méthode** :
   - Interception dynamique des appels de méthodes, mesure du temps d'exécution (`@MeasureTime`), journalisation (`@Log`), validation des arguments (`@ValidateSpellPower`) et mémoïsation (`@Cache`).

---

## 💎 Principes SOLID & Modélisation POO

- **S (Single Responsibility)** : Chaque classe possède une responsabilité unique (ex: `HouseService` gère les points, `DuelService` gère le combat, `WizardRepository` gère la persistance).
- **O (Open/Closed)** : La hiérarchie de sorts `SpellModel` (`AttackSpell`, `DefenseSpell`, `HealingSpell`) permet d'ajouter de nouvelles catégories sans altérer le code existant.
- **L (Liskov Substitution)** : `WizardCharacter` et `ProfessorCharacter` étendent `Character` et peuvent être substitués de façon transparente.
- **I (Interface Segregation)** : Interfaces fines (`ISpellCaster`, `IDamageable`, `IHealable`, `ILearner`, `ITeacher`) évitant de forcer une classe à implémenter des méthodes inutiles.
- **D (Dependency Inversion)** : `WizardRepository` et `SpellRepository` dépendent de l'abstraction `IRepository<T>` ; `HouseService` et `DuelService` reçoivent leurs dépendances par injection.

---

## 🚀 Installation et Exécution

### Prérequis
- Node.js (version 20 ou supérieure recommandée)
- npm

### 1. Cloner le dépôt
```bash
git clone https://github.com/Mohammed-Tabibi/hogwarts-academy.git
cd hogwarts-academy
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Vérification des types TypeScript
```bash
npm run typecheck
```

### 4. Lancer la démonstration complète
```bash
npm start
```

---

## 🧪 Suite de Tests Automatisés

Le projet intègre une suite de tests unitaires automatisés utilisant le lanceur de tests natif Node.js avec exécution TypeScript via `tsx` :

```bash
npm test
```

### Résultats des tests
```text
✔ Method Decorators (6 tests)
  ✔ @Cache (hit / miss / isolation d'instance)
  ✔ @ValidateSpellPower (acceptation positive / rejet négatif)
  ✔ @Log & @MeasureTime (préservation des retours)
✔ Type Guards (7 tests)
  ✔ isHouse (maisons valides / rejet Durmstrang, etc.)
  ✔ isWizard (narrowing complet / structure invalide)
  ✔ isSpell (contrôle catégorie et puissance)
✔ Repositories (4 tests)
  ✔ WizardRepository (addWizard auto-id, findByHouse, CRUD)
  ✔ SpellRepository (rejet de puissance négative)
✔ OOP Models & Polymorphism (4 tests)
  ✔ Dégâts, soins et points de vie
  ✔ Gestion du mana et levée d'exception
  ✔ Sorts polymorphes (attaque, défense, soin)
  ✔ Enseignement par un professeur
✔ Business Services (3 tests)
  ✔ HouseService (attribution, déduction, classement)
  ✔ DuelService (déroulement, émission d'événements, récompense)

Total : 24 tests exécutés avec succès (0 échec).
```

---

## 👤 Auteur

- **Mohammed Tabibi** — Développeur & Étudiant
- GitHub : [@Mohammed-Tabibi](https://github.com/Mohammed-Tabibi)
