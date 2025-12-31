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
      <h1 class="text-xl font-bold">
        {{ order?.status === "confirmed" ? "Invoice" : "Pembayaran" }} Order #{{
          order?.id
        }}
      </h1>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoadingOrder"
      class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6"
    >
      <div class="flex justify-center items-center py-8">
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin h-8 w-8 text-primary-500"
        />
        <span class="ml-2 text-gray-600">Memuat detail pesanan...</span>
      </div>
    </div>

    <!-- Detail Order -->
    <div
      v-else-if="order"
      class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6"
    >
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Detail Pesanan</h2>

      <!-- Items -->
      <div class="space-y-3 mb-4">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between items-center"
        >
          <div class="flex-1">
            <p class="font-medium">{{ item.product.name }}</p>
            <p class="text-sm text-gray-500">
              {{ item.quantity }} x Rp{{ formatNumber(item.price) }}
            </p>
          </div>
          <p class="font-semibold">Rp{{ formatNumber(item.subtotal) }}</p>
        </div>
      </div>

      <hr class="my-4" />

      <!-- Order Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Total:</strong> Rp{{ formatNumber(order.total_price) }}</p>
          <p>
            <strong>Status:</strong>
            <UBadge :color="getStatusColor(order.status)" variant="subtle">
              {{ getStatusLabel(order.status) }}
            </UBadge>
          </p>
          <p>
            <strong>Status Pembayaran:</strong>
            <UBadge
              :color="getPaymentStatusColor(order.payment_status)"
              variant="outline"
            >
              {{ getPaymentStatusLabel(order.payment_status) }}
            </UBadge>
          </p>
          <p v-if="order.shipping_cost">
            <strong>Ongkos Kirim:</strong> Rp
            {{ formatNumber(order.shipping_cost) }}
          </p>
        </div>
        <div>
          <p><strong>Alamat:</strong> {{ order.address }}</p>
          <p v-if="order.note"><strong>Catatan:</strong> {{ order.note }}</p>
          <p><strong>Tanggal:</strong> {{ formatDate(order.created_at) }}</p>
        </div>
      </div>

      <!-- Bukti Pembayaran yang sudah ada -->
      <div v-if="order.payments && order.payments.length > 0" class="mt-4">
        <h3 class="font-medium mb-2">Bukti Pembayaran:</h3>
        <div v-for="payment in order.payments" :key="payment.id" class="mb-2">
          <p class="text-sm">Total: Rp{{ formatNumber(payment.amount) }}</p>
          <p class="text-sm">Tanggal: {{ formatDate(payment.payment_date) }}</p>
          <NuxtImg
            v-if="payment.proof"
            :src="`${baseUrl}/storage/${payment.proof}`"
            class="w-32 h-32 object-cover rounded-md mt-2"
            alt="Bukti pembayaran"
          />
        </div>
      </div>
    </div>

    <!-- Warning Info - Tampilkan jika shipping_cost belum ada atau 0 -->
    <div
      v-if="
        !(order?.status === 'confirmed' && order?.payment_status === 'paid') &&
        !(
          order?.status === 'cancelled' && order?.payment_status === 'failed'
        ) &&
        (!order?.shipping_cost || parseFloat(order?.shipping_cost) <= 0)
      "
      class="bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm p-4 mb-6"
    >
      <div class="flex items-center gap-2 mb-2">
        <Icon
          name="i-heroicons-exclamation-triangle"
          class="text-yellow-600 text-xl"
        />
        <h2 class="text-lg font-semibold text-yellow-900">
          Informasi Pembayaran
        </h2>
      </div>
      <p class="text-yellow-800">
        Penjual sedang mengecek ongkos kirim yang Anda pilih. Jika sudah
        tersedia, barcode pembayaran akan muncul di halaman ini.
      </p>
      <p class="text-sm text-yellow-600 mt-2">
        Silakan refresh halaman ini secara berkala untuk melihat pembaruan.
      </p>
    </div>

    <!-- Metode Pembayaran - Tampilkan jika belum confirmed dan paid dan shipping_cost ada nilainya -->
    <div
      v-if="
        !(order?.status === 'confirmed' && order?.payment_status === 'paid') &&
        !(
          order?.status === 'cancelled' && order?.payment_status === 'failed'
        ) &&
        order?.shipping_cost &&
        parseFloat(order?.shipping_cost) > 0
      "
      class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6"
    >
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        Metode Pembayaran
      </h2>

      <div v-if="paymentMethodStore.loading" class="flex justify-center py-4">
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin h-6 w-6 text-primary-500"
        />
      </div>

      <div v-else>
        <!-- Pilihan Metode Pembayaran -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="method in paymentMethodStore.activePaymentMethods"
            :key="method.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
              selectedPaymentMethod?.id === method.id
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
            ]"
            @click="selectedPaymentMethod = method"
          >
            {{ method.name }}
          </button>
        </div>

        <!-- Konten Metode Pembayaran -->
        <div v-if="selectedPaymentMethod" class="text-center">
          <!-- Tampilan QRIS -->
          <div v-if="selectedPaymentMethod.code === 'qris'">
            <p class="text-sm text-gray-600 mb-4">
              Scan QRIS di bawah ini untuk melakukan pembayaran
            </p>
            <div class="flex justify-center mb-4">
              <div
                v-for="account in selectedPaymentMethod.accounts"
                :key="account.id"
              >
                <p class="text-sm font-bold mb-2">
                  Nama Penerima: {{ account.nama_penerima }}
                </p>
                <NuxtImg
                  v-if="account.qris_image"
                  :src="`${baseUrl}/storage/${account.qris_image}`"
                  alt="QRIS Code"
                  class="max-w-xs rounded-md border"
                />
              </div>
            </div>
          </div>

          <!-- Tampilan Bank Transfer -->
          <div v-else-if="selectedPaymentMethod.code === 'bank_transfer'">
            <p class="text-sm text-gray-600 mb-4">
              Silakan transfer ke rekening berikut:
            </p>
            <div class="space-y-4">
              <div
                v-for="account in selectedPaymentMethod.accounts"
                :key="account.id"
                class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left max-w-md mx-auto"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm text-gray-500">Bank</p>
                    <p class="font-bold text-lg text-gray-900">
                      {{ account.nama_bank }}
                    </p>
                  </div>
                  <UIcon
                    name="i-heroicons-building-library"
                    class="text-gray-400 w-8 h-8"
                  />
                </div>

                <div class="mt-3">
                  <p class="text-sm text-gray-500">Nomor Rekening</p>
                  <div class="flex items-center gap-2">
                    <p class="font-mono text-xl font-bold text-gray-900">
                      {{ account.no_rekening }}
                    </p>
                    <UButton
                      icon="i-heroicons-clipboard"
                      color="gray"
                      variant="ghost"
                      size="xs"
                      @click="copyToClipboard(account.no_rekening)"
                    />
                  </div>
                </div>

                <div class="mt-3">
                  <p class="text-sm text-gray-500">Atas Nama</p>
                  <p class="font-medium text-gray-900">
                    {{ account.nama_penerima }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Total Bayar -->
          <div class="bg-blue-50 rounded-lg p-4 text-center mt-6">
            <p class="text-sm text-blue-800 font-medium">
              Total yang harus dibayar: Rp{{
                formatNumber(order?.total_price || 0)
              }}
            </p>
            <p class="text-xs text-blue-600 mt-1">
              Setelah transfer, upload bukti pembayaran di bawah ini
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Jika order confirmed dan paid, tampilkan hanya invoice -->
    <div
      v-if="order?.status === 'confirmed' && order?.payment_status === 'paid'"
      class="bg-green-50 rounded-lg border border-green-200 p-4"
    >
      <div class="flex items-center gap-2 mb-2">
        <Icon name="i-heroicons-check-circle" class="text-green-600 text-xl" />
        <h2 class="text-lg font-semibold text-green-900">Pesanan Selesai</h2>
      </div>
      <p class="text-green-800">
        Pesanan Anda telah selesai diproses dan pembayaran telah dikonfirmasi.
      </p>
      <p class="text-sm text-green-600 mt-2">
        Terima kasih atas kepercayaan Anda!
      </p>
    </div>

    <!-- Jika order belum completed atau belum paid, tampilkan form upload bukti -->
    <div
      v-else-if="
        !(order?.status === 'cancelled' && order?.payment_status === 'failed')
      "
      class="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
    >
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        Upload Bukti Pembayaran
      </h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Nominal Transfer</label
          >
          <UInput
            v-model="amount"
            :ui="{
              base: 'bg-gray-100 text-black/85',
            }"
            type="text"
            readonly
            class="w-full cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">
            Nominal otomatis sesuai total pesanan
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Upload Bukti Transfer</label
          >
          <input
            type="file"
            accept="image/*"
            class="block w-full border rounded-md p-2"
            @change="handleFile"
          />
        </div>

        <UButton
          :loading="loading"
          color="primary"
          class="w-full"
          :disabled="!file"
          @click="submitPayment"
        >
          {{ loading ? "Mengupload..." : "Upload Bukti Pembayaran" }}
        </UButton>
      </div>
    </div>

    <!-- Jika order cancelled dan payment failed, tidak tampilkan apa-apa -->
    <div v-else class="bg-red-50 rounded-lg border border-red-200 p-4">
      <div class="flex items-center gap-2 mb-2">
        <Icon name="i-heroicons-x-circle" class="text-red-600 text-xl" />
        <h2 class="text-lg font-semibold text-red-900">Pesanan Dibatalkan</h2>
      </div>
      <p class="text-red-800">
        Pesanan ini telah dibatalkan dan pembayaran gagal.
      </p>
    </div>
  </UContainer>
</template>

<script setup>
definePageMeta({
  middleware: ["must-auth"],
});
const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;

const route = useRoute();
const orderId = computed(() => route.params.id);
const order = ref(null);
const amount = ref("");
const file = ref(null);
const loading = ref(false);
const isLoadingOrder = ref(true);
const paymentMethodStore = usePaymentMethodStore();
const selectedPaymentMethod = ref(null);
const toast = useToast();

// Polling interval reference
let pollingInterval = null;
const ONE_MINUTE = 60 * 1000;

// Ambil detail order menggunakan useApi
const { data, refresh, pending } = useApi(
  `/server/api/orders/${orderId.value}`,
  {
    server: false,
    immediate: true,
    watch: [orderId],
  }
);

// Memastikan data order selalu diperbarui
watch(
  data,
  () => {
    order.value = data.value?.data || data.value;
    isLoadingOrder.value = false;
  },
  { immediate: true }
);

// Memantau status loading
watch(pending, (newPending) => {
  isLoadingOrder.value = newPending;
});

// Fungsi untuk memuat ulang data order
const refreshOrder = async () => {
  // Hanya refresh jika tidak ada proses loading yang sedang berjalan (untuk polling)
  // isLoadingOrder.value = true; // Jangan set loading true saat polling agar tidak flicker
  await refresh();
};

// Polling untuk mengecek update ongkir secara real-time
const startPolling = () => {
  // Hentikan polling jika sudah ada
  if (pollingInterval) clearInterval(pollingInterval);

  pollingInterval = setInterval(async () => {
    // Hanya refresh jika status order belum selesai atau ongkir masih 0
    const needsShippingCost =
      !order.value?.shipping_cost ||
      parseFloat(order.value?.shipping_cost) <= 0;
    const isUnpaid = order.value?.payment_status === "unpaid";

    if (needsShippingCost && isUnpaid) {
      await refreshOrder();
    } else {
      // Jika sudah ada ongkir atau sudah dibayar, hentikan polling
      stopPolling();
    }
  }, ONE_MINUTE); // Cek setiap 1 menit
};

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

// Memuat ulang data saat halaman dimuat dan mulai polling
onMounted(() => {
  refreshOrder();
  startPolling();
  paymentMethodStore.fetchPaymentMethods();
});

// Set default selected payment method
watch(
  () => paymentMethodStore.activePaymentMethods,
  (methods) => {
    if (methods && methods.length > 0 && !selectedPaymentMethod.value) {
      selectedPaymentMethod.value = methods[0];
    }
  },
  { immediate: true }
);

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  toast.add({
      title: 'Berhasil!',
      description: 'Teks berhasil disalin ke clipboard',
      icon: 'i-heroicons-check-circle',
      color: 'success',
      timeout: 3000
    });
}

// Bersihkan polling saat komponen di-unmount
onUnmounted(() => {
  stopPolling();
});

// Auto-fill amount dengan total order
watch(
  order,
  (newOrder) => {
    if (newOrder?.total_price) {
      amount.value = formatNumber(newOrder.total_price);
    }
  },
  { immediate: true }
);

function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Status helpers
function getStatusColor(status) {
  const statusMap = {
    pending: "yellow",
    process: "blue",
    completed: "green",
    cancelled: "red",
  };
  return statusMap[status] || "gray";
}

function getStatusLabel(status) {
  const statusMap = {
    pending: "Menunggu",
    process: "Diproses",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return statusMap[status] || status;
}

function getPaymentStatusColor(status) {
  const statusMap = {
    unpaid: "yellow",
    waiting_confirmation: "blue",
    paid: "green",
    failed: "red",
  };
  return statusMap[status] || "gray";
}

function getPaymentStatusLabel(status) {
  const statusMap = {
    unpaid: "Belum Dibayar",
    waiting_confirmation: "Menunggu Konfirmasi",
    paid: "Sudah Dibayar",
    failed: "Gagal",
  };
  return statusMap[status] || status;
}

// Ambil file dari input
function handleFile(e) {
  file.value = e.target.files[0];
}

// Submit bukti pembayaran
async function submitPayment() {
  if (!file.value) {
    return alert("Bukti transfer wajib diupload");
  }

  loading.value = true;
  const formData = new FormData();
  // Gunakan total_price langsung dari order
  formData.append("amount", order.value.total_price);
  formData.append("payment_proof", file.value);

  try {
    await useApi(`/server/api/orders/${orderId.value}/payment-proof`, {
      method: "POST",
      body: formData,
    });

    alert("Bukti pembayaran berhasil diupload!");

    // Refresh order data
    const { data: refreshedData } = await useApi(
      `/server/api/orders/${orderId.value}`,
      {
        server: false,
      }
    );
    order.value = refreshedData.value?.data || refreshedData.value;

    // Reset form
    file.value = null;
  } catch (err) {
    // console.error("Error uploading payment proof:", err);
    let errorMessage = "Gagal upload bukti pembayaran";
    if (err.data?.message) {
      errorMessage = err.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    alert(errorMessage);
  } finally {
    loading.value = false;
  }
}
</script>
