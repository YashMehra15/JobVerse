import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import { Search, SlidersHorizontal } from 'lucide-react'

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector(s => s.job)
  const [filterJobs, setFilterJobs] = useState(allJobs)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    if (searchedQuery) {
      const q = searchedQuery.toLowerCase()
      setFilterJobs(allJobs.filter(j =>
        j.title?.toLowerCase().includes(q) || j.description?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q)
      ))
    } else setFilterJobs(allJobs)
  }, [allJobs, searchedQuery])

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="section-eyebrow mb-2">All openings</div>
            <h1 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.03em', color: 'var(--ink)' }}>
              Browse <span className="gold-text">Jobs</span>
            </h1>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--ink-muted)' }}>
              <span style={{ color: 'var(--amber-dark)' }}>{filterJobs.length}</span> opportunities found
            </p>
          </div>
          <button onClick={() => setShowFilter(!showFilter)}
            className="md:hidden btn-ghost flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
        <div className="flex gap-6">
          <div className={`shrink-0 w-64 ${showFilter ? 'block' : 'hidden'} md:block`}>
            <FilterCard />
          </div>
          <div className="flex-1">
            {filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-[var(--border-c)] py-24">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-amber-400" />
                </div>
                <p className="font-bold" style={{ color: 'var(--ink-soft)', fontFamily: 'Clash Display' }}>No jobs found</p>
                <p className="text-sm mt-1" style={{ color: 'var(--ink-muted)' }}>Try a different keyword or clear filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filterJobs.map(j => <Job key={j._id} job={j} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Jobs
