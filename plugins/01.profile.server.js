export default defineNuxtPlugin(async () => {
    const token = useCookie('access_token');
    const session = useSession();

    if (token.value) {
        try {
            const response = await $fetch('/server/api/me', {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            });

            if (response.user) {
                session.token = token.value;
                session.profile = response.user;
            }
        } catch {
            session.token = "";
            token.value = undefined;
        }
    }
});