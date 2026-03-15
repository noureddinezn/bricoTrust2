# BricoTrust Frontend Architecture & Planning

## Project Overview

**Project Name:** BricoTrust  
**Frontend Framework:** Vue 3 + Composition API  
**Build Tool:** Vite  
**HTTP Client:** Axios  
**State Management:** Pinia (optional, minimal use)  
**Router:** Vue Router v4  
**Styling:** Tailwind CSS  

**Core Principle:** Vue 3 SPA consuming Laravel REST API. All business logic stays in Laravel backend.

---

## 1. FOLDER STRUCTURE

```
Frontend/
├── src/
│   ├── api.js                          # Main Axios instance & token management
│   ├── main.js                         # App initialization
│   ├── App.vue                         # Root component
│   │
│   ├── assets/                         # Static assets
│   │   ├── images/
│   │   ├── styles/
│   │   └── fonts/
│   │
│   ├── components/                     # Reusable UI components
│   │   ├── common/
│   │   │   ├── AppButton.vue
│   │   │   ├── AppInput.vue
│   │   │   ├── AppTextarea.vue
│   │   │   ├── AppSelect.vue
│   │   │   ├── AppModal.vue
│   │   │   ├── AppLoader.vue
│   │   │   ├── AppEmptyState.vue
│   │   │   ├── AppErrorMessage.vue
│   │   │   ├── AppSuccessMessage.vue
│   │   │   ├── AppPagination.vue
│   │   │   ├── RatingStars.vue
│   │   │   ├── StatusBadge.vue
│   │   │   └── SearchBar.vue
│   │   │
│   │   ├── cards/
│   │   │   ├── ArtisanCard.vue
│   │   │   ├── JobPostCard.vue
│   │   │   ├── PortfolioCard.vue
│   │   │   ├── ReviewCard.vue
│   │   │   ├── ServiceRequestCard.vue
│   │   │   └── ServiceCard.vue
│   │   │
│   │   ├── forms/
│   │   │   ├── ArtisanProfileForm.vue
│   │   │   ├── JobPostForm.vue
│   │   │   ├── ServiceRequestForm.vue
│   │   │   ├── ReviewForm.vue
│   │   │   └── ReportForm.vue
│   │   │
│   │   ├── filters/
│   │   │   ├── ArtisanFilterBar.vue
│   │   │   ├── JobPostFilterBar.vue
│   │   │   └── ServiceFilterBar.vue
│   │   │
│   │   └── layout/
│   │       ├── Navbar.vue
│   │       ├── Sidebar.vue
│   │       ├── Footer.vue
│   │       └── BreadcrumbNav.vue
│   │
│   ├── composables/                    # Composition API logic (stateful hooks)
│   │   ├── useAuth.js                  # Auth state & methods
│   │   ├── useArtisans.js              # Artisan fetching & filtering
│   │   ├── useServices.js              # Services/categories fetching
│   │   ├── useJobPosts.js              # Job posts logic
│   │   ├── useServiceRequests.js       # Service requests logic
│   │   ├── useReviews.js               # Reviews logic
│   │   ├── useReports.js               # Reports logic
│   │   ├── useLeaderboard.js           # Leaderboard data
│   │   ├── usePortfolio.js             # Portfolio CRUD
│   │   ├── useFormValidation.js        # Shared validation logic
│   │   ├── usePagination.js            # Pagination state
│   │   └── useNotifications.js         # Toast/notification system
│   │
│   ├── services/                       # API communication layer
│   │   ├── api.js                      # Axios instance setup & interceptors
│   │   ├── authService.js              # Auth endpoints
│   │   ├── artisanService.js           # Artisan endpoints
│   │   ├── serviceService.js           # Service/category endpoints
│   │   ├── jobPostService.js           # Job post endpoints
│   │   ├── serviceRequestService.js    # Service request endpoints
│   │   ├── portfolioService.js         # Portfolio endpoints
│   │   ├── reviewService.js            # Review endpoints
│   │   ├── reportService.js            # Report endpoints
│   │   ├── leaderboardService.js       # Leaderboard endpoints
│   │   └── adminService.js             # Admin endpoints
│   │
│   ├── stores/                         # Pinia global state (minimal use)
│   │   ├── index.js                    # Store initialization
│   │   ├── authStore.js                # Auth state (optional if using composable)
│   │   └── notificationStore.js        # Global notifications (optional)
│   │
│   ├── router/                         # Vue Router configuration
│   │   ├── index.js                    # Main router setup
│   │   ├── guards.js                   # Route guards & middleware
│   │   ├── routes.js                   # Route definitions
│   │   └── middlewares/
│   │       ├── authMiddleware.js       # Check authentication
│   │       ├── roleMiddleware.js       # Check user role
│   │       └── guestMiddleware.js      # Redirect if authenticated
│   │
│   ├── layouts/                        # Layout components by role
│   │   ├── DefaultLayout.vue           # Public pages layout
│   │   ├── AuthLayout.vue              # Login/Register layout
│   │   ├── ClientLayout.vue            # Client dashboard layout
│   │   ├── ArtisanLayout.vue           # Artisan dashboard layout
│   │   └── AdminLayout.vue             # Admin dashboard layout
│   │
│   ├── pages/                          # Page components organized by role
│   │   ├── public/
│   │   │   ├── HomePage.vue
│   │   │   ├── ArtisansPage.vue
│   │   │   ├── ArtisanDetailsPage.vue
│   │   │   ├── ServicesPage.vue
│   │   │   ├── JobPostsPage.vue
│   │   │   ├── JobPostDetailsPage.vue
│   │   │   ├── LeaderboardPage.vue
│   │   │   └── NotFoundPage.vue
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.vue
│   │   │   ├── RegisterPage.vue
│   │   │   └── ForgotPasswordPage.vue (optional)
│   │   │
│   │   ├── client/
│   │   │   ├── ClientDashboardPage.vue
│   │   │   ├── MyRequestsPage.vue
│   │   │   ├── MyJobPostsPage.vue
│   │   │   ├── CreateJobPostPage.vue
│   │   │   ├── EditJobPostPage.vue
│   │   │   ├── MyReviewsPage.vue
│   │   │   ├── RequestDetailsPage.vue
│   │   │   └── SearchArtisansPage.vue
│   │   │
│   │   ├── artisan/
│   │   │   ├── ArtisanDashboardPage.vue
│   │   │   ├── ArtisanProfilePage.vue
│   │   │   ├── ArtisanPortfolioPage.vue
│   │   │   ├── AddPortfolioItemPage.vue
│   │   │   ├── EditPortfolioItemPage.vue
│   │   │   ├── ArtisanRequestsPage.vue
│   │   │   ├── RequestDetailsPage.vue
│   │   │   ├── MyPerformancePage.vue (optional)
│   │   │   └── JobPostCommentsPage.vue
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboardPage.vue
│   │       ├── PendingArtisansPage.vue
│   │       ├── UsersPage.vue
│   │       ├── ManageServicesPage.vue
│   │       ├── CreateServicePage.vue
│   │       ├── EditServicePage.vue
│   │       ├── ManageReportsPage.vue
│   │       └── AnalyticsPage.vue (optional)
│   │
│   ├── utils/                          # Utility functions
│   │   ├── formatters.js               # Date, currency, text formatting
│   │   ├── validators.js               # Form validation rules
│   │   ├── constants.js                # App constants, enums
│   │   ├── helpers.js                  # General helper functions
│   │   └── errorHandler.js             # Global error handling
│   │
│   └── config/
│       ├── apiConfig.js                # API base URLs, endpoints
│       └── appConfig.js                # App configuration

├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## 2. COMPONENT ORGANIZATION BY TYPE

### 2.1 Common Components (`components/common/`)

These are generic UI components used throughout the app.

| Component | Purpose |
|-----------|---------|
| `AppButton.vue` | Reusable button with variants (primary, secondary, danger) |
| `AppInput.vue` | Text input with validation, error states, and labels |
| `AppTextarea.vue` | Textarea for longer text with character count |
| `AppSelect.vue` | Dropdown select with search and grouping |
| `AppModal.vue` | Modal dialog component with confirmation actions |
| `AppLoader.vue` | Loading spinner/skeleton |
| `AppEmptyState.vue` | Empty state with icon and message |
| `AppErrorMessage.vue` | Error alert component |
| `AppSuccessMessage.vue` | Success notification component |
| `AppPagination.vue` | Pagination controls |
| `RatingStars.vue` | Star rating display (read-only or interactive) |
| `StatusBadge.vue` | Status badge (pending, approved, completed, etc.) |
| `SearchBar.vue` | Search input with debouncing |

### 2.2 Card Components (`components/cards/`)

Data display components for specific entities.

| Component | Purpose |
|-----------|---------|
| `ArtisanCard.vue` | Display artisan in grid (name, rating, services, location) |
| `JobPostCard.vue` | Display job post preview (title, status, service, date) |
| `PortfolioCard.vue` | Display portfolio item (image, title, description) |
| `ReviewCard.vue` | Display review (rating, comment, reviewer name, date) |
| `ServiceRequestCard.vue` | Display service request (status, date, artisan/client, details) |
| `ServiceCard.vue` | Display service/category card |

### 2.3 Form Components (`components/forms/`)

Complex forms for data entry.

| Component | Purpose |
|-----------|---------|
| `ArtisanProfileForm.vue` | Update artisan profile (bio, city, services, experience) |
| `JobPostForm.vue` | Create/edit job post (title, description, service, image) |
| `ServiceRequestForm.vue` | Create service request (service, description, budget) |
| `ReviewForm.vue` | Leave review (rating, comment on completed request) |
| `ReportForm.vue` | Report artisan (reason, description, evidence) |

### 2.4 Filter Components (`components/filters/`)

Search and filter controls.

| Component | Purpose |
|-----------|---------|
| `ArtisanFilterBar.vue` | Filter artisans by service, city, district, rating, price |
| `JobPostFilterBar.vue` | Filter job posts by service, status, date |
| `ServiceFilterBar.vue` | Filter services by category, popularity |

### 2.5 Layout Components (`components/layout/`)

App shell and navigation.

| Component | Purpose |
|-----------|---------|
| `Navbar.vue` | Top navigation with auth state, user menu, role-based items |
| `Sidebar.vue` | Dashboard sidebars for admin/artisan/client spaces |
| `Footer.vue` | App footer with links and info |
| `BreadcrumbNav.vue` | Breadcrumb navigation for deeper pages |

---

## 3. COMPOSABLES (Composition API Logic)

Each composable encapsulates stateful logic for a specific domain.

### 3.1 Auth Composable

```javascript
// composables/useAuth.js
export function useAuth() {
  // State
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Methods
  const login = async (email, password) => { }
  const register = async (formData) => { }
  const logout = async () => { }
  const fetchCurrentUser = async () => { }
  const updateProfile = async (data) => { }
  
  // Computed
  const userRole = computed(() => user.value?.role)
  const isClient = computed(() => userRole.value === 'client')
  const isArtisan = computed(() => userRole.value === 'artisan')
  const isAdmin = computed(() => userRole.value === 'admin')
  
  return {
    user, isAuthenticated, isLoading, error,
    login, register, logout, fetchCurrentUser, updateProfile,
    userRole, isClient, isArtisan, isAdmin
  }
}
```

### 3.2 Artisans Composable

```javascript
// composables/useArtisans.js
export function useArtisans() {
  // State
  const artisans = ref([])
  const currentArtisan = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const filters = ref({ service: '', city: '', district: '', rating: 0 })
  const pagination = ref({ page: 1, perPage: 10, total: 0 })
  
  // Methods
  const fetchArtisans = async (params) => { }
  const fetchArtisanById = async (id) => { }
  const searchArtisans = async (query) => { }
  const applyFilters = async (newFilters) => { }
  
  return {
    artisans, currentArtisan, isLoading, error, filters, pagination,
    fetchArtisans, fetchArtisanById, searchArtisans, applyFilters
  }
}
```

### 3.3 Other Key Composables

- **`useJobPosts.js`** - Fetch, create, update, delete job posts
- **`useServiceRequests.js`** - Manage service requests (create, accept, reject, complete)
- **`useReviews.js`** - Create and fetch reviews
- **`useReports.js`** - Submit and manage reports
- **`useLeaderboard.js`** - Fetch leaderboard data
- **`usePortfolio.js`** - CRUD operations on artisan portfolio
- **`useFormValidation.js`** - Shared validation logic for forms
- **`usePagination.js`** - Pagination state management
- **`useNotifications.js`** - Toast/notification system

---

## 4. API SERVICES (HTTP Communication Layer)

Each service handles API calls for a specific domain. Services use Axios and return Promise responses.

### 4.1 Service Structure Pattern

```javascript
// services/artisanService.js
import api from './api'

export const artisanService = {
  // Public endpoints
  getAll: (params) => api.get('/artisans', { params }),
  getById: (id) => api.get(`/artisans/${id}`),
  search: (query, params) => api.get('/artisans/search', { params: { q: query, ...params } }),
  getLeaderboard: (params) => api.get('/artisans/leaderboard', { params }),
  
  // Authenticated artisan endpoints
  getProfile: () => api.get('/artisan/profile'),
  updateProfile: (data) => api.put('/artisan/profile', data),
  updateServices: (serviceIds) => api.put('/artisan/services', { services: serviceIds }),
  
  // Admin endpoints
  getPending: (params) => api.get('/admin/artisans/pending', { params }),
  approve: (id) => api.post(`/admin/artisans/${id}/approve`),
  ban: (id) => api.post(`/admin/artisans/${id}/ban`)
}
```

### 4.2 Key Services

| Service | Responsibility |
|---------|-----------------|
| `authService.js` | Login, register, logout, password reset |
| `artisanService.js` | Artisan CRUD, profile, leaderboard |
| `serviceService.js` | Service/category CRUD |
| `jobPostService.js` | Job post CRUD, comments, filtering |
| `serviceRequestService.js` | Service request CRUD, status updates |
| `portfolioService.js` | Portfolio item CRUD |
| `reviewService.js` | Review CRUD, ratings |
| `reportService.js` | Report submission and management |
| `leaderboardService.js` | Leaderboard rankings and data |
| `adminService.js` | Admin operations (approve, ban, moderation) |

### 4.3 API Instance (`services/api.js`)

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// Response interceptor - handle auth errors
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 5. PINIA STORES (Global State Management)

Use Pinia stores **minimally** and only for truly global state.

### 5.1 When to Use Stores vs Composables

| Use Case | Recommendation |
|----------|---|
| User authentication state | Store (shared across entire app) |
| Global notifications/toasts | Store (needs to persist across navigation) |
| Local page data (artisans list, current job post) | Composable (scoped to component) |
| Form state | Composable or local component state |
| Filters and pagination | Composable (scoped to page) |

### 5.2 Auth Store

```javascript
// stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isArtisan = computed(() => user.value?.role === 'artisan')
  const isClient = computed(() => user.value?.role === 'client')
  
  const setUser = (userData) => { user.value = userData }
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('auth_token', newToken)
  }
  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }
  
  return {
    user, token, isAuthenticated, isAdmin, isArtisan, isClient,
    setUser, setToken, clearAuth
  }
})
```

### 5.3 Notification Store (Optional)

```javascript
// stores/notificationStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  
  const addNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    notifications.value.push({ id, message, type })
    setTimeout(() => removeNotification(id), duration)
  }
  
  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }
  
  return { notifications, addNotification, removeNotification }
})
```

---

## 6. ROUTER CONFIGURATION

### 6.1 Router Structure (`router/index.js`)

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest, requireRole } from './guards'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(requireAuth)
router.beforeEach(requireRole)

export default router
```

### 6.2 Route Definitions (`router/routes.js`)

```javascript
// Public routes
const publicRoutes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/artisans', name: 'artisans', component: ArtisansPage },
  { path: '/artisans/:id', name: 'artisan-details', component: ArtisanDetailsPage },
  { path: '/services', name: 'services', component: ServicesPage },
  { path: '/job-posts', name: 'job-posts', component: JobPostsPage },
  { path: '/job-posts/:id', name: 'job-post-details', component: JobPostDetailsPage },
  { path: '/leaderboard', name: 'leaderboard', component: LeaderboardPage },
]

// Auth routes
const authRoutes = [
  { path: '/login', name: 'login', component: LoginPage, meta: { layout: 'auth', requiresGuest: true } },
  { path: '/register', name: 'register', component: RegisterPage, meta: { layout: 'auth', requiresGuest: true } },
]

// Client routes
const clientRoutes = [
  { path: '/client/dashboard', name: 'client-dashboard', component: ClientDashboardPage, meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/requests', name: 'my-requests', component: MyRequestsPage, meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/job-posts', name: 'my-job-posts', component: MyJobPostsPage, meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/job-posts/create', name: 'create-job-post', component: CreateJobPostPage, meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/job-posts/:id/edit', name: 'edit-job-post', component: EditJobPostPage, meta: { requiresAuth: true, role: 'client' } },
]

// Artisan routes
const artisanRoutes = [
  { path: '/artisan/dashboard', name: 'artisan-dashboard', component: ArtisanDashboardPage, meta: { requiresAuth: true, role: 'artisan' } },
  { path: '/artisan/profile', name: 'artisan-profile', component: ArtisanProfilePage, meta: { requiresAuth: true, role: 'artisan' } },
  { path: '/artisan/portfolio', name: 'portfolio', component: ArtisanPortfolioPage, meta: { requiresAuth: true, role: 'artisan' } },
  { path: '/artisan/requests', name: 'artisan-requests', component: ArtisanRequestsPage, meta: { requiresAuth: true, role: 'artisan' } },
]

// Admin routes
const adminRoutes = [
  { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardPage, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/artisans/pending', name: 'pending-artisans', component: PendingArtisansPage, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/users', name: 'users', component: UsersPage, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/services', name: 'services-manage', component: ManageServicesPage, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/reports', name: 'reports', component: ManageReportsPage, meta: { requiresAuth: true, role: 'admin' } },
]

const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...clientRoutes,
  ...artisanRoutes,
  ...adminRoutes,
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
]

export default routes
```

### 6.3 Route Guards (`router/guards.js`)

```javascript
import { useAuthStore } from '../stores/authStore'

export const requireAuth = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
}

export const requireRole = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.role && to.meta.role !== authStore.user?.role) {
    return { name: 'home' }
  }
}

export const requireGuest = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'home' }
  }
}
```

---

## 7. LAYOUTS

Layouts are wrappers for different sections of the app.

### 7.1 Layout Strategy

```
DefaultLayout (Public pages)
  └─ Navbar + Footer

AuthLayout (Login/Register)
  └─ Centered form

ClientLayout (Client dashboard)
  └─ Navbar + Sidebar + Footer

ArtisanLayout (Artisan dashboard)
  └─ Navbar + Sidebar + Footer

AdminLayout (Admin dashboard)
  └─ Navbar + Sidebar + Footer
```

### 7.2 Layout Usage in Routes

```javascript
// In routes.js
{
  path: '/client/dashboard',
  component: ClientDashboardPage,
  meta: { layout: 'client', requiresAuth: true, role: 'client' }
}

// In App.vue
<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ClientLayout from '@/layouts/ClientLayout.vue'
// ... other layouts

const layouts = {
  default: DefaultLayout,
  auth: AuthLayout,
  client: ClientLayout,
  artisan: ArtisanLayout,
  admin: AdminLayout
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layouts[layoutName]
})
</script>
```

---

## 8. PAGE COMPONENTS ORGANIZATION

### 8.1 Public Pages (`pages/public/`)

| Page | Route | Features |
|------|-------|----------|
| `HomePage.vue` | `/` | Hero, featured artisans, stats, CTA |
| `ArtisansPage.vue` | `/artisans` | List, search, filters, pagination |
| `ArtisanDetailsPage.vue` | `/artisans/:id` | Profile, portfolio, reviews, contact |
| `ServicesPage.vue` | `/services` | Service list, descriptions |
| `JobPostsPage.vue` | `/job-posts` | List, filters, pagination, public browse |
| `JobPostDetailsPage.vue` | `/job-posts/:id` | Full details, comments, status |
| `LeaderboardPage.vue` | `/leaderboard` | Ranked artisans by rating/performance |

### 8.2 Auth Pages (`pages/auth/`)

| Page | Route | Features |
|------|-------|----------|
| `LoginPage.vue` | `/login` | Email/password form, role selection |
| `RegisterPage.vue` | `/register` | Full form with role-specific fields |

### 8.3 Client Pages (`pages/client/`)

| Page | Route | Features |
|------|-------|----------|
| `ClientDashboardPage.vue` | `/client/dashboard` | Overview, stats, quick actions |
| `MyRequestsPage.vue` | `/client/requests` | Service requests (pending, active, completed) |
| `MyJobPostsPage.vue` | `/client/job-posts` | Client's job posts (CRUD operations) |
| `CreateJobPostPage.vue` | `/client/job-posts/create` | Form to post new job |
| `EditJobPostPage.vue` | `/client/job-posts/:id/edit` | Edit existing job post |
| `SearchArtisansPage.vue` | `/client/search` | Advanced search and filtering |

### 8.4 Artisan Pages (`pages/artisan/`)

| Page | Route | Features |
|------|-------|----------|
| `ArtisanDashboardPage.vue` | `/artisan/dashboard` | Stats, pending requests, recent activity |
| `ArtisanProfilePage.vue` | `/artisan/profile` | Edit profile, bio, services, location |
| `ArtisanPortfolioPage.vue` | `/artisan/portfolio` | View and manage portfolio items |
| `AddPortfolioItemPage.vue` | `/artisan/portfolio/create` | Add new portfolio item |
| `EditPortfolioItemPage.vue` | `/artisan/portfolio/:id/edit` | Edit portfolio item |
| `ArtisanRequestsPage.vue` | `/artisan/requests` | View and manage incoming requests |
| `RequestDetailsPage.vue` | `/artisan/requests/:id` | Request details, accept/reject/complete |
| `JobPostCommentsPage.vue` | `/artisan/job-posts/:id/comments` | Comment on job posts |

### 8.5 Admin Pages (`pages/admin/`)

| Page | Route | Features |
|------|-------|----------|
| `AdminDashboardPage.vue` | `/admin/dashboard` | Overview stats, pending items |
| `PendingArtisansPage.vue` | `/admin/artisans/pending` | Review pending artisans (approve/ban) |
| `UsersPage.vue` | `/admin/users` | List all users, filter, manage |
| `ManageServicesPage.vue` | `/admin/services` | CRUD services/categories |
| `CreateServicePage.vue` | `/admin/services/create` | Create new service |
| `EditServicePage.vue` | `/admin/services/:id/edit` | Edit service |
| `ManageReportsPage.vue` | `/admin/reports` | View and resolve reported content |

---

## 9. UTILS & HELPERS

### 9.1 Formatters (`utils/formatters.js`)

```javascript
export const formatDate = (date) => new Date(date).toLocaleDateString()
export const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD' 
}).format(amount)
export const truncateText = (text, length) => text.length > length ? text.substr(0, length) + '...' : text
```

### 9.2 Validators (`utils/validators.js`)

```javascript
export const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  password: (password) => password.length >= 8,
  phone: (phone) => /^\d{10,}$/.test(phone.replace(/\D/g, '')),
  url: (url) => /^https?:\/\/.+/.test(url)
}
```

### 9.3 Constants (`utils/constants.js`)

```javascript
export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const ARTISAN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  BANNED: 'banned'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  ARTISAN: 'artisan'
}
```

### 9.4 Error Handler (`utils/errorHandler.js`)

```javascript
export const handleApiError = (error) => {
  if (error.response?.status === 422) {
    return error.response.data.errors
  }
  return error.response?.data?.message || 'An error occurred'
}
```

---

## 10. ARCHITECTURE PATTERNS & BEST PRACTICES

### 10.1 Component Pattern

**Rule: Keep components focused and small**

```vue
<template>
  <div class="artisan-card">
    <img :src="artisan.image" :alt="artisan.name" />
    <h3>{{ artisan.name }}</h3>
    <p>{{ artisan.city }}, {{ artisan.district }}</p>
    <RatingStars :rating="artisan.average_rating" />
    <RouterLink :to="`/artisans/${artisan.id}`">View Profile</RouterLink>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import RatingStars from '@/components/common/RatingStars.vue'

defineProps({
  artisan: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.artisan-card {
  /* styles */
}
</style>
```

### 10.2 Composable Pattern

**Rule: Encapsulate logic and state**

```javascript
// composables/useJobPosts.js
import { ref, computed } from 'vue'
import * as jobPostService from '@/services/jobPostService'

export function useJobPosts() {
  const jobPosts = ref([])
  const currentPost = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  const fetchJobPosts = async (params) => {
    isLoading.value = true
    try {
      const response = await jobPostService.getAll(params)
      jobPosts.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }
  
  const createJobPost = async (data) => {
    try {
      return await jobPostService.create(data)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  return {
    jobPosts,
    currentPost,
    isLoading,
    error,
    fetchJobPosts,
    createJobPost
  }
}
```

### 10.3 Page Component Pattern

**Rule: Pages orchestrate, don't contain logic**

```vue
<template>
  <div class="job-posts-page">
    <header>
      <h1>Job Posts</h1>
      <JobPostFilterBar @apply-filters="applyFilters" />
    </header>
    
    <AppLoader v-if="isLoading" />
    <AppErrorMessage v-else-if="error" :message="error" />
    <div v-else class="grid">
      <JobPostCard v-for="post in jobPosts" :key="post.id" :post="post" />
    </div>
    <AppPagination :pagination="pagination" @change-page="goToPage" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useJobPosts } from '@/composables/useJobPosts'
import JobPostFilterBar from '@/components/filters/JobPostFilterBar.vue'
import JobPostCard from '@/components/cards/JobPostCard.vue'

const { jobPosts, isLoading, error, pagination, fetchJobPosts } = useJobPosts()

const applyFilters = async (filters) => {
  await fetchJobPosts({ ...filters, page: 1 })
}

const goToPage = async (page) => {
  await fetchJobPosts({ page })
}

onMounted(() => fetchJobPosts())
</script>
```

### 10.4 Service Pattern

**Rule: Services only handle API communication**

```javascript
// services/jobPostService.js
import api from './api'

export const getAll = (params) => api.get('/job-posts', { params })
export const getById = (id) => api.get(`/job-posts/${id}`)
export const create = (data) => api.post('/job-posts', data)
export const update = (id, data) => api.put(`/job-posts/${id}`, data)
export const delete = (id) => api.delete(`/job-posts/${id}`)
export const addComment = (id, comment) => api.post(`/job-posts/${id}/comments`, { comment })
```

---

## 11. RESPONSIBILITY MATRIX

| Layer | Responsibility | Example |
|-------|-----------------|---------|
| **Page** | Route handler, layout composition | Display job posts list |
| **Composable** | State, computed values, methods | Fetch data, manage filters |
| **Component** | UI rendering, event handling | Render artisan card, handle click |
| **Service** | HTTP requests only | GET /artisans/:id |
| **Store** | Global app state only | Current user, auth token |
| **Backend (Laravel)** | ALL business logic | Ranking algorithm, validation, permissions |

---

## 12. DATA FLOW EXAMPLE

### Example: Browse and Filter Artisans

```
User View (ArtisansPage.vue)
    ↓
User clicks filter button
    ↓
Component emits @apply-filters event
    ↓
Page calls useArtisans().applyFilters()
    ↓
Composable updates state and calls artisanService.getAll()
    ↓
Service calls api.get('/artisans?service=1&city=NYC')
    ↓
Backend (Laravel) processes filters, calculates, returns filtered list
    ↓
Service returns response.data to composable
    ↓
Composable updates artisans ref
    ↓
Component reactive binding re-renders the list
```

---

## 13. SECURITY CONSIDERATIONS

1. **Token Storage**: Store JWT in localStorage (or sessionStorage for extra security)
2. **Token Expiration**: Handle 401 responses in axios interceptor
3. **CORS**: Ensure backend sets proper CORS headers
4. **CSRF**: Use X-CSRF-Token header if needed
5. **Input Validation**: Validate on frontend for UX, rely on backend for security
6. **Authorization**: Never trust frontend role checks, always verify on backend
7. **Sensitive Data**: Never expose secrets in frontend code or env files

---

## 14. PERFORMANCE OPTIMIZATION

1. **Code Splitting**: Use route-based lazy loading
   ```javascript
   const AdminDashboard = () => import('@/pages/admin/AdminDashboardPage.vue')
   ```

2. **Data Caching**: Cache artisan lists, services with timestamps

3. **Pagination**: Always paginate large lists (100+ items)

4. **Debouncing**: Debounce search inputs and filter changes

5. **Image Optimization**: Use proper formats (WebP), lazy load images

6. **Component Optimization**: Use `v-show` for frequent toggles, `v-if` for rare ones

---

## 15. TESTING STRUCTURE (Optional)

```
tests/
├── unit/
│   ├── composables/
│   ├── utils/
│   └── components/
├── integration/
│   └── pages/
└── e2e/
    └── workflows/
```

---

## 16. DEPLOYMENT & ENVIRONMENT

### Environment Variables (`.env.example`)
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=BricoTrust
VITE_APP_ENV=development
```

### Build & Deploy
```bash
npm run build    # Build for production
npm run preview  # Preview build locally
```

---

## 17. TECHNOLOGY STACK SUMMARY

| Technology | Purpose |
|------------|---------|
| Vue 3 | Frontend framework |
| Composition API | State and logic management |
| Vue Router 4 | Routing and navigation |
| Axios | HTTP client |
| Pinia | Global state (minimal use) |
| Tailwind CSS | Styling |
| Vite | Build tool and dev server |
| Vitest | Unit testing (optional) |
| Cypress | E2E testing (optional) |

---

## 18. QUICK START CHECKLIST

- [ ] Set up Vite + Vue 3 project
- [ ] Install dependencies (router, axios, pinia, tailwind)
- [ ] Create folder structure
- [ ] Set up API service and axios interceptors
- [ ] Create route configuration with guards
- [ ] Build layout components
- [ ] Create common UI components
- [ ] Implement auth composable and store
- [ ] Create page stubs for all routes
- [ ] Implement composables for each domain
- [ ] Create API services
- [ ] Add Tailwind CSS configuration
- [ ] Test authentication flow
- [ ] Test role-based routing
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production

---

## 19. FOLDER STRUCTURE VISUALIZATION

```
src/
├── api.js (Axios instance)
├── main.js
├── App.vue
│
├── assets/
├── components/
│   ├── common/
│   ├── cards/
│   ├── forms/
│   ├── filters/
│   └── layout/
├── composables/
├── services/
├── stores/
├── router/
├── layouts/
├── pages/
│   ├── public/
│   ├── auth/
│   ├── client/
│   ├── artisan/
│   └── admin/
├── utils/
└── config/
```

---

## CONCLUSION

This architecture ensures:

✅ **Clean Separation of Concerns**: Vue handles UI, Laravel handles logic  
✅ **Scalability**: Organized folder structure supports growth  
✅ **Reusability**: Components and composables are modular  
✅ **Security**: Auth, role checks, error handling  
✅ **Performance**: Lazy loading, pagination, caching  
✅ **Maintainability**: Clear patterns and responsibilities  

Follow these principles and you'll have a professional, scalable Vue 3 SPA frontend for BricoTrust.
