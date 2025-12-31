<template>
  <div
    class="min-h-screen flex flex-col lg:flex-row bg-blue-50 justify-center items-center px-2 lg:px-0"
  >
    <!-- Kiri: Gambar (Hanya tampil saat lg ke atas) -->
    <div class="hidden lg:block lg:w-1/2 h-screen">
      <NuxtImg
        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
        alt="Login Illustration"
        format="webp"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Kanan: Form Login -->
    <div
      class="w-full lg:w-1/2 bg-blue-50 flex items-center justify-center py-10"
    >
      <form
        class="w-full max-w-sm bg-white p-8 rounded shadow-md"
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">
          Masukan Akun Anda
        </h2>

        <!-- ✅ Pesan error umum -->
        <div
          v-if="generalError"
          class="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-4 text-sm"
        >
          {{ generalError }}
        </div>

        <!-- Input Email -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-semibold mb-2"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring text-black/80 focus:border-blue-300"
            placeholder="Masukan email"
          />
          <span v-if="v$.email.$error" class="text-red-500 text-sm mt-1">
            {{ v$.email.$errors[0].$message }}
          </span>
        </div>

        <!-- Input Password -->
        <div class="mb-6 relative">
          <label class="block text-gray-700 text-sm font-semibold mb-2"
            >Kata Sandi</label
          >
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 text-black/80 pr-10"
            placeholder="Masukan password"
          />
          <span v-if="v$.password.$error" class="text-red-500 text-sm mt-1">
            {{ v$.password.$errors[0].$message }}
          </span>
          <button
            type="button"
            class="absolute right-3 top-9 text-sm text-gray-600 cursor-pointer"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "🙈" : "👁️" }}
          </button>
        </div>

        <!-- Tombol -->
        <UButton
          :loading="status === 'pending' || profileStatus === 'pending'"
          type="submit"
          class="w-full justify-center bg-[#FB7A00] hover:bg-[#FB7A00]/80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        >
          Masuk
        </UButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import useVuelidate from "@vuelidate/core";
import { email, minLength, required } from "@vuelidate/validators";

definePageMeta({
  layout: "auth",
});

const session = useSession();
const { profile, token: tokenSession } = storeToRefs(session);
const token = useCookie("access_token");
const nuxtApp = useNuxtApp();

const showPassword = ref(false);
const generalError = ref(""); // ✅ untuk pesan umum API
const form = ref({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(8) },
};

const $externalResult = ref({});
const v$ = useVuelidate(rules, form, {
  $autoDirty: true,
  $externalResult,
});

const { status, execute, error, data } = useSubmit("/server/api/login");
const { execute: getProfile, status: profileStatus } = useApi(
  "/server/api/me",
  {
    immediate: false,
    onResponse({ response }) {
      if (response.ok) {
        profile.value = response._data?.user;
        nuxtApp.runWithContext(() => {
          navigateTo("/profile");
        });
      }
    },
  }
);

async function handleSubmit() {
  generalError.value = ""; // reset pesan umum
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  await execute(form.value);

  if (error.value) {
    // ✅ Tangkap pesan error API
    generalError.value = error.value.message;
    return;
  }

  if (data.value?.access_token) {
    tokenSession.value = data.value.access_token;
    token.value = data.value.access_token;
    getProfile();
  }
}
</script>


<style scoped>
/* Tidak diperlukan styling tambahan untuk NuxtImg */
</style>
