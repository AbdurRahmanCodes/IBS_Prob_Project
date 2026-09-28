# Task Board

A full-stack task management app: Users → Projects → Tasks.

## Stack
- **Backend:** Node.js, TypeScript, Apollo Server, TypeORM, PostgreSQL
- **Frontend:** Next.js (App Router), Apollo Client, Zustand, MUI

## Structure
- `backend/`: GraphQL + REST API
- `frontend/`: web app

## Getting started

### Prerequisites
- Node.js 20+
- pnpm (enable with `corepack enable pnpm`)
- Docker

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