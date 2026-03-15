<template>
  <section class="auth-page">
    <h2>Create Account</h2>
    <p class="subtitle">Register as a client or artisan.</p>

    <form class="auth-form" @submit.prevent="onSubmit">
      <label for="name">Full Name</label>
      <input id="name" v-model="form.name" type="text" required />

      <label for="email">Email</label>
      <input id="email" v-model="form.email" type="email" required />

      <label for="phone">Phone (optional)</label>
      <input id="phone" v-model="form.phone" type="text" />

      <label for="role">Role</label>
      <select id="role" v-model="form.role" required>
        <option value="client">Client</option>
        <option value="artisan">Artisan</option>
      </select>

      <section class="artisan-section">
        <div class="artisan-section__header">
          <h3>Artisan location</h3>
          <p>
            City and district are required for artisan accounts and stay visible below for easy access.
          </p>
        </div>

        <label for="city">
          City
          <span v-if="form.role === 'artisan'" class="required-mark">*</span>
        </label>
        <input id="city" v-model.trim="form.city" type="text" :required="form.role === 'artisan'" placeholder="Enter your city" />

        <label for="district">
          District
          <span v-if="form.role === 'artisan'" class="required-mark">*</span>
        </label>
        <input id="district" v-model.trim="form.district" type="text" :required="form.role === 'artisan'" placeholder="Enter your district" />

        <template v-if="form.role === 'artisan'">
          <label for="experience">Experience Years</label>
          <input id="experience" v-model.number="form.experience_years" type="number" min="0" />

          <label for="bio">Bio (optional)</label>
          <textarea id="bio" v-model.trim="form.bio" rows="3" />
        </template>
      </section>

      <label for="password">Password</label>
      <input id="password" v-model="form.password" type="password" minlength="8" required />

      <label for="passwordConfirmation">Confirm Password</label>
      <input
        id="passwordConfirmation"
        v-model="form.password_confirmation"
        type="password"
        minlength="8"
        required
      />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Register' }}
      </button>
    </form>

    <ul v-if="validationErrors.length" class="errors">
      <li v-for="item in validationErrors" :key="item">{{ item }}</li>
    </ul>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <p class="helper-text">
      Already have an account?
      <RouterLink to="/login">Login</RouterLink>
    </p>
  </section>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { register } from '../../api';

const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'client',
  city: '',
  district: '',
  bio: '',
  experience_years: 0,
  password: '',
  password_confirmation: '',
});

const loading = ref(false);
const error = ref('');
const message = ref('');
const validationErrors = ref([]);

const resetArtisanFields = () => {
  form.city = '';
  form.district = '';
  form.bio = '';
  form.experience_years = 0;
};

const toValidationList = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return [];
  }

  return Object.values(errors).flat();
};

watch(
  () => form.role,
  (role) => {
    if (role !== 'artisan') {
      resetArtisanFields();
    }
  }
);

const onSubmit = async () => {
  error.value = '';
  message.value = '';
  validationErrors.value = [];

  if (form.role === 'artisan') {
    const artisanValidationErrors = [];

    if (!form.city.trim()) {
      artisanValidationErrors.push('City is required when registering as an artisan.');
    }

    if (!form.district.trim()) {
      artisanValidationErrors.push('District is required when registering as an artisan.');
    }

    if (artisanValidationErrors.length > 0) {
      validationErrors.value = artisanValidationErrors;
      error.value = 'Please complete the artisan profile fields before registering.';
      return;
    }
  }

  loading.value = true;

  try {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      role: form.role,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    if (form.role === 'artisan') {
      payload.city = form.city;
      payload.district = form.district;
      payload.bio = form.bio || null;
      payload.experience_years = form.experience_years ?? 0;
    }

    const response = await register(payload);

    message.value = response.message || 'Account created successfully.';

    await router.push('/');
  } catch (err) {
    const response = err?.response?.data;

    validationErrors.value = toValidationList(response?.errors);
    error.value = response?.message || 'Registration failed. Please check your data.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  max-width: 520px;
}

.artisan-note {
  margin-top: -0.2rem;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  font-size: 0.92rem;
}

.artisan-section {
  margin-top: 0.25rem;
  padding: 0.9rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  display: grid;
  gap: 0.6rem;
}

.artisan-section__header {
  display: grid;
  gap: 0.25rem;
}

.artisan-section__header h3 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.artisan-section__header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.92rem;
}

.required-mark {
  color: #dc2626;
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

input,
select,
textarea {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
}

button {
  margin-top: 0.4rem;
  border: 0;
  border-radius: 8px;
  background: #111827;
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
