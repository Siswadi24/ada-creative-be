export default defineEventHandler(async (event) => {
  try {
    // Ambil body dari request
    const body = await readMultipartFormData(event)
    
    // Ambil authorization header
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required'
      })
    }

    // Buat FormData untuk diteruskan ke Laravel API
    const formData = new FormData()
    
    // Process multipart form data
    if (body) {
      for (const item of body) {
        if (item.name === 'photo' && item.data) {
          // Handle file upload
          const blob = new Blob([item.data], { type: item.type })
          formData.append('photo', blob, item.filename)
        } else if (item.name && item.data) {
          // Handle text fields
          formData.append(item.name, item.data.toString())
        }
      }
    }

    // Forward request ke Laravel API
    const response = await $fetch('https://api-grosiin.adacreativee.com/api/me/update', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData
    })

    // Return response sesuai format dari Laravel API
    return {
      message: response.message || 'Profile berhasil diperbarui',
      user: response.user,
      success: true
    }

  } catch (error) {
    console.error('Update profile error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Gagal update profile'
    })
  }
})