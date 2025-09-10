import { supabase } from './supabaseClient'

// Get student data (RLS will filter based on user role)
export const getStudentData = async (userId) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Get all students (only teachers can access this)
export const getAllStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data
}

// Update student marks (only teachers can do this)
export const updateStudentMarks = async (studentId, marks) => {
  const { data, error } = await supabase
    .from('students')
    .update({ marks })
    .eq('id', studentId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Create student record
export const createStudent = async (studentData) => {
  const { data, error } = await supabase
    .from('students')
    .insert(studentData)
    .select()
    .single()
  
  if (error) throw error
  return data
}