import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { Search } from 'lucide-react'

const Browse = () => {
  useGetAllJobs()
  const { allJobs } = useSelector(s => s.job)
  const dispatch = useDispatch()
  useEffect(() => () => dispatch(setSearchedQuery('')), [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="section-eyebrow mb-2">Results</div>
          <h1 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.03em', color: 'var(--ink)' }}>
            Search <span className="gold-text">Results</span>
          </h1>
          <p className="text-sm font-semibold mt-1" style={{ color: 'var(--ink-muted)' }}>
            <span style={{ color: 'var(--amber-dark)' }}>{allJobs.length}</span> jobs matched
          </p>
        </div>
        {allJobs.length === 0 ? (
          <div className="flex flex-col items-center bg-white rounded-2xl border border-[var(--border-c)] py-24">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-amber-400" />
            </div>
            <p className="font-bold" style={{ color: 'var(--ink-soft)', fontFamily: 'Clash Display' }}>No results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map(j => <Job key={j._id} job={j} />)}
          </div>
        )}
      </div>
    </div>
  )
}
export default Browse
