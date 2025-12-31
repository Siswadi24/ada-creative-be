<template>
  <UContainer class="py-6 space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-blue-600" />
        <div>
          <h1 class="text-2xl font-bold">Detail Pesanan</h1>
          <p v-if="order" class="text-sm text-gray-500">
            <span class="font-medium">#{{ route.params.id }}</span>
            <span class="text-gray-400">•</span>
            <span>{{ formatDate(order.created_at || "") }}</span>
          </p>
        </div>
      </div>

      <div v-if="order" class="flex flex-wrap gap-2">
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
          class="text-xs"
        >
          {{
            paymentStatusMap[order.payment_status]?.label ||
            order.payment_status
          }}
        </UBadge>
      </div>
    </div>

    <div v-if="pending" class="text-gray-500">Memuat data pesanan...</div>
    <div v-else-if="!order" class="flex flex-col items-center gap-3 py-10">
      <NuxtImg
        width="280"
        format="webp"
        src="/assets/no-data-found.png"
        class="opacity-90"
      />
      <p class="text-gray-600">Order tidak ditemukan</p>
      <UButton color="gray" @click="router.back()">Kembali</UButton>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          :class="[
            'bg-white border rounded-2xl p-5 shadow-sm',
            orderStatusClass(order),
          ]"
        >
          <div class="flex items-center gap-2 mb-3">
            <UIcon
              name="i-heroicons-receipt-percent"
              class="w-5 h-5 text-gray-600"
            />
            <p class="font-semibold">Ringkasan Pesanan</p>
          </div>
          <div class="space-y-2 text-sm">
            <p>
              <span class="text-gray-500">Invoice</span>:
              <span class="font-medium">{{ order.invoice_number }}</span>
              <span v-if="order.invoice_date" class="text-gray-400">
                ({{ formatDate(order.invoice_date) }})</span
              >
            </p>
            <p>
              <span class="text-gray-500">Alamat</span>: {{ order.address }}
            </p>
            <p>
              <span class="text-gray-500">Catatan</span>:
              {{ order.note || "-" }}
            </p>
            <p v-if="order.paid_at">
              <span class="text-gray-500">Dibayar</span>:
              {{ formatDateTime(order.paid_at) }}
            </p>
          </div>
        </div>

        <div class="bg-white border rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-truck" class="w-5 h-5 text-gray-600" />
            <p class="font-semibold">Pengiriman</p>
          </div>
          <div class="space-y-2 text-sm">
            <p>
              <span class="text-gray-500">Status Pengiriman</span>:
              {{
                shippingStatusMap[order.shipping_status]?.label ||
                order.shipping_status
              }}
            </p>
            <p v-if="order.delivery_status">
              <span class="text-gray-500">Status Penerimaan</span>:
              {{
                deliveryStatusMap[order.delivery_status]?.label ||
                order.delivery_status
              }}
            </p>
            <p v-if="order.tracking_number">
              <span class="text-gray-500">No. Resi</span>:
              {{ order.tracking_number }}
            </p>
            <p v-if="order.shipping_cost">
              <span class="text-gray-500">Biaya Kirim</span>:
              <span class="font-medium"
                >Rp{{ formatNumber(order.shipping_cost) }}</span
              >
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white border rounded-2xl p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-heroicons-cube" class="w-5 h-5 text-gray-600" />
          <p class="font-semibold">Daftar Produk</p>
        </div>
        <div class="divide-y divide-gray-100 rounded-lg border border-gray-100">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between items-center px-4 py-2 text-sm"
          >
            <span class="text-gray-700 truncate"
              >{{ item.product?.name || "Produk" }} (x{{ item.quantity }})</span
            >
            <span class="font-medium text-gray-900"
              >Rp{{ formatNumber(item.subtotal) }}</span
            >
          </div>
        </div>
        <div class="flex justify-between items-center pt-3">
          <span class="text-gray-600">Total</span>
          <span class="text-lg font-semibold text-blue-700"
            >Rp{{ formatNumber(order.total_price) }}</span
          >
        </div>
      </div>

      <div class="bg-white border rounded-2xl p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-heroicons-banknotes" class="w-5 h-5 text-gray-600" />
          <p class="font-semibold">Pembayaran</p>
        </div>
        <div
          v-if="order.payments && order.payments.length"
          class="divide-y divide-gray-100 rounded-lg border border-gray-100"
        >
          <div
            v-for="p in order.payments"
            :key="p.id"
            class="flex justify-between items-center px-4 py-2 text-sm"
          >
            <span class="text-gray-700">{{
              formatDateTime(p.payment_date)
            }}</span>
            <span class="font-medium">Rp{{ formatNumber(p.amount) }}</span>
          </div>
        </div>
        <p v-else-if="order.payment_status === 'failed'">
          Pembayaran telah digagalkan.
        </p>
        <p v-else class="text-gray-500">Belum ada pembayaran.</p>
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        <UButton
          v-if="
            order.status !== 'cancelled' && order.delivery_status === 'shipped'
          "
          color="success"
          class="bg-yellow-400 text-white uppercase"
          @click="navigateTo(`/confirmpenerimaanbarang/${order.id}`)"
        >
          <UIcon name="i-heroicons-check-circle" />
          Konfirmasi Penerimaan Barang
        </UButton>
        <UButton
          v-if="order.status === 'confirmed' && order.payment_status === 'paid'"
          color="gray"
          variant="solid"
          class="bg-gray-500 text-white uppercase"
          @click="navigateTo(`/payment/${order.id}`)"
        >
          <UIcon name="i-heroicons-ticket" />
          Lihat Invoice
        </UButton>
        <UButton
          v-if="
            order.payment_status !== 'paid' && order.payment_status !== 'failed'
          "
          color="primary"
          class="text-white uppercase"
          @click="navigateTo(`/payment/${order.id}`)"
        >
          <UIcon name="i-heroicons-credit-card" />
          Info Pembayaran
        </UButton>
        <UButton
          v-if="safeUrl(order?.invoice_url)"
          color="primary"
          class="text-white uppercase"
          @click="openInvoice(order.invoice_url)"
        >
          <UIcon name="i-heroicons-document" />
          Buka Invoice
        </UButton>
        <UButton color="gray" class="text-[#6B7280] uppercase bg-gray-100" @click="router.back()">
          <UIcon name="i-heroicons-arrow-left" />
          Kembali
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
definePageMeta({
  middleware: ["must-auth"],
});

const route = useRoute();
const router = useRouter();

// Ambil daftar orders dari endpoint list lalu pilih berdasarkan id route
const { data, pending } = await useApi("/server/api/orders", { server: false });
const orders = computed(() => data.value?.data || []);
const order = computed(() =>
  orders.value.find((o) => String(o.id) === String(route.params.id))
);

function formatNumber(num) {
  const n = Number(num);
  return new Intl.NumberFormat("id-ID").format(isNaN(n) ? num : n);
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

function formatDateTime(date) {
  try {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return new Date(date).toLocaleString("id-ID");
  }
}

function safeUrl(u) {
  if (!u) return null;
  return String(u).replace(/`/g, "").trim();
}

function openInvoice(url) {
  const u = safeUrl(url);
  if (u) window.open(u, "_blank");
}

const statusMap = {
  pending: { color: "info", label: "Pesanan Diproses" },
  confirmed: { color: "info", label: "Pesanan Dikonfirmasi" },
  cancelled: { color: "danger", label: "Pesanan Dibatalkan" },
};

const paymentStatusMap = {
  unpaid: { color: "warning", label: "Pembayaran Belum Dibayar" },
  paid: { color: "success", label: "Pembayaran Sudah Dibayar" },
  failed: { color: "danger", label: "Pembayaran Gagal" },
};

const shippingStatusMap = {
  pending: { color: "warning", label: "Belum Dikirim" },
  on_the_way: { color: "info", label: "Dalam Perjalanan" },
  received: { color: "success", label: "Sudah Diterima" },
};

const deliveryStatusMap = {
  pending: { color: "warning", label: "Belum Diterima" },
  shipped: { color: "info", label: "Dikirim" },
  delivered: { color: "success", label: "Sudah Diterima" },
};

function orderStatusClass(order) {
  const map = {
    pending: "border-yellow-200",
    confirmed: "border-blue-200",
    cancelled: "border-red-200",
    completed: "border-green-200",
  };
  return map[order.status] || "border-gray-200";
}
</script>

<style scoped></style>
