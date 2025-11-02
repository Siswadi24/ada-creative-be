<template>
  <UContainer class="py-6">
    <h1 class="text-xl font-bold mb-4">Pesanan Saya</h1>

    <!-- Kalau kosong -->
    <div v-if="!orders.length" class="flex flex-col items-center gap-4 py-10">
      <NuxtImg width="300" format="webp" src="/assets/no-data-found.png" />
      <span class="text-gray-400">Belum ada pesanan.</span>
    </div>

    <!-- Kalau ada isi -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border rounded-md p-4 shadow-sm space-y-2"
      >
        <!-- Header Order -->
        <div class="flex justify-between items-center">
          <p class="text-xs text-gray-500">
            #{{ order.id }} •
            {{ new Date(order.created_at).toLocaleDateString("id-ID") }}
          </p>
          <div class="flex gap-2">
            <UBadge
              :color="statusMap[order.status]?.color || 'gray'"
              variant="subtle"
              class="text-xs"
            >
              {{ statusMap[order.status]?.label || order.status }}
            </UBadge>
            <UBadge
              :color="paymentStatusMap[order.payment_status]?.color || 'gray'"
              variant="outline"
            >
              {{
                paymentStatusMap[order.payment_status]?.label ||
                order.payment_status
              }}
            </UBadge>
          </div>
        </div>

        <!-- List produk ringkas -->
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between text-sm"
        >
          <p>{{ item.product.name }} (x{{ item.quantity }})</p>
          <p>Rp{{ formatNumber(item.subtotal) }}</p>
        </div>

        <!-- Total -->
        <div class="flex justify-between items-center font-bold pt-2 border-t">
          <span>Total</span>
          <span>Rp{{ formatNumber(order.total ?? order.total_price) }}</span>
        </div>

        <!-- Tombol ke halaman payment/invoice -->
        <div class="flex justify-end gap-2">
          <!-- <UButton
            color="gray"
            size="sm"
            class="flex-1"
            @click="openDetail(order.id)"
          >
            Lihat Detail
          </UButton> -->

          <!-- Jika status cancelled, tidak tampilkan tombol lain -->
          <template v-if="order.status !== 'cancelled'">
            <!-- ✅ Konfirmasi Penerimaan Barang (cek dulu paling atas) -->
            <UButton
              v-if="order.delivery_status === 'delivered'"
              color="info"
              size="sm"
              class=""
              @click="navigateTo(`/confirmpenerimaanbarang/${order.id}`)"
            >
              <UIcon name="i-heroicons-check-circle" class="text-white" />
              Konfirmasi Penerimaan Barang
            </UButton>

            <!-- Lihat Invoice -->
            <UButton
              v-else-if="
                order.status === 'confirmed' && order.payment_status === 'paid'
              "
              size="sm"
              class="bg-gray-500"
              @click="navigateTo(`/payment/${order.id}`)"
            >
              <UIcon name="i-heroicons-ticket" class="text-white" />
              Lihat Invoice
            </UButton>

            <!-- Info Pembayaran -->
            <UButton
              v-else
              color="primary"
              size="sm"
              class=""
              @click="navigateTo(`/payment/${order.id}`)"
            >
              <UIcon name="i-heroicons-credit-card" class="text-white" />
              Info Pembayaran
            </UButton>
          </template>
        </div>
      </div>
    </div>

    <!-- <OrderModal
      v-if="selectedOrder"
      :is-open="showModal"
      :order="selectedOrder"
      @update:is-open="showModal = $event"
    /> -->
  </UContainer>
</template>

<script setup>
definePageMeta({
  middleware: ["must-auth"],
});

// Fetch orders list menggunakan useApi
const { data } = await useApi("/server/api/orders", {
  server: false,
});

const orders = computed(() => data.value?.data || []);

// State modal
const showModal = ref(false);
const selectedOrder = ref(null);

// Buka detail
async function openDetail(orderId) {
  try {
    const detail = await useApi(`/server/api/orders/${orderId}`, {
      method: "GET",
    });
    selectedOrder.value = detail.data || detail;
    showModal.value = true;
  } catch (err) {
    console.error("Gagal ambil detail order:", err);
    alert("Gagal ambil detail order");
  }
}

// Format angka
function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

// Warna status order
const statusMap = {
  pending: { color: "info", label: "Pesanan Diproses" },
  completed: { color: "success", label: "Pesanan Selesai" },
  cancelled: { color: "danger", label: "Pesanan Dibatalkan" },
  waiting_payment: {
    color: "warning",
    label: "Pesanan Menunggu Pembayaran",
  },
};

// Warna status pembayaran
const paymentStatusMap = {
  unpaid: { color: "warning", label: "Pembayaran Belum Dibayar" },
  paid: { color: "success", label: "Pembayaran Sudah Dibayar" },
  failed: { color: "danger", label: "Pembayaran Gagal" },
  waiting_confirmation: {
    color: "warning",
    label: "Pembayaran Menunggu Konfirmasi",
  },
};
</script>
