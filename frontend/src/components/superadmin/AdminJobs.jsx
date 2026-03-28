import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminJobs, updateAdminJobStatus, removeAdminJob } from '@/redux/adminSlice'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { CheckCircle, XCircle, Clock, Trash2, MapPin, IndianRupee, Search } from 'lucide-react'

const statusStyle = {
  pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#92650a', border: 'rgba(245,158,11,0.25)', icon: Clock },
  approved: { bg: 'rgba(16,185,129,0.1)',  color: '#065f46', border: 'rgba(16,185,129,0.25)', icon: CheckCircle },
  rejected: { bg: 'rgba(239,68,68,0.1)',   color: '#991b1b', border: 'rgba(239,68,68,0.25)', icon: XCircle },
}

const AdminJobsPage = () => {
  const dispatch = useDispatch()
  const { jobs } = useSelector(s => s.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(`${ADMIN_API}/jobs`, { withCredentials: true })
      .then(res => { if (res.data.success) dispatch(setAdminJobs(res.data.jobs)) })
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${ADMIN_API}/jobs/${id}`, { status }, { withCredentials: true })
      if (res.data.success) { dispatch(updateAdminJobStatus({ id, status })); toast.success(res.data.message) }
    } catch (err) { toast.error('Failed') }
  }

  const deleteJob = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await axios.delete(`${ADMIN_API}/jobs/${id}`, { withCredentials: true })
      dispatch(removeAdminJob(id)); toast.success('Job deleted')
    } catch { toast.error('Failed to delete') }
  }

  const filtered = jobs.filter(j => {
    const matchFilter = filter === 'all' || j.status === filter
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.name?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const pending = jobs.filter(j => j.status === 'pending').length

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              Job Listings
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>
              {jobs.length} total · <span style={{ color: pending > 0 ? '#d97706' : 'var(--ink-muted)', fontWeight: pending > 0 ? 700 : 400 }}>{pending} pending review</span>
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border-c)] bg-white">
            {['all','pending','approved','rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={{ background: filter === f ? 'var(--ink)' : 'transparent', color: filter === f ? '#fff' : 'var(--ink-muted)' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
          <input placeholder="Search jobs or company..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 bg-white rounded-2xl border border-[var(--border-c)]">
              <p className="font-bold" style={{ color: 'var(--ink-muted)' }}>No jobs found</p>
            </div>
          ) : filtered.map(job => {
            const st = statusStyle[job.status] || statusStyle.pending
            const Icon = st.icon
            return (
              <div key={job._id} className="bg-white rounded-2xl border p-5 relative overflow-hidden"
                style={{ borderColor: job.status === 'pending' ? 'rgba(245,158,11,0.3)' : 'var(--border-c)', boxShadow: '0 2px 8px rgba(15,13,10,0.04)' }}>
                {job.status === 'pending' && (
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#f59e0b' }} />
                )}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 rounded-xl border border-[var(--border-c)] shrink-0">
                      <AvatarImage src={job.company?.logo} />
                      <AvatarFallback className="rounded-xl font-black text-xs"
                        style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
                        {job.company?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-black text-base truncate" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>{job.company?.name}</span>
                        <span className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                          <MapPin className="w-3 h-3" />{job.location}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                          <IndianRupee className="w-3 h-3" />{Number(job.salary).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>by {job.postedBy?.fullname}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="tag flex items-center gap-1"
                      style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      <Icon className="w-3 h-3" />{job.status}
                    </span>
                    {job.status !== 'approved' && (
                      <button onClick={() => updateStatus(job._id, 'approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                        style={{ background: 'rgba(16,185,129,0.1)', color: '#065f46', border: '1px solid rgba(16,185,129,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}>
                        <CheckCircle className="w-3.5 h-3.5" />Approve
                      </button>
                    )}
                    {job.status !== 'rejected' && (
                      <button onClick={() => updateStatus(job._id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#991b1b', border: '1px solid rgba(239,68,68,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                        <XCircle className="w-3.5 h-3.5" />Reject
                      </button>
                    )}
                    <button onClick={() => deleteJob(job._id, job.title)}
                      className="p-2 rounded-xl transition-all"
                      style={{ background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminJobsPage
