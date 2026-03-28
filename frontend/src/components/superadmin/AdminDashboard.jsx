import React, { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { setStats } from '@/redux/adminSlice'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { useNavigate } from 'react-router-dom'
import {
  Users, Building2, Briefcase, FileText,
  Clock, CheckCircle, XCircle, TrendingUp, ArrowRight, ShieldCheck
} from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, color, sub, onClick }) => (
  <div onClick={onClick}
    className={`bg-white rounded-2xl border border-[var(--border-c)] p-5 ${onClick ? 'cursor-pointer hover:border-red-200 transition-all' : ''}`}
    style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {onClick && <ArrowRight className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />}
    </div>
    <div className="font-black text-2xl mb-0.5" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', letterSpacing: '-0.03em' }}>
      {value ?? '—'}
    </div>
    <div className="text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>{label}</div>
    {sub && <div className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>{sub}</div>}
  </div>
)

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { stats } = useSelector(s => s.admin)

  useEffect(() => {
    axios.get(`${ADMIN_API}/stats`, { withCredentials: true })
      .then(res => { if (res.data.success) dispatch(setStats(res.data.stats)) })
      .catch(() => {})
  }, [])

  const statCards = [
    { icon: Users,     label: 'Total Users',       value: stats?.totalUsers,       color: '#3b82f6', sub: `${stats?.totalStudents ?? 0} seekers · ${stats?.totalRecruiters ?? 0} recruiters`, to: '/superadmin/users' },
    { icon: Building2, label: 'Companies',          value: stats?.totalCompanies,   color: '#f59e0b', sub: `${stats?.pendingCompanies ?? 0} awaiting approval`, to: '/superadmin/companies' },
    { icon: Briefcase, label: 'Total Jobs',         value: stats?.totalJobs,        color: '#10b981', sub: `${stats?.pendingJobs ?? 0} pending review`, to: '/superadmin/jobs' },
    { icon: FileText,  label: 'Applications',       value: stats?.totalApplications,color: '#8b5cf6', sub: 'across all jobs', to: '/superadmin/applications' },
  ]

  const actionCards = [
    { icon: Clock,        label: 'Pending Companies', value: stats?.pendingCompanies, color: '#f59e0b', desc: 'Awaiting your review', to: '/superadmin/companies', urgent: stats?.pendingCompanies > 0 },
    { icon: Clock,        label: 'Pending Jobs',      value: stats?.pendingJobs,      color: '#3b82f6', desc: 'Awaiting your approval', to: '/superadmin/jobs', urgent: stats?.pendingJobs > 0 },
    { icon: CheckCircle,  label: 'Approved Jobs',     value: stats?.approvedJobs,     color: '#10b981', desc: 'Live on platform', to: '/superadmin/jobs', urgent: false },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="relative rounded-2xl overflow-hidden p-6" style={{ background: '#0f0d0a' }}>
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(239,68,68,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <ShieldCheck className="w-6 h-6" style={{ color: '#f87171' }} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Super Admin
                </p>
                <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.375rem', color: '#fff', letterSpacing: '-0.02em' }}>
                  Admin Control Panel 🛡️
                </h2>
              </div>
            </div>
            {(stats?.pendingJobs > 0 || stats?.pendingCompanies > 0) && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-bold" style={{ color: '#f87171' }}>
                  {(stats?.pendingJobs || 0) + (stats?.pendingCompanies || 0)} items need review
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(s => (
            <StatCard key={s.label} {...s} onClick={() => navigate(s.to)} />
          ))}
        </div>

        {/* Action cards */}
        <div>
          <h3 className="font-bold mb-3" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', fontSize: '1rem' }}>
            Requires Your Attention
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {actionCards.map(({ icon: Icon, label, value, color, desc, to, urgent }) => (
              <div key={label} onClick={() => navigate(to)}
                className="bg-white rounded-2xl border p-5 cursor-pointer transition-all"
                style={{
                  borderColor: urgent ? `${color}40` : 'var(--border-c)',
                  background: urgent ? `${color}06` : 'white',
                  boxShadow: urgent ? `0 4px 16px ${color}10` : '0 2px 12px rgba(15,13,10,0.04)'
                }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}12` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  {urgent && <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />}
                </div>
                <div className="font-black text-2xl mb-0.5" style={{ fontFamily: 'Clash Display', color: urgent ? color : 'var(--ink)', letterSpacing: '-0.03em' }}>
                  {value ?? 0}
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>{label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-[var(--border-c)] p-5"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', fontSize: '1rem' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Review Companies', to: '/superadmin/companies', color: '#f59e0b' },
              { label: 'Approve Jobs',     to: '/superadmin/jobs',      color: '#3b82f6' },
              { label: 'Manage Users',     to: '/superadmin/users',     color: '#10b981' },
              { label: 'All Applications', to: '/superadmin/applications', color: '#8b5cf6' },
            ].map(({ label, to, color }) => (
              <button key={to} onClick={() => navigate(to)}
                className="flex items-center justify-between p-3.5 rounded-xl border transition-all text-left"
                style={{ borderColor: 'var(--border-c)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-c)'; e.currentTarget.style.background = 'transparent' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>{label}</span>
                <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--ink-muted)' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
