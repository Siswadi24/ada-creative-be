export default defineEventHandler(async (event) => {
  try {
    // Ambil authorization header
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required'
      })
    }

    // Forward request ke Laravel API
    const response = await $fetch('https://api-grosiin.adacreativee.com/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      }
    })

    // Return response sesuai format dari Laravel API
    return {
      message: response.message || 'Cart data retrieved successfully',
      items: response.items || response.data,
      success: true
    }

  } catch (error) {
    console.error('Get cart error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Gagal mengambil data keranjang'
    })
  }
})