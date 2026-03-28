import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff, ArrowRight, GraduationCap, Briefcase, Check } from 'lucide-react'

const roles = [
  { id: 'student',   label: 'Job Seeker',  icon: GraduationCap, desc: 'Find & apply for jobs' },
  { id: 'recruiter', label: 'Recruiter',    icon: Briefcase,     desc: 'Post jobs & hire talent' },
]

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '', role: '' })
  const [showPw, setShowPw] = useState(false)
  const { loading, user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => { if (user) navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/') }, [user])

  const ch = (e) => setInput({ ...input, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
      })
      if (res.data.success) { dispatch(setUser(res.data.user)); navigate(res.data.user.role === 'recruiter' ? '/recruiter/dashboard' : '/'); toast.success(res.data.message) }
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed') }
    finally { dispatch(setLoading(false)) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative w-full max-w-md anim-fade-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10 w-fit">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 5.5C2 4.4 2.9 3.5 4 3.5h8c1.1 0 2 .9 2 2v5c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-5z" fill="#0f0d0a"/>
                <circle cx="8" cy="8" r="1.5" fill="#f59e0b"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
              Job<span style={{ color: '#f59e0b' }}>Verse</span>
            </span>
          </Link>

          <h1 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2.25rem', color: '#fff', letterSpacing: '-0.03em' }}>
            Welcome back
          </h1>
          <p className="mb-8 text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Bricolage Grotesque' }}>
            Sign in to continue your journey
          </p>

          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
              <input type="email" name="email" value={input.email} onChange={ch}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-xl outline-none text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'Bricolage Grotesque' }}
                onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }} />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
                <a href="#" className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Forgot?</a>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={input.password} onChange={ch}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-xl outline-none text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'Bricolage Grotesque' }}
                  onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(({ id, label, icon: Icon, desc }) => (
                  <label key={id} className="relative flex flex-col gap-1 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: input.role === id ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${input.role === id ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    <input type="radio" name="role" value={id} checked={input.role === id} onChange={ch} className="sr-only" />
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
                      style={{ background: input.role === id ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)' }}>
                      <Icon className="w-4 h-4" style={{ color: input.role === id ? '#f59e0b' : 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <span className="font-bold text-sm" style={{ color: input.role === id ? '#fbbf24' : 'rgba(255,255,255,0.6)', fontFamily: 'Bricolage Grotesque' }}>{label}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</span>
                    {input.role === id && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-amber-900" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-amber w-full h-12 rounded-xl text-sm font-bold">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            No account?{' '}
            <Link to="/signup" className="font-bold" style={{ color: '#f59e0b' }}>Create one →</Link>
          </p>
        </div>
      </div>

      {/* Right panel — visual */}
      <div className="hidden lg:flex flex-col justify-center items-center w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#1a1508 0%,#0f0d0a 100%)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
        <div className="relative z-10 text-center max-w-xs">
          <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-8 anim-float">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="12" width="32" height="22" rx="4" stroke="#f59e0b" strokeWidth="2"/>
              <path d="M13 12V10a6 6 0 0112 0v2" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="22" r="3" fill="#f59e0b"/>
            </svg>
          </div>
          <h2 className="mb-4" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.75rem', color: '#fff', letterSpacing: '-0.03em' }}>
            15,000+ roles<br />waiting for you
          </h2>
          <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Top companies are actively hiring. Don't let your dream job go to someone else.
          </p>
          {[
            { val: '340+', lbl: 'New jobs today' },
            { val: '2,000+', lbl: 'Companies hiring' },
            { val: '4.8★', lbl: 'Platform rating' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="flex items-center justify-between px-4 py-3 rounded-xl mb-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Bricolage Grotesque' }}>{lbl}</span>
              <span className="font-bold text-sm" style={{ color: '#f59e0b', fontFamily: 'Clash Display' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Login
