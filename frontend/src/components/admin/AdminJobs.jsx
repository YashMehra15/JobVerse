import React, { useEffect, useState } from 'react'
import RecruiterLayout from './RecruiterLayout'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchJobByText } from '@/redux/jobSlice'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { Plus, Search } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs()
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => { dispatch(setSearchJobByText(input)) }, [input])

  return (
    <RecruiterLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Job Listings
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>Manage your posted jobs</p>
        </div>
        <button onClick={() => navigate('/admin/jobs/create')} className="btn-amber" style={{ fontSize: '0.8125rem' }}>
          <Plus className="w-3.5 h-3.5" />Post New Job
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-c)] overflow-hidden"
        style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
        <div className="p-4 border-b border-[var(--border-c)]">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
            <input placeholder="Search jobs..." value={input} onChange={e => setInput(e.target.value)}
              className="input-field pl-9" style={{ height: '2.375rem' }} />
          </div>
        </div>
        <AdminJobsTable />
      </div>
    </RecruiterLayout>
  )
}
export default AdminJobs
