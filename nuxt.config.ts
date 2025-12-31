// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  fonts: {
    provider: 'none',
  },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', "@pinia/nuxt", '@vite-pwa/nuxt', 'nuxt-security'],
  pwa: {
    manifest: {
      name: 'AlokaStore',
      short_name: 'AlokaStore',
      description: 'AlokaStore - Your one-stop shop for all your needs',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      lang: 'en',
      start_url: '/',
      icons: [
        {
          src: '/favicon.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/logo/Logo-AlokaStore.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/logo/Logo-AlokaStore.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: undefined,
      navigateFallbackDenylist: [/^\/api/, /^\/login/],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    }
  },
  security: {
    strict: false,
    nonce: true,
    ssg: {
      meta: true,
      hashScripts: true,
      hashStyles: false
    },
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "https:", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", "https:"],
        'font-src': ["'self'", "https:", 'https://fonts.gstatic.com', 'https://iconify.design', 'https://image.nuxt.com'],
        'img-src': ["'self'", 'data:', 'https://backend-api.alokastore.com'],
        'connect-src': ["'self'", 'https://backend-api.alokastore.com'],
        'frame-src': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'manifest-src': ["'self'"],
        'media-src': ["'self'"]
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'cross-origin',
      xContentTypeOptions: 'nosniff',
      xDownloadOptions: 'noopen',
      xFrameOptions: 'DENY',
      xPermittedCrossDomainPolicies: 'none',
      xXSSProtection: '1'
    },
    sri: true
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'description', content: 'AlokaStore - Your one-stop shop for all your needs' },
        { name: 'keywords', content: 'AlokaStore, shopping, online store, reseller' },
        { name: 'author', content: 'AlokaStore Team' },
        { name: 'google-site-verification', content: 'your-google-site-verification-code' },
      ],
      titleTemplate: '%s - AlokaStore',
      title: 'AlokaStore',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
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
    "/server/**": { proxy: `${process.env.NUXT_BASE_URL}/**` },
    "/registration/**": { ssr: false },
    "/cart": { ssr: false },
  },
  runtimeConfig: {
    public: {
      baseUrl: `${process.env.NUXT_PUBLIC_BASE_URL}`,
    }
  }
  // routeRules: {
  //   '/api/**': { proxy: `${import.meta.env.NUXT_BASE_URL}/**` },
  // }
  // routeRules: {
  //   '/api/**': { proxy: `${process.env.NUXT_PUBLIC_API_BASE}/**` },
  // },
})