# Digital Complaint Management System — Backend

Node.js/Express backend with role-based auth, REST APIs, and real-time status updates via Socket.io.

## Folder structure

```
server/
├── config/          # App config and DB init
│   ├── index.js     # Env (PORT, JWT_SECRET, DB_PATH, CORS)
│   └── database.js  # SQLite connection and schema
├── models/          # Data access
│   ├── User.js
│   └── Complaint.js
├── middlewares/     # Auth and authorization
│   ├── auth.js      # JWT verify (requireAuth, optionalAuth)
│   └── authorize.js # Role check (user / admin)
├── services/        # Business logic
│   ├── authService.js
│   └── complaintService.js
├── controllers/     # Request handlers
│   ├── authController.js
│   ├── complaintController.js
│   ├── adminController.js
│   └── chatbotController.js
├── routes/          # API routes
│   ├── index.js     # Mounts /auth, /complaints, /admin, /chatbot
│   ├── auth.js
│   ├── complaints.js
│   └── admin.js
├── app.js           # Express app
├── server.js        # HTTP server + Socket.io
├── .env.example
└── package.json
```

## Setup

```bash
cd server
cp .env.example .env   # edit .env if needed
npm install
npm start
```

Default: `http://localhost:5000`. API base: `http://localhost:5000/api`.

## Demo accounts (seeded on first run)

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@example.com | admin123  |
| User  | user@example.com  | user123   |

## API overview

All API routes are under `/api`. Frontend uses `Authorization: Bearer <token>`.

### Auth

| Method | Path        | Body / Query | Description        |
|--------|-------------|--------------|--------------------|
| POST   | /api/auth/login  | `{ email, password }` | Login → `{ user, token }` |
| POST   | /api/auth/logout | —            | Logout (client clears token) |
| GET    | /api/auth/me     | — (auth)     | Current user        |

### User — Complaints

| Method | Path               | Body / Query | Description        |
|--------|--------------------|--------------|--------------------|
| POST   | /api/complaints    | `{ title, description, category?, attachments? }` | Create complaint |
| GET    | /api/complaints/me | — (auth)     | List my complaints |
| GET    | /api/complaints/:id| — (auth)     | Get one complaint  |

### Admin — Complaints

| Method | Path                    | Body / Query | Description        |
|--------|-------------------------|--------------|--------------------|
| GET    | /api/admin/complaints   | `?status=&category=&search=` | List all (filtered) |
| PATCH  | /api/admin/complaints/:id | `{ status, adminNotes? }` | Update status      |

**Status values:** `pending` | `in_progress` | `resolved` | `rejected`  
**Category values:** `technical` | `billing` | `service` | `other`

### Real-time (Socket.io)

- **Path:** `/api/socket.io`
- **Auth (handshake):** `{ userId?, complaintId? }` — used to join rooms.
- **Event:** `complaint:updated` — payload is the updated complaint object. Emitted to:
  - room `complaint:<id>` (anyone viewing that complaint)
  - room `user:<userId>` (the complaint owner)

When an admin updates a complaint status, the backend emits `complaint:updated` so the user’s dashboard and detail page update in real time.

## Request / response flow

1. **Login:** `POST /api/auth/login` → `{ user, token }`; client stores token and user.
2. **Authenticated requests:** `Authorization: Bearer <token>`; `requireAuth` verifies JWT and sets `req.user`.
3. **User routes:** `requireAuth` + `authorize('user', 'admin')`; user can create/list/view own complaints.
4. **Admin routes:** `requireAuth` + `authorize('admin')`; admin can list all, filter, and PATCH status.
5. **Status update:** Admin PATCH → service updates DB → controller sets `req.app.get('io')` and emits to Socket.io rooms → clients subscribed to that complaint/user receive `complaint:updated`.

## Environment (.env)

| Variable     | Default              | Description        |
|-------------|----------------------|--------------------|
| PORT        | 5000                 | Server port        |
| JWT_SECRET  | (change in prod)     | JWT signing secret |
| JWT_EXPIRES_IN | 7d                | Token expiry       |
| DB_PATH    | ./data/complaints.db | SQLite file        |
| CORS_ORIGIN | http://localhost:3000 | Allowed origin   |
