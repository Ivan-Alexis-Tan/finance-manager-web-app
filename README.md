# Personal Finance Manager

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-000000)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack web application for recording and managing personal financial transactions. The application allows users to securely sign in, record income and expense transactions individually or in bulk, and efficiently search and organize financial records.

> **Live Demo:** https://finance-manager-web-app-puce.vercel.app

## Features

- Secure authentication with Google and GitHub (OAuth)
- Record income and expense transactions
- Create multiple transactions in a single submission (bulk entry)
- Edit and delete existing transactions
- Search transactions
- Filter transactions
- Pagination
- Responsive UI
- Server-side validation with Zod

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Backend
- Next.js Server Actions
- Route Handlers
- Auth.js
- Prisma ORM
- Zod

### Database
- PostgreSQL

### Deployment
- Vercel

## Motivation

This project was built both as a portfolio project and as a personal finance tracker. It provides a secure place to record daily financial transactions while serving as a foundation for future data analysis and visualization projects.

## What I Learned

- Building a full-stack application with Next.js
- Authentication using Auth.js
- PostgreSQL with Prisma ORM
- Server-side validation using Zod
- Structuring a larger application
- Debugging deployment and authentication issues
- Reading official documentation and solving implementation problems independently

## Future Improvements

- Dashboard
- Charts and graphs
- Budget planning
- Savings tracking
- Category analytics
- CSV/Excel export
- Recurring transactions

## Installation

```bash
git clone https://github.com/Ivan-Alexis-Tan/finance-manager-web-app
cd finance-manager
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm dev
```

## Environment Variables

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```