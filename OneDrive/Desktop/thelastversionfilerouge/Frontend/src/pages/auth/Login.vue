<template>
  <main class="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
      <section class="w-full rounded-3xl bg-white px-6 py-10 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:px-8">
        <header class="mb-8 text-center">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Login</h1>
          <p class="mt-2 text-sm text-slate-500">Access your BricoTrust account</p>
        </header>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <p v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {{ error }}
          </p>

          <div class="space-y-2">
            <label for="email" class="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="mohammed@gmail.com"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
            />
          </div>

          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            <span>Remember me</span>
          </label>

          <button
            type="submit"
            class="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-600">
          Don't have an account?
          <RouterLink to="/register" class="font-semibold text-slate-900 hover:underline">Register</RouterLink>
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { login } from '../../api';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const error = ref('');

const form = reactive({
  email: '',
  password: '',
  remember: false,
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await login({
      email: form.email,
      password: form.password,
      remember: form.remember,
    });

    const redirectTo = route.query.redirect?.toString() || '/';
    await router.push(redirectTo);
  } catch (exception) {
    error.value = exception?.response?.data?.message || 'Invalid login credentials.';
  } finally {
    loading.value = false;
  }
};
</script>
