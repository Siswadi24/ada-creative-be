// export default defineEventHandler(async (event) => {
//   try {
//     const body = await readMultipartFormData(event)
//     const authHeader = getHeader(event, 'authorization')
    
//     if (!authHeader) {
//       throw createError({
//         statusCode: 401,
//         statusMessage: 'Authorization header required'
//       })
//     }
//     const formData = new FormData()
//     if (body) {
//       for (const item of body) {
//         if (item.name === 'photo' && item.data) {
//           const blob = new Blob([item.data], { type: item.type })
//           formData.append('photo', blob, item.filename)
//         } else if (item.name && item.data) {
//           formData.append(item.name, item.data.toString())
//         }
//       }
//     }
//     const response = await $fetch('https://api-grosiin.adacreativee.com/api/me/update', {
//       method: 'POST',
//       headers: {
//         'Authorization': authHeader,
//       },
//       body: formData
//     })

//     return {
//       message: response.message || 'Profile berhasil diperbarui',
//       user: response.user,
//       success: true
//     }

//   } catch (error) {
//     console.error('Update profile error:', error)
    
//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.message || 'Gagal update profile'
//     })
//   }
// })