import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/public/HomePage.vue';
import ArtisansPage from '../pages/public/ArtisansPage.vue';
import ArtisanDetailsPage from '../pages/public/ArtisanDetailsPage.vue';
import LeaderboardPage from '../pages/public/LeaderboardPage.vue';
import ServicesPage from '../pages/public/ServicesPage.vue';
import JobPostsPage from '../pages/public/JobPostsPage.vue';
import JobPostDetailsPage from '../pages/public/JobPostDetailsPage.vue';
import Login from '../pages/auth/Login.vue';
import Register from '../pages/auth/Register.vue';
import DashboardPage from '../pages/admin/DashboardPage.vue';
import ArtisanProfilePage from '../pages/artisan/ArtisanProfilePage.vue';
import MyArtisanProfilePage from '../pages/artisan/MyArtisanProfilePage.vue';
import ArtisanPortfolioPage from '../pages/artisan/ArtisanPortfolioPage.vue';
import PortfolioCreatePage from '../pages/artisan/PortfolioCreatePage.vue';
import PortfolioEditPage from '../pages/artisan/PortfolioEditPage.vue';
import CreateJobPostPage from '../pages/client/CreateJobPostPage.vue';
import MyJobPostsPage from '../pages/client/MyJobPostsPage.vue';
import JobPostEditPage from '../pages/client/JobPostEditPage.vue';
import CreateServiceRequestPage from '../pages/client/CreateServiceRequestPage.vue';
import MyRequestsPage from '../pages/client/MyRequestsPage.vue';
import ArtisanRequestsPage from '../pages/artisan/ArtisanRequestsPage.vue';
import ManageReportsPage from '../pages/admin/ManageReportsPage.vue';
import ManageServicesPage from '../pages/admin/ManageServicesPage.vue';
import CreateServicePage from '../pages/admin/CreateServicePage.vue';
import EditServicePage from '../pages/admin/EditServicePage.vue';
import PendingArtisansPage from '../pages/admin/PendingArtisansPage.vue';
import UsersPage from '../pages/admin/UsersPage.vue';
import { getUser, isAuthenticated } from '../api';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/artisans', name: 'artisans', component: ArtisansPage },
    { path: '/artisans/:id', name: 'artisan-details', component: ArtisanDetailsPage, props: true },
    { path: '/artisans/:id/portfolio', name: 'artisan-portfolio', component: ArtisanPortfolioPage, props: true },
    { path: '/leaderboard', name: 'leaderboard', component: LeaderboardPage },
    { path: '/services', name: 'services', component: ServicesPage },
    { path: '/job-posts', name: 'job-posts', component: JobPostsPage },
    { path: '/job-posts/:id', name: 'job-post-details', component: JobPostDetailsPage, props: true },
    { path: '/service-requests/create/:id', name: 'service-request-create', component: CreateServiceRequestPage, meta: { requiresAuth: true, requiresClient: true }, props: true },
    { path: '/my-requests', name: 'my-requests', component: MyRequestsPage, meta: { requiresAuth: true, requiresClient: true } },
    { path: '/login', name: 'login', component: Login, meta: { publicOnly: true } },
    { path: '/register', name: 'register', component: Register, meta: { publicOnly: true } },
    {
      path: '/my-profile',
      name: 'my-profile',
      component: MyArtisanProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/artisan/profile/edit',
      name: 'artisan-profile-edit',
      component: ArtisanProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/portfolio/create',
      name: 'portfolio-create',
      component: PortfolioCreatePage,
      meta: { requiresAuth: true, requiresArtisan: true },
    },
    {
      path: '/portfolio/:id/edit',
      name: 'portfolio-edit',
      component: PortfolioEditPage,
      meta: { requiresAuth: true, requiresArtisan: true },
      props: true,
    },
    {
      path: '/job-posts/create',
      name: 'job-post-create',
      component: CreateJobPostPage,
      meta: { requiresAuth: true, requiresClient: true },
    },
    {
      path: '/job-posts/:id/edit',
      name: 'job-post-edit',
      component: JobPostEditPage,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/job-posts/my',
      name: 'my-job-posts',
      component: MyJobPostsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/artisan/requests',
      name: 'artisan-requests',
      component: ArtisanRequestsPage,
      meta: { requiresAuth: true, requiresArtisan: true },
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/artisans/pending',
      name: 'admin-artisans-pending',
      component: PendingArtisansPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: UsersPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/reports',
      name: 'admin-reports',
      component: ManageReportsPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/services',
      name: 'admin-services',
      component: ManageServicesPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/services/create',
      name: 'admin-services-create',
      component: CreateServicePage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/services/:id/edit',
      name: 'admin-services-edit',
      component: EditServicePage,
      meta: { requiresAuth: true, requiresAdmin: true },
      props: true,
    },
  ],
});

router.beforeEach((to) => {
  const authenticated = isAuthenticated();
  const user = getUser();

  if (to.meta.publicOnly && authenticated) {
    return { path: '/' };
  }

  if (to.meta.requiresAuth && !authenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    return { path: '/' };
  }

  if (to.meta.requiresClient && user?.role !== 'client') {
    return { path: '/job-posts' };
  }

  if (to.meta.requiresArtisan && user?.role !== 'artisan') {
    return { path: '/artisans' };
  }

  return true;
});

export default router;
