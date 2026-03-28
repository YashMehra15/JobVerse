import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { MapPin, ArrowUpRight, IndianRupee, Clock, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const typeColors = {
  'Full Time': { bg: '#10b98114', color: '#065f46', border: '#10b98125' },
  'Part Time': { bg: '#f59e0b14', color: '#92650a', border: '#f59e0b25' },
  'Remote':    { bg: '#3b82f614', color: '#1e40af', border: '#3b82f625' },
  'Contract':  { bg: '#8b5cf614', color: '#5b21b6', border: '#8b5cf625' },
}

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate()
  const tc = typeColors[job?.jobType] || { bg: '#6b656014', color: '#3d3530', border: '#6b656025' }
  const daysAgo = Math.floor((new Date() - new Date(job?.createdAt)) / 86400000)

  return (
    <div onClick={() => navigate(`/description/${job._id}`)}
      className="group relative bg-white rounded-2xl border border-[var(--border-c)] p-5 cursor-pointer card-lift overflow-hidden">

      {/* Amber top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
        style={{ background: 'linear-gradient(90deg, var(--amber), #f97316)' }} />

      {/* Company + Arrow */}
      <div className="flex items-start justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-10 w-10 rounded-xl border border-[var(--border-c)] shadow-sm">
            <AvatarImage src={job?.company?.logo} />
            <AvatarFallback className="rounded-xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
              {job?.company?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--ink)', fontFamily: 'Bricolage Grotesque' }}>
              {job?.company?.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--ink-muted)', fontSize: '0.7rem' }}>
              <MapPin className="w-3 h-3" />{job?.location}
            </div>
          </div>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-[var(--border-c)] group-hover:bg-amber-50 group-hover:border-amber-200 transition-all shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--ink-muted)] group-hover:text-amber-600 transition-colors" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-base mb-1.5 group-hover:text-amber-700 transition-colors leading-tight"
        style={{ fontFamily: 'Clash Display', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
        {job?.title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--ink-muted)' }}>
        {job?.description}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="tag" style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
          <Briefcase className="w-2.5 h-2.5" />{job?.jobType}
        </span>
        <span className="tag tag-amber">
          <IndianRupee className="w-2.5 h-2.5" />{Number(job?.salary).toLocaleString('en-IN')}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-c)]">
        <span style={{ fontSize: '0.7rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
          <Clock className="w-3 h-3 inline mr-1" />
          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
        </span>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--amber-dark)' }}>
          View role →
        </span>
      </div>
    </div>
  )
}

export default LatestJobCards
