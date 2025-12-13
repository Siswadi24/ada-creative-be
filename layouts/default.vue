<template>
  <div class="default-layout">
    <LayoutsTopNavbar />
    <main class="main-layout">
      <slot />
    </main>
    <LayoutsFooter />
    <LayoutsBottomNavbar class="md:hidden"/>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import "~/assets/css/main.css";

.default-layout {
  @apply flex flex-col;
  @apply min-h-screen;
  @apply pb-[58px] md:pb-0;
  @apply w-full;
  min-width: 0;
  @apply bg-white;
}

.main-layout {
  @apply pt-20 sm:pt-20 md:pt-16;
  @apply flex-1;
  @apply text-black/85 ;
}
</style>
