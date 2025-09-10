import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/pages/_app'
import { setUserRole } from '@/utils/auth'
import { supabase } from '@/utils/supabaseClient'

export default function SelectRole() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRole || !name) {
      setError('Please select a role and enter your name')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Set user role
      await setUserRole(user.id, selectedRole)

      // Create user profile based on role
      if (selectedRole === 'student') {
        await supabase.from('students').insert({
          user_id: user.id,
          name,
          subject: 'Mathematics', // Default subject
          marks: 0
        })
      } else if (selectedRole === 'teacher') {
        await supabase.from('teachers').insert({
          user_id: user.id,
          name
        })
      }

      router.push('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please select your role and provide your name to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={selectedRole === 'student'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Student</div>
                    <div className="text-sm text-gray-500">View your own academic progress and marks</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={selectedRole === 'teacher'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Teacher</div>
                    <div className="text-sm text-gray-500">View and manage all student data and marks</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={submitting || !selectedRole || !name}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Setting up your account...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}