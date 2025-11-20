<template>
  <UContainer class="py-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">Detail Pesanan #{{ route.params.id }}</h1>
        <p v-if="order" class="text-xs text-gray-500">
          {{
            new Date(order.created_at || order.invoice_date).toLocaleString(
              "id-ID"
            )
          }}
        </p>
      </div>

      <div v-if="order" class="flex gap-2">
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
    <div v-else-if="!order" class="space-y-4">
      <p class="text-gray-600">Order tidak ditemukan.</p>
      <UButton color="gray" @click="router.back()">Kembali</UButton>
    </div>

    <div v-else class="space-y-6">
      <!-- Info Invoice & Order -->
      <div class="border rounded-md p-4 space-y-2">
        <p>
          <strong>Invoice:</strong> {{ order.invoice_number }}
          <span v-if="order.invoice_date">
            ({{
              new Date(order.invoice_date).toLocaleDateString("id-ID")
            }})</span
          >
        </p>
        <p><strong>Alamat:</strong> {{ order.address }}</p>
        <p><strong>Catatan:</strong> {{ order.note || "-" }}</p>
        <p v-if="order.paid_at">
          <strong>Dibayar:</strong>
          {{ new Date(order.paid_at).toLocaleString("id-ID") }}
        </p>
      </div>

      <!-- Pengiriman -->
      <div class="border rounded-md p-4 space-y-1">
        <p class="font-semibold">Pengiriman</p>
        <p>
          <strong>Status Pengiriman:</strong>
          {{
            shippingStatusMap[order.shipping_status]?.label ||
            order.shipping_status
          }}
        </p>
        <p v-if="order.delivery_status">
          <strong>Status Penerimaan:</strong>
          {{
            deliveryStatusMap[order.delivery_status]?.label ||
            order.delivery_status
          }}
        </p>
        <p v-if="order.tracking_number">
          <strong>No. Resi:</strong> {{ order.tracking_number }}
        </p>
        <p v-if="order.shipping_cost">
          <strong>Biaya Kirim:</strong> Rp{{
            formatNumber(order.shipping_cost)
          }}
        </p>
      </div>

      <!-- Items -->
      <div class="border rounded-md p-4 space-y-2">
        <p class="font-semibold">Daftar Produk</p>
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between text-sm"
        >
          <span
            >{{ item.product?.name || "Produk" }} (x{{ item.quantity }})</span
          >
          <span>Rp{{ formatNumber(item.subtotal) }}</span>
        </div>
        <div class="flex justify-between font-bold border-t pt-3">
          <span>Total</span>
          <span>Rp{{ formatNumber(order.total ?? order.total_price) }}</span>
        </div>
      </div>

      <!-- Payments -->
      <div class="border rounded-md p-4 space-y-2">
        <p class="font-semibold">Pembayaran</p>
        <template v-if="order.payments && order.payments.length">
          <div
            v-for="p in order.payments"
            :key="p.id"
            class="flex justify-between text-sm"
          >
            <span>{{ new Date(p.payment_date).toLocaleString("id-ID") }}</span>
            <span>Rp{{ formatNumber(p.amount) }}</span>
          </div>
        </template>
        <p v-else class="text-gray-500">Belum ada pembayaran.</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <UButton
          v-if="safeUrl(order?.invoice_url)"
          color="primary"
          @click="openInvoice(order.invoice_url)"
          >Buka Invoice</UButton
        >
        <UButton color="gray" variant="subtle" @click="router.back()"
          >Kembali</UButton
        >
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
</script>

<style scoped>
</style>