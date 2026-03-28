import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Redirect recruiters away from student pages
const StudentRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/recruiter/dashboard')
    }
  }, [user])

  if (user?.role === 'recruiter') return null
  return <>{children}</>
}

export default StudentRoute
