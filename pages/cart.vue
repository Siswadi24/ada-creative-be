<template>
  <UContainer class="py-6">
    <!-- Header dengan checkbox select all -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-arrow-left" variant="link" color="gray" @click="$router.back()" />
        <h1 class="text-xl font-bold">Keranjang Saya</h1>
      </div>
      <div v-if="cartItems.length" class="flex items-center gap-2">
        <input 
          type="checkbox" 
          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          :checked="isAllSelected"
          @change="toggleSelectAll"
        >
        <span class="text-sm text-gray-600">Pilih Semua</span>
      </div>
    </div>

    <!-- Kalau kosong -->
    <div v-if="!cartItems.length" class="flex flex-col items-center gap-4 py-10">
      <NuxtImg width="300" format="webp" src="/assets/no-data-found.png" />
      <span class="text-gray-400">Keranjang kosong.</span>
    </div>

    <!-- Kalau ada isi -->
    <div v-else class="space-y-4">
      <!-- Card List produk -->
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
      >
        <div class="flex items-start gap-3">
          <!-- Checkbox -->
          <input 
            type="checkbox" 
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
            :checked="selectedItems.includes(item.id)"
            @change="toggleSelectItem(item.id)"
          >
          
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
            <div class="flex justify-between items-start">
              <div class="flex-1 pr-2">
                <h3 class="font-semibold text-gray-900 truncate">{{ item.product.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  Rp{{ formatNumber(item.product.price) }} per item
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-sm text-gray-600">Qty: {{ item.quantity }}</span>
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
                class="text-red-500 hover:text-red-700 hover:bg-red-50"
                @click="() => removeFromCart(item.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Selected items summary -->
      <div v-if="selectedItems.length" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
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
      <div class="sticky bottom-0 bg-white border-t pt-4">
        <UButton
          color="primary"
          size="lg"
          class="w-full"
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
import SuccessResponse from '~/components/handlingResponse/successResponse.vue'

definePageMeta({
  middleware: ["must-auth"],
})

// Ambil cart menggunakan useApi
const { data, refresh } = await useApi("server/api/cart", {
  server: false
})

const cartItems = computed(() => data.value?.items?.data || [])

// State untuk select items
const selectedItems = ref([])

// State untuk success modal
const showSuccessModal = ref(false)
const apiResponse = ref(null)

// Computed untuk select all
const isAllSelected = computed({
  get: () => selectedItems.value.length > 0 && selectedItems.value.length === cartItems.value.length,
  set: (val) => {
    if (val) {
      selectedItems.value = cartItems.value.map(item => item.id)
    } else {
      selectedItems.value = []
    }
  }
})

// Total selected items
const selectedTotal = computed(() => {
  return cartItems.value
    .filter(item => selectedItems.value.includes(item.id))
    .reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
})

// Functions
function toggleSelectAll() {
  isAllSelected.value = !isAllSelected.value
}

function toggleSelectItem(itemId) {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

// Menu items untuk dropdown
function _getMenuItems(item) {
  console.log('🎯 Creating menu items for item:', item.id)
  
  const menuItems = [
    [
      {
        label: 'Hapus dari keranjang',
        icon: 'i-heroicons-trash',
        value: 'delete' // Gunakan value untuk identifier
      }
    ]
  ]
  
  console.log('📋 Menu items created:', menuItems)
  return menuItems
}

// Handle menu selection
function _handleMenuSelect(selectedItem, cartItem) {
  console.log('🖱️ Menu item selected:', selectedItem)
  console.log('🖱️ Cart item:', cartItem)
  
  if (selectedItem.value === 'delete') {
    console.log('�️ Delete action triggered for item:', cartItem.id)
    removeFromCart(cartItem.id)
  }
}

// Remove item dari cart
async function removeFromCart(itemId) {
  if (!confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
    return
  }

  try {
    const { data: response } = await useApi(`server/api/cart/${itemId}`, {
      method: "DELETE"
    })
    
    // Remove from selected items jika ada
    const index = selectedItems.value.indexOf(itemId)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    }
    
    // Refresh cart data
    await refresh()
    
    // Store API response and show success modal
    apiResponse.value = response.value
    showSuccessModal.value = true
    
  } catch (err) {
    let errorMessage = "Unknown error"
    if (err.data?.message) {
      errorMessage = err.data.message
    } else if (err.message) {
      errorMessage = err.message
    } else if (err.status) {
      errorMessage = `HTTP ${err.status}: ${err.statusText || 'Request failed'}`
    }
    
    alert("Gagal menghapus item: " + errorMessage)
  }
}

// Format angka
function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num)
}

// Checkout - redirect ke halaman checkout dengan selected items
async function handleCheckout() {
  if (!selectedItems.value.length) {
    return alert("Pilih item yang ingin di-checkout")
  }

  // Get selected cart items
  const selectedCartItems = cartItems.value.filter(item => 
    selectedItems.value.includes(item.id)
  )

  // Store selected items di localStorage untuk dikirim ke halaman checkout
  localStorage.setItem('checkoutItems', JSON.stringify({
    items: selectedCartItems,
    total: selectedTotal.value
  }))

  // Redirect ke halaman checkout
  navigateTo('/checkout')
}

// Handle success modal actions
function handleSuccessAction() {
  showSuccessModal.value = false
  // Tetap di halaman cart
}

function handleSecondaryAction() {
  showSuccessModal.value = false
  // Redirect ke halaman produk untuk lanjut belanja
  navigateTo('/product')
}
</script>
