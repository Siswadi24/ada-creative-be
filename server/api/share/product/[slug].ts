interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  gallery_urls: string[]
}

interface ProductResponse {
  data: Product[]
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  // Base URL API backend
  const apiBaseUrl = process.env.NUXT_BASE_URL || 'http://103.250.11.117'

  // Ambil semua produk
  const productResponse = await $fetch<ProductResponse>(`${apiBaseUrl}/api/products`)
  const products = productResponse.data || []
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }

  // Pastikan gambar absolut
  const imageUrl = product.gallery_urls?.[0] || '/logo/Logo-Grosiin.png'
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${apiBaseUrl}${imageUrl}`

  // Base URL publik untuk link share
  const protocol = event.node.req.headers['x-forwarded-proto'] || 'https'
  const host = event.node.req.headers.host
  const fullShareUrl = `${protocol}://${host}/share/product/${slug}`

  // URL halaman produk
  const fullProductUrl = `${protocol}://${host}/product/${slug}`

  // HTML dengan OG tags
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>${product.name} - Grosiin</title>

  <!-- Open Graph -->
  <meta property="og:title" content="${product.name} - Grosiin" />
  <meta property="og:description" content="${product.description || 'Produk berkualitas dengan harga grosir terbaik'}" />
  <meta property="og:image" content="${fullImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${fullShareUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Grosiin" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${product.name} - Grosiin" />
  <meta name="twitter:description" content="${product.description || 'Produk berkualitas dengan harga grosir terbaik'}" />
  <meta name="twitter:image" content="${fullImageUrl}" />

  <!-- Redirect setelah 3 detik -->
  <meta http-equiv="refresh" content="3;url=${fullProductUrl}" />

  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    img {
      max-width: 300px;
      height: auto;
      border-radius: 8px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${fullImageUrl}" alt="${product.name}" />
    <h1>${product.name}</h1>
    <p>Rp ${new Intl.NumberFormat('id-ID').format(product.price)}</p>
    <p>Mengarahkan ke halaman produk...</p>
  </div>
</body>
</html>
  `

  setHeader(event, 'Content-Type', 'text/html')
  return html
})
