<template>
  <div class="min-h-screen bg-gray-50/50">
    <UContainer class="py-8 max-w-2xl">
      <!-- Header -->
      <div class="mb-8">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="gray"
          class="mb-4 -ml-2"
          @click="$router.back()"
        >
          Kembali
        </UButton>
        <h1 class="text-2xl font-bold text-gray-900">Konfirmasi Penerimaan</h1>
        <p class="text-gray-500 mt-1">
          Pastikan barang yang Anda terima sesuai dengan pesanan #{{ orderId }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingOrder" class="space-y-4">
        <USkeleton class="h-48 w-full rounded-xl" />
        <USkeleton class="h-12 w-full rounded-lg" />
      </div>

      <!-- Main Content -->
      <UCard
        v-else
        class="overflow-hidden bg-white shadow-lg ring-1 ring-gray-200/50"
      >
        <!-- Order Info Preview -->
        <div
          v-if="order"
          class="bg-blue-50/50 p-4 border-b border-blue-100 mb-6 -mx-6 -mt-6"
        >
          <div class="flex items-start gap-3">
            <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
              <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6" />
            </div>
            <div>
              <p class="font-medium text-gray-900">
                Pesanan {{ order.invoice_number }}
              </p>
              <p class="text-sm text-gray-600 mt-0.5">
                {{ order.items_count || order.items?.length || 0 }} Item Barang
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(order.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <!-- Camera Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="block font-semibold text-gray-900">
                Bukti Foto Penerimaan
                <span class="text-red-500">*</span>
              </label>
              <UBadge v-if="form.proof" color="green" variant="subtle" size="xs"
                >Foto Terambil</UBadge
              >
            </div>

            <!-- Camera Interface -->
            <div
              class="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/3] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center group"
            >
              <!-- 1. Start Camera State -->
              <div v-if="!isCameraOpen && !previewUrl" class="text-center p-6">
                <div
                  class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-300 transition-colors"
                >
                  <UIcon
                    name="i-heroicons-camera"
                    class="w-8 h-8 text-gray-500"
                  />
                </div>
                <p class="text-gray-600 font-medium mb-1">
                  Ambil Foto Langsung
                </p>
                <p class="text-sm text-gray-500 mb-4">
                  Upload file tidak diizinkan untuk keamanan
                </p>
                <UButton
                  icon="i-heroicons-camera"
                  color="primary"
                  class="mb-3"
                  @click="startCamera"
                >
                  Buka Kamera
                </UButton>
              </div>

              <!-- 2. Camera View Finder -->
              <div v-show="isCameraOpen" class="absolute inset-0 bg-black">
                <video
                  ref="videoRef"
                  autoplay
                  playsinline
                  class="w-full h-full object-cover transform scale-x-[-1]"
                ></video>
                <div
                  class="absolute bottom-4 left-0 right-0 flex justify-center gap-4 p-4 bg-gradient-to-t from-black/50 to-transparent"
                >
                  <UButton
                    color="white"
                    variant="solid"
                    size="xl"
                    :ui="{ rounded: 'rounded-full' }"
                    class="w-16 h-16 p-0 flex items-center justify-center border-4 border-white/30"
                    @click="takePhoto"
                  >
                    <div class="w-12 h-12 bg-white rounded-full"></div>
                  </UButton>
                  <UButton
                    icon="i-heroicons-x-mark"
                    color="info"
                    variant="ghost"
                    class="absolute right-4 top-1/2 -translate-y-1/2"
                    @click="stopCamera"
                  />
                </div>
              </div>

              <!-- 3. Preview Result -->
              <div
                v-if="previewUrl && !isCameraOpen"
                class="absolute inset-0 bg-black"
              >
                <img :src="previewUrl" class="w-full h-full object-contain" />
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
                >
                  <UButton
                    icon="i-heroicons-arrow-path"
                    color="error"
                    variant="solid"
                    @click="retakePhoto"
                  >
                    Foto Ulang
                  </UButton>
                </div>
                <button
                  class="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                  title="Ambil Ulang Foto"
                  @click="retakePhoto"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <p class="text-xs text-gray-500 flex items-center gap-1">
              <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
              Pastikan foto menampilkan kondisi barang dengan jelas
            </p>
          </div>

          <!-- Notes Section -->
          <div class="space-y-2">
            <label class="block font-semibold text-gray-900"
              >Catatan Tambahan</label
            >
            <UTextarea
            v-model="form.note"
            :ui="{ base: 'bg-white text-black/85 w-full' }"
              placeholder="Contoh: Barang diterima dengan baik, packing aman..."
              :rows="3"
              variant="outline"
              class="bg-gray-50 w-full"
            />
          </div>

          <!-- Action Buttons -->
          <div
            class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end"
          >
            <UButton
              color="gray"
              variant="ghost"
              class="bg-gray-100 justify-center"
              icon="i-heroicons-arrow-left-circle"
              size="lg"
              @click="$router.back()"
            >
              Batal
            </UButton>
            <UButton
              color="primary"
              size="lg"
              :loading="isSubmitting"
              :disabled="!form.proof"
              icon="i-heroicons-check-circle"
              class="justify-center"
              @click="submitConfirmation"
            >
              Konfirmasi Penerimaan
            </UButton>
          </div>
        </div>
      </UCard>
    </UContainer>

    <!-- Hidden Canvas for capture -->
    <canvas ref="canvasRef" class="hidden"></canvas>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const toast = useToast();

const orderId = route.params.id;
const isLoadingOrder = ref(false);
const order = ref(null);

const form = ref({
  proof: null,
  note: "",
});

const previewUrl = ref(null);
const isSubmitting = ref(false);

// Camera Refs
const videoRef = ref(null);
const canvasRef = ref(null);
const isCameraOpen = ref(false);
const stream = ref(null);

// Fetch basic order info
onMounted(async () => {
  isLoadingOrder.value = true;
  try {
    const { data } = await useApi(`/server/api/orders/${orderId}`, {
      server: false,
    });
    if (data.value) {
      order.value = data.value.data || data.value;
    }
  } catch (err) {
    // console.error("Failed to fetch order", err);
    toast.add({
      title: "Gagal Memuat Pesanan",
      description: "Tidak dapat mengambil informasi pesanan. Silakan coba lagi.",
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    })
  } finally {
    isLoadingOrder.value = false;
  }
});

onBeforeUnmount(() => {
  stopCamera();
});

// Camera Functions
const startCamera = async () => {
  try {
    isCameraOpen.value = true;
    await nextTick(); // Wait for video element to exist

    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
    }
  } catch (err) {
    // console.error("Camera error:", err);
    isCameraOpen.value = false;

    // Fallback error message
    toast.add({
      title: "Gagal Membuka Kamera",
      description:
        "Pastikan Anda memberikan izin akses kamera pada browser ini.",
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
  isCameraOpen.value = false;
};

const takePhoto = () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;

  // Set canvas size to match video dimension
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  // Mirror if front camera (optional, but usually front cam is mirrored)
  // Here we assume environment (back) camera, so no mirror usually needed unless user flips
  // But CSS transform scale-x-[-1] mirrors the preview, we might want the capture to be normal
  // or mirrored depending on preference. Usually back camera photo should be normal.

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(
    (blob) => {
      if (blob) {
        const file = new File([blob], `proof-${orderId}-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        form.value.proof = file;
        previewUrl.value = URL.createObjectURL(blob);
        stopCamera();
      }
    },
    "image/jpeg",
    0.8
  ); // 0.8 quality
};

const retakePhoto = () => {
  form.value.proof = null;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  startCamera();
};

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Submit Logic
const submitConfirmation = async () => {
  if (!form.value.proof) {
    toast.add({
      title: "Foto Wajib Diisi",
      description: "Silakan ambil foto bukti penerimaan terlebih dahulu.",
      color: "yellow",
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append("received_proof", form.value.proof);
    formData.append("received_note", form.value.note || "");

    await useApi(`/server/api/orders/${orderId}/confirm-delivered`, {
      method: "POST",
      body: formData,
    });

    toast.add({
      title: "Berhasil!",
      description: "Konfirmasi penerimaan barang berhasil dikirim.",
      color: "green",
      icon: "i-heroicons-check-circle",
    });

    // Give time for toast
    setTimeout(() => {
      router.push("/orders");
    }, 1500);
  } catch (error) {
    // console.error(error);
    toast.add({
      title: "Gagal Mengirim",
      description:"Terjadi kesalahan saat mengirim konfirmasi.",
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Ensure video covers the area nicely */
video {
  transform: scaleX(1); /* Reset mirror for back camera usually */
}
</style>
