<template>
  <div>
    <nav class="bg-white fixed w-full z-20 top-0 start-0">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-1 rtl:space-x-reverse">
          <NuxtImg
            v-if="settings.logo_path"
            :src="`${baseUrl}storage/${settings.logo_path}`"
            alt="Logo Grosiin"
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
            <!-- <li>
              <NuxtLink
                to="/contact"
                class="block py-2 px-3 text-black/80 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >Kontak</NuxtLink>
            </li> -->
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
import { computed } from "vue"
import { NuxtLink } from "#components"
import { useApi } from "~/composables/use-api"

const baseUrl = "https://api-grosiin.adacreativee.com/"

// ambil data settings dari API (kayak footer)
const { data: settingsData, pending: settingsPending, error: settingsError } =
  await useApi("/server/api/settings", {})

const settings = computed(() => {
  const data = settingsData.value?.data || {}
  return {
    ...data,
    site_name: data.site_name || "Grosiin",
    logo_path: data.logo_path || "",
  }
})
</script>

<style scoped>
@reference "~/assets/css/main.css";

.router-link-active {
  @apply text-blue-600 dark:text-blue-500;
}
</style>
