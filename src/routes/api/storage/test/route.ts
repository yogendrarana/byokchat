import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { auth } from '@/lib/auth/auth'
import { uploadImage, type StorageConfig } from '@/services/storage-service'

export const Route = createFileRoute('/api/storage/test')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Authenticate user
          const session = await auth.api.getSession({
            headers: request.headers
          })

          if (!session?.user?.id) {
            return json({ success: false, message: 'Unauthorized' }, { status: 401 })
          }

          const storageConfig: StorageConfig = await request.json()

          // Validate storage configuration
          if (!storageConfig.provider) {
            return json({ success: false, message: 'Storage provider is required' }, { status: 400 })
          }

          // Test the storage connection
          const testBuffer = Buffer.from('test-image-data', 'utf-8')
          const result = await uploadImage(
            storageConfig.provider,
            storageConfig,
            testBuffer,
            'test-connection.png'
          )

          if (result.success) {
            return json({
              success: true,
              message: `Successfully connected to ${storageConfig.provider} storage`
            })
          } else {
            return json({
              success: false,
              message: result.error || 'Connection test failed'
            })
          }
        } catch (error) {
          console.error('Storage test error:', error)
          return json(
            { success: false, message: error instanceof Error ? error.message : 'Storage test failed' },
            { status: 500 }
          )
        }
      }
    }
  }
})
