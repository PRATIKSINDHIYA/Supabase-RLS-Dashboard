import { supabase } from '@/utils/supabaseClient'
import { getStudentData, getAllStudents, updateStudentMarks } from '@/utils/students'
import { getUserRole } from '@/utils/auth'

// Mock Supabase responses
const mockSupabaseResponse = (data, error = null) => ({
  data,
  error,
})

describe('Row Level Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Student Access Control', () => {
    test('students can only view their own data', async () => {
      const studentId = 'student-123'
      const mockStudentData = {
        id: 'student-123',
        user_id: 'student-123',
        name: 'John Doe',
        subject: 'Mathematics',
        marks: 85,
      }

      supabase.from().select().eq().single.mockResolvedValue(
        mockSupabaseResponse(mockStudentData)
      )

      const result = await getStudentData(studentId)

      expect(supabase.from).toHaveBeenCalledWith('students')
      expect(supabase.from().select).toHaveBeenCalledWith('*')
      expect(supabase.from().select().eq).toHaveBeenCalledWith('user_id', studentId)
      expect(result).toEqual(mockStudentData)
    })

    test('students cannot access other students data', async () => {
      const studentId = 'student-123'
      const otherStudentId = 'student-456'

      // Mock RLS blocking access to other student's data
      supabase.from().select().eq().single.mockResolvedValue(
        mockSupabaseResponse(null, { message: 'Row Level Security policy violation' })
      )

      await expect(getStudentData(otherStudentId)).rejects.toThrow()
    })
  })

  describe('Teacher Access Control', () => {
    test('teachers can view all students', async () => {
      const mockAllStudents = [
        { id: 'student-1', name: 'John Doe', marks: 85 },
        { id: 'student-2', name: 'Jane Smith', marks: 92 },
        { id: 'student-3', name: 'Bob Johnson', marks: 78 },
      ]

      supabase.from().select().order.mockResolvedValue(
        mockSupabaseResponse(mockAllStudents)
      )

      const result = await getAllStudents()

      expect(supabase.from).toHaveBeenCalledWith('students')
      expect(supabase.from().select).toHaveBeenCalledWith('*')
      expect(supabase.from().select().order).toHaveBeenCalledWith('name')
      expect(result).toEqual(mockAllStudents)
    })

    test('teachers can update student marks', async () => {
      const studentId = 'student-123'
      const newMarks = 90
      const updatedStudent = {
        id: 'student-123',
        name: 'John Doe',
        marks: newMarks,
      }

      supabase.from().update().eq().select().single.mockResolvedValue(
        mockSupabaseResponse(updatedStudent)
      )

      const result = await updateStudentMarks(studentId, newMarks)

      expect(supabase.from).toHaveBeenCalledWith('students')
      expect(supabase.from().update).toHaveBeenCalledWith({ marks: newMarks })
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', studentId)
      expect(result).toEqual(updatedStudent)
    })

    test('students cannot update marks', async () => {
      const studentId = 'student-123'
      const newMarks = 90

      // Mock RLS blocking student from updating marks
      supabase.from().update().eq().select().single.mockResolvedValue(
        mockSupabaseResponse(null, { message: 'Row Level Security policy violation' })
      )

      await expect(updateStudentMarks(studentId, newMarks)).rejects.toThrow()
    })
  })

  describe('Role-Based Access', () => {
    test('getUserRole returns correct role', async () => {
      const userId = 'user-123'
      const mockRole = { role: 'teacher' }

      supabase.from().select().eq().single.mockResolvedValue(
        mockSupabaseResponse(mockRole)
      )

      const result = await getUserRole(userId)

      expect(supabase.from).toHaveBeenCalledWith('user_roles')
      expect(supabase.from().select).toHaveBeenCalledWith('role')
      expect(supabase.from().select().eq).toHaveBeenCalledWith('user_id', userId)
      expect(result).toBe('teacher')
    })

    test('handles missing user role', async () => {
      const userId = 'user-123'

      supabase.from().select().eq().single.mockResolvedValue(
        mockSupabaseResponse(null, { message: 'No rows found' })
      )

      await expect(getUserRole(userId)).rejects.toThrow()
    })
  })

  describe('RLS Policy Enforcement', () => {
    test('RLS policies prevent unauthorized access', async () => {
      // Test that RLS policies are enforced at the database level
      const unauthorizedAccess = async () => {
        // This would be blocked by RLS policies
        supabase.from().select().eq().single.mockResolvedValue(
          mockSupabaseResponse(null, { 
            message: 'Row Level Security policy violation',
            code: 'PGRST301'
          })
        )
        
        return await getStudentData('unauthorized-user-id')
      }

      await expect(unauthorizedAccess()).rejects.toThrow()
    })

    test('RLS policies allow authorized access', async () => {
      const authorizedUserId = 'authorized-user-123'
      const mockData = { id: authorizedUserId, name: 'Authorized User' }

      supabase.from().select().eq().single.mockResolvedValue(
        mockSupabaseResponse(mockData)
      )

      const result = await getStudentData(authorizedUserId)
      expect(result).toEqual(mockData)
    })
  })
})