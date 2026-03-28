import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff, Upload, ArrowRight, GraduationCap, Briefcase, Check, Sparkles } from 'lucide-react'

const perks = ['Free to use, always', 'Verified top companies', 'One-click job apply', 'Real-time alerts']

const Signup = () => {
  const [input, setInput] = useState({ fullname: '', email: '', phoneNumber: '', password: '', role: '', file: '' })
  const [showPw, setShowPw] = useState(false)
  const { loading, user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/') }, [])

  const ch = (e) => setInput({ ...input, [e.target.name]: e.target.value })
  const fh = (e) => setInput({ ...input, file: e.target.files?.[0] })

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(input).forEach(([k, v]) => { if (k !== 'file' && v) fd.append(k, v) })
    if (input.file) fd.append('file', input.file)
    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${USER_API_END_POINT}/register`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
      })
      if (res.data.success) { navigate('/login'); toast.success(res.data.message) }
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
    finally { dispatch(setLoading(false)) }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
    color: '#fff', fontFamily: 'Bricolage Grotesque', borderRadius: '0.75rem',
  }
  const focusStyle = { borderColor: '#f59e0b', boxShadow: '0 0 0 3px rgba(245,158,11,0.15)' }
  const blurStyle = { borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none' }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Left panel — benefits */}
      <div className="hidden lg:flex flex-col justify-center w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#1a1508,#0f0d0a)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 70%, rgba(245,158,11,0.1) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Join 50K+ professionals
            </span>
          </div>
          <h2 className="mb-4" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2.25rem', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Your career<br />upgrade starts<br /><span style={{ color: '#f59e0b' }}>today</span>
          </h2>
          <p className="mb-10 text-sm" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Create your free account and get access to thousands of curated job opportunities.
          </p>
          <div className="space-y-3">
            {perks.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Bricolage Grotesque' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative w-full max-w-md py-8 anim-fade-up">
          <Link to="/" className="flex items-center gap-2.5 mb-8 w-fit">
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

          <h1 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2rem', color: '#fff', letterSpacing: '-0.03em' }}>
            Create account
          </h1>
          <p className="mb-7 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Fill in your details to get started</p>

          <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name</label>
              <input name="fullname" value={input.fullname} onChange={ch} placeholder="John Doe"
                className="w-full h-11 px-4 outline-none text-sm" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => Object.assign(e.target.style, blurStyle)} />
            </div>

            {/* Email + Phone row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
                <input type="email" name="email" value={input.email} onChange={ch} placeholder="you@email.com"
                  className="w-full h-11 px-4 outline-none text-sm" style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => Object.assign(e.target.style, blurStyle)} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Phone</label>
                <input name="phoneNumber" value={input.phoneNumber} onChange={ch} placeholder="9876543210"
                  className="w-full h-11 px-4 outline-none text-sm" style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => Object.assign(e.target.style, blurStyle)} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={input.password} onChange={ch} placeholder="Min 8 characters"
                  className="w-full h-11 px-4 pr-12 outline-none text-sm" style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => Object.assign(e.target.style, blurStyle)} />
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
                {[
                  { id: 'student', label: 'Job Seeker', icon: GraduationCap },
                  { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
                ].map(({ id, label, icon: Icon }) => (
                  <label key={id} className="relative flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                    style={{ background: input.role===id ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${input.role===id ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                    <input type="radio" name="role" value={id} checked={input.role===id} onChange={ch} className="sr-only" />
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: input.role===id ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)' }}>
                      <Icon className="w-4 h-4" style={{ color: input.role===id ? '#f59e0b' : 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <span className="font-bold text-sm" style={{ color: input.role===id ? '#fbbf24' : 'rgba(255,255,255,0.5)', fontFamily: 'Bricolage Grotesque' }}>{label}</span>
                    {input.role===id && <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-amber-900" />
                    </div>}
                  </label>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Profile Photo <span style={{ color: 'rgba(255,255,255,0.2)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                style={{ background: input.file ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)', border: `1.5px dashed ${input.file ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: input.file ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)' }}>
                  <Upload className="w-4 h-4" style={{ color: input.file ? '#f59e0b' : 'rgba(255,255,255,0.35)' }} />
                </div>
                <span className="text-sm" style={{ color: input.file ? '#fbbf24' : 'rgba(255,255,255,0.35)', fontFamily: 'Bricolage Grotesque' }}>
                  {input.file ? input.file.name : 'Click to upload photo'}
                </span>
                <input type="file" accept="image/*" onChange={fh} className="sr-only" />
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-amber w-full h-12 rounded-xl mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{ color: '#f59e0b' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
