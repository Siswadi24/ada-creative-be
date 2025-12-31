<template>
  <div>
    <SearchView v-if="showSearchView" @back="showSearchView = false" />

    <div v-else>
      <!-- Filter Floating Section -->
      <section>
        <UContainer class="flex justify-center relative">
          <div :class="[isFloating ? floatingClass : normalClass]">
            <div class="flex w-full items-center justify-between">
              <!-- Search Icon -->
              <button
                class="text-gray-600 hover:text-black w-full items-start flex"
                @click="showSearchView = true"
              >
                <Icon name="i-lucide-search" class="text-xl cursor-pointer" />
              </button>

              <!-- Cart Icon -->
              <NuxtLink to="/cart" class="relative hover:text-purple-300">
                <Icon
                  name="i-lucide-shopping-cart"
                  class="text-2xl dark:text-gray-400"
                />
                <span
                  v-if="countCart > 0"
                  class="absolute -top-1 -right-2 text-xs bg-red-600 text-white rounded-full px-1"
                >
                  {{ countCart }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Produk List -->
      <section>
        <UContainer>
          <div
            v-if="statusProducts === 'pending'"
            class="w-full flex flex-col items-center justify-center"
          >
            <NuxtImg src="/assets/loading.gif" alt="Loading" />
            <span class="text-gray-500 text-sm">Memuat produk...</span>
          </div>
          <div
            v-else-if="statusProducts === 'error'"
            class="w-full flex flex-col items-center justify-center my-3"
          >
            <NuxtImg src="/assets/error1.png" format="webp" class="w-full" />
            <span class="text-red-500 text-base">Gagal memuat produk.</span>
          </div>
          <div
            v-else-if="!products.data || products.data.length === 0"
            class="w-full flex flex-col items-center justify-center"
          >
            <NuxtImg
              src="/assets/no-data-found.png"
              format="webp"
              class="w-full object-contain"
            />
            <span class="text-gray-500 text-base"
              >Tidak ada produk yang ditemukan.</span
            >
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-1 my-5">
            <BaseProductCard
              v-for="product in visibleProducts"
              :key="`product-${product.id}`"
              :title="product.name"
              :price="Number(product.price)"
              :discount="0"
              :units="product.unit"
              :stock="product.stock"
              :sale="0"
              :image="product.thumbnail_url || '/assets/no-data-found.png'"
              :slug="product.slug"
            />
          </div>

          <!-- Sentinel Element for Infinite Scroll -->
          <div
            v-if="products.data && visibleCount < products.data.length"
            ref="loadMoreTrigger"
            class="h-10 w-full"
          ></div>

          <div
            v-if="isLoadingMore"
            class="col-span-full flex justify-center mt-4"
          >
            <NuxtImg
              src="/assets/loading.gif"
              alt="Loading more..."
              class="w-12 h-12"
            />
          </div>
        </UContainer>
      </section>
    </div>
  </div>
</template>

<script setup>
import SearchView from "~/components/base/SearchView.vue";
const route = useRoute();
const router = useRouter();
const isFloating = ref(false);
const showSearchView = ref(false);

const scrollContainer = ref(null);
const loadMoreTrigger = ref(null); // Reference for IntersectionObserver
const showLeftArrow = ref(false);
const showRightArrow = ref(true);
const visibleCount = ref(8); // Awalnya tampilkan 8
const increment = 6;
const isLoadingMore = ref(false);
let observer = null;

useSeoMeta({
  title: "AlokaStore - Produk Grosir Terlengkap",
  ogTitle: "AlokaStore - Temukan Produk Terlengkap Hanya di AlokaStore",
  description:
    "Temukan berbagai produk grosir berkualitas dengan harga terbaik di AlokaStore.",
  keywords: "produk grosir, grosirin, belanja grosir, harga grosir",
});

const { status: statusProducts, data: productsData } = useApi(
  "/server/api/products",
  {
    immediate: true,
  }
);

const products = computed(() => {
  if (statusProducts.value === "success") {
    return productsData.value;
  }
  return [];
});

const productStore = useProductStore();
watchEffect(() => {
  if (statusProducts.value === "success" && products.value?.data) {
    productStore.setProducts(products.value.data);
  }
});

const visibleProducts = computed(() => {
  return products.value.data?.slice(0, visibleCount.value) || [];
});

// Fetch cart count dari API
const { data: cartData } = await useApi("/server/api/cart", {
  server: false,
  default: () => ({ items: { data: [] } }),
});

const countCart = computed(() => {
  return cartData.value?.items?.total || 0;
});

const handleInfiniteScroll = async (entries) => {
  const target = entries[0];
  if (
    target.isIntersecting &&
    !isLoadingMore.value &&
    visibleCount.value < products.value.data?.length
  ) {
    isLoadingMore.value = true;

    // simulasi delay loading
    await new Promise((resolve) => setTimeout(resolve, 600));

    visibleCount.value += increment;
    isLoadingMore.value = false;

    // Cek apakah masih perlu load lagi (jika layar belum penuh)
    await nextTick();
    if (loadMoreTrigger.value) {
      const rect = loadMoreTrigger.value.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Sentinel masih terlihat, load lagi
        // Kita panggil observer callback secara manual atau biarkan user scroll
        // Untuk "auto fill", kita bisa panggil rekursif dengan mock entry
        handleInfiniteScroll([{ isIntersecting: true }]);
      }
    }
  }
};

// hanya untuk scroll halaman (bukan kategori)
const handleWindowScroll = () => {
  isFloating.value = window.scrollY > 50;
};

// hanya untuk scroll kategori
const handleCategoryScroll = () => {
  const el = scrollContainer.value;
  if (!el) return;

  const hasOverflow = el.scrollWidth > el.clientWidth;

  showLeftArrow.value = el.scrollLeft > 0;
  showRightArrow.value =
    hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth;
};

const _scrollLeft = () => {
  scrollContainer.value?.scrollBy({ left: -200, behavior: "smooth" });
  setTimeout(() => handleCategoryScroll(), 300);
};

const _scrollRight = () => {
  scrollContainer.value?.scrollBy({ left: 100, behavior: "smooth" });
  setTimeout(() => handleCategoryScroll(), 300);
};

onMounted(() => {
  window.addEventListener("scroll", handleWindowScroll);
  window.addEventListener("resize", handleCategoryScroll);

  // Setup IntersectionObserver
  observer = new IntersectionObserver(handleInfiniteScroll, {
    root: null,
    rootMargin: "200px",
    threshold: 0.1,
  });

  watch(loadMoreTrigger, (newEl, oldEl) => {
    if (oldEl) observer.unobserve(oldEl);
    if (newEl) observer.observe(newEl);
  });

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }

  const hasSearchQuery = route.query.search || route.query.category;
  if (hasSearchQuery) {
    showSearchView.value = true;
  }

  // Pastikan container sudah terlayout sempurna
  nextTick(() => {
    requestAnimationFrame(() => {
      handleCategoryScroll();
    });
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleWindowScroll);
  window.removeEventListener("resize", handleCategoryScroll);
  if (observer) {
    observer.disconnect();
  }
});

// Gunakan posisi top-24 seperti sebelumnya
const floatingClass =
  "fixed top-24 left-1/2 transform -translate-x-1/2 z-30 bg-white/10 backdrop-blur-md text-black dark:text-white border border-white/30 rounded-full px-6 py-3 flex w-3/4 items-center gap-4 shadow-md max-w-3xl transition-all duration-300";

const normalClass =
  "w-full max-w-3xl bg-white/10 backdrop-blur-md text-black dark:text-white border border-white/30 rounded- px-6 py-3 mt-5 flex items-center gap-4 shadow-md transition-all duration-300";
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
