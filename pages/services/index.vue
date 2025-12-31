<template>
  <div class="min-h-screen bg-gray-100">
    <UContainer>
      <!-- Header Section -->
      <div class="text-center py-8">
        <div class="mb-4">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-xl">CS</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Customer Support
          </h1>
          <p class="text-gray-600">
            Butuh bantuan? Hubungi kami melalui kontak berikut
          </p>
        </div>
      </div>

      <!-- Services Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
          Layanan Kami
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Icon name="mdi:truck-fast" class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">
                Pengiriman Cepat
              </h3>
            </div>
            <p class="text-gray-600 text-sm">
              Proses pengiriman yang cepat dan terpercaya untuk semua pesanan
              Anda.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Icon name="mdi:shield-check" class="w-6 h-6 text-green-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">
                Produk Original
              </h3>
            </div>
            <p class="text-gray-600 text-sm">
              Semua produk yang kami jual adalah original dan berkualitas
              tinggi.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Icon name="mdi:headset" class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Support 24/7</h3>
            </div>
            <p class="text-gray-600 text-sm">
              Tim support kami siap membantu Anda kapan pun dibutuhkan.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Information Section -->
      <div class="mb-8 pb-3">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
          Hubungi Kami
        </h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Contact Cards -->
            <div class="space-y-4">
              <div
                class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="copyToClipboard(settings.email || '')">
                <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <Icon name="mdi:email" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">Email Support</h4>
                  <p class="text-gray-600 text-sm">{{ settings.email || '' }}</p>
                </div>
                <Icon name="mdi:content-copy" class="w-4 h-4 text-gray-400" />
              </div>

              <div
                class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="copyToClipboard(settings.phone || '')">
                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <Icon name="mdi:whatsapp" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">WhatsApp</h4>
                  <p class="text-gray-600 text-sm">{{ settings.phone || '' }}</p>
                </div>
                <Icon name="mdi:content-copy" class="w-4 h-4 text-gray-400" />
              </div>

              <div class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Icon name="mdi:phone" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">Telepon</h4>
                  <p class="text-gray-600 text-sm">{{ settings.phone || '' }}</p>
                </div>
              </div>
            </div>

            <!-- Social Media Cards -->
            <div class="space-y-4">
              <div
                class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="openLink(settings.instagram_link || '')">
                <div class="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <Icon name="mdi:instagram" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">Instagram</h4>
                  <p class="text-gray-600 text-sm">@aloka.store_</p>
                </div>
                <Icon name="mdi:open-in-new" class="w-4 h-4 text-gray-400" />
              </div>

              <!-- <div
                class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="openLink('https://youtube.com/grosiin')">
                <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <Icon name="mdi:youtube" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">YouTube</h4>
                  <p class="text-gray-600 text-sm">Grosiin Channel</p>
                </div>
                <Icon name="mdi:open-in-new" class="w-4 h-4 text-gray-400" />
              </div> -->

              <div
                class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="openLink(settings.shopee_link || '')">
                <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Icon name="mdi:shopping" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">Shopee</h4>
                  <p class="text-gray-600 text-sm">Aloka.Store</p>
                </div>
                <Icon name="mdi:open-in-new" class="w-4 h-4 text-gray-400" />
              </div>

              <div
                class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                @click="openLink(settings.tiktok_link || '')">
                <div class="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3">
                  <Icon name="mdi:play-circle" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">TikTok</h4>
                  <p class="text-gray-600 text-sm">@aloka.store2</p>
                </div>
                <Icon name="mdi:open-in-new" class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const toast = useToast();
const settingsStore = useSettingsStore();
// Access settings state directly (it's a ref in the store)
const settings = computed(() => settingsStore.settings);

// Fetch settings on mount if not already available
onMounted(async () => {
  if (Object.keys(settings.value).length === 0) {
    await settingsStore.fetchSettings();
  }
});

// Function to copy text to clipboard
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      title: 'Berhasil!',
      description: 'Teks berhasil disalin ke clipboard',
      icon: 'i-heroicons-check-circle',
      color: 'success',
      timeout: 3000
    });
  } catch (err) {
    // console.error("Gagal menyalin teks: ", err);
    toast.add({
      title: 'Gagal!',
      description: 'Tidak dapat menyalin teks ke clipboard',
      icon: 'i-heroicons-x-circle',
      color: 'error',
      timeout: 3000

    });
  }
};

// Function to open external links
const openLink = (url) => {
  window.open(url, "_blank");
  toast.add({
    title: 'Membuka Link',
    description: 'Mengarahkan ke halaman eksternal',
    icon: 'i-heroicons-arrow-top-right-on-square',
    color: 'blue',
    timeout: 2000
  });
};

// SEO Meta
useSeoMeta({
  title: "Customer Support - AlokasStore",
  ogTitle: "Customer Support - AlokasStore",
  description:
    "Hubungi customer support AlokasStore untuk bantuan dan informasi. Tersedia via WhatsApp, Email, Instagram, YouTube, dan Shopee.",
  ogDescription:
    "Hubungi customer support AlokasStore untuk bantuan dan informasi. Tersedia via WhatsApp, Email, Instagram, YouTube, dan Shopee.",
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
