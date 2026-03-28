import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Users, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react'

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(s => s.job)
  const [filtered, setFiltered] = useState(allAdminJobs)
  const navigate = useNavigate()

  useEffect(() => {
    setFiltered(allAdminJobs.filter(j => {
      if (!searchJobByText) return true
      const q = searchJobByText.toLowerCase()
      return j.title?.toLowerCase().includes(q) || j.company?.name?.toLowerCase().includes(q)
    }))
  }, [allAdminJobs, searchJobByText])

  const typeColor = {
    'Full Time': { bg:'#10b98110', color:'#065f46', border:'#10b98120' },
    'Part Time': { bg:'#f59e0b10', color:'#92650a', border:'#f59e0b20' },
    'Remote':    { bg:'#3b82f610', color:'#1e40af', border:'#3b82f620' },
    'Contract':  { bg:'#8b5cf610', color:'#5b21b6', border:'#8b5cf620' },
  }

  const approvalStyle = {
    pending:  { bg:'rgba(245,158,11,0.1)',  color:'#92650a', icon: Clock },
    approved: { bg:'rgba(16,185,129,0.1)',  color:'#065f46', icon: CheckCircle },
    rejected: { bg:'rgba(239,68,68,0.1)',   color:'#991b1b', icon: XCircle },
  }

  return (
    <Table>
      <TableCaption className="py-3 text-xs" style={{ color:'var(--ink-muted)' }}>{filtered.length} jobs posted</TableCaption>
      <TableHeader>
        <TableRow className="border-[var(--border-c)]" style={{ background:'var(--surface-3)' }}>
          {['Job Title','Company','Type','Approval','Applicants',''].map((h,i) => (
            <TableHead key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color:'var(--ink-muted)' }}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.length === 0 ? (
          <TableRow><TableCell colSpan={6} className="text-center py-16 text-sm" style={{ color:'var(--ink-muted)' }}>No jobs posted yet</TableCell></TableRow>
        ) : filtered.map(job => {
          const tc = typeColor[job.jobType] || { bg:'#6b656010', color:'var(--ink-muted)', border:'#6b656020' }
          const ap = approvalStyle[job.status] || approvalStyle.pending
          const ApIcon = ap.icon
          return (
            <TableRow key={job._id} className="border-[var(--border-c)] transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <TableCell className="font-bold text-sm" style={{ color:'var(--ink)', fontFamily:'Clash Display' }}>{job.title}</TableCell>
              <TableCell className="text-sm" style={{ color:'var(--ink-muted)' }}>{job.company?.name}</TableCell>
              <TableCell>
                <span className="tag text-xs" style={{ background:tc.bg, color:tc.color, border:`1px solid ${tc.border}` }}>{job.jobType}</span>
              </TableCell>
              <TableCell>
                <span className="tag flex items-center gap-1 w-fit capitalize text-xs"
                  style={{ background:ap.bg, color:ap.color }}>
                  <ApIcon className="w-3 h-3" />{job.status || 'pending'}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-sm font-semibold" style={{ color:'var(--ink-soft)' }}>
                  <Users className="w-3.5 h-3.5 text-amber-500" />{job.applications?.length || 0}
                </span>
              </TableCell>
              <TableCell>
                <button onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background:'rgba(245,158,11,0.08)', color:'var(--amber-dark)', border:'1px solid rgba(245,158,11,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.08)'}>
                  Applicants <ArrowRight className="w-3 h-3" />
                </button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
export default AdminJobsTable
