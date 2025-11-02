<template>
  <UModal
    default-open
    transition
    title="Pengumuman"
    description="Deskripsi pengumuman penting"
    :ui="{
      wrapper: 'w-full',
      body: 'p-0 sm:p-0',
    }"
  >
    <template #content>
      <div v-if="image && !title" class="relative w-full h-full">
        <UButton
          color="success"
          icon="i-heroicons-x-mark"
          variant="none"
          class="absolute top-4 right-4 text-black cursor-pointer"
          @click="$emit('close')"
        />
        <NuxtImg
          :src="image"
          format="webp"
          class="w-full h-full object-cover"
          alt="Modal Image"
        />
      </div>

      <!-- Jika hanya text -->
      <div
        v-else-if="title && !image"
        class="relative bg-white rounded-base text-center h-full"
      >
        <h2 v-if="title" class="text-lg font-medium text-black/80">
          {{ title }}
        </h2>
      </div>

      <!-- Jika ada teks (judul), tampil seperti biasa -->
      <div v-else class="relative bg-white rounded-base text-center h-full">
        <UButton
          color="success"
          icon="i-heroicons-x-mark"
          variant="none"
          class="absolute top-4 right-4 text-black cursor-pointer"
          @click="$emit('close')"
        />
        <NuxtImg
          v-if="image"
          :src="image"
          format="webp"
          class="w-full mb-4 object-cover"
          alt="Modal Image"
        />

        <h2
          v-if="title"
          class="text-lg font-medium text-black/80 justify-start"
        >
          {{ title }}
        </h2>
      </div>
    </template>
    <template #footer> Ini Footer </template>
  </UModal>
</template>

<script setup>
defineEmits(["close"]);

defineProps({
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
});
</script>
