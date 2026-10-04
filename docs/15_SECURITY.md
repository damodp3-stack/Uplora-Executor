# Uplora: Security & Data Protection Architecture

## 1. Zero Client-Side Secret Exposure
* The Gemini API key (`GEMINI_API_KEY`) is stored strictly on the server side (`process.env.GEMINI_API_KEY`) and accessed via `@google/genai` inside server routes.
* **Prohibition**: No API key is ever embedded in client-side bundles, local storage, or transmitted via client responses.
* **No UI for Secrets**: The application does not render input fields or prompts asking the user to paste their API key.

## 2. Input Validation & SQL / Query Hygiene
* All incoming payloads for tasks, leads, revenue entries, ideas, and decisions are sanitized and type-checked before persistence.
* Escaped database queries protect against injection attacks.

## 3. Human Gatekeeper for Destructive & Strategic Changes
* The AI COO cannot autonomously delete data or enact permanent business pivots.
* Any AI-recommended restructuring (e.g., dropping website services, reallocating payroll, altering pricing structures) requires explicit founder approval via UI confirmation modal.

## 4. Audit Trail & Data Integrity
* Key state mutations (revenue additions, decision approvals, task difficulty step-downs, role changes) log timestamps and author IDs.
* Automated local JSON backups prevent catastrophic data loss during testing or offline operation.
