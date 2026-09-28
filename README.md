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
- Docker

### Run the database
    docker compose up -d

### Run the backend
    cd backend
    cp .env.example .env
    npm install
    npm run dev

## Workflow
- Never commit directly to `main`.
- Branch naming: `feat/...`, `fix/...`, `chore/...`
- Commit style: Conventional Commits (`feat: add x`)
- Every change goes through a Pull Request.
