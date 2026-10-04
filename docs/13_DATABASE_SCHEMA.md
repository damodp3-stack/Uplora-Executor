# Uplora: Relational Database Schema & Entities

The database is architected for local-first zero-latency execution (SQLite compatible engine and JSON persistent store), fully normalized for easy migration to PostgreSQL/Cloud SQL if desired.

## 1. Core Tables

### `users`
* `id` (TEXT PRIMARY KEY): Unique identifier (e.g., 'usr_damo', 'usr_partner', 'usr_assistant')
* `name` (TEXT): Display name
* `role` (TEXT): 'ceo', 'cto', 'lead_hunter', 'admin'
* `avatar_url` (TEXT): Visual avatar
* `xp` (INTEGER): Current cumulative XP earned
* `level` (INTEGER): Current player level (1-10)
* `streak_days` (INTEGER): Continuous daily execution streak
* `created_at` (DATETIME)

### `company`
* `id` (TEXT PRIMARY KEY): 'uplora_main'
* `name` (TEXT): 'Uplora'
* `structure` (TEXT): 'Commerce-Tech Company'
* `quest_target` (REAL): Long term target in INR (default: 1000000000.0)
* `monthly_target` (REAL): Current monthly revenue goal (default: 100000.0)
* `current_run_rate` (REAL): Estimated monthly baseline (default: 40000.0)
* `updated_at` (DATETIME)

### `tasks`
* `id` (TEXT PRIMARY KEY)
* `title` (TEXT NOT NULL)
* `description` (TEXT)
* `owner_id` (TEXT NOT NULL, FK -> users.id)
* `layer` (TEXT): 'daily' | 'weekly' | 'monthly' | 'side_quest'
* `category` (TEXT): 'sales' | 'delivery' | 'lead_gen' | 'strategy' | 'product'
* `priority` (TEXT): 'critical' | 'high' | 'medium' | 'low'
* `difficulty` (TEXT): 'easy' | 'medium' | 'hard' | 'boss'
* `xp_reward` (INTEGER NOT NULL)
* `status` (TEXT): 'pending' | 'completed' | 'missed'
* `due_date` (TEXT)
* `completed_at` (DATETIME)
* `missed_reason` (TEXT)
* `missed_notes` (TEXT)
* `adapted_from_task_id` (TEXT)

### `leads` (CRM)
* `id` (TEXT PRIMARY KEY)
* `business_name` (TEXT NOT NULL)
* `contact_name` (TEXT)
* `phone` (TEXT)
* `whatsapp` (TEXT)
* `instagram` (TEXT)
* `website` (TEXT)
* `city` (TEXT)
* `category` (TEXT)
* `problem_identified` (TEXT)
* `proposed_solution` (TEXT)
* `estimated_value` (REAL)
* `lead_source` (TEXT)
* `assigned_to` (TEXT, FK -> users.id)
* `status` (TEXT): 'prospect' | 'contacted' | 'connected' | 'interested' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'followup'
* `last_contact_date` (TEXT)
* `next_followup_date` (TEXT)
* `notes` (TEXT)
* `created_at` (DATETIME)

### `revenue`
* `id` (TEXT PRIMARY KEY)
* `client_id` (TEXT)
* `client_name` (TEXT NOT NULL)
* `service_type` (TEXT): 'website' | 'whatsapp_automation' | 'storeik' | 'ecommerce' | 'maintenance' | 'other'
* `amount` (REAL NOT NULL)
* `payment_date` (TEXT NOT NULL)
* `notes` (TEXT)
* `xp_awarded` (INTEGER)

### `daily_checkins`
* `id` (TEXT PRIMARY KEY)
* `user_id` (TEXT NOT NULL)
* `date` (TEXT NOT NULL)
* `completed_summary` (TEXT)
* `missed_summary` (TEXT)
* `biggest_win` (TEXT)
* `blockers` (TEXT)
* `key_outcome` (TEXT)
* `revenue_logged` (REAL)
* `tomorrow_focus` (TEXT)
* `created_at` (DATETIME)

### `ideas`
* `id` (TEXT PRIMARY KEY)
* `title` (TEXT NOT NULL)
* `problem` (TEXT)
* `target_customer` (TEXT)
* `proposed_solution` (TEXT)
* `potential_revenue` (REAL)
* `difficulty` (TEXT): 'low' | 'medium' | 'high'
* `cost_estimate` (REAL)
* `status` (TEXT): 'quarantine' | 'validating' | 'approved' | 'rejected' | 'graduated'
* `created_at` (DATETIME)

### `experiments`
* `id` (TEXT PRIMARY KEY)
* `idea_id` (TEXT)
* `title` (TEXT NOT NULL)
* `hypothesis` (TEXT)
* `duration_days` (INTEGER)
* `start_date` (TEXT)
* `end_date` (TEXT)
* `metrics_tracked` (TEXT)
* `outcome` (TEXT): 'running' | 'success' | 'failed' | 'inconclusive'
* `lessons_learned` (TEXT)

### `decisions` (Decision Log & Strategic Ledger)
* `id` (TEXT PRIMARY KEY)
* `title` (TEXT NOT NULL)
* `rationale` (TEXT NOT NULL)
* `author_id` (TEXT)
* `expected_outcome` (TEXT)
* `status` (TEXT): 'proposed' | 'approved' | 'rejected' | 'in_pilot' | 'reviewed'
* `review_date` (TEXT)
* `actual_outcome` (TEXT)
* `permanent_rule` (TEXT)
* `created_at` (DATETIME)

### `market_opportunities`
* `id` (TEXT PRIMARY KEY)
* `headline` (TEXT NOT NULL)
* `sector` (TEXT)
* `source_url` (TEXT)
* `why_it_matters` (TEXT NOT NULL)
* `potential_service` (TEXT)
* `potential_revenue` (REAL)
* `status` (TEXT): 'unreviewed' | 'saved' | 'converted_to_idea' | 'dismissed'
* `created_at` (DATETIME)

### `company_memory`
* `id` (TEXT PRIMARY KEY)
* `category` (TEXT): 'vision' | 'pricing' | 'client_rule' | 'technical' | 'team'
* `key` (TEXT NOT NULL)
* `content` (TEXT NOT NULL)
* `updated_at` (DATETIME)

### `achievements`
* `id` (TEXT PRIMARY KEY)
* `code` (TEXT NOT NULL UNIQUE)
* `title` (TEXT NOT NULL)
* `description` (TEXT)
* `icon` (TEXT)
* `unlocked` (BOOLEAN)
* `unlocked_at` (DATETIME)
