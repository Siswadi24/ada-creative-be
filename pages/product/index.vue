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
                class="text-gray-600 hover:text-black"
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
          
          <!-- Pagination Controls -->
          <div 
            v-if="products.meta && products.meta.last_page > 1" 
            class="flex justify-center items-center gap-2 my-8"
          >
            <!-- Previous Button -->
            <button
              @click="goToPrevPage"
              :disabled="currentPage <= 1 || isLoadingMore"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="i-lucide-chevron-left" class="text-lg" />
            </button>
            
            <!-- Page Numbers -->
            <div class="flex gap-1">
              <!-- First page -->
              <button
                v-if="currentPage > 3"
                @click="goToPage(1)"
                :disabled="isLoadingMore"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                1
              </button>
              
              <!-- Ellipsis -->
              <span v-if="currentPage > 4" class="px-2 py-2 text-gray-500">...</span>
              
              <!-- Previous page -->
              <button
                v-if="currentPage > 1"
                @click="goToPage(currentPage - 1)"
                :disabled="isLoadingMore"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                {{ currentPage - 1 }}
              </button>
              
              <!-- Current page -->
              <button
                class="px-3 py-2 bg-purple-600 text-white rounded-lg cursor-default"
              >
                {{ currentPage }}
              </button>
              
              <!-- Next page -->
              <button
                v-if="currentPage < products.meta.last_page"
                @click="goToPage(currentPage + 1)"
                :disabled="isLoadingMore"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                {{ currentPage + 1 }}
              </button>
              
              <!-- Ellipsis -->
              <span v-if="currentPage < products.meta.last_page - 3" class="px-2 py-2 text-gray-500">...</span>
              
              <!-- Last page -->
              <button
                v-if="currentPage < products.meta.last_page - 2"
                @click="goToPage(products.meta.last_page)"
                :disabled="isLoadingMore"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                {{ products.meta.last_page }}
              </button>
            </div>
            
            <!-- Next Button -->
            <button
              @click="goToNextPage"
              :disabled="currentPage >= products.meta.last_page || isLoadingMore"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="i-lucide-chevron-right" class="text-lg" />
            </button>
          </div>
          
          <!-- Loading indicator for pagination -->
          <div
            v-if="isLoadingMore"
            class="flex justify-center mt-4"
          >
            <NuxtImg
              src="/assets/loading.gif"
              alt="Loading..."
              class="w-12 h-12"
            />
          </div>
          
          <!-- Page info -->
          <div 
            v-if="products.meta && products.data.length > 0" 
            class="text-center text-gray-500 text-sm mt-4"
          >
            Menampilkan {{ products.meta.per_page }} - {{ products.meta.to }} dari {{ products.meta.total }} produk
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
const showLeftArrow = ref(false);
const showRightArrow = ref(true);
const currentPage = ref(1);
const isLoadingMore = ref(false);

useSeoMeta({
  title: "Grosiin - Produk Grosir Terlengkap",
  ogTitle: "Grosiin - Temukan Produk Terlengkap Hanya di Grosiin",
  description:
    "Temukan berbagai produk grosir berkualitas dengan harga terbaik di Grosiin.",
  keywords: "produk grosir, grosirin, belanja grosir, harga grosir",
});

const { status: statusProducts, data: productsData, refresh: refreshProducts } = useApi(
  "/server/api/products",
  {
    immediate: true,
    query: {
      page: currentPage,
      per_page: 10,
    }
  }
);

const products = computed(() => {
  if (statusProducts.value === "success" && productsData.value) {
    return productsData.value;
  }
  return { data: [], meta: null };
});

const productStore = useProductStore();
watchEffect(() => {
  if (statusProducts.value === "success" && products.value?.data) {
    productStore.setProducts(products.value.data);
  }
});

const visibleProducts = computed(() => {
  return products.value.data || [];
});

// Fetch cart count dari API
const { data: cartData } = await useApi("/server/api/cart", {
  server: false,
  default: () => ({ items: { data: [] } })
});

const countCart = computed(() => {
  return cartData.value?.items?.data?.length || 0;
});

// const handleInfiniteScroll = async () => {
//   // Infinite scroll functionality removed - using pagination instead
// };

// Pagination functions
const goToPage = async (page) => {
  if (page < 1 || page > products.value.meta?.last_page) return;
  
  isLoadingMore.value = true;
  currentPage.value = page;
  
  try {
    await refreshProducts();
  } catch (error) {
    console.error('Error loading page:', error);
  } finally {
    isLoadingMore.value = false;
  }
};

const goToNextPage = () => {
  if (currentPage.value < products.value.meta?.last_page) {
    goToPage(currentPage.value + 1);
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
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
  // Removed infinite scroll event listener

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
  // Removed infinite scroll event listener cleanup
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