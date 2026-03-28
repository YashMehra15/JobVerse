import React from 'react'
import RecruiterLayout from './RecruiterLayout'
import ApplicantsTable from './ApplicantsTable'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { ArrowLeft, Users } from 'lucide-react'

// hook to load applicants
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { setAllApplicants } from '@/redux/applicationSlice'

const Applicants = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { applicants } = useSelector(s => s.application)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, { withCredentials: true })
        if (res.data.success) dispatch(setAllApplicants(res.data.job))
      } catch {}
    }
    fetch()
  }, [id])

  return (
    <RecruiterLayout>
      <div>
        <button onClick={() => navigate('/admin/jobs')}
          className="flex items-center gap-1.5 text-sm font-semibold mb-5 transition-colors"
          style={{ color: 'var(--ink-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}>
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              Applicants
            </h2>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              {applicants?.title} · {applicants?.applications?.length || 0} total
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border-c)] overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
          <ApplicantsTable />
        </div>
      </div>
    </RecruiterLayout>
  )
}
export default Applicants
