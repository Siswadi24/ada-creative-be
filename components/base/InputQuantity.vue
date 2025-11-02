<template>
  <div class="input-quantity">
    <UButton
      color="white"
      icon="i-heroicons:minus"
      variant="none"
      class="text-black/80"
      @click="handleDecrease"
    />
    <UInput
      v-model="model"
      type="number"
      :padded="false"
      variant="none"
      class="text-blue-500"
    />
    <UButton
      color="white"
      icon="i-heroicons:plus"
      variant="none"
      class="text-black/80"
      @click="handleIncrease"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 10,
  },
});

const model = defineModel({
  default: 1,
  type: Number,
});

function handleDecrease() {
  if (model.value > props.min) {
    model.value--;
  }
}

function handleIncrease() {
  if (model.value < props.max) {
    model.value++;
  }
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

.input-quantity {
  @apply flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden shadow-sm;
}

.input-quantity :deep(input) {
  @apply w-10 sm:w-12 md:w-16 h-10 text-center text-base outline-none bg-transparent text-black/80;
}

.input-quantity :deep(input)::-webkit-outer-spin-button,
.input-quantity :deep(input)::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.input-quantity :deep(input)[type="number"] {
  -moz-appearance: textfield;
}

.input-quantity :deep(button) {
  @apply h-10 w-10 flex items-center justify-center transition hover:bg-gray-100 dark:hover:bg-gray-800;
}
</style>
