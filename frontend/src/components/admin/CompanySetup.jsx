import React, { useEffect, useState } from 'react'
import RecruiterLayout from './RecruiterLayout'
import { ArrowLeft, Loader2, Building2, Upload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useSelector, useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
  const { id } = useParams()
  useGetCompanyById(id)
  const [input, setInput] = useState({ name:'', description:'', website:'', location:'', file:null })
  const { singleCompany } = useSelector(s => s.company)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const ch = (e) => setInput({ ...input, [e.target.name]: e.target.value })
  const fh = (e) => setInput({ ...input, file: e.target.files?.[0] })

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', input.name)
    fd.append('description', input.description)
    fd.append('website', input.website)
    fd.append('location', input.location)
    if (input.file) fd.append('file', input.file)
    try {
      setLoading(true)
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
      })
      if (res.data.success) { toast.success(res.data.message); navigate('/admin/companies') }
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (singleCompany) setInput({ name: singleCompany.name||'', description: singleCompany.description||'', website: singleCompany.website||'', location: singleCompany.location||'', file: null })
  }, [singleCompany])

  const fields = [
    { name:'name',        label:'Company Name',  placeholder:'Acme Technologies' },
    { name:'description', label:'Description',   placeholder:'Brief about your company' },
    { name:'website',     label:'Website URL',   placeholder:'https://yourcompany.com' },
    { name:'location',    label:'Location',      placeholder:'Bangalore, India' },
  ]

  return (
    <RecruiterLayout>
      <div className="max-w-2xl">
        <button onClick={() => navigate('/admin/companies')}
          className="flex items-center gap-1.5 text-sm font-semibold mb-5 transition-colors"
          style={{ color: 'var(--ink-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}>
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </button>

        <h2 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Company Settings
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>Update your company profile and details</p>

        <div className="bg-white rounded-2xl border border-[var(--border-c)] p-6"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <form onSubmit={submit} className="space-y-4">
            {fields.map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>{label}</label>
                <input name={name} value={input[name]} onChange={ch} placeholder={placeholder} className="input-field" />
              </div>
            ))}

            {/* Logo upload */}
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>
                Company Logo <span style={{ textTransform:'none', letterSpacing:0, fontWeight:400, color:'var(--ink-muted)' }}>(optional)</span>
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                style={{ background: input.file?'rgba(245,158,11,0.05)':'var(--surface-3)', border:`1.5px dashed ${input.file?'rgba(245,158,11,0.4)':'var(--border-c)'}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: input.file?'rgba(245,158,11,0.12)':'rgba(15,13,10,0.05)' }}>
                  <Upload className="w-4 h-4" style={{ color: input.file?'var(--amber)':'var(--ink-muted)' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: input.file?'var(--amber-dark)':'var(--ink-muted)' }}>
                  {input.file ? input.file.name : 'Upload company logo'}
                </span>
                <input type="file" accept="image/*" onChange={fh} className="sr-only" />
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border-c)]">
              <button type="button" onClick={() => navigate('/admin/companies')} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-amber flex-1">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RecruiterLayout>
  )
}
export default CompanySetup
