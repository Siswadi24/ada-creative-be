<template>
  <div>
    <UContainer class="py-6">
      <div class="flex items-center gap-2 mb-4">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="link"
          color="gray"
          @click="$router.back()"
        />
        <h1 class="text-xl font-bold">Konfirmasi Penerimaan Barang</h1>
      </div>

      <UCard class="mt-6 max-w-lg mx-auto p-6 space-y-4 bg-white">
        <div>
          <label class="block font-medium mb-1"
            >Upload Bukti Penerimaan Barang</label
          >
          <UInput
            :ui="{
              base: 'bg-white text-black/85',
            }"
            class="w-full text-white"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
          />
          <div v-if="previewUrl" class="mt-3">
            <img
              :src="previewUrl"
              alt="Preview Bukti"
              class="rounded-lg shadow max-h-64 object-contain"
            />
          </div>
        </div>

        <div>
          <label class="flex font-medium mb-1">Catatan (Opsional)</label>
          <UTextarea
            v-model="form.note"
            :ui="{
              base: 'bg-white text-black/85',
            }"
            placeholder="Tambahkan catatan penerimaan..."
            class="w-full"
          />
        </div>

        <div class="flex justify-end mt-4 cursor-pointer">
          <UButton
            color="primary"
            size="md"
            :loading="isSubmitting"
            @click="submitConfirmation"
          >
            Kirim Konfirmasi
          </UButton>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const orderId = route.params.id;

const form = ref({
  proof: null,
  note: "",
});

const previewUrl = ref(null);
const isSubmitting = ref(false);

// Preview file
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  form.value.proof = file;
  previewUrl.value = URL.createObjectURL(file);
};

// Submit konfirmasi penerimaan barang
const submitConfirmation = async () => {
  if (!form.value.proof) {
    alert("Silakan upload bukti penerimaan terlebih dahulu.");
    return;
  }

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append("proof", form.value.proof);
    formData.append("note", form.value.note || "");

    // 🔥 panggil endpoint menggunakan useApi
    await useApi(`/server/api/orders/${orderId}/confirm-delivered`, {
      method: "POST",
      body: formData,
    });

    alert("Konfirmasi penerimaan barang berhasil dikirim!");
    router.push("/orders");
  } catch (error) {
    console.error(error);
    alert("Gagal mengirim konfirmasi. Silakan coba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
img {
  border: 1px solid #eee;
}
</style>
