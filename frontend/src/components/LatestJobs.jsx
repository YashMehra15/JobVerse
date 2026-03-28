import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'
import { ArrowRight, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job)

  return (
    <section className="py-20" style={{ background: 'var(--surface-3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-eyebrow mb-3">Just posted</div>
            <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.03em', color: 'var(--ink)' }}>
              Fresh <span className="gold-text">Opportunities</span>
            </h2>
            <p className="mt-2 text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>Updated daily from top companies</p>
          </div>
          <Link to="/jobs">
            <button className="btn-ghost hidden sm:flex">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {allJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-[var(--border-c)] py-20">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
              <Briefcase className="w-7 h-7 text-amber-400" />
            </div>
            <p className="font-bold text-[var(--ink-soft)]">No jobs posted yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-muted)' }}>Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.slice(0, 6).map(job => <LatestJobCards key={job._id} job={job} />)}
          </div>
        )}
      </div>
    </section>
  )
}

export default LatestJobs
