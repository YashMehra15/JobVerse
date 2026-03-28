import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { updateApplicationStatus } from '@/redux/applicationSlice'

const statusStyle = {
  pending:  { bg:'rgba(245,158,11,0.1)', color:'#92650a', border:'rgba(245,158,11,0.2)', icon: Clock },
  accepted: { bg:'rgba(16,185,129,0.1)',  color:'#065f46', border:'rgba(16,185,129,0.2)', icon: CheckCircle },
  rejected: { bg:'rgba(239,68,68,0.1)',  color:'#991b1b', border:'rgba(239,68,68,0.2)', icon: XCircle },
}

const ApplicantsTable = () => {
  const { applicants } = useSelector(s => s.application)
  const dispatch = useDispatch()

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true })
      if (res.data.success) {
        dispatch(updateApplicationStatus({ id, status }))
        toast.success(`Marked as ${status}`)
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
  }

  return (
    <Table>
      <TableCaption className="py-3 text-xs" style={{ color:'var(--ink-muted)' }}>
        {applicants?.applications?.length || 0} applicants
      </TableCaption>
      <TableHeader>
        <TableRow className="border-[var(--border-c)]" style={{ background:'var(--surface-3)' }}>
          {['Applicant','Contact','Resume','Applied','Status','Action'].map((h,i) => (
            <TableHead key={i} className={`text-xs font-bold uppercase tracking-widest${i===5?' text-right':''}`} style={{ color:'var(--ink-muted)' }}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!applicants?.applications?.length ? (
          <TableRow><TableCell colSpan={6} className="text-center py-16 text-sm" style={{ color:'var(--ink-muted)' }}>No applicants yet</TableCell></TableRow>
        ) : applicants.applications.map(app => {
          const st = statusStyle[app.status] || statusStyle.pending
          const Icon = st.icon
          return (
            <TableRow key={app._id} className="border-[var(--border-c)] transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 rounded-xl border border-[var(--border-c)]">
                    <AvatarImage src={app.applicant?.profile?.profilePhoto} />
                    <AvatarFallback className="rounded-xl font-black text-xs" style={{ background:'linear-gradient(135deg,#fef3c7,#fde68a)', color:'#92650a' }}>
                      {app.applicant?.fullname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-sm" style={{ color:'var(--ink)', fontFamily:'Clash Display' }}>{app.applicant?.fullname}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm" style={{ color:'var(--ink-muted)' }}>{app.applicant?.email}</TableCell>
              <TableCell>
                {app.applicant?.profile?.resume ? (
                  <a href={app.applicant.profile.resume} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold" style={{ color:'var(--amber-dark)' }}>
                    <FileText className="w-3 h-3" />View
                  </a>
                ) : <span style={{ color:'var(--border-c)' }}>—</span>}
              </TableCell>
              <TableCell className="text-sm" style={{ color:'var(--ink-muted)' }}>{app.createdAt?.split('T')[0]}</TableCell>
              <TableCell>
                <span className="tag flex items-center gap-1 w-fit capitalize"
                  style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>
                  <Icon className="w-3 h-3" />{app.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <button onClick={() => updateStatus(app._id, 'accepted')}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{ background:'rgba(16,185,129,0.08)', color:'#065f46', border:'1px solid rgba(16,185,129,0.2)' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(16,185,129,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(16,185,129,0.08)'}>Accept</button>
                  <button onClick={() => updateStatus(app._id, 'rejected')}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{ background:'rgba(239,68,68,0.08)', color:'#991b1b', border:'1px solid rgba(239,68,68,0.2)' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}>Reject</button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
export default ApplicantsTable
