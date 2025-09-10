import { supabase } from '@/utils/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Get user role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Role fetch error:', error)
      return res.status(404).json({ message: 'User role not found', error: error.message })
    }

    res.status(200).json({ role: data.role })
  } catch (error) {
    console.error('Error fetching user role:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}