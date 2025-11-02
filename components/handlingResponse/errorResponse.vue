<template>
  <Teleport to="body">
    <Transition
      name="error-modal"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
          @click.stop
        >
          <!-- Error Icon with Animation -->
          <div class="text-center pt-8 pb-4">
            <div class="relative inline-flex items-center justify-center">
              <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Transition
                  name="error-icon"
                  enter-active-class="transition-all duration-500 ease-out delay-200"
                  enter-from-class="scale-0 rotate-180"
                  enter-to-class="scale-100 rotate-0"
                >
                  <UIcon
                    v-if="showErrorIcon"
                    name="i-heroicons-x-mark"
                    class="w-10 h-10 text-red-600"
                  />
                </Transition>
              </div>
              <!-- Ripple Effect -->
              <div class="absolute inset-0 w-20 h-20 bg-red-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="px-8 pb-8">
            <h3 class="text-xl font-bold text-gray-900 text-center mb-3">
              {{ title }}
            </h3>
            
            <p class="text-gray-600 text-center mb-6 leading-relaxed">
              {{ message }}
            </p>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <UButton
                v-if="showSecondaryButton"
                color="gray"
                variant="outline"
                class="flex-1"
                @click="handleSecondaryAction"
              >
                {{ secondaryButtonText }}
              </UButton>
              
              <UButton
                color="red"
                class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                @click="handlePrimaryAction"
              >
                {{ primaryButtonText }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  // Visibility control
  modelValue: {
    type: Boolean,
    default: false
  },
  
  // Content props
  title: {
    type: String,
    default: 'Terjadi Kesalahan!'
  },
  message: {
    type: String,
    default: 'Terjadi kesalahan saat memproses permintaan Anda'
  },
  
  // Button customization
  primaryButtonText: {
    type: String,
    default: 'OK'
  },
  secondaryButtonText: {
    type: String,
    default: 'Batal'
  },
  showSecondaryButton: {
    type: Boolean,
    default: false
  },
  
  // Auto close - disabled by default to let user take action
  autoClose: {
    type: Boolean,
    default: false
  },
  autoCloseDelay: {
    type: Number,
    default: 3000
  },
  
  // Backdrop click to close
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'primary-action', 'secondary-action', 'close'])

// Reactive data
const isVisible = ref(false)
const showErrorIcon = ref(false)

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    showModal()
  } else {
    hideModal()
  }
}, { immediate: true })

// Methods
function showModal() {
  isVisible.value = true
  
  // Show error icon with delay for animation
  nextTick(() => {
    setTimeout(() => {
      showErrorIcon.value = true
    }, 100)
  })
}

function hideModal() {
  isVisible.value = false
  showErrorIcon.value = false
}

function closeModal() {
  emit('update:modelValue', false)
  emit('close')
}

function handlePrimaryAction() {
  emit('primary-action')
  closeModal()
}

function handleSecondaryAction() {
  emit('secondary-action')
  closeModal()
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    closeModal()
  }
}
</script>

<style scoped>
</style>