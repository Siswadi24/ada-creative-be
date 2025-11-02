export default defineNuxtRouteMiddleware(() => {
    const session = useSession()
    if (!session.tokenCookie) {
        return navigateTo('/login', { external: true })
    }
})