import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setAdminLoggedIn } from '@/redux/adminSlice'
import { Loader2, ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${ADMIN_API}/login`, { email, password }, { withCredentials: true })
      if (res.data.success) {
        dispatch(setAdminLoggedIn(true))
        toast.success(res.data.message)
        navigate('/superadmin/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied')
    } finally { setLoading(false) }
  }

  const iStyle = {
    width: '100%', height: '2.875rem', padding: '0 1rem',
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '0.75rem', color: '#fff', fontSize: '0.875rem',
    fontFamily: 'Bricolage Grotesque', outline: 'none',
  }
  const onF = e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)' }
  const onB = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#080705' }}>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(239,68,68,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Spinning ring decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-5">
        <svg viewBox="0 0 200 200" className="anim-spin-slow">
          <circle cx="100" cy="100" r="95" stroke="#ef4444" strokeWidth="0.5" fill="none" strokeDasharray="10 6"/>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 anim-fade-up">

        {/* Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.25)', boxShadow: '0 0 40px rgba(239,68,68,0.15)' }}>
            <ShieldCheck className="w-8 h-8" style={{ color: '#f87171' }} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Clash Display', letterSpacing: '-0.03em' }}>
            Admin Portal
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Restricted Access — Authorized Only
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Admin Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@jobverse.com" style={iStyle} onFocus={onF} onBlur={onB} />
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Password
              </label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••" style={{ ...iStyle, paddingRight: '3rem' }} onFocus={onF} onBlur={onB} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all mt-2"
              style={{ background: loading ? 'rgba(239,68,68,0.4)' : 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', boxShadow: loading ? 'none' : '0 8px 24px rgba(239,68,68,0.35)' }}>
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</>
                : <><Lock className="w-4 h-4" />Access Admin Panel</>}
            </button>
          </form>
        </div>

        {/* Security notice */}
        <div className="flex items-center gap-2 justify-center mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            All access attempts are logged and monitored
          </p>
        </div>

        {/* Links back */}
        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.15)' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.25)' }}>← Back to JobVerse</a>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
