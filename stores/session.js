export const useSession = defineStore("session", () => {
    const profile = ref({
        "name": "",
        "email": "",
        "phone": null,
        "address": "",
    });

    const token = ref('');
    const tokenCookie = useCookie('access_token');

    function logout() {
        token.value = '';
        profile.value = {
            "name": "",
            "email": "",
            "phone": null,
            "address": "",
        };
        tokenCookie.value = undefined;

        navigateTo('/');
    }

    return { profile, token, logout, tokenCookie };
})