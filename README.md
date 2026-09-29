# Task Board

A full-stack task management app: Users → Projects → Tasks.

## Stack

- **Backend:** Node.js, TypeScript, Apollo Server, TypeORM, PostgreSQL
- **Frontend:** Next.js (App Router), Apollo Client, Zustand, MUI

## Structure

- `backend/`: GraphQL + REST API
- `frontend/`: web app

## Monorepo tooling

This repo uses a pnpm workspace (see `pnpm-workspace.yaml`) so that shared
dev tooling (Prettier, Husky, lint-staged) can live at the root and apply
across both apps. `backend/` and `frontend/` remain independent for their
own runtime dependencies — the root `package.json` only holds dev tooling,
nothing is shared at runtime.

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 10 (enable with `corepack enable pnpm`)
- Docker

### Install repository tooling

    pnpm install

### Run the database

    docker compose up -d

### Run the backend

    cd backend
    cp .env.example .env
    pnpm install
    pnpm dev

### Run the frontend

    cd frontend
    pnpm install
    pnpm dev

Open http://localhost:3000

## Workflow

- Never commit directly to `main`.
- Branch naming: `feat/...`, `fix/...`, `chore/...`
- Commit style: Conventional Commits (`feat: add x`)
- Every change goes through a Pull Request.
