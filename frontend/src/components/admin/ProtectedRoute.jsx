import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Only recruiters can access recruiter portal
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/recruiter/login')
    } else if (user.role !== 'recruiter') {
      navigate('/')
    }
  }, [user])

  if (!user || user.role !== 'recruiter') return null
  return <>{children}</>
}

export default ProtectedRoute
