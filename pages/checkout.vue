<template>
  <UContainer class="py-6">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-4">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="link"
        color="gray"
        @click="$router.back()"
      />
      <h1 class="text-xl font-bold">Checkout</h1>
    </div>

    <!-- Kalau tidak ada data checkout -->
    <div
      v-if="!checkoutItems.length"
      class="flex flex-col items-center gap-4 py-10"
    >
      <NuxtImg width="300" format="webp" src="/assets/no-data-found.png" />
      <span class="text-gray-400">Tidak ada item untuk di-checkout.</span>
      <UButton color="primary" @click="$router.push('/cart')">
        Kembali ke Keranjang
      </UButton>
    </div>

    <!-- Kalau ada data checkout -->
    <div v-else class="space-y-6">
      <!-- Items yang akan di-checkout -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900">Item Pesanan</h2>

        <div
          v-for="item in checkoutItems"
          :key="item.id"
          class="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
        >
          <div class="flex items-start gap-3">
            <!-- Product Image -->
            <NuxtImg
              :src="item.product.thumbnail"
              format="webp"
              width="80"
              height="80"
              class="rounded-md object-cover flex-shrink-0"
            />

            <!-- Product Details -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">
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
          </div>
        </div>
      </div>

      <!-- Form Data Pengiriman -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Data Pengiriman
        </h2>

        <div class="space-y-4">
          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Alamat Lengkap <span class="text-red-500">*</span>
            </label>
            <UTextarea
              v-model="form.address"
              :ui="{
                base: 'bg-white text-black/85',
              }"
              placeholder="Masukkan alamat lengkap pengiriman"
              required
              class="w-full bg-white"
            />
          </div>

          <!-- Ekspedisi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Pilih Ekspedisi <span class="text-red-500">*</span>
            </label>
            <USelect
              v-model="form.expedition"
              :ui="{
                base: 'bg-white text-black/85',
                content: 'bg-white',
                item: 'text-black/85',
              }"
              :items="expeditionOptions"
              placeholder="Pilih jasa ekspedisi"
              required
              :loading="loadingShipping"
              class="w-full"
            />
            <p v-if="loadingShipping" class="text-xs text-gray-500 mt-1">
              Memuat opsi pengiriman...
            </p>
          </div>

          <!-- Note/Catatan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <UInput
              v-model="form.note"
              :ui="{
                base: 'bg-white text-black/85',
              }"
              placeholder="Catatan tambahan untuk pesanan"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Ringkasan Pesanan -->
      <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h2 class="text-lg font-semibold text-blue-900 mb-4">
          Ringkasan Pesanan
        </h2>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-blue-800">Total Item:</span>
            <span class="font-medium">{{ checkoutItems.length }} item</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-blue-800">Subtotal:</span>
            <span class="font-medium">Rp{{ formatNumber(totalAmount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-blue-800">Ongkos Kirim:</span>
            <span class="font-medium">Rp{{ formatNumber(shippingCost) }}</span>
          </div>
          <hr class="border-blue-300" />
          <div class="flex justify-between text-base font-bold">
            <span class="text-blue-900">Total Bayar:</span>
            <span class="text-blue-900"
              >Rp{{ formatNumber(totalAmount + shippingCost) }}</span
            >
          </div>
        </div>
      </div>

      <!-- Checkout Button -->
      <div class="sticky bottom-0 bg-white border-t pt-4">
        <UButton
          color="primary"
          size="lg"
          class="w-full justify-center text-white font-bold"
          :loading="isSubmitting"
          :disabled="!isFormValid"
          @click="handleSubmitOrder"
        >
          {{
            isSubmitting
              ? "Memproses..."
              : `Buat Pesanan - Rp${formatNumber(totalAmount + shippingCost)}`
          }}
        </UButton>
      </div>
    </div>

    <!-- Success Response Modal -->
    <SuccessResponse
      v-model="showSuccessModal"
      :title="apiResponse?.message || 'Pesanan Berhasil Dibuat!'"
      :message="
        apiResponse?.message ||
        'Pesanan Anda telah berhasil dibuat dan akan segera diproses.'
      "
      primary-button-text="Lihat Pesanan"
      secondary-button-text="Buat Pesanan Lagi"
      :show-secondary-button="true"
      @primary-action="handleSuccessAction"
      @secondary-action="handleSecondaryAction"
    />
  </UContainer>
</template>

<script setup>
import { UButton, USelect } from "#components";
import SuccessResponse from "~/components/handlingResponse/successResponse.vue";

definePageMeta({
  middleware: ["must-auth"],
});

// Ambil data checkout dari localStorage
const checkoutData = ref(null);
const checkoutItems = ref([]);
const totalAmount = ref(0);

// Form data
const form = reactive({
  address: "",
  expedition: "",
  note: "",
});

// State
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const apiResponse = ref(null);

// Fetch shipping options from API
const { data: shippingResponse, pending: loadingShipping } = await useApi(
  "/server/api/shippings"
);

// Transform API response to match the expected format
const expeditionOptions = computed(() => {
  if (!shippingResponse.value?.data) return [];

  return shippingResponse.value.data.map((shipping) => ({
    label: `${shipping.name} - ${shipping.service}`,
    value: shipping.id.toString(), // Menggunakan ID sebagai value
    id: shipping.id, // Menyimpan ID shipping
    cost: parseInt(shipping.cost),
    estimation: shipping.estimation,
  }));
});

// Computed shipping cost
const shippingCost = computed(() => {
  if (!form.expedition) return 0;
  const selectedExp = expeditionOptions.value.find(
    (exp) => exp.value === form.expedition
  );
  return selectedExp?.cost || 0;
});

// Form validation
const isFormValid = computed(() => {
  return form.address.trim() !== "" && form.expedition !== "";
});

// Load checkout data dari localStorage
onMounted(() => {
  const storedData = localStorage.getItem("checkoutItems");
  if (storedData) {
    try {
      checkoutData.value = JSON.parse(storedData);
      checkoutItems.value = checkoutData.value.items || [];
      totalAmount.value = checkoutData.value.total || 0;
    } catch (error) {
      // console.error("Error parsing checkout data:", error);
      checkoutItems.value = [];
      totalAmount.value = 0;
    }
  }

  // Redirect jika tidak ada data checkout
  if (!checkoutItems.value.length) {
    navigateTo("/cart");
  }
});

// Submit order
async function handleSubmitOrder() {
  if (!isFormValid.value) {
    alert("Mohon lengkapi alamat dan ekspedisi");
    return;
  }

  isSubmitting.value = true;

  try {
    // Menyesuaikan format payload sesuai kebutuhan API
    const orderPayload = {
      items: checkoutItems.value.map((item) => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity),
      })),
      address: form.address,
      shipping_id: parseInt(form.expedition), // form.expedition sekarang berisi ID shipping
      note: form.note || "",
    };

    // console.log("Submitting order with data:", orderPayload);

    const { data: response } = await useApi("/server/api/orders", {
      method: "POST",
      body: orderPayload,
    });

    // Clear localStorage setelah berhasil order
    localStorage.removeItem("checkoutItems");

    // Store API response and show success modal
    apiResponse.value = response.value;
    showSuccessModal.value = true;
  } catch (error) {
    // console.error("Error creating order:", error);

    let errorMessage = "Gagal membuat pesanan";
    if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}

// Handle success modal actions
function handleSuccessAction() {
  showSuccessModal.value = false;

  // Redirect ke halaman payment dengan invoice URL jika tersedia
  if (apiResponse.value?.data?.id) {
    navigateTo(`/payment/${apiResponse.value.data.id}`);
  } else {
    navigateTo("/orders");
  }
}

function handleSecondaryAction() {
  showSuccessModal.value = false;
  // Redirect ke halaman cart untuk membuat pesanan lagi
  navigateTo("/cart");
}

// Format number helper
function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}
</script>

<style lang="scss" scoped>
</style>