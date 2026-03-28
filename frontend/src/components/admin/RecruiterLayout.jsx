import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import {
  Building2, Briefcase, LayoutDashboard, LogOut,
  Menu, X, ChevronRight, Users, Bell, Settings
} from 'lucide-react'

const navItems = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/companies',     icon: Building2,       label: 'Companies' },
  { to: '/admin/jobs',          icon: Briefcase,       label: 'Job Listings' },
]

const RecruiterLayout = ({ children }) => {
  const { user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const logout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setUser(null))
        navigate('/recruiter/login')
        toast.success('Logged out')
      }
    } catch { toast.error('Logout failed') }
  }

  const isActive = (path) => location.pathname === path

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ background: 'var(--ink)' }}>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/recruiter/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-amber-900" />
          </div>
          <div>
            <span style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
              Job<span style={{ color: '#f59e0b' }}>Verse</span>
            </span>
            <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Bricolage Grotesque' }}>Recruiter</div>
          </div>
        </Link>
        <button className="lg:hidden p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.4)' }} onClick={() => setSidebarOpen(false)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        <p className="text-xs font-bold px-3 mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>Main Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all group"
            style={{
              background: isActive(to) ? 'rgba(245,158,11,0.12)' : 'transparent',
              border: isActive(to) ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
              color: isActive(to) ? '#fbbf24' : 'rgba(255,255,255,0.45)',
            }}
            onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.background = 'transparent' }}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-semibold" style={{ fontFamily: 'Bricolage Grotesque' }}>{label}</span>
            {isActive(to) && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-400" />}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 m-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9 ring-2 ring-amber-500/30">
            <AvatarImage src={user?.profile?.profilePhoto} />
            <AvatarFallback className="text-xs font-black text-amber-900 bg-amber-400">
              {user?.fullname?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs truncate" style={{ color: '#fff', fontFamily: 'Clash Display' }}>{user?.fullname}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
          <LogOut className="w-3.5 h-3.5" />Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-2)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 h-full overflow-y-auto">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col h-full overflow-y-auto"><Sidebar /></div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--border-c)] shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-3)] transition-colors"
              onClick={() => setSidebarOpen(true)} style={{ color: 'var(--ink-muted)' }}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-sm" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>
                {navItems.find(n => isActive(n.to))?.label || 'Recruiter Portal'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[var(--surface-3)] transition-colors relative" style={{ color: 'var(--ink-muted)' }}>
              <Bell className="w-4.5 h-4.5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
            </button>
            <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid var(--border-c)' }}>
              <Avatar className="h-7 w-7 ring-2 ring-amber-200">
                <AvatarImage src={user?.profile?.profilePhoto} />
                <AvatarFallback className="text-xs font-black text-amber-900 bg-amber-100">
                  {user?.fullname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--ink)' }}>
                {user?.fullname?.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default RecruiterLayout
