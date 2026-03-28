import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminCompanies, updateAdminCompanyStatus, removeAdminCompany } from '@/redux/adminSlice'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { CheckCircle, XCircle, Clock, Trash2, Globe, MapPin, Search, Filter } from 'lucide-react'

const statusStyle = {
  pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#92650a', border: 'rgba(245,158,11,0.25)',  icon: Clock },
  approved: { bg: 'rgba(16,185,129,0.1)',  color: '#065f46', border: 'rgba(16,185,129,0.25)', icon: CheckCircle },
  rejected: { bg: 'rgba(239,68,68,0.1)',   color: '#991b1b', border: 'rgba(239,68,68,0.25)',  icon: XCircle },
}

const AdminCompanies = () => {
  const dispatch = useDispatch()
  const { companies } = useSelector(s => s.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(`${ADMIN_API}/companies`, { withCredentials: true })
      .then(res => { if (res.data.success) dispatch(setAdminCompanies(res.data.companies)) })
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${ADMIN_API}/companies/${id}`, { status }, { withCredentials: true })
      if (res.data.success) { dispatch(updateAdminCompanyStatus({ id, status })); toast.success(res.data.message) }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const deleteCompany = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will also delete all its jobs.`)) return
    try {
      await axios.delete(`${ADMIN_API}/companies/${id}`, { withCredentials: true })
      dispatch(removeAdminCompany(id)); toast.success('Company deleted')
    } catch (err) { toast.error('Failed to delete') }
  }

  const filtered = companies.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.owner?.email?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const pending = companies.filter(c => c.status === 'pending').length

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              Companies
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>
              {companies.length} total · <span style={{ color: pending > 0 ? '#d97706' : 'var(--ink-muted)', fontWeight: pending > 0 ? 700 : 400 }}>{pending} pending approval</span>
            </p>
          </div>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border-c)] bg-white">
            {['all','pending','approved','rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={{
                  background: filter === f ? 'var(--ink)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--ink-muted)'
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
          <input placeholder="Search companies or owner..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center py-16 bg-white rounded-2xl border border-[var(--border-c)]">
              <Building2 className="w-8 h-8 mb-2" style={{ color: 'var(--ink-muted)' }} />
              <p className="font-bold" style={{ color: 'var(--ink-muted)' }}>No companies found</p>
            </div>
          ) : filtered.map(company => {
            const st = statusStyle[company.status] || statusStyle.pending
            const Icon = st.icon
            return (
              <div key={company._id} className="bg-white rounded-2xl border border-[var(--border-c)] p-5 relative overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)', borderColor: company.status === 'pending' ? 'rgba(245,158,11,0.3)' : 'var(--border-c)' }}>
                {company.status === 'pending' && (
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#f59e0b' }} />
                )}

                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 rounded-xl border border-[var(--border-c)]">
                      <AvatarImage src={company.logo} />
                      <AvatarFallback className="rounded-xl font-black text-sm"
                        style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
                        {company.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-black text-sm leading-tight" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>{company.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>{company.owner?.email}</p>
                    </div>
                  </div>
                  <span className="tag flex items-center gap-1 shrink-0"
                    style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                    <Icon className="w-3 h-3" />{company.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 mb-4 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {company.location && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{company.location}</div>}
                  {company.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      <a href={company.website} target="_blank" rel="noreferrer" className="font-semibold hover:underline" style={{ color: 'var(--amber-dark)' }}>
                        {company.website.replace(/https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {company.description && <p className="line-clamp-2 mt-1">{company.description}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-[var(--border-c)]">
                  {company.status !== 'approved' && (
                    <button onClick={() => updateStatus(company._id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#065f46', border: '1px solid rgba(16,185,129,0.2)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}>
                      <CheckCircle className="w-3.5 h-3.5" />Approve
                    </button>
                  )}
                  {company.status !== 'rejected' && (
                    <button onClick={() => updateStatus(company._id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#991b1b', border: '1px solid rgba(239,68,68,0.2)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                      <XCircle className="w-3.5 h-3.5" />Reject
                    </button>
                  )}
                  <button onClick={() => deleteCompany(company._id, company.name)}
                    className="p-2 rounded-xl transition-all"
                    style={{ background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCompanies
