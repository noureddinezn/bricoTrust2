<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
    <div class="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex min-w-0 items-center gap-2 text-xl font-bold text-blue-600 sm:text-2xl" @click="closeMobileMenu">
        <FontAwesomeIcon icon="screwdriver-wrench" class="h-8 w-8 text-blue-500" />
        <span class="truncate">BricoTrust</span>
      </RouterLink>

      <nav class="hidden items-center gap-8 lg:flex">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 text-[15px] font-semibold text-slate-500 transition hover:text-slate-900"
          :class="route.path === item.to ? 'text-slate-900' : ''"
          @click="closeMobileMenu"
        >
          <FontAwesomeIcon :icon="item.icon" class="text-base" :class="item.iconColor" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6 lg:flex">
        <template v-if="!isLoggedIn">
          <RouterLink
            to="/login"
            class="flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            @click="closeMobileMenu"
          >
            <FontAwesomeIcon icon="right-to-bracket" class="text-slate-400" />
            <span>Login</span>
          </RouterLink>

          <RouterLink
            to="/register"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
            @click="closeMobileMenu"
          >
            <FontAwesomeIcon icon="user-plus" />
            <span>Register</span>
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink
            v-if="profileLink"
            :to="profileLink"
            class="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:flex"
            @click="closeMobileMenu"
          >
            <span class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-white">
              <img
                v-if="profileImageUrl"
                :src="profileImageUrl"
                :alt="`${currentUser?.name || 'User'} profile photo`"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ userInitial }}</span>
            </span>
            <span>{{ currentUser?.name }}</span>
          </RouterLink>

          <div v-else class="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 sm:flex">
            <span class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-white">
              <img
                v-if="profileImageUrl"
                :src="profileImageUrl"
                :alt="`${currentUser?.name || 'User'} profile photo`"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ userInitial }}</span>
            </span>
            <span>{{ currentUser?.name }}</span>
          </div>

          <button
            type="button"
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="onLogout"
          >
            Logout
          </button>
        </template>
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <RouterLink
          v-if="isLoggedIn && profileLink"
          :to="profileLink"
          class="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-700"
          @click="closeMobileMenu"
        >
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            :alt="`${currentUser?.name || 'User'} profile photo`"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ userInitial }}</span>
        </RouterLink>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          aria-label="Toggle navigation menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <FontAwesomeIcon :icon="mobileMenuOpen ? 'xmark' : 'bars'" class="text-xl" />
        </button>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="border-t border-slate-200 bg-white lg:hidden">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <nav class="flex flex-col gap-2">
          <RouterLink
            v-for="item in navigationItems"
            :key="`mobile-${item.to}`"
            :to="item.to"
            class="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            :class="route.path === item.to ? 'bg-slate-100 text-slate-900' : ''"
            @click="closeMobileMenu"
          >
            <span class="flex items-center gap-3">
              <FontAwesomeIcon :icon="item.icon" class="text-base" :class="item.iconColor" />
              <span>{{ item.label }}</span>
            </span>
            <FontAwesomeIcon icon="chevron-right" class="text-slate-300" />
          </RouterLink>
        </nav>

        <div class="mt-4 border-t border-slate-200 pt-4">
          <template v-if="!isLoggedIn">
            <div class="grid gap-3 sm:grid-cols-2">
              <RouterLink
                to="/login"
                class="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="closeMobileMenu"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="closeMobileMenu"
              >
                Register
              </RouterLink>
            </div>
          </template>

          <template v-else>
            <div class="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <span class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-white">
                <img
                  v-if="profileImageUrl"
                  :src="profileImageUrl"
                  :alt="`${currentUser?.name || 'User'} profile photo`"
                  class="h-full w-full object-cover"
                />
                <span v-else>{{ userInitial }}</span>
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">{{ currentUser?.name }}</p>
                <p class="text-xs uppercase tracking-[0.16em] text-slate-500">{{ currentUser?.role || 'user' }}</p>
              </div>
            </div>

            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              <RouterLink
                v-if="profileLink"
                :to="profileLink"
                class="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="closeMobileMenu"
              >
                My Profile
              </RouterLink>
              <button
                type="button"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="onLogout"
              >
                Logout
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { fetchCurrentUser, getUser, isAuthenticated, logout, resolveAssetUrl } from '../../api';

const route = useRoute();
const router = useRouter();

const currentUser = ref(getUser());
const isLoggedIn = ref(isAuthenticated());
const mobileMenuOpen = ref(false);

const navigationItems = computed(() => {
  const baseItems = [
    { to: '/', label: 'Home', icon: 'house', iconColor: 'text-slate-400' },
    { to: '/artisans', label: 'Artisans', icon: 'users', iconColor: 'text-slate-400' },
    { to: '/services', label: 'Services', icon: 'screwdriver-wrench', iconColor: 'text-slate-400' },
    { to: '/job-posts', label: 'Job Posts', icon: 'briefcase', iconColor: 'text-slate-400' },
    { to: '/leaderboard', label: 'Leaderboard', icon: 'ranking-star', iconColor: 'text-amber-500' },
  ];

  if (currentUser.value?.role === 'client') {
    baseItems.splice(4, 0, { to: '/my-requests', label: 'My Requests', icon: 'clipboard-list', iconColor: 'text-blue-500' });
  }

  if (currentUser.value?.role === 'artisan') {
    baseItems.splice(4, 0, { to: '/artisan/requests', label: 'Requests', icon: 'clipboard-list', iconColor: 'text-blue-500' });
  }

  return baseItems;
});

const userInitial = computed(() => (currentUser.value?.name ? currentUser.value.name.charAt(0).toUpperCase() : 'U'));
const profileImageUrl = computed(() => resolveAssetUrl(currentUser.value?.artisan?.profile_image));
const profileLink = computed(() => {
  if (currentUser.value?.role !== 'artisan') {
    return null;
  }

  return '/my-profile';
});

const refreshCurrentUser = async () => {
  if (!isAuthenticated()) {
    return;
  }

  try {
    currentUser.value = await fetchCurrentUser();
    isLoggedIn.value = true;
  } catch {
    currentUser.value = getUser();
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

watch(
  () => route.fullPath,
  () => {
    currentUser.value = getUser();
    isLoggedIn.value = isAuthenticated();
    closeMobileMenu();
  },
  { immediate: true },
);

onMounted(refreshCurrentUser);

const onLogout = async () => {
  try {
    await logout();
  } finally {
    currentUser.value = null;
    isLoggedIn.value = false;
    await router.push('/login');
  }
};
</script>
