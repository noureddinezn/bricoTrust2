<template>
  <main class="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
      <section class="w-full rounded-3xl bg-white px-6 py-10 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:px-8">
        <header class="mb-8 text-center">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Create Account</h1>
          <p class="mt-2 text-sm text-slate-500">Join BricoTrust and start connecting with trusted artisans</p>
        </header>

        <form class="space-y-5" @submit.prevent="handleRegister">
          <p v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {{ error }}
          </p>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700" for="name">Full Name</label>
            <input
              id="name"
              v-model.trim="form.name"
              type="text"
              required
              autocomplete="name"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
            />
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700" for="email">Email Address</label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                required
                autocomplete="email"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700" for="phone">Phone Number</label>
              <input
                id="phone"
                v-model.trim="form.phone"
                type="tel"
                autocomplete="tel"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700" for="role">Account Type</label>
            <select
              id="role"
              v-model="form.role"
              required
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
            >
              <option value="" disabled>Choose your role</option>
              <option value="client">Client</option>
              <option value="artisan">Artisan</option>
            </select>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="mb-3 space-y-1">
              <h2 class="text-sm font-semibold text-slate-900">Artisan location</h2>
              <p class="text-sm text-slate-500">
                If you choose artisan, city and district are required and must be filled before registration.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700" for="city">
                  City
                  <span v-if="form.role === 'artisan'" class="text-red-600">*</span>
                </label>
                <input
                  id="city"
                  v-model.trim="form.city"
                  type="text"
                  :required="form.role === 'artisan'"
                  autocomplete="address-level2"
                  placeholder="Enter your city"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700" for="district">
                  District
                  <span v-if="form.role === 'artisan'" class="text-red-600">*</span>
                </label>
                <input
                  id="district"
                  v-model.trim="form.district"
                  type="text"
                  :required="form.role === 'artisan'"
                  autocomplete="address-level3"
                  placeholder="Enter your district"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700" for="password">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="new-password"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700" for="password_confirmation">Confirm Password</label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                required
                autocomplete="new-password"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            class="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-600">
          Already have an account?
          <RouterLink to="/login" class="font-semibold text-slate-900 hover:underline">Login</RouterLink>
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { register } from '../../api';

const router = useRouter();

const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: '',
  city: '',
  district: '',
  password: '',
  password_confirmation: '',
});

const clearArtisanFields = () => {
  form.city = '';
  form.district = '';
};

watch(
  () => form.role,
  (role) => {
    if (role !== 'artisan') {
      clearArtisanFields();
    }
  }
);

const handleRegister = async () => {
  if (form.password !== form.password_confirmation) {
    error.value = 'Passwords do not match.';
    return;
  }

  if (form.role === 'artisan' && (!form.city.trim() || !form.district.trim())) {
    error.value = 'City and district are required when registering as an artisan.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      password: form.password,
      password_confirmation: form.password_confirmation,
      ...(form.role === 'artisan'
        ? {
            city: form.city,
            district: form.district,
          }
        : {}),
    });

    await router.push('/');
  } catch (exception) {
    error.value = exception?.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
