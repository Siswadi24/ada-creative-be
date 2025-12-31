<template>
  <div>
    <nav class="bg-white fixed w-full z-20 top-0 start-0">
      <div v-if="settingsPending" class="bg-gray-100 text-center py-2">
        <p>Memuat pengaturan...</p>
      </div>
      <div v-else-if="settingsError" class="bg-red-500 text-white text-center py-2">
        <p>{{ settingsError }}.</p>
      </div>
      <div v-else class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-1 rtl:space-x-reverse">
          <NuxtImg
            v-if="settings.logo_path"
            :src="`${baseUrl}/storage/${settings.logo_path}`"
            alt="Logo AlokaStore"
            width="120"
            class="object-contain"
            format="webp"
          />
        </a>

        <!-- menu utama -->
        <div
          id="navbar-sticky"
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-2"
        >
          <ul
            class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white"
          >
            <li>
              <NuxtLink
                to="/"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >Beranda</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/product"
                class="block py-2 px-3 text-black/80 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >Produk</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/services"
                class="block py-2 px-3 text-black/80 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >Layanan</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/cart"
                class="block py-2 px-3 text-black/80 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >Keranjang</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/profile"
                class="block py-2 px-3 text-black/80 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >Akun</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const baseUrl = config.public.baseUrl
// const baseUrl = "https://backend-api.alokastore.com/"
const settingsStore = useSettingsStore()

const settingsPending = computed(() => settingsStore.isLoading)
const settingsError = computed(() => settingsStore.error)
const settings = computed(() => settingsStore.settings)

onMounted(async () => {
  if (Object.keys(settingsStore.settings).length === 0) {
    await settingsStore.fetchSettings()
  }
})
</script>

<style scoped>
@reference "~/assets/css/main.css";

.router-link-active {
  @apply text-blue-600 dark:text-blue-500;
}
</style>
