import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setAdminLoggedIn } from '@/redux/adminSlice'
import { Loader2, ShieldCheck } from 'lucide-react'

const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    // Verify admin token by hitting a protected endpoint
    axios.get(`${ADMIN_API}/stats`, { withCredentials: true })
      .then(() => { dispatch(setAdminLoggedIn(true)); setAllowed(true) })
      .catch(() => { navigate('/superadmin/login', { replace: true }) })
      .finally(() => setChecking(false))
  }, [])

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080705' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <ShieldCheck className="w-6 h-6" style={{ color: '#f87171' }} />
        </div>
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ef4444' }} />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Verifying access...</p>
      </div>
    </div>
  )

  return allowed ? <>{children}</> : null
}

export default AdminRoute
