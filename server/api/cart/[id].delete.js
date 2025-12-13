// export default defineEventHandler(async (event) => {
//   try {
//     const itemId = getRouterParam(event, 'id')
//     const authHeader = getHeader(event, 'authorization')
    
//     if (!authHeader) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Authorization header required'
//       })
//     }
//     const response = await $fetch(`https://api-grosiin.adacreativee.com/api/cart/${itemId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': authHeader,
//       }
//     })
//     return {
//       message: response.message || 'Item berhasil dihapus dari keranjang',
//       data: response.data,
//       success: true
//     }

//   } catch (error) {
//     console.error('Delete cart item error:', error)
    
//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.data?.message || error.message || 'Gagal menghapus item dari keranjang'
//     })
//   }
// })
// export default defineEventHandler(async (event) => {
//   try {
//     const itemId = getRouterParam(event, 'id')
//     const authHeader = getHeader(event, 'authorization')

//     if (!authHeader) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Authorization header required'
//       })
//     }

//     const apiBaseUrl = process.env.NUXT_BASE_URL || 'https://api-grosiin.adacreativee.com'

//     const response = await $fetch(`${apiBaseUrl}/api/cart/${itemId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': authHeader,
//       }
//     })

//     return {
//       message: response.message || 'Item berhasil dihapus dari keranjang',
//       data: response.data,
//       success: true
//     }

//   } catch (error) {
//     console.error('Delete cart item error:', error)

//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.data?.message || error.message || 'Gagal menghapus item dari keranjang'
//     })
//   }
// })
