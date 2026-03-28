import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import {
  Building2, Briefcase, Users, TrendingUp,
  Plus, ArrowRight, Eye, Zap
} from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-[var(--border-c)] p-5"
    style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <TrendingUp className="w-4 h-4 text-emerald-500" />
    </div>
    <div className="font-black text-2xl mb-0.5" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', letterSpacing: '-0.03em' }}>
      {value}
    </div>
    <div className="text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>{label}</div>
    {sub && <div className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>{sub}</div>}
  </div>
)

const RecruiterDashboard = () => {
  useGetAllCompanies()
  useGetAllAdminJobs()
  const { user } = useSelector(s => s.auth)
  const { companies } = useSelector(s => s.company)
  const { allAdminJobs } = useSelector(s => s.job)
  const navigate = useNavigate()

  const totalApplications = allAdminJobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0)
  const recentJobs = allAdminJobs.slice(0, 5)

  const stats = [
    { icon: Building2, label: 'Companies',       value: companies.length,       sub: 'registered',          color: '#f59e0b' },
    { icon: Briefcase, label: 'Active Jobs',      value: allAdminJobs.length,    sub: 'posted by you',       color: '#3b82f6' },
    { icon: Users,     label: 'Total Applicants', value: totalApplications,      sub: 'across all jobs',     color: '#10b981' },
    { icon: Zap,       label: 'Response Rate',    value: '94%',                  sub: 'avg. this month',     color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden p-6" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-64 h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right, rgba(245,158,11,0.1) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-amber-400/40">
              <AvatarImage src={user?.profile?.profilePhoto} />
              <AvatarFallback className="font-black text-amber-900 bg-amber-400">
                {user?.fullname?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Welcome back</p>
              <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.375rem', color: '#fff', letterSpacing: '-0.02em' }}>
                {user?.fullname} 👋
              </h2>
            </div>
          </div>
          <div className="flex gap-3">
            {companies.length === 0 ? (
              <button onClick={() => navigate('/admin/companies/create')} className="btn-amber" style={{ fontSize: '0.8rem' }}>
                <Plus className="w-3.5 h-3.5" />Register Company
              </button>
            ) : (
              <button onClick={() => navigate('/admin/jobs/create')} className="btn-amber" style={{ fontSize: '0.8rem' }}>
                <Plus className="w-3.5 h-3.5" />Post New Job
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick actions + Recent jobs */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-[var(--border-c)] p-5"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', fontSize: '1rem' }}>
            Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Post a New Job', icon: Plus, to: '/admin/jobs/create', color: '#f59e0b' },
              { label: 'Register Company', icon: Building2, to: '/admin/companies/create', color: '#3b82f6' },
              { label: 'Manage Companies', icon: Eye, to: '/admin/companies', color: '#10b981' },
              { label: 'View All Jobs', icon: Briefcase, to: '/admin/jobs', color: '#8b5cf6' },
            ].map(({ label, icon: Icon, to, color }) => (
              <button key={to} onClick={() => navigate(to)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group"
                style={{ border: '1px solid var(--border-c)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-c)'; e.currentTarget.style.background = 'transparent' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}12` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-sm font-semibold flex-1" style={{ color: 'var(--ink-soft)', fontFamily: 'Bricolage Grotesque' }}>{label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--border-c)] p-5"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', fontSize: '1rem' }}>
              Recent Job Listings
            </h3>
            <button onClick={() => navigate('/admin/jobs')}
              className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--amber-dark)' }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3">
                <Briefcase className="w-6 h-6 text-amber-400" />
              </div>
              <p className="font-bold text-sm" style={{ color: 'var(--ink-soft)', fontFamily: 'Clash Display' }}>No jobs posted yet</p>
              <p className="text-xs mt-1 mb-4" style={{ color: 'var(--ink-muted)' }}>Post your first job to start hiring</p>
              <button onClick={() => navigate('/admin/jobs/create')} className="btn-amber" style={{ fontSize: '0.8rem' }}>
                <Plus className="w-3.5 h-3.5" />Post First Job
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentJobs.map(job => (
                <div key={job._id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-c)] hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer group"
                  onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}>
                  <Avatar className="h-9 w-9 rounded-xl border border-[var(--border-c)] shrink-0">
                    <AvatarImage src={job.company?.logo} />
                    <AvatarFallback className="rounded-xl font-black text-xs"
                      style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
                      {job.company?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>{job.title}</p>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                      {job.company?.name} · {job.applications?.length || 0} applicants
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="tag tag-amber">{job.jobType}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Setup prompt if no company */}
      {companies.length === 0 && (
        <div className="rounded-2xl p-6 flex items-center gap-5"
          style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(249,115,22,0.06))', border: '1.5px dashed rgba(245,158,11,0.3)' }}>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1" style={{ fontFamily: 'Clash Display', color: 'var(--ink)' }}>
              Register your company first
            </h3>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              You need to register at least one company before you can post jobs.
            </p>
          </div>
          <button onClick={() => navigate('/admin/companies/create')} className="btn-amber shrink-0" style={{ fontSize: '0.8rem' }}>
            Register Company <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default RecruiterDashboard
