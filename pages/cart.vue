<template>
  <UContainer class="py-6 pb-20 sm:pb-6">
    <!-- Header dengan checkbox select all -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
    >
      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="link"
          color="gray"
          @click="$router.back()"
        />
        <h1 class="text-xl font-bold">Keranjang Saya</h1>
      </div>
      <div
        v-if="cartItems.length"
        class="flex items-center gap-2 sm:self-auto self-start"
      >
        <input
          type="checkbox"
          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          :checked="isAllSelected"
          @change="toggleSelectAll"
        />
        <span class="text-sm text-gray-600">Pilih Semua</span>
      </div>
    </div>

    <!-- Kalau kosong -->
    <div
      v-if="!cartItems.length"
      class="flex flex-col items-center gap-4 py-10"
    >
      <NuxtImg width="300" format="webp" src="/assets/no-data-found.png" />
      <span class="text-gray-400">Keranjang kosong.</span>
    </div>

    <!-- Kalau ada isi -->
    <div v-else class="space-y-4">
      <!-- Card List produk -->
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 overflow-hidden relative"
      >
        <div class="flex flex-wrap sm:flex-nowrap items-start gap-3">
          <!-- Checkbox -->
          <input
            type="checkbox"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
            :checked="selectedItems.includes(item.id)"
            @change="toggleSelectItem(item.id)"
          />

          <!-- Product Image -->
          <NuxtImg
            :src="item.product.thumbnail"
            format="webp"
            width="80"
            height="80"
            class="rounded-md object-cover flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24"
          />

          <!-- Product Details -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <div class="flex-1 pr-8 sm:pr-2 max-w-full">
                <h3 class="font-semibold text-gray-900 break-words truncate">
                  {{ item.product.name }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  Rp{{ formatNumber(item.product.price) }} per item
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-sm text-gray-600"
                    >Qty: {{ item.quantity }}</span
                  >
                  <span class="text-sm text-gray-400">•</span>
                  <span class="font-semibold text-blue-600">
                    Rp{{ formatNumber(item.subtotal) }}
                  </span>
                </div>
              </div>

              <!-- Delete Button -->
              <UButton
                icon="i-heroicons-trash"
                variant="ghost"
                color="red"
                size="sm"
                class="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 absolute top-3 right-3 sm:static"
                @click="() => removeFromCart(item.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator for infinite scroll -->
      <div
        v-if="hasMorePages"
        ref="scrollContainer"
        class="py-4 flex justify-center"
      >
        <UIcon
          v-if="loadingMore"
          name="i-heroicons-arrow-path"
          class="animate-spin w-6 h-6 text-gray-400"
        />
      </div>

      <!-- Selected items summary -->
      <div
        v-if="selectedItems.length"
        class="bg-blue-50 rounded-lg p-4 border border-blue-200"
      >
        <div class="flex justify-between items-center">
          <span class="text-sm text-blue-800">
            {{ selectedItems.length }} item dipilih
          </span>
          <span class="font-bold text-blue-900">
            Total: Rp{{ formatNumber(selectedTotal) }}
          </span>
        </div>
      </div>

      <!-- Checkout Button -->
      <div class="sticky bottom-0 bg-white border-t pt-4 pb-4">
        <UButton
          color="primary"
          size="lg"
          class="flex items-center justify-center w-full text-white font-bold"
          :disabled="!selectedItems.length"
          @click="handleCheckout"
        >
          Checkout ({{ selectedItems.length }} item)
        </UButton>
      </div>
    </div>

    <!-- Success Response Modal -->
    <SuccessResponse
      v-model="showSuccessModal"
      :title="apiResponse?.message || 'Berhasil!'"
      :message="apiResponse?.message || 'Item berhasil dihapus dari keranjang'"
      primary-button-text="OK"
      secondary-button-text="Lanjut Belanja"
      :show-secondary-button="true"
      @primary-action="handleSuccessAction"
      @secondary-action="handleSecondaryAction"
    />
  </UContainer>
</template>

<script setup>
import SuccessResponse from "~/components/handlingResponse/successResponse.vue";

definePageMeta({
  middleware: ["must-auth"],
});

const { data, refresh } = await useApi("/server/api/cart", {
  server: false,
  default: () => ({ items: { data: [] } }),
  retry: 1,
});

const selectedItems = ref([]);
const showSuccessModal = ref(false);
const apiResponse = ref(null);
// Infinite Scroll Loading
const loadingMore = ref(false);
const currentPage = ref(1);
const lastPage = computed(() => data.value?.items?.last_page || 1);
const hasMorePages = computed(() => currentPage.value < lastPage.value);
const scrollContainer = ref(null);

const isAllSelected = computed({
  get: () =>
    selectedItems.value.length > 0 &&
    selectedItems.value.length === cartItems.value.length,
  set: (val) => {
    if (val) {
      selectedItems.value = cartItems.value.map((item) => item.id);
    } else {
      selectedItems.value = [];
    }
  },
});

const selectedTotal = computed(() => {
  return cartItems.value
    .filter((item) => selectedItems.value.includes(item.id))
    .reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
});

function toggleSelectAll() {
  isAllSelected.value = !isAllSelected.value;
}

function toggleSelectItem(itemId) {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
  }
}

function _getMenuItems(item) {
  // console.log("🎯 Creating menu items for item:", item.id);
  const menuItems = [
    [
      {
        label: "Hapus dari keranjang",
        icon: "i-heroicons-trash",
        value: "delete",
      },
    ],
  ];
  // console.log("📋 Menu items created:", menuItems);
  return menuItems;
}

function _handleMenuSelect(selectedItem, cartItem) {
  // console.log("🖱️ Menu item selected:", selectedItem);
  // console.log("🖱️ Cart item:", cartItem);
  if (selectedItem.value === "delete") {
    // console.log("�️ Delete action triggered for item:", cartItem.id);
    removeFromCart(cartItem.id);
  }
}

// Remove item dari cart
async function removeFromCart(itemId) {
  if (!confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
    return;
  }

  try {
    const { data: response } = await useApi(`/server/api/cart/${itemId}`, {
      method: "DELETE",
    });

    const index = selectedItems.value.indexOf(itemId);
    if (index > -1) {
      selectedItems.value.splice(index, 1);
    }
    // Refresh cart data
    await refresh();

    apiResponse.value = response.value;
    showSuccessModal.value = true;
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err.data?.message) {
      errorMessage = err.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    } else if (err.status) {
      errorMessage = `HTTP ${err.status}: ${
        err.statusText || "Request failed"
      }`;
    }

    alert("Gagal menghapus item: " + errorMessage);
  }
}

const cartItems = ref([]);
watch(
  () => data.value?.items?.data,
  (newItems) => {
    if (newItems && (currentPage.value === 1 || cartItems.value.length === 0)) {
      cartItems.value = [...newItems];
      currentPage.value = data.value?.items?.current_page || 1;
    }
  },
  { immediate: true, deep: true }
);

async function loadMoreItems() {
  if (loadingMore.value || !hasMorePages.value) return;

  loadingMore.value = true;
  const nextPage = currentPage.value + 1;

  try {
    const response = await $fetch(`/server/api/cart?page=${nextPage}`, {
      headers: {
        Authorization: `Bearer ${useCookie("access_token").value}`,
      },
    });

    if (response?.items?.data) {
      cartItems.value = [...cartItems.value, ...response.items.data];
      currentPage.value = response.items.current_page;
    }
  } catch (error) {
    console.error("Failed to load more items:", error);
  } finally {
    loadingMore.value = false;
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMoreItems();
      }
    },
    { rootMargin: "100px" }
  );

  if (scrollContainer.value) {
    observer.observe(scrollContainer.value);
  }
});

function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

async function handleCheckout() {
  if (!selectedItems.value.length) {
    return alert("Pilih item yang ingin di-checkout");
  }
  const selectedCartItems = cartItems.value.filter((item) =>
    selectedItems.value.includes(item.id)
  );
  localStorage.setItem(
    "checkoutItems",
    JSON.stringify({
      items: selectedCartItems,
      total: selectedTotal.value,
    })
  );
  navigateTo("/checkout");
}

function handleSuccessAction() {
  showSuccessModal.value = false;
  // Tetap di halaman cart
}

function handleSecondaryAction() {
  showSuccessModal.value = false;
  navigateTo("/product");
}
</script>
