# Digital Complaint Management System – Frontend Design

## Overview

React-based SPA with role-based access (User/Admin), complaint submission & tracking, admin management, and an integrated chatbot.

---

## 1. Folder Structure

```
src/
├── api/
│   ├── client.js          # Axios instance, interceptors
│   ├── services.js        # API endpoints (auth, complaints, chatbot)
│   └── mockAuth.js        # Mock auth for development
├── components/
│   ├── common/            # Reusable UI
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   └── Loader.jsx
│   ├── layout/
│   │   ├── AppLayout.jsx      # Header, nav, outlet
│   │   └── ProtectedRoute.jsx # Auth + role guard
│   ├── complaints/
│   │   └── StatusBadge.jsx
│   ├── admin/
│   │   ├── ComplaintFilters.jsx
│   │   └── UpdateStatusModal.jsx
│   └── chatbot/
│       └── Chatbot.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── user/
│   │   ├── UserDashboard.jsx
│   │   ├── SubmitComplaintPage.jsx
│   │   └── ComplaintDetailPage.jsx
│   └── admin/
│       └── AdminDashboard.jsx
├── types/
│   └── index.js           # JSDoc types, constants
├── App.jsx
├── main.jsx
└── index.css
```

---

## 2. Authentication & Role-Based Access

| Role | Access |
|------|--------|
| **user** | Dashboard, Submit complaint, Complaint detail, Chatbot |
| **admin** | Admin dashboard (view/filter/update complaints), Chatbot |

- **AuthContext**: `user`, `loading`, `login`, `logout`
- **ProtectedRoute**: Redirects unauthenticated users to `/login`, enforces `roles` when provided
- Token stored in `localStorage`; Axios interceptor adds `Authorization` header
- 401 responses clear token and redirect to login

---

## 3. Routing

| Path | Component | Protection |
|------|-----------|------------|
| `/login` | LoginPage | Public (redirects if authenticated) |
| `/` | AppLayout | Protected |
| `/dashboard` | UserDashboard | `roles: ['user']` |
| `/dashboard/submit` | SubmitComplaintPage | `roles: ['user']` |
| `/dashboard/complaints/:id` | ComplaintDetailPage | `roles: ['user']` |
| `/admin` | AdminDashboard | `roles: ['admin']` |

---

## 4. API Integration

### Client (`api/client.js`)

- Base URL: `VITE_API_URL` or `/api`
- Request: Add `Authorization: Bearer <token>`
- Response: On 401, clear auth and redirect to login
- Timeout: 15s

### Services (`api/services.js`)

| Service | Method | Endpoint |
|---------|--------|----------|
| authApi | login | POST `/auth/login` |
| authApi | me | GET `/auth/me` |
| complaintApi | create | POST `/complaints` |
| complaintApi | getMyComplaints | GET `/complaints/me` |
| complaintApi | getById | GET `/complaints/:id` |
| adminComplaintApi | getAll | GET `/admin/complaints` (query: status, category, search) |
| adminComplaintApi | updateStatus | PATCH `/admin/complaints/:id` |
| chatbotApi | sendMessage | POST `/chatbot/message` |

### Error Handling

- Axios interceptor converts errors to `Error(message)`
- Components use `try/catch` and display `error.message`
- Loaders shown during async operations

---

## 5. UX Practices

- **Form validation**: Client-side (required, min length, email format) with inline errors
- **Responsive**: Flexbox layouts, media queries for mobile
- **Loading states**: Spinner/overlay during API calls
- **Empty states**: Clear CTAs when no complaints
- **Feedback**: Error banners, success via navigation
- **Accessibility**: Labels, `aria-label` on icons, semantic HTML

---

## 6. State Management

- **Auth**: `AuthContext` (user, login, logout)
- **Local UI**: `useState` for forms, modals, filters
- **Server state**: Fetch on mount (`useEffect`), refetch after mutations
- No global state library; add React Query/SWR later if needed

---

## 7. Chatbot

- Floating action button (bottom-right)
- Collapsible panel with message history
- Suggestion chips for common questions
- Integrates with `chatbotApi.sendMessage`
- Fallback reply when API unavailable

---

## 8. Responsive Design

- Mobile-first CSS variables (colors, radii)
- Breakpoints: `768px`, `480px`
- Tables hide non-essential columns on small screens
- Chatbot panel adapts to viewport

---

## 9. Integration Checklist

1. Set `VITE_API_URL` to backend base URL
2. Ensure backend returns `{ token, user }` for login
3. Ensure backend expects `Authorization: Bearer <token>`
4. Add CORS if frontend and backend on different origins
