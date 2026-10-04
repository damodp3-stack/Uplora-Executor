# Uplora: Backup, Export & Disaster Recovery

## 1. Local-First Data Sovereignty
As a local-first business operating system, Uplora's company records (financial history, CRM client phone numbers, decision logs) belong solely to the founder.

## 2. Backup Mechanisms
1. **Automated Snapshot on Mutation**: State is automatically synced to the server persistent file (`data/uplora_db.json`) on every data write.
2. **One-Click JSON Full Backup**:
   * Generates a timestamped JSON file (`uplora_backup_YYYY-MM-DD_HHmmss.json`) containing all tables: users, tasks, leads, revenue, ideas, decisions, checkins, achievements.
3. **One-Click CSV Export**:
   * Export individual high-value datasets (e.g., `uplora_leads.csv`, `uplora_revenue_ledger.csv`) for use in external spreadsheets or accounting software.
4. **Instant Restore & Seeding**:
   * Drag-and-drop or select an exported JSON backup to completely restore application state.
   * "Reset to Factory Benchmark" with Uplora's real baseline parameters (December 2025 start, ₹40k run rate, Damo, Partner, Assistant).
