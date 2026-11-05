# Arcana Domain Specifications & Contracts

This directory contains the central data contracts and JSON schemas governing the Arcana platform across all native client platforms:

- **`web/`**: Native Web client (TypeScript, React 19, Tailwind CSS, Vite)
- **`android/`**: Native Android client (Kotlin, Jetpack Compose, Gradle Kotlin DSL)
- **`ios/`**: Native iOS client (Swift 5.9, SwiftUI, Xcode project)

## Schema Manifest

1. `pantry-item.schema.json`: Inventory item, categories (`Flora`, `Fauna`, `Mineral`, `Tool`), quantities, units, lunar phase, and threshold warnings.
2. `spell-recipe.schema.json`: Recipe definitions, difficulty tiers, elemental affinities, required reagents, and step-by-step instructions.
3. `journal-entry.schema.json`: Personal chronicle entries with OCR capture text, formatted markdown, relational foreign keys to Pantry and Archive, outcome ratings, and lunar conditions.
4. `user-profile.schema.json`: Arcane identity parameters (arcane name, tradition, focus item, affinities, privacy toggles).
5. `coven.schema.json`: Ed25519 single-use cryptographic invite token model and Barter exchange board specifications.
