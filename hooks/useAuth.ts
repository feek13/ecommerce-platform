import { useContext } from 'react'
import { AuthContext } from '@/app/providers/AuthProvider'

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export AuthContext for direct use if needed
export { AuthContext }
