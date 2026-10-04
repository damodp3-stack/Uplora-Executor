# Uplora: Internal REST API Specification

The application provides a resilient, local-first API consumed by the frontend and AI tools.

## 1. Company & Quest Endpoints
* `GET /api/company/status` — Returns overall status, revenue numbers, current level, XP, health score, and ETA estimates.
* `POST /api/company/target` — Updates configurable Quest target (e.g. ₹1B) or monthly goal.

## 2. Tasks & Adaptive Difficulty Endpoints
* `GET /api/tasks` — List tasks with optional query params `owner`, `layer`, `status`.
* `POST /api/tasks` — Create a new task.
* `PATCH /api/tasks/:id/complete` — Mark task completed, award XP, update streak.
* `PATCH /api/tasks/:id/missed` — Log missed task with root-cause reason and optional notes.
* `POST /api/tasks/adapt` — Auto-step down or modify recurring target based on failure patterns.

## 3. Sales CRM Endpoints
* `GET /api/leads` — Fetch leads list, filterable by stage or assignee.
* `POST /api/leads` — Create a prospect lead.
* `PATCH /api/leads/:id/stage` — Update lead stage (e.g., Prospect -> Won).
* `DELETE /api/leads/:id` — Archive or delete lead.

## 4. Revenue & Payments Endpoints
* `GET /api/revenue` — Fetch all confirmed revenue entries.
* `POST /api/revenue` — Log a new transaction (awards 1 XP per ₹100, recalculates ETA).

## 5. Daily Check-in & Review Endpoints
* `POST /api/checkins` — Submit 8-question daily operational reflection.
* `GET /api/checkins/recent` — Fetch previous check-in logs.
* `GET /api/reviews/weekly` — Aggregate week's performance data.

## 6. Ideas & Decisions Endpoints
* `GET /api/ideas` — Retrieve stored ideas and quarantine status.
* `POST /api/ideas` — Submit new idea.
* `GET /api/decisions` — List decision logs.
* `POST /api/decisions` — Record strategic decision.
* `PATCH /api/decisions/:id/status` — Approve, reject, or pilot decision.

## 7. Gemini AI COO & Grounded Market Radar Endpoints
* `POST /api/gemini/chat` — Send query to Uplora AI COO with live database context and function calling tools.
* `POST /api/gemini/market-radar` — Trigger Google Search grounded scan for e-commerce, WhatsApp, and MSME opportunities.
* `POST /api/gemini/adapt-tasks` — Run AI bottleneck scan and generate recommended schedule adjustments.

## 8. Backup & Data Management Endpoints
* `GET /api/backup/export` — Download complete JSON database export.
* `POST /api/backup/import` — Restore or load database from JSON backup.
* `GET /api/backup/csv/:table` — Export specific table (e.g., leads, revenue) to CSV.
