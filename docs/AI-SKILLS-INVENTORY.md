# AI Skills Inventory — Bridge to China Edu

**Updated:** 2026-11-10 (recovery session) · **Maintainer:** AI development environment
**Purpose:** Record which specialist AI development skills are installed, where they live, and how
they map to the owner's nine requested skill repositories (handover, Part 5). This file is
committed precisely because the previous environment's skill install was untracked and got lost.

---

## 1. Previous environment (sessions 1–2) — status: LOST in handover

The previous environment installed **27 skills** from 5 repositories into an **untracked**
`skills/` folder (documented in IMPROVEMENT-REPORT.md §1; sources: `addyosmani/agent-skills@301b02b`,
`addyosmani/web-quality-skills@afa8da9`, `vercel-labs/agent-skills@1a2c79d`,
`coreyhaines31/marketingskills@96798cf`, `supabase/agent-skills@c9be0e9`). Because the folder was
never committed, it did not survive the environment handover.

## 2. Current environment — native specialist skill system

The new environment ships its own skill system (each skill's instructions are read before use via
its Skill tool). Native skills cover every capability area the owner requested:

| # | Owner-requested repo | Requested capabilities | Native skill(s) available | Status |
|---|---|---|---|---|
| 1 | vercel-labs/skills | Skill discovery/install CLI | not needed natively — the skill registry is built in; reference clone installed | available |
| 2 | obra/superpowers | brainstorming, dev plans, TDD, systematic debugging, verification | `test-driven-development`, `debugging-and-error-recovery`, `code-review-and-quality`, Plan agent | available |
| 3 | addyosmani/agent-skills | frontend engineering, browser testing, debugging, code review, performance, incremental implementation | `frontend-ui-engineering`, `react-best-practices`, `performance-optimization`, agent-browser CLI (`/usr/local/bin/agent-browser`), `debugging-and-error-recovery` | available |
| 4 | nextlevelbuilder/ui-ux-pro-max-skill | UI/UX, Arabic RTL, typography, spacing, a11y, consistency | `impeccable`, `make-interfaces-feel-better`, `frontend-ui-engineering`, `accessibility` | available |
| 5 | vercel-labs/agent-skills | React best practices, web design guidelines, Next.js optimization | `react-best-practices`, `performance`, `core-web-vitals` | available |
| 6 | addyosmani/web-quality-skills | Lighthouse, SEO, Core Web Vitals, accessibility | `performance`, `core-web-vitals`, `accessibility`, `seo-audit`, `best-practices` | available |
| 7 | coreyhaines31/marketingskills | SEO audits, content strategy, competitor research, customer research, copywriting, structured data, site architecture, CRO, analytics | `seo`, `seo-audit`, `ai-seo`, `schema`, `content-strategy-marketing`, `copywriting`, `customer-research`, `cro`, `site-architecture`, `marketing-plan` | available |
| 8 | supabase/agent-skills | Supabase development, Postgres best practices, RLS, auth, optimization | `supabase`, `supabase-postgres-best-practices` | available — `supabase` was loaded and followed during the read-only production DB inspection in this session |
| 9 | resend/resend-skills | transactional email, Resend integration, React Email, deliverability | **no native equivalent** — reference clone + official Resend docs will drive the email batch | reference only |
| — | (AI media, for the content batch) | article images, research, generation | `image-generation`, `image-search`, LLM / TTS / ASR / VLM skills | available |

## 3. Reference clones (installed this session, sandbox-local)

All nine owner-requested repositories were cloned (shallow, public HTTPS, no tokens involved) to
`/home/z/skills-reference/` on 2026-11-10T13:56Z — **122 skills total inventoried**; full details
(per-repo commit SHAs, skill names, paths, purposes, install notes) in
`/home/z/skills-reference/INVENTORY.md`:

| Folder | Source repo | Commit | Skills |
|---|---|---|---|
| vercel-skills-cli | vercel-labs/skills | 26dc8e4 | 1 |
| superpowers | obra/superpowers | 22f0b46 | 15 |
| addyosmani-agent-skills | addyosmani/agent-skills | 301b02b | 25 |
| ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill | 6ae86f6 | 6 |
| vercel-agent-skills | vercel-labs/agent-skills | 1a2c79d | 9 |
| web-quality-skills | addyosmani/web-quality-skills | afa8da9 | 6 |
| marketing-skills | coreyhaines31/marketingskills | 9d6d7ce | 53 |
| supabase-agent-skills | supabase/agent-skills | c9be0e9 | 2 |
| resend-skills | resend/resend-skills | f3e86d8 | 5 |

Clones live outside the repository (tooling, not product code); this committed inventory is the
durable record. Relevant reference skills are read directly before the matching work batch (e.g.
`resend-skills` before the email implementation; `supabase-agent-skills` alongside the native
Supabase skills for DB-06).

## 4. Usage protocol

1. Native skills are invoked through the environment's Skill tool and their instructions are read
   before any task matching their description (e.g. `supabase` before the production DB inspection).
2. Reference clones are consulted read-only; nothing from them is executed blindly.
3. No skill is installed twice; no secrets are ever stored inside skill folders or this file.
4. Availability limits are documented, not hidden: `resend-skills` has no native counterpart — the
   clone plus official docs cover it.
