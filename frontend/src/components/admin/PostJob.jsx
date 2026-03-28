import React, { useState } from 'react'
import RecruiterLayout from './RecruiterLayout'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'

const PostJob = () => {
  const [input, setInput] = useState({ title:'', description:'', requirements:'', salary:'', location:'', jobType:'', experience:'', position:'', companyId:'' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { companies } = useSelector(s => s.company)

  const ch = (e) => setInput({ ...input, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, { withCredentials: true })
      if (res.data.success) { toast.success(res.data.message); navigate('/admin/jobs') }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to post job') }
    finally { setLoading(false) }
  }

  const fields = [
    { name: 'title',       label: 'Job Title',          placeholder: 'e.g. Senior Frontend Developer', span: 2 },
    { name: 'description', label: 'Job Description',    placeholder: 'Describe role and responsibilities...', span: 2, textarea: true },
    { name: 'requirements',label: 'Requirements',       placeholder: 'React, Node.js, SQL (comma separated)', span: 2 },
    { name: 'salary',      label: 'Annual Salary (₹)',  placeholder: '1200000', type: 'number' },
    { name: 'location',    label: 'Location',           placeholder: 'Bangalore' },
    { name: 'jobType',     label: 'Job Type',           placeholder: 'Full Time' },
    { name: 'experience',  label: 'Experience (years)', placeholder: '2', type: 'number' },
    { name: 'position',    label: 'Open Positions',     placeholder: '5', type: 'number' },
  ]

  const iClass = "w-full px-4 py-2.5 rounded-xl outline-none text-sm transition-all input-field"

  return (
    <RecruiterLayout>
      <div className="max-w-3xl">
        <button onClick={() => navigate('/admin/jobs')}
          className="flex items-center gap-1.5 text-sm font-semibold mb-5 transition-colors"
          style={{ color: 'var(--ink-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}>
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        <h2 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Post New Job
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>Fill in the details to publish your job listing</p>

        <div className="bg-white rounded-2xl border border-[var(--border-c)] p-6"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <form onSubmit={submit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {fields.map(({ name, label, placeholder, type='text', span, textarea }) => (
                <div key={name} className={span === 2 ? 'col-span-2' : 'col-span-1'}>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>{label}</label>
                  {textarea ? (
                    <textarea name={name} value={input[name]} onChange={ch} placeholder={placeholder} rows={3}
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm transition-all resize-none input-field" />
                  ) : (
                    <input name={name} type={type} value={input[name]} onChange={ch} placeholder={placeholder} className={iClass} />
                  )}
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>Company</label>
                {companies.length === 0 ? (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl"
                    style={{ background: 'rgba(245,158,11,0.06)', border: '1.5px dashed rgba(245,158,11,0.3)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--amber-dark)' }}>
                      Register a company first before posting a job.
                    </p>
                    <button type="button" onClick={() => navigate('/admin/companies/create')}
                      className="btn-amber ml-auto shrink-0" style={{ fontSize: '0.75rem', padding: '0.4rem 0.875rem' }}>
                      Register →
                    </button>
                  </div>
                ) : (
                  <Select onValueChange={val => setInput({ ...input, companyId: val })}>
                    <SelectTrigger className="h-11 rounded-xl border-[var(--border-c)] bg-[var(--surface-3)] text-sm">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectGroup>
                        {companies.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border-c)]">
              <button type="button" onClick={() => navigate('/admin/jobs')} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-amber flex-1">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Posting...</> : <><span>Publish Job</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RecruiterLayout>
  )
}
export default PostJob
