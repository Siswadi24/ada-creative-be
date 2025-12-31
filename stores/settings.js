import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settingsApp', () => {
    const settings = ref({});
    const isLoading = ref(false);
    const error = ref(null);
    
    async function fetchSettings() {
        // Prevent double fetching if already loading
        if (isLoading.value) return;

        isLoading.value = true;
        error.value = null;
        try {
            // Use $fetch for imperative calls in actions
            // We need to manually handle headers since we're not using useApi (which uses useFetch)
            const session = useSession();
            const tokenCookie = useCookie('access_token');
            const token = session.token || tokenCookie.value;
            
            const headers = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await $fetch('/server/api/settings', {
                headers
            });
            
            if (response?.data) {
                settings.value = response.data;
            }
        } catch {
            error.value = "Error, Gagal mengambil data pengaturan";
        } finally {
            isLoading.value = false;
        }
    }

    return {
        settings,
        isLoading,
        error,
        fetchSettings
    };
});
