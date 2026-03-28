import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Mail, Phone, FileText, Pen, Briefcase, Star, Download } from 'lucide-react'
import { useSelector } from 'react-redux'
import UpdateProfileDialog from './UpdateProfileDialog'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
  useGetAppliedJobs()
  const [open, setOpen] = useState(false)
  const { user } = useSelector(s => s.auth)

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-[var(--border-c)] overflow-hidden mb-5"
          style={{ boxShadow: '0 4px 24px rgba(15,13,10,0.06)' }}>
          {/* Banner */}
          <div className="h-28 relative" style={{ background: 'var(--ink)' }}>
            <div className="absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute bottom-0 right-0 left-0 h-12"
              style={{ background: 'linear-gradient(to top, rgba(15,13,10,0.5), transparent)' }} />
          </div>

          <div className="px-7 pb-7">
            <div className="flex items-end justify-between -mt-10 mb-5">
              <div className="relative">
                <Avatar className="h-20 w-20 rounded-2xl border-4 border-white shadow-xl">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback className="rounded-2xl text-white text-2xl font-black"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
                    {user?.fullname?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <button onClick={() => setOpen(true)} className="btn-ghost mb-1"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                <Pen className="w-3.5 h-3.5" />Edit Profile
              </button>
            </div>

            <h1 className="mb-1" style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.625rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              {user?.fullname}
            </h1>
            <p className="text-sm max-w-md leading-relaxed mb-5" style={{ color: 'var(--ink-muted)' }}>
              {user?.profile?.bio || 'No bio added yet — click Edit Profile to add one'}
            </p>

            <div className="flex flex-wrap gap-4 pt-5 border-t border-[var(--border-c)]">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                </div>{user?.email}
              </div>
              {user?.phoneNumber && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                  </div>{user.phoneNumber}
                </div>
              )}
            </div>

            {user?.profile?.skills?.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>Skills</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.profile.skills.map((s, i) => <span key={i} className="tag tag-amber">{s}</span>)}
                </div>
              </div>
            )}

            {user?.profile?.resume && (
              <div className="mt-5 flex items-center gap-3 p-4 rounded-xl border border-[var(--border-c)]"
                style={{ background: 'var(--surface-3)' }}>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--ink)' }}>{user.profile.resumeOriginalName||'Resume'}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>PDF Document</p>
                </div>
                <a href={user.profile.resume} target="_blank" rel="noreferrer" className="btn-ghost"
                  style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}>
                  <Download className="w-3.5 h-3.5" />View
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Applied jobs */}
        <div className="bg-white rounded-2xl border border-[var(--border-c)] p-7"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-amber-500" />
            </div>
            <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.25rem', color: 'var(--ink)' }}>
              Applied Jobs
            </h2>
          </div>
          <AppliedJobTable />
        </div>
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile
