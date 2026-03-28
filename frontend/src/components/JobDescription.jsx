import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { MapPin, Briefcase, IndianRupee, Clock, Users, Globe, CheckCircle, Loader2, ArrowRight, CalendarDays, Star } from 'lucide-react'

const JobDescription = () => {
  const { singleJob } = useSelector(s => s.job)
  const { user } = useSelector(s => s.auth)
  const [applying, setApplying] = useState(false)
  const isApplied = singleJob?.applications?.some(a => a.applicant?._id === user?._id || a === user?._id)
  const dispatch = useDispatch()
  const { id: jobId } = useParams()

  const applyHandler = async () => {
    try {
      setApplying(true)
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setSingleJob({ ...singleJob, applications: [...(singleJob.applications||[]), { applicant: user?._id }] }))
        toast.success(res.data.message)
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply') }
    finally { setApplying(false) }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
        if (res.data.success) dispatch(setSingleJob(res.data.job))
      } catch {}
    }
    fetch()
  }, [jobId])

  if (!singleJob) return <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}><Navbar /><div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div></div>

  const meta = [
    { icon: MapPin, label: singleJob?.location },
    { icon: Briefcase, label: `${singleJob?.position} Positions` },
    { icon: IndianRupee, label: `${Number(singleJob?.salary).toLocaleString('en-IN')} PA` },
    { icon: Users, label: `${singleJob?.applications?.length||0} Applied` },
    { icon: Clock, label: singleJob?.jobType },
    { icon: Globe, label: `${singleJob?.experienceLevel}+ yrs` },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-[var(--border-c)] overflow-hidden mb-5"
          style={{ boxShadow: '0 4px 24px rgba(15,13,10,0.06)' }}>
          {/* Amber stripe top */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg,var(--amber),#f97316,#ef4444)' }} />
          <div className="p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-2xl border-2 border-[var(--border-c)]"
                  style={{ boxShadow: '0 4px 12px rgba(15,13,10,0.08)' }}>
                  <AvatarImage src={singleJob?.company?.logo} />
                  <AvatarFallback className="rounded-2xl font-black text-xl"
                    style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
                    {singleJob?.company?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--amber-dark)' }}>{singleJob?.company?.name}</p>
                  <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', letterSpacing: '-0.03em' }}>
                    {singleJob?.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                    <CalendarDays className="w-3.5 h-3.5" />
                    Posted {new Date(singleJob?.createdAt).toLocaleDateString('en-IN', { day:'numeric',month:'short',year:'numeric' })}
                  </div>
                </div>
              </div>
              {isApplied ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: '#10b98112', color: '#065f46', border: '1.5px solid #10b98130' }}>
                  <CheckCircle className="w-4 h-4" />Applied ✓
                </div>
              ) : (
                <button onClick={applyHandler} disabled={applying} className="btn-amber"
                  style={{ borderRadius: '0.75rem', opacity: applying ? 0.7 : 1 }}>
                  {applying ? <><Loader2 className="w-4 h-4 animate-spin" />Applying...</> : <><span>Apply Now</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              )}
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[var(--border-c)]">
              {meta.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ background: 'var(--surface-3)', color: 'var(--ink-soft)', border: '1px solid var(--border-c)' }}>
                  <Icon className="w-3.5 h-3.5 text-amber-500" />{label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-[var(--border-c)] p-6">
              <h2 className="font-bold mb-3" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', fontSize: '1.125rem' }}>
                About the Role
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>{singleJob?.description}</p>
            </div>
            {singleJob?.requirements?.length > 0 && (
              <div className="bg-white rounded-2xl border border-[var(--border-c)] p-6">
                <h2 className="font-bold mb-4" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', fontSize: '1.125rem' }}>Requirements</h2>
                <div className="flex flex-wrap gap-2">
                  {singleJob.requirements.map((r, i) => (
                    <span key={i} className="tag tag-amber">{r.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[var(--border-c)] p-5">
              <h2 className="font-bold mb-4" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', fontSize: '1rem' }}>Company</h2>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 rounded-xl border border-[var(--border-c)]">
                  <AvatarImage src={singleJob?.company?.logo} />
                  <AvatarFallback className="rounded-xl font-black text-sm"
                    style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
                    {singleJob?.company?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold text-sm" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>{singleJob?.company?.name}</p>
              </div>
              <div className="space-y-2 text-sm">
                {singleJob?.company?.location && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--ink-muted)' }}>
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />{singleJob.company.location}
                  </div>
                )}
                {singleJob?.company?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <a href={singleJob.company.website} target="_blank" rel="noreferrer"
                      className="font-semibold" style={{ color: 'var(--amber-dark)' }}>Visit website →</a>
                  </div>
                )}
                {singleJob?.company?.description && (
                  <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--ink-muted)' }}>{singleJob.company.description}</p>
                )}
              </div>
            </div>

            {/* Apply CTA */}
            {!isApplied && (
              <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--ink)' }}>
                <Star className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="font-bold text-white text-sm mb-1" style={{ fontFamily: 'Clash Display' }}>Ready to apply?</p>
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Join {singleJob?.applications?.length||0} other applicants</p>
                <button onClick={applyHandler} disabled={applying} className="btn-amber w-full" style={{ borderRadius: '0.625rem' }}>
                  Apply Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDescription
