<template>
  <UContainer class="py-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-blue-600" />
        <div>
          <h1 class="text-2xl font-bold">Pesanan Saya</h1>
          <p class="text-sm text-gray-500">Lihat status dan detail pesanan Anda</p>
        </div>
      </div>
      <UButton color="primary" variant="soft" class="hidden sm:flex" @click="navigateTo('/product')">
        <UIcon name="i-heroicons-shopping-cart" class="w-5 h-5" />
        Belanja Produk
      </UButton>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="space-y-5">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white border rounded-2xl p-5 shadow-sm space-y-4"
      >
        <div class="flex justify-between items-center">
          <USkeleton class="h-5 w-1/3" />
          <div class="flex gap-2">
            <USkeleton class="h-6 w-20 rounded-full" />
            <USkeleton class="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="j in 2" :key="j" class="flex justify-between">
            <USkeleton class="h-4 w-1/2" />
            <USkeleton class="h-4 w-24" />
          </div>
        </div>
        <div class="flex justify-between items-center pt-2">
          <USkeleton class="h-4 w-16" />
          <USkeleton class="h-6 w-32" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <USkeleton class="h-9 w-28 rounded-md" />
          <USkeleton class="h-9 w-32 rounded-md" />
        </div>
      </div>
    </div>

    <!-- Kalau kosong -->
    <div v-else-if="!orders.length" class="flex flex-col items-center gap-4 py-12">
      <NuxtImg width="280" format="webp" src="/assets/no-data-found.png" class="opacity-90" />
      <div class="text-center">
        <p class="text-gray-600 text-base">Belum ada pesanan</p>
        <p class="text-gray-400 text-sm mt-1">Mulai belanja untuk melihat pesanan Anda di sini</p>
      </div>
      <UButton color="primary" class="mt-2 text-white" @click="navigateTo('/product')">
        Jelajahi Produk
      </UButton>
    </div>

    <!-- Kalau ada isi -->
    <div v-else class="space-y-5">
      <div
        v-for="order in orders"
        :key="order.id"
        class="group relative bg-white border rounded-2xl p-5 shadow-sm space-y-3 hover:shadow-md transition"
        :class="orderStatusClass(order)"
      >
        <!-- Header Order -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <UIcon name="i-heroicons-receipt-percent" class="w-5 h-5 text-gray-500" />
            <span class="font-medium">#{{ order.id }}</span>
            <span class="text-gray-400">•</span>
            <span>{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
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
        <div class="divide-y divide-gray-100 rounded-lg border border-gray-100">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between items-center px-4 py-2 text-sm"
          >
            <p class="text-gray-700 truncate">{{ item.product.name }} (x{{ item.quantity }})</p>
            <p class="font-medium text-gray-900">Rp{{ formatNumber(item.subtotal) }}</p>
          </div>
        </div>

        <!-- Total -->
        <div class="flex justify-between items-center pt-3">
          <span class="text-gray-600">Total</span>
          <span class="text-lg font-semibold text-blue-700">Rp{{ formatNumber(order.total ?? order.total_price) }}</span>
        </div>

        <!-- Tombol ke halaman payment/invoice -->
        <div class="flex flex-wrap justify-end gap-2">
          <UButton
            size="sm"
            variant="soft"
            class="text-white bg-orange-600 uppercase"
            @click="navigateTo(`/orders/details/${order.id}`)"
          >
            <UIcon name="i-heroicons-eye" />
            Lihat Detail
          </UButton>

          <!-- Jika status cancelled, tidak tampilkan tombol lain -->
          <template v-if="order.status !== 'cancelled'">
            <!-- ✅ Konfirmasi Penerimaan Barang (cek dulu paling atas) -->
            <UButton
              v-if="order.delivery_status === 'shipped'"
              size="sm"
              class="bg-yellow-400 text-white uppercase"
              @click="navigateTo(`/confirmpenerimaanbarang/${order.id}`)"
            >
              <UIcon name="i-heroicons-check-circle" />
              Konfirmasi Penerimaan Barang
            </UButton>

            <!-- Lihat Invoice -->
            <UButton
              v-else-if="
                order.status === 'confirmed' && order.payment_status === 'paid'
              "
              size="sm"
              variant="solid"
              class="bg-gray-500 text-white uppercase"
              @click="navigateTo(`/payment/${order.id}`)"
            >
              <UIcon name="i-heroicons-ticket" />
              Lihat Invoice
            </UButton>

            <!-- Info Pembayaran -->
            <UButton
              v-else
              color="primary"
              size="sm"
              class="text-white uppercase"
              @click="navigateTo(`/payment/${order.id}`)"
            >
              <UIcon name="i-heroicons-credit-card" />
              Info Pembayaran
            </UButton>
          </template>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
definePageMeta({
  middleware: ["must-auth"],
});

const { data, pending } = useApi("/server/api/orders", {
  server: false,
  lazy: true
})

const orders = computed(() => data.value?.data || []);

// Format angka
function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return new Date(date).toLocaleDateString("id-ID");
  }
}

// Warna status order
const statusMap = {
  pending: { color: "info", label: "Pesanan Diproses" },
  completed: { color: "success", label: "Pesanan Selesai" },
  cancelled: { color: "error", label: "Pesanan Dibatalkan" },
};

// Warna status pembayaran
const paymentStatusMap = {
  unpaid: { color: "warning", label: "Pembayaran Belum Dibayar" },
  paid: { color: "success", label: "Pembayaran Sudah Dibayar" },
  failed: { color: "error", label: "Pembayaran Gagal" },
};

function orderStatusClass(order) {
  const map = {
    pending: "border-yellow-200",
    completed: "border-green-200",
    cancelled: "border-red-200",
    confirmed: "border-blue-200",
  };
  return map[order.status] || "border-gray-200";
}
</script>
