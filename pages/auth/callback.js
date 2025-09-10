import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabaseClient'
import { setUserRole } from '@/utils/auth'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (data.session?.user) {
          // Check if user has a role set
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.session.user.id)
            .single()

          if (roleError && roleError.code === 'PGRST116') {
            // Check if this is a new signup with stored data
            const signupData = localStorage.getItem('signupData')
            if (signupData) {
              try {
                const { role, name, email } = JSON.parse(signupData)
                
                // Setup user profile using API route
                const response = await fetch('/api/setup-user', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.session.access_token}`
                  },
                  body: JSON.stringify({ role, name, email })
                })

                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.message || 'Failed to setup user profile')
                }
                
                // Clear stored data
                localStorage.removeItem('signupData')
                
                // Redirect to dashboard
                router.push('/dashboard')
                return
              } catch (setupError) {
                console.error('Error setting up user profile:', setupError)
                // Clear stored data and redirect to role selection
                localStorage.removeItem('signupData')
                router.push('/select-role')
                return
              }
            }
            
            // No stored signup data, redirect to role selection
            router.push('/select-role')
            return
          }

          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  )
}