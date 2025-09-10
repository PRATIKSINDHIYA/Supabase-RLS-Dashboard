import Link from 'next/link'
import { useAuth } from '@/pages/_app'
import { signOut } from '@/utils/auth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (user) {
      // Get user role
      fetchUserRole()
    }
  }, [user])

  const fetchUserRole = async () => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setUserRole(null)
        return
      }

      // Try to get user role directly from Supabase
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching user role:', error)
        setUserRole(null)
        return
      }

      setUserRole(roleData.role)
    } catch (error) {
      console.error('Error fetching user role:', error)
      setUserRole(null)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RLS</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Guard Dog</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {userRole === 'teacher' && (
                  <Link
                    href="/teacher"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Teacher Panel
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}