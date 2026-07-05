---
name: ai-arch-review
description: Reviews the codebase architecture for violations of project standards including file placement, component purity, import rules, TypeScript conventions, Redux usage, and naming conventions. Use this skill when asked to review architecture, check code quality, or audit the codebase for best practice violations.
---

# Skill: Architecture Review

## Purpose

Review the entire src/ directory of the AI Support Ticket Classifier
against the rules defined in rules.md. Report violations clearly
and fix them.

## When to use this skill

Run this skill:

- Before every PR merge to dev
- Before deployment
- After a large feature is built
- When a new developer joins the project

## How to run this review

1. Read AGENTS.md fully
2. Read .antigravity/skills/arch-review/rules.md fully
3. Scan every file in src/ systematically
4. For each violation found, report:
    - Which rule is violated (e.g. RULE 2.1)
    - Which file and line
    - What the violation # Skill: Architecture Review

## Purpose

Review the entire src/ directory of the AI Support Ticket Classifier
against the rules defined in rules.md. Report violations clearly
and fix them.

## When to use this skill

Run this skill:

- Before every PR merge to dev
- Before deployment
- After a large feature is built
- When a new developer joins the project

## How to run this review

1. Read AGENTS.md fully
2. Read .antigravity/skills/arch-review/rules.md fully
3. Scan every file in src/ systematically
4. For each violation found, report:
    - Which rule is violated (e.g. RULE 2.1)
    - Which file and line
    - What the violation is
    - What the fix should be
5. Group violations by severity:
   CRITICAL — breaks architecture (wrong file placement, cross-module imports)
   MAJOR — reduces maintainability (logic in TSX, hardcoded config)
   MINOR — style/naming inconsistencies
6. After reporting ALL violations, fix them one file at a time
7. Run npm run build + npm run lint after all fixes
8. Commit with message: "refactor: fix architecture violations from arch-review"

## What NOT to do

- Do not change business logic while fixing architecture issues
- Do not rewrite working code — only move, rename, or extract
- Do not fix things not covered by rules.md
- Do not spawn parallel subagents — review files sequentiallyis
    - What the fix should be

5. Group violations by severity:
   CRITICAL — breaks architecture (wrong file placement, cross-module imports)
   MAJOR — reduces maintainability (logic in TSX, hardcoded config)
   MINOR — style/naming inconsistencies
6. After reporting ALL violations, fix them one file at a time
7. Run npm run build + npm run lint after all fixes
8. Commit with message: "refactor: fix architecture violations from arch-review"

## What NOT to do

- Do not change business logic while fixing architecture issues
- Do not rewrite working code — only move, rename, or extract
- Do not fix things not covered by rules.md
- Do not spawn parallel subagents — review files sequentially