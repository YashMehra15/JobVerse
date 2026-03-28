import React, { useEffect, useState } from 'react'
import RecruiterLayout from './RecruiterLayout'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Plus, Search, Building2 } from 'lucide-react'

const Companies = () => {
  useGetAllCompanies()
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => { dispatch(setSearchCompanyByText(input)) }, [input])

  return (
    <RecruiterLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Companies
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>Manage your registered companies</p>
        </div>
        <button onClick={() => navigate('/admin/companies/create')} className="btn-amber" style={{ fontSize: '0.8125rem' }}>
          <Plus className="w-3.5 h-3.5" />New Company
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border-c)] overflow-hidden"
        style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
        <div className="p-4 border-b border-[var(--border-c)]">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
            <input placeholder="Search companies..." value={input} onChange={e => setInput(e.target.value)}
              className="input-field pl-9" style={{ height: '2.375rem' }} />
          </div>
        </div>
        <CompaniesTable />
      </div>
    </RecruiterLayout>
  )
}
export default Companies
