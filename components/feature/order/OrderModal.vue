<template>
  <UModal
    v-model="isOpen"
    title="Detail Order"
    :ui="{
      wrapper: 'z-[9999] w-full',
      body: 'p-4 sm:p-6',
      base: 'sm:rounded-lg rounded-none'
    }"
  >
    <template #content>
      <div v-if="order" class="space-y-4 text-sm text-gray-700">
        <div>
          <p><strong>Alamat:</strong> {{ order.address }}</p>
          <p><strong>Catatan:</strong> {{ order.note || '-' }}</p>
          <p>
            <strong>Status:</strong>
            {{ statusMap[order.status]?.label || order.status }}
          </p>
          <p>
            <strong>Pembayaran:</strong>
            {{ paymentStatusMap[order.payment_status]?.label || order.payment_status }}
          </p>
        </div>

        <div class="border-t pt-3 space-y-2">
          <p class="font-semibold">Daftar Produk:</p>
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.product.name }} (x{{ item.quantity }})</span>
            <span>Rp{{ formatNumber(item.subtotal) }}</span>
          </div>
        </div>

        <div class="flex justify-between font-bold border-t pt-3">
          <span>Total</span>
          <span>Rp{{ formatNumber(order.total ?? order.total_price) }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton color="gray" variant="subtle" block @click="$emit('close')">
        Tutup
      </UButton>
    </template>
  </UModal>
</template>

<script setup>
const isOpen = defineModel('isOpen', { type: Boolean, default: false })

defineProps({
  order: { type: Object, default: null }
})

defineEmits(["close"])

// helper number
function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num)
}

const statusMap = {
  process: { color: "warning", label: "Sedang Diproses" },
  completed: { color: "success", label: "Selesai" },
  cancelled: { color: "danger", label: "Dibatalkan" },
  pending: { color: "warning", label: "Menunggu Pembayaran" },
}

const paymentStatusMap = {
  unpaid: { color: "warning", label: "Belum Dibayar" },
  paid: { color: "success", label: "Sudah Dibayar" },
  failed: { color: "danger", label: "Gagal" },
  waiting_confirmation: { color: "warning", label: "Menunggu Konfirmasi" },
}
</script>
