import React, { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminApps } from '@/redux/adminSlice'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

const statusStyle = {
  pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#92650a', border: 'rgba(245,158,11,0.25)', icon: Clock },
  accepted: { bg: 'rgba(16,185,129,0.1)',  color: '#065f46', border: 'rgba(16,185,129,0.25)', icon: CheckCircle },
  rejected: { bg: 'rgba(239,68,68,0.1)',   color: '#991b1b', border: 'rgba(239,68,68,0.25)', icon: XCircle },
}

const AdminApplications = () => {
  const dispatch = useDispatch()
  const { applications } = useSelector(s => s.admin)

  useEffect(() => {
    axios.get(`${ADMIN_API}/applications`, { withCredentials: true })
      .then(res => { if (res.data.success) dispatch(setAdminApps(res.data.applications)) })
  }, [])

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>Applications</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>{applications.length} total applications</p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-c)] overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          {applications.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <p className="font-bold" style={{ color: 'var(--ink-muted)' }}>No applications yet</p>
            </div>
          ) : applications.map(app => {
            const st = statusStyle[app.status] || statusStyle.pending
            const Icon = st.icon
            return (
              <div key={app._id}
                className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border-c)] last:border-0 transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>
                    {app.applicant?.fullname}
                    <span className="font-normal ml-2" style={{ color: 'var(--ink-muted)' }}>applied to</span>
                    <span className="ml-1">{app.job?.title}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                    {app.applicant?.email} · {app.job?.company} · {app.createdAt?.split('T')[0]}
                  </p>
                </div>
                <span className="tag flex items-center gap-1 shrink-0 capitalize"
                  style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                  <Icon className="w-3 h-3" />{app.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminApplications
