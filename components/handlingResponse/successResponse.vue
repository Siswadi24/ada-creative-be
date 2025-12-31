<template>
  <Teleport to="body">
    <Transition
      name="success-modal"
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
          <!-- Success Icon with Animation -->
          <div class="text-center pt-8 pb-4">
            <div class="relative inline-flex items-center justify-center">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Transition
                  name="checkmark"
                  enter-active-class="transition-all duration-500 ease-out delay-200"
                  enter-from-class="scale-0 rotate-180"
                  enter-to-class="scale-100 rotate-0"
                >
                  <UIcon
                    v-if="showCheckmark"
                    name="i-heroicons-check"
                    class="w-10 h-10 text-green-600"
                  />
                </Transition>
              </div>
              <!-- Ripple Effect -->
              <div class="absolute inset-0 w-20 h-20 bg-green-200 rounded-full animate-ping opacity-20"></div>
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
                class="flex-1 text-black/50"
                @click="handleSecondaryAction"
              >
                {{ secondaryButtonText }}
              </UButton>
              
              <UButton
                color="green"
                class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
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
    default: 'Berhasil!'
  },
  message: {
    type: String,
    default: 'Operasi berhasil dilakukan'
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
const showCheckmark = ref(false)

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
  
  // Show checkmark with delay for animation
  nextTick(() => {
    setTimeout(() => {
      showCheckmark.value = true
    }, 100)
  })
}

function hideModal() {
  isVisible.value = false
  showCheckmark.value = false
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