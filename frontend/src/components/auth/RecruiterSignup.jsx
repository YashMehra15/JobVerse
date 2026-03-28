import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff, ArrowRight, Building2, Upload, CheckCircle } from 'lucide-react'

const perks = [
  'Post unlimited job listings',
  'Access verified candidate profiles',
  'Manage applications in one dashboard',
  'Accept or reject with one click',
]

const RecruiterSignup = () => {
  const [input, setInput] = useState({ fullname: '', email: '', phoneNumber: '', password: '', role: 'recruiter', file: '' })
  const [showPw, setShowPw] = useState(false)
  const { loading, user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'recruiter') navigate('/recruiter/dashboard')
    else if (user?.role === 'student') navigate('/')
  }, [user])

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
      if (res.data.success) { navigate('/recruiter/login'); toast.success(res.data.message) }
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
    finally { dispatch(setLoading(false)) }
  }

  const iStyle = {
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
    color: '#fff', fontFamily: 'Bricolage Grotesque', borderRadius: '0.75rem',
  }
  const onF = e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)' }
  const onB = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Left — benefits */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#1a1508,#0f0d0a)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />

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
          <h2 className="mb-4" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2rem', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Start hiring<br />smarter today
          </h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Join thousands of recruiters who trust JobVerse to find the best talent across India.
          </p>
          <div className="space-y-3">
            {perks.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Bricolage Grotesque' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} JobVerse Recruiter Platform
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative">
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative w-full max-w-md py-8 anim-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Recruiter Portal
            </span>
          </div>

          <h1 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2rem', color: '#fff', letterSpacing: '-0.03em' }}>
            Create recruiter account
          </h1>
          <p className="mb-7 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Start posting jobs and finding talent</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name</label>
              <input name="fullname" value={input.fullname} onChange={ch} placeholder="Your full name"
                className="w-full h-11 px-4 outline-none text-sm" style={iStyle} onFocus={onF} onBlur={onB} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Work Email</label>
                <input type="email" name="email" value={input.email} onChange={ch} placeholder="you@company.com"
                  className="w-full h-11 px-4 outline-none text-sm" style={iStyle} onFocus={onF} onBlur={onB} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Phone</label>
                <input name="phoneNumber" value={input.phoneNumber} onChange={ch} placeholder="9876543210"
                  className="w-full h-11 px-4 outline-none text-sm" style={iStyle} onFocus={onF} onBlur={onB} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={input.password} onChange={ch} placeholder="Min 8 characters"
                  className="w-full h-11 px-4 pr-12 outline-none text-sm" style={iStyle} onFocus={onF} onBlur={onB} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Profile photo */}
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Profile Photo <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'rgba(255,255,255,0.2)' }}>(optional)</span>
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                style={{ background: input.file ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)', border: `1.5px dashed ${input.file ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                <Upload className="w-4 h-4" style={{ color: input.file ? '#f59e0b' : 'rgba(255,255,255,0.35)' }} />
                <span className="text-sm" style={{ color: input.file ? '#fbbf24' : 'rgba(255,255,255,0.35)', fontFamily: 'Bricolage Grotesque' }}>
                  {input.file ? input.file.name : 'Upload profile photo'}
                </span>
                <input type="file" accept="image/*" onChange={fh} className="sr-only" />
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-amber w-full h-12 rounded-xl mt-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
                : <><span>Create Recruiter Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link to="/recruiter/login" className="font-bold" style={{ color: '#f59e0b' }}>Sign in →</Link>
          </p>
          <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Looking for a job?</span>
            <Link to="/signup" className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>Job Seeker Signup →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterSignup
