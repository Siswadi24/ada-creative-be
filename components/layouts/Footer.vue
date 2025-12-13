<template>
  <footer class="bg-[#10434E] text-white/90">
    <div class="w-full mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Alamat -->
        <div>
          <!-- Logo dari API jika tersedia -->
          <NuxtImg
            v-if="settings.logo_path"
            :src="`${baseUrl}storage/${settings.logo_path}`"
            :alt="settings.site_name || 'Logo Aplikasi'"
            class="mb-4"
            width="120"
            format="webp"
          />

          <!-- Nama aplikasi dinamis -->
          <h3 class="text-lg font-semibold mb-2">
            {{ settings.site_name || "Grosiin" }}
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
            <a href="#"><Icon name="mdi:instagram" /></a>
            <a href="#"><Icon name="mdi:facebook" /></a>
            <a href="#"><Icon name="mdi:linkedin" /></a>
            <a href="#"><Icon name="mdi:youtube" /></a>
            <a :href="settings.whatsapp_link" target="_blank"><Icon name="mdi:whatsapp" /></a>
          </div>
        </div>

        <!-- Tentang Kami -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Tentang Kami</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/contact" class="hover:underline">Kontak</NuxtLink>
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
        © {{ new Date().getFullYear() }} {{ settings.site_name || "Grosiin" }}. All rights reserved
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useApi } from '~/composables/use-api'

const baseUrl = "https://backend-api.alokastore.com/"

const { data: settingsData, pending: settingsPending, error: settingsError } = await useApi("/server/api/settings", {})

const settings = computed(() => {
  const data = settingsData.value?.data || {}
  return {
    ...data,
    site_name: data.site_name || "",
    address: data.address || "",
    logo_path: data.logo_path || "",
    whatsapp_link: data.whatsapp_link || "#"
  }
})
</script>
