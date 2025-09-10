import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/pages/_app'
import { getAllStudents, updateStudentMarks } from '@/utils/students'
import { getUserRole } from '@/utils/auth'
import Navbar from '@/components/Navbar'

export default function TeacherDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editMarks, setEditMarks] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      checkUserRole()
    }
  }, [user, loading, router])

  const checkUserRole = async () => {
    try {
      const role = await getUserRole(user.id)
      if (role !== 'teacher') {
        router.push('/dashboard')
        return
      }
      loadStudents()
    } catch (error) {
      console.error('Error checking user role:', error)
      setError('Failed to verify permissions. Please try again.')
    }
  }

  const loadStudents = async () => {
    try {
      setLoadingData(true)
      const data = await getAllStudents()
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
      setError('Failed to load student data. Please try again.')
    } finally {
      setLoadingData(false)
    }
  }

  const handleEditMarks = (student) => {
    setEditingId(student.id)
    setEditMarks(student.marks.toString())
  }

  const handleSaveMarks = async (studentId) => {
    if (!editMarks || isNaN(editMarks) || editMarks < 0 || editMarks > 100) {
      alert('Please enter a valid marks value between 0 and 100')
      return
    }

    try {
      setSaving(true)
      const updatedStudent = await updateStudentMarks(studentId, parseInt(editMarks))
      
      // Update the local state
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, marks: updatedStudent.marks }
          : student
      ))
      
      setEditingId(null)
      setEditMarks('')
    } catch (error) {
      console.error('Error updating marks:', error)
      if (error.message.includes('Row Level Security')) {
        alert('Permission denied: You need to update the RLS policies in Supabase. Please run the FIX_TEACHER_PERMISSIONS.sql script.')
      } else {
        alert(`Failed to update marks: ${error.message}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditMarks('')
  }

  const getGradeColor = (marks) => {
    if (marks >= 90) return 'text-green-600 bg-green-100'
    if (marks >= 80) return 'text-blue-600 bg-blue-100'
    if (marks >= 70) return 'text-yellow-600 bg-yellow-100'
    if (marks >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getGrade = (marks) => {
    if (marks >= 90) return 'A+'
    if (marks >= 80) return 'A'
    if (marks >= 70) return 'B'
    if (marks >= 60) return 'C'
    if (marks >= 50) return 'D'
    return 'F'
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage student data and update marks. You have full access to all student records.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Student Management
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and edit student marks. Click "Edit" to modify marks for any student.
            </p>
          </div>

          {students.length === 0 ? (
            <div className="px-4 py-5 sm:px-6">
              <p className="text-gray-500">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Student</th>
                    <th className="table-header">Subject</th>
                    <th className="table-header">Marks</th>
                    <th className="table-header">Grade</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-bold">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {student.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-900">{student.subject}</div>
                      </td>
                      <td className="table-cell">
                        {editingId === student.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editMarks}
                              onChange={(e) => setEditMarks(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              disabled={saving}
                            />
                            <span className="text-sm text-gray-500">/100</span>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {student.marks}/100
                          </div>
                        )}
                      </td>
                      <td className="table-cell">
                        {editingId === student.id ? (
                          <div className="text-sm text-gray-500">-</div>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.marks)}`}>
                            {getGrade(student.marks)}
                          </span>
                        )}
                      </td>
                      <td className="table-cell">
                        {editingId === student.id ? (
                          <div className="text-sm text-gray-500">-</div>
                        ) : (
                          <span className={`text-sm font-medium ${student.marks >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                            {student.marks >= 60 ? 'Pass' : 'Fail'}
                          </span>
                        )}
                      </td>
                      <td className="table-cell">
                        {editingId === student.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveMarks(student.id)}
                              disabled={saving}
                              className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={saving}
                              className="text-gray-600 hover:text-gray-900 text-sm font-medium disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditMarks(student)}
                            className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        {students.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
                <p className="mt-2 text-3xl font-bold text-primary-600">{students.length}</p>
              </div>
            </div>

            <div className="card">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Average Marks</h3>
                <p className="mt-2 text-3xl font-bold text-primary-600">
                  {Math.round(students.reduce((sum, s) => sum + s.marks, 0) / students.length)}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Pass Rate</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {Math.round((students.filter(s => s.marks >= 60).length / students.length) * 100)}%
                </p>
              </div>
            </div>

            <div className="card">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Top Performers</h3>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {students.filter(s => s.marks >= 90).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}