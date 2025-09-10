import { supabase } from './supabaseClient'

// Get teacher data
export const getTeacherData = async (userId) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Create teacher record
export const createTeacher = async (teacherData) => {
  const { data, error } = await supabase
    .from('teachers')
    .insert(teacherData)
    .select()
    .single()
  
  if (error) throw error
  return data
}