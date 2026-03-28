import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff, ArrowRight, Building2, Users, TrendingUp, BarChart3 } from 'lucide-react'

const RecruiterLogin = () => {
  const [input, setInput] = useState({ email: '', password: '', role: 'recruiter' })
  const [showPw, setShowPw] = useState(false)
  const { loading, user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.role === 'recruiter') navigate('/recruiter/dashboard')
    else if (user?.role === 'student') navigate('/')
  }, [user])

  const ch = (e) => setInput({ ...input, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
      })
      if (res.data.success) {
        dispatch(setUser(res.data.user))
        navigate('/recruiter/dashboard')
        toast.success(`Welcome back, ${res.data.user.fullname}!`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { dispatch(setLoading(false)) }
  }

  const iStyle = {
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
    color: '#fff', fontFamily: 'Bricolage Grotesque', borderRadius: '0.75rem',
  }
  const onF = e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)' }
  const onB = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

  const stats = [
    { icon: Users, label: 'Active Candidates', value: '50,000+' },
    { icon: TrendingUp, label: 'Jobs Filled Monthly', value: '2,400+' },
    { icon: BarChart3, label: 'Avg. Time to Hire', value: '12 days' },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#1a1508,#0f0d0a)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 80%, rgba(245,158,11,0.1) 0%, transparent 70%)' }} />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-amber-900" />
          </div>
          <span style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            Job<span style={{ color: '#f59e0b' }}>Verse</span>
            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontFamily: 'Bricolage Grotesque' }}>
              Recruiter
            </span>
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="mb-4" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2.25rem', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Hire India's<br />best talent<br /><span style={{ color: '#f59e0b' }}>faster</span>
          </h2>
          <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Access a pool of verified candidates, post jobs in minutes, and manage your entire hiring pipeline from one place.
          </p>
          <div className="space-y-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-3.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                  <Icon className="w-4.5 h-4.5 text-amber-400" />
                </div>
                <div>
                  <div className="font-black text-white text-sm" style={{ fontFamily: 'Clash Display' }}>{value}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} JobVerse Recruiter Platform
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative w-full max-w-md anim-fade-up">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-amber-900" />
            </div>
            <span style={{ fontFamily: 'Clash Display', fontWeight: 700, color: '#fff' }}>
              Job<span style={{ color: '#f59e0b' }}>Verse</span>
            </span>
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Recruiter Portal
            </span>
          </div>

          <h1 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2.25rem', color: '#fff', letterSpacing: '-0.03em' }}>
            Sign in to hire
          </h1>
          <p className="mb-8 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Access your hiring dashboard
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Work Email</label>
              <input type="email" name="email" value={input.email} onChange={ch} placeholder="you@company.com"
                className="w-full h-12 px-4 outline-none text-sm" style={iStyle}
                onFocus={onF} onBlur={onB} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
                <a href="#" className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Forgot?</a>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={input.password} onChange={ch} placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 outline-none text-sm" style={iStyle}
                  onFocus={onF} onBlur={onB} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-amber w-full h-12 rounded-xl font-bold">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>
                : <><span>Access Dashboard</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            New recruiter?{' '}
            <Link to="/recruiter/signup" className="font-bold" style={{ color: '#f59e0b' }}>
              Create account →
            </Link>
          </p>

          <div className="flex items-center gap-3 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Looking for a job instead?</span>
            <Link to="/login" className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Job Seeker Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterLogin
