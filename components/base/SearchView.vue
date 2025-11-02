<template>
  <UContainer>
    <section class="p-4">
      <!-- Tombol Kembali -->
      <button
        class="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-black"
        @click="handleBack"
      >
        <Icon name="i-lucide-arrow-left" />
        Kembali
      </button>

      <!-- Form Pencarian -->
      <form
        class="flex flex-col md:flex-row md:items-center gap-2"
        @submit.prevent="emitSearch"
      >
        <UInput
          v-model="keyword"
          :ui="{ base: 'bg-white text-black/85' }"
          placeholder="Cari nama produk..."
          class="flex-1"
        />

        <USelectMenu
          v-model="selectedCategory"
          :ui="{
            base: 'bg-white text-black/85',
            content: 'bg-white text-black',
            item: 'text-black/85',
          }"
          :items="categoryItems"
          :search-input="{
            placeholder: 'Cari kategori produk...',
            variant: 'transparent',
            icon: 'i-lucide-search',
          }"
          arrow
          placeholder="Pilih kategori"
          option-attribute="label"
          value-attribute="id"
          class="w-full md:w-1/3 text-black/85 not-"
        />

        <button class="bg-[#FB7A00] text-white px-4 py-2 rounded h-full">
          Cari
        </button>
      </form>

      <!-- Loading -->
      <div v-if="loading" class="mt-4 text-gray-500">
        <NuxtImg src="/assets/loading.gif" alt="Loading" />
        <span>Mencari...</span>
      </div>
      <!-- Tidak ada hasil -->
      <div v-else-if="results.length === 0 && hasSearched" class="mt-4 text-gray-500">
        Maaf, Tidak ada hasil ditemukan. Silakan coba kata kunci lain.
      </div>

      <!-- Hasil -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-1 mt-4">
        <BaseProductCard
          v-for="product in results"
          :key="`product-${product.id}`"
          :title="product.name"
          :price="Number(product.price)"
          :discount="20"
          :units="product.unit"
          :stock="product.stock"
          :sale="1000"
          :image="product.thumbnail_url || '/assets/no-data-found.png'"
          :slug="product.slug"
        />
      </div>
    </section>
  </UContainer>
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

async function fetchCategories() {
  try {
    const data = await $fetch("server/api/categories");

    if (data && Array.isArray(data.data)) {
      categoryItems.value = [
        { label: "Semua Kategori", id: null },
        ...data.data.map((cat) => ({
          label: cat.name,
          id: cat.id,
          slug: cat.slug,
        })),
      ];
      return true;
    }

    return false;
  } catch (error) {
    // Bisa tambahkan toast jika perlu, contoh:
    // useToast().add({ color: 'error', title: 'Gagal memuat kategori' });
    return error;
  }
}

// Kosongkan nama produk jika user pilih kategori
// watch(selectedCategory, (newVal) => {
//   if (newVal?.id !== null) {
//     keyword.value = "";
//   }
// });

// Kosongkan kategori jika user input keyword
// watch(keyword, (newVal) => {
//   if (newVal && selectedCategory.value?.id !== null) {
//     selectedCategory.value = categoryItems.value[0];
//   }
// });

async function emitSearch() {
  loading.value = true;
  hasSearched.value = true; 

  const hasKeyword = keyword.value.trim().length > 0;
  const hasCategory =
    selectedCategory.value && selectedCategory.value.id !== null;

  if (!hasKeyword && !hasCategory) {
    loading.value = false;
    return;
  }

  const params = {};
  if (hasKeyword) {
    params.search = keyword.value.trim();
  }

  if (hasCategory) {
    params.category = selectedCategory.value.id;
  }

  const data = await $fetch("/server/api/products", { params });
  results.value = data?.data || [];
  loading.value = false;

  // Update URL
  router.replace({
    query: {
      ...(hasKeyword && { search: keyword.value }),
      ...(hasCategory && { category: selectedCategory.value.id }),
    },
  });
}

function handleBack() {
  router.push("/product");
  emit("back");
}

onMounted(async () => {
  try {
    const query = route.query;
    const hasKeyword = typeof query.search === "string" && query.search.trim().length > 0;
    const hasCategory =
      typeof query.category === "string" && !isNaN(parseInt(query.category));

    // Try fetching categories multiple times if needed
    let retries = 3;
    let categoriesFetched = false;

    while (retries > 0 && !categoriesFetched) {
      categoriesFetched = await fetchCategories();
      if (!categoriesFetched) {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }

    if (!categoriesFetched) {
      // console.error('Failed to fetch categories after multiple attempts');
      return;
    }

    if (hasCategory) {
      const catId = parseInt(query.category);
      const foundCategory = categoryItems.value.find((cat) => cat.id === catId);
      if (foundCategory) {
        selectedCategory.value = foundCategory;
      }
    }

    if (hasKeyword) {
      keyword.value = query.search;
    }

    // Only search if we have categories and search parameters
    if ((hasCategory || hasKeyword) && categoriesFetched) {
      await emitSearch();
    }
  } catch (error) {
    return error;
    // console.error('Error in initialization:', error);
  }
});

onBeforeUnmount(() => {
  router.replace({ query: {} });
});
</script>


<!-- // Ambil query param
  // keyword.value = route.query.s || "";

  // const categoryParam = route.query.category;
  // if (categoryParam !== undefined) {
  //   selectedCategory.value = categoryItems.value.find(
  //     (item) => String(item.id) === String(categoryParam)
  //   );
  // }

  // // Jalankan pencarian jika ada query
  // if (keyword.value || selectedCategory.value?.id !== null) {
  //   emitSearch();
  // } -->