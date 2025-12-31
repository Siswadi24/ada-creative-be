<template>
  <div
    class="fixed inset-0 z-50 bg-gray-50 flex flex-col min-h-screen overflow-hidden"
  >
    <!-- Header Section (Sticky) -->
    <div class="bg-white shadow-sm z-20">
      <UContainer class="py-4">
        <!-- Search Bar Row -->
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="gray"
            class="-ml-2"
            @click="handleBack"
          />

          <div class="flex-1 relative group">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors"
              />
            </div>
            <input
              v-model="keyword"
              type="text"
              class="block w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200"
              placeholder="Cari produk impianmu..."
              @keyup.enter="emitSearch"
              autoFocus
            />
            <button
              v-if="keyword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              @click="keyword = ''"
            >
              <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
            </button>
          </div>

          <UButton
            color="primary"
            variant="solid"
            class="hidden sm:flex px-6 rounded-xl"
            :loading="loading"
            @click="emitSearch"
          >
            Cari
          </UButton>
        </div>

        <!-- Category Filters (Horizontal Scroll) -->
        <div
          class="mt-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide"
        >
          <div class="flex items-center gap-2 pb-2 min-w-max">
            <button
              v-for="item in categoryItems"
              :key="item.id || 'all'"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
              :class="[
                selectedCategory?.id === item.id ||
                (!selectedCategory && item.id === null)
                  ? 'bg-primary-50 text-primary-600 border-primary-200 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              ]"
              @click="selectCategory(item)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content Area (Scrollable) -->
    <div class="flex-1 overflow-y-auto scroll-smooth">
      <UContainer class="py-6 pb-20">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-20 space-y-4"
        >
          <div class="relative w-20 h-20">
            <div
              class="absolute inset-0 rounded-full border-4 border-gray-100"
            ></div>
            <div
              class="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"
            ></div>
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse"
            />
          </div>
          <p class="text-gray-500 animate-pulse font-medium">
            Sedang mencari produk...
          </p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="results.length === 0 && hasSearched"
          class="flex flex-col items-center justify-center py-16 text-center px-4"
        >
          <div class="bg-gray-100 p-6 rounded-full mb-4">
            <UIcon
              name="i-heroicons-face-frown"
              class="w-16 h-16 text-gray-400"
            />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            Produk tidak ditemukan
          </h3>
          <p class="text-gray-500 max-w-xs mx-auto">
            Maaf, kami tidak dapat menemukan produk dengan kata kunci "<span
              class="font-semibold text-gray-900"
              >{{ keyword }}</span
            >". Coba gunakan kata kunci lain.
          </p>
        </div>

        <!-- Initial State / Recommendations (Optional) -->
        <div
          v-else-if="!hasSearched && results.length === 0"
          class="flex flex-col items-center justify-center py-20 opacity-50"
        >
          <UIcon
            name="i-heroicons-magnifying-glass"
            class="w-24 h-24 text-gray-200 mb-4"
          />
          <p class="text-gray-400 text-lg">Mulai pencarian Anda</p>
        </div>

        <!-- Search Results -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
        >
          <BaseProductCard
            v-for="product in results"
            :key="`product-${product.id}`"
            :title="product.name"
            :price="Number(product.price)"
            :discount="0"
            :units="product.unit"
            :stock="product.stock"
            :sale="0"
            :image="product.thumbnail_url || '/assets/no-data-found.png'"
            :slug="product.slug"
            class="h-full"
          />
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["back"]);

const route = useRoute();
const router = useRouter();

const keyword = ref("");
const selectedCategory = ref(null);
const results = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
const categoryItems = ref([]);
const isInitializing = ref(true);

// Helper to select category
const selectCategory = (item) => {
  selectedCategory.value = item;
  // Optional: Auto trigger search when category changes
  // emitSearch(); 
};

async function fetchCategories() {
  try {
    const data = await $fetch("server/api/categories");

    if (data && Array.isArray(data.data)) {
      categoryItems.value = [
        { label: "Semua", id: null },
        ...data.data.map((cat) => ({
          label: cat.name,
          id: cat.id,
          slug: cat.slug,
        })),
      ];
      // Set default selected category to "Semua" if none selected
      // if (!selectedCategory.value) {
      //   selectedCategory.value = categoryItems.value[0];
      // }
      return true;
    }

    return false;
  } catch (error) {
    return error;
  }
}

async function emitSearch() {
  // Prevent empty search if desired, or allow "View All"
  // const hasKeyword = keyword.value.trim().length > 0;
  // const hasCategory = selectedCategory.value && selectedCategory.value.id !== null;
  
  // if (!hasKeyword && !hasCategory) return;

  loading.value = true;
  hasSearched.value = true;

  const params = {};
  if (keyword.value.trim()) {
    params.search = keyword.value.trim();
  }

  if (selectedCategory.value && selectedCategory.value.id !== null) {
    params.category = selectedCategory.value.id;
  }

  try {
    const data = await $fetch("/server/api/products", { params });
    results.value = data?.data || [];
  } catch (err) {
    // console.error(err);
    results.value = [];
  } finally {
    loading.value = false;
  }

  // Update URL silently
  router.replace({
    query: {
      ...(params.search && { search: params.search }),
      ...(params.category && { category: params.category }),
    },
  });
}

function handleBack() {
  router.push("/product");
  emit("back");
}

// Watchers for better UX (Optional: Auto search on category change)
watch(selectedCategory, (newVal, oldVal) => {
  if (isInitializing.value) return;
  if (newVal?.id !== oldVal?.id) {
    emitSearch();
  }
});

onMounted(async () => {
  try {
    const query = route.query;
    const hasKeyword = typeof query.search === "string" && query.search.trim().length > 0;
    const hasCategory = typeof query.category === "string" && !isNaN(parseInt(query.category));

    // Fetch categories first
    let retries = 3;
    let categoriesFetched = false;
    while (retries > 0 && !categoriesFetched) {
      categoriesFetched = await fetchCategories();
      if (!categoriesFetched) {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!categoriesFetched) return;

    // Restore state from URL
    // Set keyword first to ensure it's available if category change triggers search (though guarded now)
    if (hasKeyword) {
      keyword.value = query.search;
    }

    if (hasCategory) {
      const catId = parseInt(query.category);
      const foundCategory = categoryItems.value.find((cat) => cat.id === catId);
      if (foundCategory) {
        selectedCategory.value = foundCategory;
      }
    }

    // Enable watcher after state restoration
    isInitializing.value = false;

    // Trigger initial search if there are params
    if (hasCategory || hasKeyword) {
      await emitSearch();
    } else {
      // If no params, maybe just show all products or empty state?
      // Let's show empty state to encourage search, or show all products:
      // await emitSearch(); // Uncomment to show all products initially
    }
  } catch (error) {
    return;
    // console.error('Error in initialization:', error);
  } finally {
    isInitializing.value = false;
  }
});

onBeforeUnmount(() => {
  // router.replace({ query: {} }); // Optional: Clean up URL
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>