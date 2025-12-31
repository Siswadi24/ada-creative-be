<template>
  <footer class="bg-[#10434E] text-white/90">
    <div class="max-w-screen-xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Alamat -->
        <div>
          <!-- Logo dari API jika tersedia -->
          <NuxtImg
            v-if="settings.logo_path"
            :src="`${baseUrl}/storage/${settings.logo_path}`"
            :alt="settings.site_name || 'Logo Aplikasi'"
            class="mb-4"
            width="120"
            format="webp"
          />

          <!-- Nama aplikasi dinamis -->
          <h3 class="text-lg font-semibold mb-2">
            {{ settings.site_name || "AlokaStore" }}
          </h3>

          <div v-if="settingsPending" class="text-sm leading-relaxed">
            <p>Memuat alamat...</p>
          </div>
          <div v-else-if="settingsError" class="text-sm leading-relaxed text-red-300">
            <p>Gagal memuat alamat.</p>
          </div>
          <p v-else class="text-sm leading-relaxed">
            {{ settings.address }}
          </p>

          <div class="flex gap-4 mt-4 text-white text-xl">
            <a :href="settings.whatsapp_link" target="_blank"><Icon name="mdi:instagram" /></a>
            <a :href="settings.whatsapp_link" target="_blank"><Icon name="mdi:whatsapp" /></a>
            <a :href="settings.tiktok_link" target="_blank"><Icon name="mdi:music-note" /></a>
            <a :href="settings.shopee_link" target="_blank"><Icon name="mdi:shopify" /></a>
          </div>
        </div>

        <!-- Tentang Kami -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Tentang Kami</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/services" class="hover:underline">Layanan</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/product" class="hover:underline">Produk</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Informasi Lainnya -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Informasi Lainnya</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:underline">Jadi Suplier</a></li>
            <li><NuxtLink to="#faq" class="hover:underline">FAQ</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="text-center text-sm mt-10 border-t border-white/20 pt-4">
        © {{ new Date().getFullYear() }} {{ settings.site_name || "AlokaStore" }}. All rights reserved
      </div>
    </div>
  </footer>
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
