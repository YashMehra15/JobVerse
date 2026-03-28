import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminUsers, removeAdminUser } from '@/redux/adminSlice'
import axios from 'axios'
import { ADMIN_API } from '@/utils/constant'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Trash2, Search, GraduationCap, Briefcase } from 'lucide-react'

const AdminUsers = () => {
  const dispatch = useDispatch()
  const { users } = useSelector(s => s.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(`${ADMIN_API}/users`, { withCredentials: true })
      .then(res => { if (res.data.success) dispatch(setAdminUsers(res.data.users)) })
  }, [])

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await axios.delete(`${ADMIN_API}/users/${id}`, { withCredentials: true })
      dispatch(removeAdminUser(id)); toast.success('User deleted')
    } catch { toast.error('Failed to delete') }
  }

  const filtered = users.filter(u => {
    const matchFilter = filter === 'all' || u.role === filter
    const matchSearch = !search || u.fullname?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>Users</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>{users.length} registered users</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border-c)] bg-white">
            {['all','student','recruiter'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={{ background: filter === f ? 'var(--ink)' : 'transparent', color: filter === f ? '#fff' : 'var(--ink-muted)' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-c)] overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <p className="font-bold" style={{ color: 'var(--ink-muted)' }}>No users found</p>
            </div>
          ) : filtered.map((user, i) => (
            <div key={user._id}
              className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border-c)] last:border-0 transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Avatar className="h-10 w-10 rounded-xl border border-[var(--border-c)] shrink-0">
                <AvatarImage src={user.profilePhoto} />
                <AvatarFallback className="rounded-xl font-black text-sm"
                  style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92650a' }}>
                  {user.fullname?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: 'var(--ink)', fontFamily: 'Clash Display' }}>{user.fullname}</p>
                <p className="text-xs truncate" style={{ color: 'var(--ink-muted)' }}>{user.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="tag flex items-center gap-1"
                  style={user.role === 'student'
                    ? { background: 'rgba(59,130,246,0.1)', color: '#1e40af', border: '1px solid rgba(59,130,246,0.2)' }
                    : { background: 'rgba(245,158,11,0.1)', color: '#92650a', border: '1px solid rgba(245,158,11,0.2)' }}>
                  {user.role === 'student' ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                  {user.role}
                </span>
                <span className="text-xs hidden sm:block" style={{ color: 'var(--ink-muted)' }}>
                  {user.createdAt?.split('T')[0]}
                </span>
                <button onClick={() => deleteUser(user._id, user.fullname)}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: '#ef4444' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
