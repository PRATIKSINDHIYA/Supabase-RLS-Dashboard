import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/pages/_app'
import { getStudentData, getAllStudents } from '@/utils/students'
import { getUserRole } from '@/utils/auth'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [studentData, setStudentData] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadUserData()
    }
  }, [user, loading, router])

  const loadUserData = async () => {
    try {
      setLoadingData(true)
      
      // Get user role
      const role = await getUserRole(user.id)
      setUserRole(role)

      if (role === 'student') {
        // Load student's own data
        const data = await getStudentData(user.id)
        setStudentData(data)
      } else if (role === 'teacher') {
        // Load all students data
        const data = await getAllStudents()
        setAllStudents(data)
      } else {
        // User doesn't have a role set, redirect to role selection
        router.push('/select-role')
        return
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // If user doesn't have a role, redirect to role selection
      if (error.message.includes('No rows found') || error.message.includes('PGRST116')) {
        router.push('/select-role')
        return
      }
      setError('Failed to load data. Please try again.')
    } finally {
      setLoadingData(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === 'student' ? 'My Dashboard' : 'All Students'}
          </h1>
          <p className="mt-2 text-gray-600">
            {userRole === 'student' 
              ? 'View your academic progress and marks'
              : 'View and manage all student data'
            }
          </p>
        </div>

        {userRole === 'student' ? (
          <StudentView data={studentData} />
        ) : (
          <TeacherView data={allStudents} />
        )}
      </div>
    </div>
  )
}

function StudentView({ data }) {
  if (!data) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No data available. Please contact your teacher.</p>
      </div>
    )
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

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">
                {data.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{data.name}</h3>
            <p className="text-sm text-gray-500">Student</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Subject</h3>
          <p className="mt-2 text-2xl font-bold text-primary-600">{data.subject}</p>
        </div>
      </div>

      <div className="card">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Marks</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.marks}/100</p>
        </div>
      </div>

      <div className="card sm:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(data.marks)}`}>
              Grade: {getGrade(data.marks)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Percentage</div>
            <div className="text-lg font-semibold text-gray-900">{data.marks}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Status</div>
            <div className={`text-lg font-semibold ${data.marks >= 60 ? 'text-green-600' : 'text-red-600'}`}>
              {data.marks >= 60 ? 'Pass' : 'Fail'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeacherView({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No student data available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">All Students</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage student data. Click on a student to view details.
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {data.map((student) => (
          <li key={student.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.subject}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{student.marks}/100</div>
                  <div className="text-sm text-gray-500">
                    {student.marks >= 60 ? 'Pass' : 'Fail'}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {student.marks >= 90 ? 'A+' : 
                   student.marks >= 80 ? 'A' : 
                   student.marks >= 70 ? 'B' : 
                   student.marks >= 60 ? 'C' : 
                   student.marks >= 50 ? 'D' : 'F'}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}