import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Menu, X, ChevronDown, Building2 } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
      style={{ boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 5.5C2 4.4 2.9 3.5 4 3.5h8c1.1 0 2 .9 2 2v5c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-5z" fill="#0f0d0a"/>
        <path d="M5 3.5V3a2 2 0 014 0v.5" stroke="#0f0d0a" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="1.5" fill="#f59e0b"/>
      </svg>
    </div>
    <span style={{ fontFamily:'Clash Display', fontWeight:700, fontSize:'1.2rem', letterSpacing:'-0.02em', color:'var(--ink)' }}>
      Job<span style={{ color:'var(--amber)' }}>Verse</span>
    </span>
  </Link>
)

const Navbar = () => {
  const { user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const logout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
      if (res.data.success) { dispatch(setUser(null)); navigate('/'); toast.success(res.data.message) }
    } catch { toast.error('Logout failed') }
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/browse', label: 'Explore' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-[var(--border-c)]'
        : 'bg-[var(--surface-2)]/80 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-3)]'
                }`} style={{ fontFamily:'Bricolage Grotesque' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                {/* Recruiter portal entry */}
                <Link to="/recruiter/login">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{ color:'var(--ink-muted)', border:'1px solid var(--border-c)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--amber)'; e.currentTarget.style.color='var(--amber-dark)'; e.currentTarget.style.background='rgba(245,158,11,0.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-c)'; e.currentTarget.style.color='var(--ink-muted)'; e.currentTarget.style.background='transparent' }}>
                    <Building2 className="w-3.5 h-3.5" />For Recruiters
                  </button>
                </Link>
                <Link to="/login">
                  <button className="btn-ghost" style={{ padding:'0.5rem 1rem', fontSize:'0.8125rem' }}>Sign in</button>
                </Link>
                <Link to="/signup">
                  <button className="btn-amber" style={{ padding:'0.5rem 1.125rem', fontSize:'0.8125rem' }}>Get started →</button>
                </Link>
              </>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface-3)] border border-transparent hover:border-[var(--border-c)] transition-all">
                    <Avatar className="h-7 w-7 ring-2 ring-amber-200">
                      <AvatarImage src={user?.profile?.profilePhoto} />
                      <AvatarFallback className="text-xs font-black text-amber-900 bg-amber-100">
                        {user?.fullname?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold" style={{ color:'var(--ink)' }}>{user?.fullname?.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5" style={{ color:'var(--ink-muted)' }} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-2xl shadow-2xl border-[var(--border-c)] bg-white">
                  <div className="px-3 py-2.5 mb-1 border-b border-[var(--border-c)]">
                    <p className="font-bold text-sm truncate" style={{ color:'var(--ink)', fontFamily:'Clash Display' }}>{user?.fullname}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color:'var(--ink-muted)' }}>{user?.email}</p>
                  </div>
                  <div className="space-y-0.5 pt-1">
                    {user?.role === 'student' && (
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ color:'var(--ink-soft)' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(245,158,11,0.08)'; e.currentTarget.style.color='var(--amber-dark)' }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--ink-soft)' }}>
                        <User2 className="w-4 h-4" />My Profile
                      </Link>
                    )}
                    <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left"
                      style={{ color:'#ef4444' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <LogOut className="w-4 h-4" />Sign out
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color:'var(--ink-muted)' }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-c)] bg-white/98 backdrop-blur-xl px-4 py-3 space-y-1 anim-fade-up">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ color:'var(--ink-soft)' }}>
              {link.label}
            </Link>
          ))}
          {!user ? (
            <div className="space-y-2 pt-2">
              <Link to="/recruiter/login" className="block" onClick={() => setMobileOpen(false)}>
                <button className="btn-ghost w-full text-xs">
                  <Building2 className="w-3.5 h-3.5" />Recruiter Portal
                </button>
              </Link>
              <div className="flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="btn-ghost w-full">Sign in</button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="btn-amber w-full">Get started</button>
                </Link>
              </div>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ color:'#ef4444' }}>
              <LogOut className="w-4 h-4" />Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
