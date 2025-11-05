const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getUserToken(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const projectId = SUPABASE_URL.split('//')[1].split('.')[0]
    const authData = localStorage.getItem(`sb-${projectId}-auth-token`)
    if (authData) {
      const parsed = JSON.parse(authData)
      return parsed?.access_token || null
    }
  } catch (error) {
    console.warn('Failed to get user token:', error)
  }
  return null
}

/**
 * Upload review images to Supabase Storage
 * @param files - Array of image files to upload
 * @param userId - User ID for organizing storage
 * @returns Array of public URLs
 */
export async function uploadReviewImages(
  files: File[],
  userId: string
): Promise<string[]> {
  const timestamp = Date.now()
  const userToken = getUserToken()

  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${index}.${fileExt}`
    const filePath = `${userId}/${timestamp}/${fileName}`

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/review-images/${filePath}`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${userToken || SUPABASE_ANON_KEY}`
        },
        body: formData
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
    }

    // Return public URL
    return `${SUPABASE_URL}/storage/v1/object/public/review-images/${filePath}`
  })

  return Promise.all(uploadPromises)
}

/**
 * Upload chat images to Supabase Storage
 * @param file - Image file to upload
 * @param userId - User ID for organizing storage
 * @returns Public URL
 */
export async function uploadChatImage(
  file: File,
  userId: string
): Promise<string> {
  const timestamp = Date.now()
  const userToken = getUserToken()
  const fileExt = file.name.split('.').pop()
  const fileName = `${timestamp}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/chat-images/${filePath}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${userToken || SUPABASE_ANON_KEY}`
      },
      body: formData
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
  }

  return `${SUPABASE_URL}/storage/v1/object/public/chat-images/${filePath}`
}
