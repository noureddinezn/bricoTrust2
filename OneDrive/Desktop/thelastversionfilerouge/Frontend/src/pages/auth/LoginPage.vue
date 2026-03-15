<template>
  <section class="auth-page">
    <h2>Welcome Back</h2>
    <p class="subtitle">Login to continue to your dashboard.</p>

    <form class="auth-form" @submit.prevent="onSubmit">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        placeholder="you@example.com"
        required
      />

      <label for="password">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        placeholder="Your password"
        required
      />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <ul v-if="validationErrors.length" class="errors">
      <li v-for="item in validationErrors" :key="item">{{ item }}</li>
    </ul>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <p class="helper-text">
      New here?
      <RouterLink to="/register">Create an account</RouterLink>
    </p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { login } from '../../api';

const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');
const message = ref('');
const validationErrors = ref([]);

const toValidationList = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return [];
  }

  return Object.values(errors).flat();
};

const onSubmit = async () => {
  loading.value = true;
  error.value = '';
  message.value = '';
  validationErrors.value = [];

  try {
    const response = await login({
      email: form.email,
      password: form.password,
    });

    message.value = response.message || 'Logged in successfully.';

    // Navigate to admin dashboard for admin users, otherwise go home.
    if (response.user?.role === 'admin') {
      await router.push('/admin/dashboard');
      return;
    }

    await router.push('/');
  } catch (err) {
    const response = err?.response?.data;

    validationErrors.value = toValidationList(response?.errors);
    error.value = response?.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  max-width: 440px;
}

.subtitle {
  margin-top: 0.25rem;
  color: #6b7280;
}

.auth-form {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
}

button {
  margin-top: 0.4rem;
  border: 0;
  border-radius: 8px;
  background: #1f2937;
  color: #ffffff;
  padding: 0.7rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: default;
}

.errors {
  margin-top: 0.9rem;
  color: #b91c1c;
  padding-left: 1rem;
}

.success {
  margin-top: 0.9rem;
  color: #166534;
}

.error {
  margin-top: 0.9rem;
  color: #b91c1c;
}

.helper-text {
  margin-top: 1rem;
  color: #4b5563;
}
</style>
