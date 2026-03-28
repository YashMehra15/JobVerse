import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { MapPin, Clock, IndianRupee, Bookmark, ArrowUpRight, Briefcase, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const typeColors = {
  'Full Time': { bg: '#10b98112', color: '#065f46', border: '#10b98120' },
  'Part Time': { bg: '#f59e0b12', color: '#92650a', border: '#f59e0b20' },
  'Remote':    { bg: '#3b82f612', color: '#1e40af', border: '#3b82f620' },
  'Contract':  { bg: '#8b5cf612', color: '#5b21b6', border: '#8b5cf620' },
}

const Job = ({ job }) => {
  const navigate = useNavigate()
  const daysAgo = Math.floor((new Date() - new Date(job?.createdAt)) / 86400000)
  const tc = typeColors[job?.jobType] || { bg: '#6b656012', color: 'var(--ink-muted)', border: '#6b656020' }

  return (
    <div className="group relative bg-white rounded-2xl border border-[var(--border-c)] p-5 card-lift cursor-pointer overflow-hidden"
      onClick={() => navigate(`/description/${job?._id}`)}>
      {/* Top shimmer on hover */}
      <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full rounded-t-2xl transition-all duration-500"
        style={{ background: 'linear-gradient(90deg, var(--amber), #f97316)' }} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 rounded-xl border border-[var(--border-c)]">
            <AvatarImage src={job?.company?.logo} />
            <AvatarFallback className="rounded-xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
              {job?.company?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--ink)', fontFamily: 'Bricolage Grotesque' }}>{job?.company?.name}</p>
            <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>
              <MapPin className="w-3 h-3" />{job?.location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
            {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
          </span>
          <button onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors" style={{ color: 'var(--ink-muted)' }}>
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-base mb-1.5 leading-tight group-hover:text-amber-700 transition-colors"
        style={{ fontFamily: 'Clash Display', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
        {job?.title}
      </h3>
      <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--ink-muted)' }}>{job?.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="tag" style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
          <Briefcase className="w-2.5 h-2.5" />{job?.position} pos
        </span>
        <span className="tag tag-amber"><IndianRupee className="w-2.5 h-2.5" />{Number(job?.salary).toLocaleString('en-IN')}</span>
        <span className="tag tag-dark"><Clock className="w-2.5 h-2.5" />{job?.jobType}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-c)]">
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
          <Users className="w-3 h-3" />{job?.applications?.length || 0} applied
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ color: 'var(--amber-dark)', background: 'rgba(245,158,11,0.08)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.08)'}>
          View role <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default Job
