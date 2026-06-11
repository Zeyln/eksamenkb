# EksamenKB — Internal Knowledge Base

## 🧭 Overview

EksamenKB is a full-stack internal knowledge base application designed for companies to let their employees write, organise, and share documentation. It is a hosted B2B product: EksamenKB develops, maintains, and operates the infrastructure on behalf of each client company. The client company is the data controller — they retain admin access to user management and own their data — but EksamenKB manages all hosting. Access is strictly restricted to authorised personnel; there is no public registration.

The application is built with Norwegian businesses as the primary market and is designed to comply with GDPR and applicable Norwegian data protection law (Datatilsynet).

---

## 🛠 Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite (build tool / dev server)
- Tailwind CSS v4
- React Router v7
- Axios (HTTP client with auth interceptors)

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- bcrypt (password hashing)
- JWT — access token + refresh token

**Infrastructure**
- Docker + Docker Compose
  - `api` container: Node.js / Express / Prisma
  - `db` container: PostgreSQL with mounted volume for persistence

---

## ✅ Features

**Authentication**
- Login / register with email, username, and password
- JWT access token + refresh token stored in localStorage
- All routes except `/login` and `/register` require authentication — unauthenticated users are redirected to login with a redirect-back after successful sign-in
- Session expiry handling: when a token expires mid-session, a modal overlay appears prompting the user to re-authenticate — all in-progress work (e.g. a half-written article) is preserved in memory and restored immediately after login

**Articles**
- Full CRUD: create, read, update, delete
- Status system: `DRAFT` / `PUBLISHED`
- Author attribution
- Category assignment

**Categories**
- Hierarchical structure: top-level categories with sub-categories
- Create and delete categories
- Filter articles by category on the home page

**UI / UX**
- Spreadsheet-inspired layout: articles listed in a structured table with row numbers, column headers, and category filter
- Rigid, sharp-edged design system — no border-radius
- Light gray canvas, white surfaces, green accents
- Status bar on each page showing article count and login state

**Compliance**
- Privacy Policy document (GDPR-compliant, issued per client company)
- Data Processing Agreement (DPA) template
- Passwords stored exclusively as hashed values — never plain text
- No cookies, tracking, or third-party analytics

---

## 🚧 Not yet implemented

- **Role-based access control** — the `role` field exists on the User model but permissions are not yet enforced beyond basic authentication
- **Admin user management** — client company admins cannot yet manage (invite / deactivate) users through the UI
- **Search** — full-text search across articles is not yet implemented
- **Rich text / Markdown** — article content is currently plain text
- **White-label configuration** — client company name, logo, and branding are hardcoded placeholders
