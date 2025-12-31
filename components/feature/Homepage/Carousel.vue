<template>
  <UCarousel
    v-slot="{ item }"
    ref="carouselRef"
    :items="items"
    :ui="{ item: 'basis-full' }"
    class="rounded-lg overflow-hidden w-full mx-auto aspec-[3.39/1]"
    autoplay
    indicators
  >
    <img :src="item" class="w-full object-cover" draggable="false" />
  </UCarousel>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped></style>