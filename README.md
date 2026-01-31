# Digital Complaint Management System

React frontend for a complaint management system with role-based access (User/Admin), complaint submission and tracking, and an integrated chatbot.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Login

When the backend is unavailable, login falls back to mock auth:

- **User**: `user@test.com` / any password
- **Admin**: `admin@test.com` / any password

For real backend, set `VITE_USE_MOCK_AUTH=false` and configure `VITE_API_URL`.

## Features

- **User**: Login, submit complaints, track status, view details
- **Admin**: View all complaints, filter by status/category/search, update status & notes
- **Chatbot**: In-app assistance (bottom-right FAB)
- **Protected routes**: Role-based access control
- **Responsive UI**: Mobile-friendly layout

## Project Structure

See [FRONTEND_DESIGN.md](./FRONTEND_DESIGN.md) for detailed design, folder structure, API flow, and UX practices.

## Scripts

| Command   | Description        |
|-----------|--------------------|
| `npm run dev`    | Start dev server   |
| `npm run build`  | Production build   |
| `npm run preview`| Preview production |

## Tech Stack

- React 18
- React Router 6
- Axios
- Vite
