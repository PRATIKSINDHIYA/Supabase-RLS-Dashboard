import { supabase } from './supabaseClient'

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Get user role
export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data?.role
}

// Set user role
export const setUserRole = async (userId, role) => {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
  
  if (error) throw error
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser()
  return !!user
}

// Check if user is teacher
export const isTeacher = async (userId) => {
  const role = await getUserRole(userId)
  return role === 'teacher'
}

// Check if user is student
export const isStudent = async (userId) => {
  const role = await getUserRole(userId)
  return role === 'student'
}