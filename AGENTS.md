# AGENTS.md — Project Context for AI Coding Agents

## Project
CVE Tracker SaaS — my-first-app
Live: https://my-first-app-rose-gamma.vercel.app/

## Stack
- Next.js 16.2.3, TypeScript, Tailwind CSS v4
- PostgreSQL on Railway, Prisma 7 ORM
- Clerk Auth (auth + billing — Phase 4 in progress)
- Deployed on Vercel

## Structure
- app/ — App Router pages and API routes
- app/api/saved-threats/ — GET and POST handlers for CVE storage
- app/dashboard/ — protected dashboard page
- prisma/schema.prisma — Threat model with userId as plain string

## Conventions
- Loop variables: always use `t` in .map() .filter() .forEach()
- Inline comments on every important line
- Server Components by default; 'use client' only when hooks needed
- userId comes from Clerk auth(), never hardcoded

## Current Phase
Phase 4 — Clerk Billing setup (next: /pricing page + has() feature gates)
