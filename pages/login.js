import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/pages/_app'
import AuthForm from '@/components/AuthForm'

export default function Login() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return <AuthForm />
}