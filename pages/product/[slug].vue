<template>
  <UContainer v-if="product" class="dark:text-white py-3 md:py-6">
    <div
      class="flex items-center gap-1 text-sm mb-4 text-gray-500 flex-wrap overflow-auto"
    >
      <UBreadcrumb
        :ui="{
          root: 'flex flex-wrap gap-2 items-center w-xs text-lg',
          item: 'flex flex-wrap items-center gap-2',
        }"
        :items="breadcrumbs"
      />
    </div>
    <div class="flex flex-col md:flex-row gap-6">
      <template v-if="items.length === 0">
        <NuxtImg
          src="/assets/no-data-found.png"
          format="webp"
          class="w-full object-contain"
        />
      </template>
      <template v-else>
        <!-- Gambar dan Thumbnail -->
        <div class="w-full md:w-1/2">
          <UCarousel
            ref="carousel"
            v-slot="{ item }"
            :items="items"
            :prev="{ onClick: onClickPrev }"
            :next="{ onClick: onClickNext }"
            class="w-full mx-auto"
            @select="onSelect"
          >
            <img
              :src="item"
              class="rounded-lg w-full aspect-square object-cover"
            />
          </UCarousel>

          <!-- Thumbnails -->
          <div class="flex gap-2 justify-start pt-4 flex-wrap">
            <button
              v-for="(item, index) in items"
              :key="index"
              class="w-16 h-16 border rounded-md overflow-hidden"
              :class="{ 'ring-2 ring-primary': activeIndex === index }"
              @click="select(index)"
            >
              <img :src="item" class="object-cover w-full h-full" />
            </button>
          </div>
        </div>
      </template>

      <!-- Deskripsi Produk -->
      <div class="w-full md:w-1/2 flex flex-col justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-black/85">
            {{ product.name || "" }}
          </h1>
          <p class="text-primary text-2xl font-bold mt-2">
            Rp{{ formatNumber(product?.price || 0) }}
          </p>
          <p class="text-sm mt-1 text-gray-400">{{ product?.stock }} stok</p>
          <p class="text-sm mt-1 text-gray-400">{{ product?.unit }}</p>

          <div class="mt-4">
            <h2 class="font-semibold mb-1 text-black/85">Deskripsi:</h2>
            <p class="text-sm text-black/50">
              {{ product?.description || "" }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-3">
          <label class="text-sm font-medium min-w-[80px] text-black/80"
            >Kuantitas</label
          >
          <BaseInputQuantity v-model="quantity" :max="product?.stock" />
        </div>

        <!-- Tombol Beli -->
        <div class="mt-4 flex gap-4 text-center">
          <UButton
            size="lg"
            variant="outline"
            class="cursor-pointer text-black/65 bg-green-50 hover:bg-green-100 text-base sm:text-lg md:text-lg lg:text-xl md:p-2 xl:p-4 font-bold"
            @click="handleAddToCart"
          >
            Masukkan Keranjang
          </UButton>
          <UButton
            size="lg"
            variant="solid"
            color="primary"
            class="cursor-pointer text-base sm:text-lg md:text-lg lg:text-xl p-2 text-white font-bold"
            @click="handleAddToCart"
          >
            Beli Langsung
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
  <div
    v-else-if="!product && productsData"
    class="text-center py-10 text-gray-400"
  >
    Produk tidak ditemukan.
  </div>
  <div v-else class="text-center py-10 text-gray-400">
    Sedang memuat produk...
  </div>

  <!-- Success Response Modal -->
  <SuccessResponse
    v-model="showSuccessModal"
    :title="apiResponse?.message || 'Berhasil Ditambahkan!'"
    :message="
      apiResponse?.message || 'Produk berhasil ditambahkan ke keranjang Anda.'
    "
    primary-button-text="Lihat Keranjang"
    secondary-button-text="Lanjut Belanja"
    :show-secondary-button="true"
    @primary-action="handleSuccessAction"
    @secondary-action="handleSecondaryAction"
  />

  <!-- Error Response Modal -->
  <ErrorResponse
    v-model="showErrorModal"
    :title="errorResponse?.message || 'Terjadi Kesalahan!'"
    :message="
      errorResponse?.message ||
      'Terjadi kesalahan saat menambahkan produk ke keranjang.'
    "
    primary-button-text="OK"
    :show-secondary-button="false"
    @primary-action="handleErrorAction"
  />
</template>

<script setup>
import SuccessResponse from "~/components/handlingResponse/successResponse.vue";
import ErrorResponse from "~/components/handlingResponse/errorResponse.vue";

const route = useRoute();
const slug = computed(() => route.params.slug);

// Ambil semua produk dari API
const { data: productsData } = await useAsyncData("products", () =>
  $fetch("/server/api/products")
);

const { data: settingsData } = await useAsyncData("settings", () =>
  $fetch("/server/api/settings")
);

const productStore = useProductStore();
const session = useSession();
const { token: tokenSession } = storeToRefs(session);
const token = useCookie("access_token");

// State untuk success modal
const showSuccessModal = ref(false);
const apiResponse = ref(null);

// State untuk error modal
const showErrorModal = ref(false);
const errorResponse = ref(null);

watchEffect(() => {
  if (productsData.value?.data) {
    productStore.setProducts(productsData.value.data);
  }
});

// Ambil produk berdasarkan slug dari store
const product = computed(() => productStore.findBySlug(slug.value));
const items = computed(() => product.value?.gallery_urls || []);

const breadcrumbs = computed(() => [
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/",
  },
  {
    label: "Produk",
    icon: "i-lucide-shopping-bag",
    to: "/product",
  },
  {
    label: product.value?.name || "Detail Produk",
  },
]);

// Set SEO meta tags for better link previews
watchEffect(() => {
  if (product.value) {
    useSeoMeta({
      title: `AlokaStore | ${product.value.name || ""}`,
      ogTitle: `AlokaStore | ${product.value.name || ""}`,
      ogDescription:
        product.value.description || "Deskripsi produk tidak tersedia.",
      ogImage: items.value?.[0] || "/logo/Logo-AlokaStore.png",
      ogType: "product",
      description:
        product.value.description || "Deskripsi produk tidak tersedia.",
      keywords: `produk grosir, ${product.value.name || ""}, harga grosir ${
        product.value.price || 0
      }`,
    });
  }
});

const carousel = useTemplateRef("carousel");
const activeIndex = ref(0);
const quantity = ref(1);

function onClickPrev() {
  activeIndex.value--;
}

function onClickNext() {
  activeIndex.value++;
}
function onSelect(index) {
  activeIndex.value = index;
}
function select(index) {
  activeIndex.value = index;
  carousel.value?.emblaApi?.scrollTo(index);
}

// ✅ Tambah ke Keranjang
async function handleAddToCart() {
  if (!product.value) return;

  const { data: response, error } = await useApi("/server/api/cart", {
    method: "POST",
    body: {
      product_id: product.value.id,
      quantity: quantity.value,
    },
  });

  // Check if there's an error
  if (error.value) {
    // console.error("Gagal menambahkan ke keranjang:", error.value);

    // Store error response and show error modal
    errorResponse.value = error.value.data || {
      message:
        error.value.statusMessage ||
        "Terjadi kesalahan saat menambahkan ke keranjang",
    };
    showErrorModal.value = true;
  } else {
    // Store API response and show success modal
    apiResponse.value = response.value;
    showSuccessModal.value = true;
  }
}

// Handle success modal actions
function handleSuccessAction() {
  showSuccessModal.value = false;
  // Redirect ke halaman cart
  navigateTo("/cart");
}

function handleSecondaryAction() {
  showSuccessModal.value = false;
  // Tetap di halaman ini untuk lanjut belanja
}

// Handle error modal actions
function handleErrorAction() {
  showErrorModal.value = false;
  // Tetap di halaman ini
}

// ✅ Beli Langsung via WhatsApp
// function handleBuyNow() {
//   const phoneNumber =
//     settingsData.value?.data?.phone?.replace(/^0/, "62") || "6285800445350";
//   const name = product.value?.name || "Produk Tanpa Nama";
//   const price = product.value?.price || 0;
//   const formattedPrice = formatNumber(price);
//   const qty = quantity.value;
//   const totalPrice = price * qty;
//   const formattedTotalPrice = formatNumber(totalPrice);
//   const shareUrl = `${window.location.origin}/api/share/product/${slug.value}`;
//   const message = `${shareUrl}

// 🛒 *Pesanan Baru!*

// 📦 *Produk:* ${name}
// 💵 *Harga Satuan:* Rp${formattedPrice}
// 📊 *Jumlah:* ${qty}
// 💰 *Total Harga:* Rp${formattedTotalPrice}

// Saya ingin memesan produk ini. Mohon bantuannya, terima kasih 🙏`.trim();

//   const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
//     message
//   )}`;
//   window.open(url, "_blank");
// }
</script>
