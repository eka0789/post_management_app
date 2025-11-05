# Post Management App

## Overview
Two-stack implementation:
- `/laravel` — Laravel API (Auth + Posts CRUD)
- `/nextjs` — Next.js frontend (App Router) consuming Laravel API
UI uses Tailwind + DaisyUI.

## Requirements
- Docker & Docker Compose (optional, recommended)
- PHP 8.1+, Composer, Node 18+, npm

## Running locally (without Docker)
### Laravel
cd laravel
cp .env.example .env
composer install
php artisan key:generate
# configure DB env
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=9000

### Next.js
cd nextjs
cp .env.local.example .env.local
npm install
npm run dev

## Running with Docker
docker compose up --build

## API Endpoints
Auth:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout

Posts:
- GET /api/v1/posts
- GET /api/v1/posts/{slug}
- POST /api/v1/posts
- PUT /api/v1/posts/{id}
- DELETE /api/v1/posts/{id}

## Notes & Tech Choices
- Authentication: Laravel Sanctum token-based (simple to integrate with Next.js)
- UI: Tailwind + DaisyUI on both stacks for consistency
- DB: MySQL in Docker (or local MySQL)
- Security: API protected with `auth:sanctum`, policies for post ownership + role checks.

## Running tests
Describe any unit/feature tests you provide in `laravel/tests` and how to run them.
