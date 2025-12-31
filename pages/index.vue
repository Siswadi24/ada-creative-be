<template>
  <!-- Page Loading State -->
  <div
    v-if="isPageLoading"
    class="fixed inset-0 bg-white z-50 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"
      ></div>
      <p class="text-lg font-medium text-gray-600">Memuat halaman...</p>
      <p class="text-sm text-gray-400 mt-2">Mohon tunggu sebentar</p>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else>
    <section>
      <UContainer>
        <div
          class="flex flex-col-reverse md:flex-row w-full gap-10 items-center transition-all duration-500 ease-in-out"
        >
          <!-- Kiri (Teks) -->
          <div
            class="w-full md:w-1/4 space-y-6 transition-all duration-500 ease-in-out transform md:translate-x-0 -translate-y-4 opacity-0 animate-title-banner"
          >
            <p class="text-black/85 font-semibold md:pt-10">
              #ResellerAlokaStore
            </p>
            <h1
              class="text-4xl xl:text-5xl font-bold leading-tight text-transparent bg-clip-text animate-gradient bg-gradient-to-r from-black via-orange-500 to-orange-400"
            >
              Bangun Bisnismu Bersama <br />
              Aloka Store
            </h1>
            <p class="text-black/85">
              Aloka Store menghadirkan peluang usaha retail yang mudah dan terus berkembang. Dengan satu kali pendaftaran, Anda mendapatkan akses ke berbagai produk mulai dari kosmetik, aksesoris, dan masih banyak lagi dengan harga termurah.
            </p>
            <div class="flex gap-4">
              <button
                class="px-6 py-3 bg-[#FB7A00] text-white rounded-lg hover:bg-[#d89d31] hover:cursor-pointer"
                @click="handleDaftarReseller"
              >
                Daftar Reseller
              </button>
            </div>
          </div>

          <!-- Kanan (Slider) -->
          <template v-if="filteredBanners.length > 0">
            <FeatureHomepageCarousel :items="filteredBanners" />
          </template>
          <template v-else>
            <NuxtImg src="/assets/no-data-found.png" class="w-full" />
          </template>
        </div>
      </UContainer>
    </section>

    <hr class="border-dashed border-gray-300" />

    <section>
      <UContainer>
        <div>
          <h1 class="text-xl text-center my-10 font-bold text-black/85">
            🔑 Apa Keuntungan Menjadi Reseller Kami?
          </h1>
          <!-- Loading state -->
          <div
            v-if="benefitsData.pending"
            class="flex justify-center items-center py-10"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
            ></div>
          </div>
          <!-- Error state -->
          <div v-else-if="benefitsData.error" class="text-center py-10">
            <p class="text-red-500">
              Gagal memuat data keuntungan. Silakan coba lagi nanti.
            </p>
          </div>
          <!-- Empty state -->
          <div v-else-if="benefits.length === 0" class="text-center py-10">
            <NuxtImg
              format="webp"
              src="/assets/no-data-found.png"
              alt="Tidak ada data keuntungan"
              class="w-64 h-64 object-contain mx-auto"
            />
            <p class="text-gray-500 mt-4">
              Belum ada data keuntungan tersedia saat ini
            </p>
          </div>
          <!-- Benefits items -->
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div
              v-for="(item, index) in benefits"
              :key="'benefit-' + index"
              :class="[
                'p-5 rounded-xl transition-all duration-300 dark:bg-transparent md:bg-white shadow-sm cursor-pointer overflow-hidden',
                'hover:border-2 hover:border-dashed hover:border-bg-[#ffa500]',
                openIndex === index
                  ? 'border-2 border-dashed border-bg-[#ffa500] md:border-none'
                  : '',
              ]"
              @click="toggleDescription(index)"
            >
              <!-- ✅ Gambar -->
              <div v-if="openIndex === index" class="block md:hidden mb-3">
                <NuxtImg
                  format="webp"
                  :src="item.image_url"
                  alt="Gambar mobile"
                  class="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <div class="hidden md:block mb-3">
                <NuxtImg
                  format="webp"
                  :src="item.image_url"
                  alt="Gambar"
                  class="w-full h-40 object-cover rounded-lg"
                />
              </div>

              <!-- ICON + TITLE sejajar di mobile, vertikal di desktop -->
              <div class="flex items-center md:block gap-2">
                <div class="text-purple-600 text-2xl">
                  <Icon :name="item.icon" />
                </div>
                <h3 class="text-lg font-semibold text-black/85">
                  {{ item.title }}
                </h3>
              </div>

              <!-- Garis putus-putus hanya muncul -->
              <div
                v-show="openIndex === index"
                class="border-t border-dashed border-gray-300 mb-2 block md:hidden"
              ></div>
              <div
                class="border-t border-dashed border-gray-300 mb-2 hidden md:block"
              ></div>

              <!-- Deskripsi -->
              <p class="text-base text-black/55 hidden md:block">
                {{ item.description }}
              </p>
              <p
                v-show="openIndex === index"
                class="text-base text-black/55 block md:hidden mt-2"
              >
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <hr class="border-dashed border-gray-300 my-10" />

    <section>
      <UContainer>
        <div
          class="flex justify-between items-center mb-4 animate-product-populer"
        >
          <h1 class="text-xl my-5 font-bold text-black/85">
            Produk {{ productsPopulerDummy?.data?.[0]?.name || "Populer" }}
          </h1>

          <NuxtLink
            to="/product"
            class="flex items-center gap-2 group transition-all duration-300 ease-in-out hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
          >
            <span
              class="text-base text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
              >Lihat Semua
            </span>
            <Icon
              name="i-heroicons-arrow-right"
              class="hidden md:block text-base text-gray-400 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-300 transform group-hover:translate-x-1"
            />
          </NuxtLink>
        </div>
        <div class="product-section-content animate-product-populer">
          <template
            v-if="(productsPopulerDummy?.data?.[0]?.products || []).length > 0"
          >
            <BaseProductCard
              v-for="productPopuler in productsPopulerDummy?.data?.[0]
                ?.products || []"
              :key="`product-${productPopuler.id}`"
              :title="productPopuler.name"
              :price="parseInt(productPopuler.price)"
              :discount="0"
              :units="productPopuler.unit || ''"
              :sale="productPopuler.sale || 0"
              :image="
                productPopuler.thumbnail_url || '/assets/no-data-found.png'
              "
              :slug="`${productPopuler.slug}`"
            />
          </template>
          <template v-else>
            <div class="col-span-full flex justify-center items-center py-10">
              <NuxtImg
                format="webp"
                src="/assets/no-data-found.png"
                alt="Tidak ada produk populer"
                class="w-64 h-64 object-contain"
              />
            </div>
          </template>
        </div>
      </UContainer>
    </section>

    <hr class="border-dashed border-gray-300 my-10" />

    <section id="faq">
      <UContainer>
        <div
          class="flex flex-col text-base text-center my-10 font-medium text-purple-500"
        >
          <h1>Tanya Alokastore?</h1>
          <span class="text-black/80 font-bold text-xl">
            Frequently Asked Question
          </span>
        </div>

        <div class="space-y-4 my-5">
          <!-- Loading state -->
          <div
            v-if="faqData.pending"
            class="flex justify-center items-center py-10"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
            ></div>
          </div>

          <!-- Error state -->
          <div v-else-if="faqData.error" class="text-center py-10">
            <p class="text-red-500">
              Gagal memuat data FAQ. Silakan coba lagi nanti.
            </p>
          </div>

          <!-- Empty state -->
          <div v-else-if="FAQ.length === 0" class="text-center py-10">
            <NuxtImg
              format="webp"
              src="/assets/no-data-found.png"
              alt="Tidak ada FAQ"
              class="w-64 h-64 object-contain mx-auto"
            />
            <p class="text-gray-500 mt-4">Belum ada FAQ tersedia saat ini</p>
          </div>

          <!-- FAQ items -->
          <div
            v-else
            v-for="(item, index) in FAQ"
            :key="'faq-' + index"
            :class="[
              'p-5 rounded-xl transition-all duration-300 dark:bg-transparent md:bg-white shadow-sm cursor-pointer',
              'hover:border-2 hover:border-dashed hover:border-bg-[#ffa500]',
              openIndexFaq === index
                ? 'border-2 border-dashed border-bg-[#ffa500] md:border-none'
                : '',
            ]"
            @click="toggleDescriptionFaq(index)"
          >
            <!-- ICON + TITLE sejajar di mobile, vertikal di desktop -->
            <div class="flex items-center gap-2 mb-2">
              <div class="dark:text-white md:text-purple-600 text-2xl">
                <Icon :name="item.icon" />
              </div>
              <h3 class="text-lg font-semibold text-black/85 md:text-black/80">
                {{ item.title }}
              </h3>
            </div>

            <!-- Garis putus-putus hanya muncul: -->
            <div
              v-show="openIndexFaq === index"
              class="border-t border-dashed border-gray-300 mb-2 block xl:hidden"
            ></div>
            <div
              class="border-t border-dashed border-gray-300 mb-2 hidden xl:block"
            ></div>

            <!-- Deskripsi -->
            <p class="text-base text-black/55 hidden xl:block">
              {{ item.description }}
            </p>
            <p
              v-show="openIndexFaq === index"
              class="text-base text-black/55 block xl:hidden mt-2"
            >
              {{ item.description }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Modal Announcement -->
    <div v-if="announcement && showAnnouncement && modalAnnouncements[0]">
      <FeatureHomepageModal
        :image="modalData.image"
        :title="modalData.title"
        @close="showAnnouncement = false"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "AlokaStore - Partner Reseller",
  description:
    "Bergabunglah dengan AlokaStore sebagai reseller dan nikmati berbagai keuntungan menarik. Dapatkan akses ke produk berkualitas dengan harga khusus.",
  keywords: "reseller, grosirin, partner, produk grosir, bisnis online",
});

const isPageLoading = ref(true);
const router = useRouter();

// Force loading on any page entry - this should be the first thing that happens
if (process.client) {
  isPageLoading.value = true;
}

const timestamp = Date.now();
const {
  data: announcementsData,
  pending: announcementsPending,
  refresh: refreshAnnouncements,
} = await useAsyncData(
  `banners-${timestamp}`,
  () => $fetch("/server/api/announcements"),
  {
    default: () => ({ data: [] }),
    transform: (data) => data || { data: [] },
    server: false,
    lazy: true, // This allows the component to render immediately while data loads
  }
);

const filteredBanners = computed(() => {
  const items = announcementsData.value?.data || [];
  const now = new Date();

  return items
    .filter((item) => {
      if (item.type !== "banner") return false;
      if (!item.is_active) return false;
      if (item.expired_at && new Date(item.expired_at) < now) return false;

      return true;
    })
    .map((item) => item.image_url);
});

const modalAnnouncements = computed(() => {
  const items = announcementsData.value?.data || [];
  const now = new Date();

  return items.filter((item) => {
    if (item.type !== "modal") return false;
    if (!item.is_active) return false;
    if (item.expired_at && new Date(item.expired_at) < now) return false;

    return true;
  });
});

const showAnnouncement = ref(true);
const announcement = computed(() => modalAnnouncements.value.length > 0);

const modalData = computed(() => {
  if (modalAnnouncements.value.length > 0) {
    const data = modalAnnouncements.value[0];
    return {
      title: data.title?.trim() || "Default Title",
      image: data.image_url?.trim() || "",
    };
  }
  return { title: "", image: "" };
});

const openIndex = ref(null);
const openIndexFaq = ref(null);

const {
  data: productsPopulerDummy,
  pending: productsPending,
  refresh: refreshProducts,
} = await useApi("/server/api/popular-categories", {
  default: () => ({ data: [{ name: "Populer", products: [] }] }),
  transform: (data) => data || { data: [{ name: "Populer", products: [] }] },
  server: false,
  lazy: true,
  key: `products-${timestamp}`,
});

const {
  data: benefitsData,
  pending: benefitsPending,
  refresh: refreshBenefits,
} = await useApi("/server/api/benefits", {
  default: () => ({ data: [] }),
  transform: (data) => data || { data: [] },
  server: false,
  lazy: true,
  key: `benefits-${timestamp}`,
});

const {
  data: faqData,
  pending: faqPending,
  refresh: refreshFaq,
} = await useApi("/server/api/faqs", {
  default: () => ({ data: [] }),
  transform: (data) => data || { data: [] },
  server: false,
  lazy: true,
  key: `faq-${timestamp}`,
});

const toggleDescription = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const toggleDescriptionFaq = (index) => {
  openIndexFaq.value = openIndexFaq.value === index ? null : index;
};

function handleDaftarReseller() {
  const getContactInfo = async () => {
    try {
      const settings = await $fetch("/server/api/settings");
      const phone = settings?.data?.phone || "6285800445350";

      let whatsappNumber = phone.toString().trim();
      if (whatsappNumber.startsWith("08")) {
        whatsappNumber = "62" + whatsappNumber.substring(1);
      } else if (!whatsappNumber.startsWith("62")) {
        whatsappNumber = "6285800445350";
      }

      const message =
        "Halo, saya tertarik untuk menjadi reseller. Mohon informasi lebih lanjut.";
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    } catch (error) {
      // console.error("Failed to get contact info:", error);
      // Fallback to manual contact
      const fallbackMessage =
        "Halo, saya tertarik untuk menjadi reseller. Mohon informasi lebih lanjut.";
      const fallbackUrl = `https://wa.me/6285800445350?text=${encodeURIComponent(
        fallbackMessage
      )}`;

      try {
        window.open(fallbackUrl, "_blank");
      } catch (openError) {
        alert("Mohon hubungi kami langsung di WhatsApp: 085800445350");
      }
    }
  };

  getContactInfo();
}

const benefits = computed(() => {
  try {
    const data = benefitsData.value?.data || [];

    const icons = [
      "i-heroicons:user",
      "mdi:certificate",
      "i-heroicons-briefcase",
      "i-heroicons-sparkles",
    ];

    return data.map((item, index) => ({
      icon: icons[index % icons.length],
      title: item.title || "Keuntungan",
      description: item.description || "Deskripsi tidak tersedia",
      image_url: item.image_url
        ? item.image_url.trim()
        : "/assets/no-data-found.png",
    }));
  } catch (error) {
    // console.error("Error processing benefits data:", error);
    return [];
  }
});


const FAQ = computed(() => {
  try {
    const faqs = faqData.value?.data || [];
    return faqs.map((faq) => ({
      icon:
        faq.id % 2 === 0
          ? "mdi:question-mark-circle"
          : "i-heroicons:question-mark-circle",
      title: faq.question || "Pertanyaan",
      description: faq.answer || "Jawaban tidak tersedia",
    }));
  } catch (error) {
    // console.error("Error processing FAQ data:", error);
    return [];
  }
});

router.beforeEach((to, from) => {
  if (to.path === "/") {
    isPageLoading.value = true;
  }
});

// Simplified and more immediate loading management
const checkLoadingState = () => {
  // Only hide loading when ALL data is loaded AND we've shown loading for minimum time
  const allDataLoaded =
    !announcementsPending.value &&
    !productsPending.value &&
    !benefitsPending.value &&
    !faqPending.value;

  if (allDataLoaded) {
    setTimeout(() => {
      isPageLoading.value = false;
    }, 300);
  }
};

// Watch for all API loading states with immediate checking
watch(
  [announcementsPending, productsPending, benefitsPending, faqPending],
  checkLoadingState,
  { immediate: true }
);

// Handle component mounting - ensure loading shows immediately
onMounted(() => {
  isPageLoading.value = true;
  nextTick(() => {
    checkLoadingState();
  });

  setTimeout(() => {
    if (isPageLoading.value) {
      isPageLoading.value = false;
      // console.warn("Loading timeout reached - forcing content display");
    }
  }, 8000);
});

if (process.client) {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && router.currentRoute.value.path === "/") {
      isPageLoading.value = true;
      checkLoadingState();
    }
  });
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

.product-section-content {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 md:gap-3;
  @apply mt-3;
}

@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-title-banner {
  animation: fade-in-down 0.6s ease-out forwards;
}

.animate-slider-banner {
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-product-populer {
  animation: fadeSlideIn 0.5s ease-out both;
}

@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-move 6s ease infinite;
}
</style>