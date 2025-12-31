import { defineStore } from "pinia";
import { useSession } from "./session";

export const usePaymentMethodStore = defineStore("paymentMethod", {
    state: () => ({
        paymentMethods: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchPaymentMethods() {
            this.loading = true;
            this.error = null;

            // Ambil token dari session atau cookie
            const session = useSession();
            const tokenCookie = useCookie('access_token');
            const token = session.token || tokenCookie.value;

            try {
                // Gunakan $fetch bukan useApi/useFetch untuk request di dalam action
                const response = await $fetch("/server/api/payment-methods", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    onResponseError({ response }) {
                        if (response?._data?.message) {
                            throw createError({
                                statusCode: response.status,
                                statusMessage: response._data.message,
                                data: response._data,
                            });
                        }
                    },
                });

                // $fetch mengembalikan data mentah (bukan Ref)
                this.paymentMethods = response?.data || response || [];
                return this.paymentMethods;
            } catch (err) {
                this.error = err?.data?.message ||
                    err?.statusMessage ||
                    'Terjadi kesalahan, silakan coba lagi'
                // console.error("Failed to fetch payment methods:", err);
            } finally {
                this.loading = false;
            }
        },
    },

    getters: {
        activePaymentMethods: (state) => {
            return state.paymentMethods.filter((method) => method.is_active);
        },
    },
});
