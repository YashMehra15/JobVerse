import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Pencil, Globe, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'

const approvalStyle = {
  pending:  { bg:'rgba(245,158,11,0.1)',  color:'#92650a', icon: Clock,         label:'Pending Review' },
  approved: { bg:'rgba(16,185,129,0.1)',  color:'#065f46', icon: CheckCircle,   label:'Approved' },
  rejected: { bg:'rgba(239,68,68,0.1)',   color:'#991b1b', icon: XCircle,       label:'Rejected' },
}

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(s => s.company)
  const [filtered, setFiltered] = useState(companies)
  const navigate = useNavigate()

  useEffect(() => {
    setFiltered(companies.filter(c =>
      !searchCompanyByText || c.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    ))
  }, [companies, searchCompanyByText])

  return (
    <Table>
      <TableCaption className="py-3 text-xs" style={{ color: 'var(--ink-muted)' }}>
        {filtered.length} {filtered.length === 1 ? 'company' : 'companies'} registered
      </TableCaption>
      <TableHeader>
        <TableRow className="border-[var(--border-c)]" style={{ background: 'var(--surface-3)' }}>
          {['Company','Location','Website','Status','Registered',''].map((h, i) => (
            <TableHead key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-16 text-sm" style={{ color: 'var(--ink-muted)' }}>
              No companies registered yet
            </TableCell>
          </TableRow>
        ) : filtered.map(c => {
          const ap = approvalStyle[c.status] || approvalStyle.pending
          const ApIcon = ap.icon
          return (
            <TableRow key={c._id} className="border-[var(--border-c)] transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 rounded-xl border border-[var(--border-c)]">
                    <AvatarImage src={c.logo} />
                    <AvatarFallback className="rounded-xl font-black text-xs"
                      style={{ background:'linear-gradient(135deg,#fef3c7,#fde68a)', color:'#92650a' }}>
                      {c.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-sm" style={{ color:'var(--ink)', fontFamily:'Clash Display' }}>{c.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm" style={{ color:'var(--ink-muted)' }}>
                {c.location
                  ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                  : <span style={{ color:'var(--border-c)' }}>—</span>}
              </TableCell>
              <TableCell>
                {c.website
                  ? <a href={c.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold" style={{ color:'var(--amber-dark)' }}>
                      <Globe className="w-3 h-3" />Visit
                    </a>
                  : <span style={{ color:'var(--border-c)' }}>—</span>}
              </TableCell>
              <TableCell>
                <span className="tag flex items-center gap-1 w-fit"
                  style={{ background: ap.bg, color: ap.color }}>
                  <ApIcon className="w-3 h-3" />{ap.label}
                </span>
              </TableCell>
              <TableCell className="text-sm" style={{ color:'var(--ink-muted)' }}>
                {c.createdAt?.split('T')[0]}
              </TableCell>
              <TableCell>
                <button onClick={() => navigate(`/admin/companies/${c._id}`)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background:'rgba(245,158,11,0.08)', color:'var(--amber-dark)', border:'1px solid rgba(245,158,11,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.08)'}>
                  <Pencil className="w-3 h-3" />Edit
                </button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default CompaniesTable
