import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useAuth } from '@/pages/_app'
import AuthForm from '@/components/AuthForm'
import { supabase } from '@/utils/supabaseClient'

// Mock the useAuth hook
jest.mock('@/pages/_app', () => ({
  useAuth: jest.fn(),
}))

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders login form by default', () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    
    render(<AuthForm />)
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  test('switches to sign up form', () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    
    render(<AuthForm />)
    
    fireEvent.click(screen.getByText('Sign up'))
    
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Role')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
  })

  test('handles email/password sign in', async () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    })
    
    render(<AuthForm />)
    
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  test('handles Google OAuth sign in', async () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    supabase.auth.signInWithOAuth.mockResolvedValue({
      data: { url: 'https://google.com/oauth' },
      error: null,
    })
    
    render(<AuthForm />)
    
    fireEvent.click(screen.getByText('Continue with Google'))
    
    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })
  })

  test('displays error message on authentication failure', async () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' },
    })
    
    render(<AuthForm />)
    
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})