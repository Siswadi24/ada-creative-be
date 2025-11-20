// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/image', '@nuxt/ui', "@pinia/nuxt", '@vite-pwa/nuxt'],
  // pwa:{
  //   manifest: {
  //     name: 'Grosiin',
  //     short_name: 'Grosiin',
  //     description: 'Grosiin - Your one-stop shop for all your needs',
  //     theme_color: '#ffffff',
  //     background_color: '#ffffff',
  //     display: 'standalone',
  //     lang: 'en',
  //     start_url: '/',
  //     icons: [
  //       {
  //         src: '/logo/Logo-Grosiin.png',
  //         sizes: '512x512',
  //         type: 'image/png'
  //       },
  //       {
  //         src: '/logo/Logo-Grosiin.png',
  //         sizes: '192x192',
  //         type: 'image/png'
  //       }
  //     ]
  //   },
  //   workbox: {
  //     navigateFallback: '/',
  //     navigateFallbackDenylist: [/^\/api/, /^\/login/],
  //   },
  //   devOptions: {
  //     enabled: true,
  //     type: 'module',
  //   }
  // },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'description', content: 'Grosiin - Your one-stop shop for all your needs' },
        { name: 'keywords', content: 'grosiin, shopping, online store, reseller' },
        { name: 'author', content: 'Grosiin Team' },
        { name: 'google-site-verification', content: 'your-google-site-verification-code' },
      ],
      title: 'Grosiin',
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logo/Logo-Grosiin.png"
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: ""
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        }
      ]
    }
  },
  routeRules: {
    "/server/**": { proxy: `${import.meta.env.NUXT_BASE_URL}/**` },
  },
  // routeRules: {
  //   '/server/**': { proxy: `${import.meta.env.NUXT_BASE_URL}/**` },
  // }
  // routeRules: {
  //   '/server/**': { proxy: `${process.env.NUXT_PUBLIC_API_BASE}/**` },
  // },
})