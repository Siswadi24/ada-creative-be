export default defineNuxtRouteMiddleware(async () => {
    const session = useSession()
    
    // 1. Cek dulu apakah cookie token ada
    if (!session.tokenCookie) {
        return navigateTo('/login', { external: true })
    }

    // 2. Jika ada token tapi profile belum ada (misal di client-side navigation atau setelah manual inject token),
    //    coba validasi token dengan fetch user profile
    if (!session.profile.name) {
        try {
            // Kita gunakan useApi atau $fetch untuk memvalidasi token
            // Kita bisa memanfaatkan endpoint /me yang sudah ada
            const response = await $fetch('/server/api/me', {
                headers: {
                    Authorization: `Bearer ${session.tokenCookie}`
                }
            })

            // Jika berhasil, simpan data user ke session
            if (response.user) {
                session.profile = response.user
                session.token = session.tokenCookie
            } else {
                throw new Error("Invalid user data")
            }
        } catch (error) {
            // Jika token tidak valid (401 atau error lain), logout dan redirect
            // console.error("Invalid token detected in middleware:", error)
            session.logout()
            return navigateTo('/login', { external: true })
        }
    }
})