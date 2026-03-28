import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector } from 'react-redux'

const statusStyle = {
  pending:  { background: '#f59e0b12', color: '#92650a', border: '1px solid #f59e0b25' },
  accepted: { background: '#10b98112', color: '#065f46', border: '1px solid #10b98125' },
  rejected: { background: '#ef444412', color: '#991b1b', border: '1px solid #ef444425' },
}

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(s => s.application)
  return (
    <Table>
      <TableCaption className="text-xs" style={{ color: 'var(--ink-muted)' }}>Your application history</TableCaption>
      <TableHeader>
        <TableRow className="border-[var(--border-c)] hover:bg-transparent">
          {['Date','Job Role','Company','Status'].map(h => (
            <TableHead key={h} className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {allAppliedJobs.length === 0 ? (
          <TableRow><TableCell colSpan={4} className="text-center py-12 text-sm" style={{ color: 'var(--ink-muted)' }}>No applications yet</TableCell></TableRow>
        ) : allAppliedJobs.map(app => (
          <TableRow key={app._id} className="border-[var(--border-c)]" style={{ '--tw-ring-color': 'transparent' }}>
            <TableCell className="text-sm" style={{ color: 'var(--ink-muted)' }}>{app?.createdAt?.split('T')[0]}</TableCell>
            <TableCell className="font-bold text-sm" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>{app.job?.title}</TableCell>
            <TableCell className="text-sm" style={{ color: 'var(--ink-muted)' }}>{app.job?.company?.name}</TableCell>
            <TableCell>
              <span className="tag capitalize" style={statusStyle[app.status] || statusStyle.pending}>{app.status}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
export default AppliedJobTable
