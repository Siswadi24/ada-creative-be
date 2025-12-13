<template>
  <UContainer class="py-6 pb-20 sm:pb-6">
    <div class="max-w-md w-full mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          @click="router.push('/profile')"
          class="p-2 rounded-full hover:bg-gray-100"
        >
          <Icon name="lucide:arrow-left" />
        </button>
        <h1 class="text-xl font-bold truncate min-w-0">Edit Profile</h1>
      </div>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="saveProfile">
        <!-- Photo -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">Profile Photo</label>
          <div class="max-w-full overflow-hidden">
            <input type="file" accept="image/*" @change="onFileChange" />
          </div>
          <div v-if="preview" class="mt-2">
            <img
              :src="preview"
              class="w-24 h-24 object-cover rounded-full border"
            />
          </div>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">No.Telp</label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          :disabled="isUpdating"
          class="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isUpdating ? 'Menyimpan...' : 'Save' }}
        </button>
      </form>
    </div>

    <!-- Success Response Modal -->
    <SuccessResponse
      v-model="showSuccessModal"
      :title="apiResponse?.message || 'Profile Berhasil Diperbarui!'"
      :message="apiResponse?.message || 'Data profil Anda telah berhasil diperbarui.'"
      primary-button-text="Kembali ke Profil"
      @primary-action="handleSuccessAction"
    />
  </UContainer>
</template>

<script setup>
// Import komponen success response
import SuccessResponse from '~/components/handlingResponse/successResponse.vue'

const router = useRouter()
const session = useSession()
const { token: tokenSession } = storeToRefs(session)

const form = reactive({
  name: session?.profile?.name || "",
  username: session?.profile?.username || "",
  gender: session?.profile?.gender || "Male",
  phone: session?.profile?.phone || "",
  email: session?.profile?.email || "",
  photo: null,
})

const preview = ref(null)
const showSuccessModal = ref(false)
const isUpdating = ref(false)
const apiResponse = ref(null)

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.photo = file
    preview.value = URL.createObjectURL(file) // preview foto
  }
}

async function saveProfile() {
  try {
    isUpdating.value = true
    
    const fd = new FormData()
    fd.append("name", form.name)
    fd.append("username", form.username)
    fd.append("gender", form.gender)
    fd.append("phone", form.phone)
    fd.append("email", form.email)

    if (form.photo) {
      fd.append("photo", form.photo) // upload file
    }

    // Laravel butuh override _method untuk FormData
    fd.append("_method", "PUT")

    // Menggunakan useApi untuk update profile
    const { data: response } = await useApi('/server/api/me/update', {
      method: 'POST', // tetap POST biar FormData jalan
      headers: {
        Authorization: `Bearer ${tokenSession.value}`,
      },
      body: fd,
    })

    // update session biar UI ikut update
    if (response.value?.user) {
      session.profile = response.value.user
    }

    // Simpan response untuk ditampilkan di success modal
    apiResponse.value = response.value

    // Tampilkan success modal
    showSuccessModal.value = true
    
  } catch (err) {
    console.error("Update gagal:", err)
    
    // Tampilkan error dengan toast atau alert
    useNuxtApp().$toast?.add({
      title: 'Error',
      description: 'Gagal update profile! Silakan coba lagi.',
      color: 'red'
    }) || alert("Gagal update profile!")
    
  } finally {
    isUpdating.value = false
  }
}

function handleSuccessAction() {
  // Navigasi kembali ke profile setelah success
  router.push('/profile')
}
</script>
