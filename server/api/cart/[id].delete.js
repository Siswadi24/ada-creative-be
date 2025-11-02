export default defineEventHandler(async (event) => {
  try {
    // Ambil ID dari parameter
    const itemId = getRouterParam(event, 'id')
    
    // Ambil authorization header
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required'
      })
    }

    // Forward request ke Laravel API
    const response = await $fetch(`https://api-grosiin.adacreativee.com/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      }
    })

    // Return response sesuai format dari Laravel API
    return {
      message: response.message || 'Item berhasil dihapus dari keranjang',
      data: response.data,
      success: true
    }

  } catch (error) {
    console.error('Delete cart item error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Gagal menghapus item dari keranjang'
    })
  }
})