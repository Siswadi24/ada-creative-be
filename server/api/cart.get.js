// export default defineEventHandler(async (event) => {
//   try {
//     const authHeader = getHeader(event, 'authorization')
    
//     if (!authHeader) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Authorization header required'
//       })
//     }
//     const response = await $fetch('https://api-grosiin.adacreativee.com/api/cart', {
//       method: 'GET',
//       headers: {
//         'Authorization': authHeader,
//       }
//     })
//     return {
//       message: response.message || 'Cart data retrieved successfully',
//       items: response.items || response.data,
//       success: true
//     }

//   } catch (error) {
//     console.error('Get cart error:', error)
    
//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.data?.message || error.message || 'Gagal mengambil data keranjang'
//     })
//   }
// })
// export default defineEventHandler(async (event) => {
//   try {
//     const authHeader = getHeader(event, 'authorization')

//     if (!authHeader) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Authorization header required'
//       })
//     }

//     const apiBaseUrl = process.env.NUXT_BASE_URL || 'https://api-grosiin.adacreativee.com'

//     const response = await $fetch(`${apiBaseUrl}/api/cart`, {
//       method: 'GET',
//       headers: {
//         'Authorization': authHeader,
//       }
//     })

//     return {
//       message: response.message || 'Cart data retrieved successfully',
//       items: response.items || response.data,
//       success: true
//     }

//   } catch (error) {
//     console.error('Get cart error:', error)

//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.data?.message || error.message || 'Gagal mengambil data keranjang'
//     })
//   }
// })
