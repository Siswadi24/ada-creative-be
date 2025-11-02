<template>
  <UContainer class="py-6">
    <div class="max-w-md mx-auto">
      <!-- Profile Header -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative w-28 h-28 rounded-full overflow-hidden shadow">
          <img
            :src="session.profile.avatar || '/assets/user.png'"
            alt="Profile"
            class="w-full h-full object-cover"
          />
          <!-- Edit Icon -->
          <button
            class="absolute bottom-2 right-2 bg-primary-600 text-white p-1.5 rounded-full shadow"
            @click="router.push('/dataprofile/edit')"
          >
            <Icon name="lucide:pencil" size="16" />
          </button>
        </div>
        <h1 class="text-xl font-bold mt-3">{{ session.profile.name }}</h1>
        <p class="text-gray-500">Akun</p>
      </div>

      <!-- Menu List -->
      <div class="space-y-3">
        <button
          class="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:bg-gray-50 w-full"
          @click="router.push('/dataprofile/edit')"
        >
          <div class="flex items-center gap-3">
            <Icon name="lucide:user" class="text-primary-600" size="20" />
            <span class="font-medium">Ubah Profil</span>
          </div>
          <Icon name="lucide:chevron-right" class="text-gray-400" />
        </button>

        <button
          class="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:bg-gray-50 w-full"
        >
          <div class="flex items-center gap-3">
            <Icon name="lucide:bell" class="text-primary-600" size="20" />
            <span class="font-medium">Pemberitahuan</span>
          </div>
          <Icon name="lucide:chevron-right" class="text-gray-400" />
        </button>

        <button
          class="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:bg-gray-50 w-full"
        >
          <div class="flex items-center gap-3">
            <Icon name="lucide:map-pin" class="text-primary-600" size="20" />
            <span class="font-medium">Alamat Reseller</span>
          </div>
          <Icon name="lucide:chevron-right" class="text-gray-400" />
        </button>

        <button
          class="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:bg-gray-50 w-full"
          @click="router.push('/orders')"
        >
          <div class="flex items-center gap-3">
            <Icon name="lucide:truck" class="text-primary-600" size="20" />
            <span class="font-medium">Cek Pesanan</span>
          </div>
          <Icon name="lucide:chevron-right" class="text-gray-400" />
        </button>
      </div>

      <!-- Logout -->
      <div class="mt-8">
        <button
          class="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
          @click="showLogoutConfirm = true"
        >
          Sign Out
        </button>
      </div>
    </div>

    <!-- Modal Konfirmasi Logout -->
    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Konfirmasi Logout</h2>
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin keluar?</p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            @click="showLogoutConfirm = false"
          >
            Batal
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            @click="handleLogout"
          >
            Ya, Logout
          </button>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
definePageMeta({
  middleware: ["must-auth"],
});

const session = useSession();
const router = useRouter();
const showLogoutConfirm = ref(false);

async function handleLogout() {
  await session.logout();
  router.push("/login");
}
</script>
