import React, { useState } from 'react'
import RecruiterLayout from './RecruiterLayout'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Building2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

const CompanyCreate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)

  const register = async () => {
    if (!companyName.trim()) return toast.error('Company name is required')
    try {
      setLoading(true)
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, { withCredentials: true })
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company))
        toast.success(res.data.message)
        navigate(`/admin/companies/${res.data.company._id}`)
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <RecruiterLayout>
      <div className="max-w-lg">
        <button onClick={() => navigate('/admin/companies')}
          className="flex items-center gap-1.5 text-sm font-semibold mb-5 transition-colors"
          style={{ color: 'var(--ink-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}>
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </button>

        <h2 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Register Company
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>Give your company a name to get started</p>

        <div className="bg-white rounded-2xl border border-[var(--border-c)] p-6"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
            <Building2 className="w-7 h-7 text-amber-500" />
          </div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>Company Name</label>
          <input value={companyName} onChange={e => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Technologies" className="input-field mb-5"
            onKeyDown={e => e.key === 'Enter' && register()} />
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin/companies')} className="btn-ghost flex-1">Cancel</button>
            <button onClick={register} disabled={loading} className="btn-amber flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  )
}
export default CompanyCreate
