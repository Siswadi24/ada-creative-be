<template>
  <NuxtLink class="group relative rounded-[24px] overflow-hidden bg-white shadow-md transition hover:shadow-lg flex flex-col" :to="`/product/${slug}`">
    <!-- Diskon -->
    <div v-if="discount" class="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded z-10">
      -{{ formattedDiscount }}%
    </div>

    <!-- Gambar Produk -->
    <NuxtImg
      format="webp"
      :src="image"
      :alt="`${title} - Grosiin`"
      class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
    />

    <!-- Detail -->
    <div class="flex flex-col justify-between px-4 py-3 flex-1 text-left">
      <!-- Judul -->
      <h3 class="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
        {{ title }}
      </h3>

      <!-- Harga + Terjual -->
      <div class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div class="text-[15px] font-semibold text-gray-900">
          <span class="text-xs align-top mr-0.5">Rp</span>{{ formattedPrice }}
        </div>
        <div v-if="sale !== 0" class="text-xs text-gray-500">
          {{ formattedSale }} Terjual
        </div>
      </div>

      <!-- Units dan Stock -->
      <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
        <div v-if="units !== undefined">{{ units }}</div>
        <div v-if="stock !== 0">{{ stock }} stok</div>
      </div>
    </div>
  </NuxtLink>
</template>


<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  sale: {
    type: Number,
    default: undefined,
  },
  discount: {
    type: Number,
    default: undefined,
  },
  units: {
    type: String,
    default: "",
  },
  slug: {
    type: String,
    default: "",
  },
});
const formattedPrice = computed(() => formatNumber(props.price));
const formattedSale = computed(() => formatNumber(props.sale));
const formattedDiscount = computed(() => formatNumber(props.discount));
</script>

<style scoped>
</style>