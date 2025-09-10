import { supabase } from '@/utils/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { role, name, email } = req.body

    // Get the authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Set user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role })
    
    if (roleError) {
      return res.status(400).json({ message: 'Failed to set user role', error: roleError.message })
    }

    // Create user profile based on role
    if (role === 'student') {
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: user.id,
          name,
          subject: 'Mathematics', // Default subject
          marks: 0
        })
      
      if (studentError) {
        return res.status(400).json({ message: 'Failed to create student profile', error: studentError.message })
      }
    } else if (role === 'teacher') {
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert({
          user_id: user.id,
          name
        })
      
      if (teacherError) {
        return res.status(400).json({ message: 'Failed to create teacher profile', error: teacherError.message })
      }
    }

    res.status(200).json({ message: 'User setup completed successfully' })
  } catch (error) {
    console.error('Error setting up user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}