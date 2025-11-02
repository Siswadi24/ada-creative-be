<template>
  <nav
    class="fixed bottom-0 z-10 w-full max-w-md mx-auto bg-gray-100 border-t-2 border-gray-300 flex justify-around p-3 text-sm 
           rounded-t-2xl shadow-lg"
  >
    <NuxtLink 
      to="/" 
      class="flex flex-col items-center px-2 py-2 rounded-lg text-gray-600 min-w-0 flex-shrink-0"
    >
      <span><Icon name="i-lucide-home" class="text-xl sm:text-2xl mb-1" /></span>
      <span class="text-xs sm:text-sm font-medium truncate">Beranda</span>
    </NuxtLink>
    
    <NuxtLink 
      to="/product" 
      class="flex flex-col items-center px-2 py-2 rounded-lg text-gray-600 min-w-0 flex-shrink-0"
    >
      <span><Icon name="i-lucide-box" class="text-xl sm:text-2xl mb-1" /></span>
      <span class="text-xs sm:text-sm font-medium truncate">Produk</span>
    </NuxtLink>
    
    <NuxtLink 
      to="/services" 
      class="flex flex-col items-center px-2 py-2 rounded-lg text-gray-600 min-w-0 flex-shrink-0"
    >
      <span><Icon name="i-lucide-cog" class="text-xl sm:text-2xl mb-1" /></span>
      <span class="text-xs sm:text-sm font-medium truncate">Layanan</span>
    </NuxtLink>
    
    <NuxtLink 
      to="/contact" 
      class="flex flex-col items-center px-2 py-2 rounded-lg text-gray-600 min-w-0 flex-shrink-0"
    >
      <span><Icon name="i-lucide-phone" class="text-xl sm:text-2xl mb-1" /></span>
      <span class="text-xs sm:text-sm font-medium truncate">Kontak</span>
    </NuxtLink>
    
    <NuxtLink 
      to="/profile" 
      class="flex flex-col items-center px-2 py-2 rounded-lg text-gray-600 min-w-0 flex-shrink-0"
    >
      <span><Icon name="i-lucide-user" class="text-xl sm:text-2xl mb-1" /></span>
      <span class="text-xs sm:text-sm font-medium truncate">Akun</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.router-link-active {
  @apply bg-blue-600 text-white
         transition-colors duration-300 ease-in-out 
         transform scale-105 font-semibold
         rounded-xl shadow-lg;
}

/* Enhanced styling for better visibility for older users */
nav a {
  @apply transition-all duration-200 hover:bg-gray-200;
}

/* nav a:hover {
  @apply text-gray-800;
} */

/* Responsive adjustments for mobile screens - more balanced sizing */
@media (max-width: 640px) {
  nav {
    @apply px-2 py-3;
  }
  
  nav a {
    @apply px-1.5 py-2;
  }
  
  nav a span:last-child {
    @apply text-sm font-medium;
  }
  
  nav a span:first-child {
    @apply text-xl;
  }
  
  .router-link-active {
    @apply scale-105;
  }
}

/* For very small screens */
@media (max-width: 360px) {
  nav {
    @apply px-1 py-2;
  }
  
  nav a {
    @apply px-1 py-1.5;
  }
  
  nav a span:last-child {
    @apply text-xs font-medium;
  }
  
  nav a span:first-child {
    @apply text-lg;
  }
  
  .router-link-active {
    @apply scale-100;
  }
}
</style>
