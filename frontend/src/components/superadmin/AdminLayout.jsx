import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { setAdminLoggedIn } from '@/redux/adminSlice'
import { toast } from 'sonner'
import {
  LayoutDashboard, Users, Building2, Briefcase,
  FileText, LogOut, Menu, X, ShieldCheck,
  ChevronRight, Bell
} from 'lucide-react'

const navItems = [
  { to: '/superadmin/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/superadmin/companies',    icon: Building2,       label: 'Companies'    },
  { to: '/superadmin/jobs',         icon: Briefcase,       label: 'Jobs'         },
  { to: '/superadmin/users',        icon: Users,           label: 'Users'        },
  { to: '/superadmin/applications', icon: FileText,        label: 'Applications' },
]

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    try {
      await axios.get(`${ADMIN_API}/logout`, { withCredentials: true })
      dispatch(setAdminLoggedIn(false))
      navigate('/superadmin/login')
      toast.success('Admin logged out')
    } catch { toast.error('Logout failed') }
  }

  const isActive = (path) => location.pathname === path

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ background: '#0f0d0a', borderRight: '1px solid rgba(239,68,68,0.1)' }}>
      {/* Logo */}
      <div className="p-5 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <ShieldCheck className="w-4 h-4" style={{ color: '#f87171' }} />
            </div>
            <div>
              <div className="font-bold text-sm text-white" style={{ fontFamily: 'Clash Display' }}>
                Job<span style={{ color: '#f59e0b' }}>Verse</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(239,68,68,0.7)' }}>
                Super Admin
              </div>
            </div>
          </div>
          <button className="lg:hidden" style={{ color: 'rgba(255,255,255,0.4)' }} onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3">
        <p className="text-xs font-bold px-3 mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Management
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all"
            style={{
              background: isActive(to) ? 'rgba(239,68,68,0.1)' : 'transparent',
              border: `1px solid ${isActive(to) ? 'rgba(239,68,68,0.2)' : 'transparent'}`,
              color: isActive(to) ? '#f87171' : 'rgba(255,255,255,0.4)',
            }}
            onMouseEnter={e => { if (!isActive(to)) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}}
            onMouseLeave={e => { if (!isActive(to)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-semibold" style={{ fontFamily: 'Bricolage Grotesque' }}>{label}</span>
            {isActive(to) && <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: '#f87171' }} />}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
          <LogOut className="w-3.5 h-3.5" />Sign Out
        </button>
      </div>
    </aside>
  )

  const currentPage = navItems.find(n => isActive(n.to))?.label || 'Admin'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-2)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 shrink-0 h-full overflow-y-auto"><Sidebar /></div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex flex-col h-full overflow-y-auto"><Sidebar /></div>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--border-c)] shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-3)]"
              style={{ color: 'var(--ink-muted)' }} onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <h1 className="font-bold text-sm" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>
                  {currentPage}
                </h1>
              </div>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Admin Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
              <span className="text-xs font-bold" style={{ color: '#ef4444' }}>Super Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
