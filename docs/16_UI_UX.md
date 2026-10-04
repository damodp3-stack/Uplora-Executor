# Uplora: UI/UX & Command Center Design Philosophy

## 1. Visual Aesthetics: The High-Stakes Strategy Command HUD
The interface blends the tactical immersion of a strategy RPG with the clean, high-density utility of a modern SaaS executive console.

### Key Visual Rules
* **Palette**:
  * Background: Obsidian Void (`#090d16` / `#0f172a`), Dark Navy Slate (`#1e293b`).
  * Accents: Radiant Amber/Gold (`#f59e0b` / `#fbbf24`) for revenue and XP, Cyan/Teal (`#06b6d4` / `#14b8a6`) for tech & automation, Emerald (`#10b981`) for completed quests & profits, Crimson (`#ef4444`) for missed quotas & bottlenecks.
* **Anti-Slop & Zero-Pill Discipline**:
  * No rounded capsule pills floating over cards. Metadata uses clean unboxed text with typographic dot separators (`·`).
  * Cards use single-elevation depth with crisp 1px borders (`border-slate-800/80`).
* **Tactile Progression**:
  * Glowing animated progress bars for Quest Target and Level XP.
  * Streak counters with subtle ember animations.
  * Quick Action Floating Dock (FAB / Quick Bar) for 1-click logging: `+ Task`, `+ Lead`, `+ Revenue`, `+ Idea`, `+ Decision`, `+ Daily Check-in`.

## 2. Mobile & Android First-Class Experience
* The founder frequently operates from an Android phone while on sales calls or visiting local merchants.
* Bottom navigation bar for mobile with quick thumb access to Quest, Tasks, CRM, and AI Manager.
* Direct action buttons: "Call Merchant", "WhatsApp Chat" (opens `wa.me/<phone>`), and "Instagram Profile" links.
