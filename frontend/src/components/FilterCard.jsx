import React from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { SlidersHorizontal, X } from 'lucide-react'

const filterData = [
  { filterType: 'Location', array: ['Delhi', 'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Remote'] },
  { filterType: 'Industry', array: ['Frontend Developer', 'Backend Developer', 'FullStack Developer', 'Data Science', 'DevOps', 'UI/UX Designer'] },
  { filterType: 'Salary (LPA)', array: ['0-3', '3-6', '6-10', '10-20', '20+'] },
]

const FilterCard = () => {
  const dispatch = useDispatch()
  return (
    <div className="bg-white rounded-2xl border border-[var(--border-c)] p-5 sticky top-20"
      style={{ boxShadow: '0 2px 12px rgba(15,13,10,0.04)' }}>
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border-c)]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <h2 className="font-bold" style={{ fontFamily: 'Clash Display', color: 'var(--ink)', letterSpacing: '-0.01em' }}>Filters</h2>
        </div>
        <button onClick={() => dispatch(setSearchedQuery(''))}
          className="flex items-center gap-1 text-xs font-bold transition-colors"
          style={{ color: 'var(--ink-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}>
          <X className="w-3 h-3" />Clear
        </button>
      </div>
      {filterData.map(({ filterType, array }) => (
        <div key={filterType} className="mb-5 last:mb-0">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--ink-muted)' }}>{filterType}</h3>
          <div className="space-y-1">
            {array.map(item => (
              <label key={item} className="flex items-center gap-2.5 cursor-pointer group py-1">
                <input type="radio" name={filterType} value={item}
                  onChange={() => dispatch(setSearchedQuery(item))}
                  className="w-3.5 h-3.5 accent-amber-500" />
                <span className="text-sm font-medium transition-colors" style={{ color: 'var(--ink-muted)', fontFamily: 'Bricolage Grotesque' }}
                  onMouseEnter={e => e.target.style.color = 'var(--amber-dark)'}
                  onMouseLeave={e => e.target.style.color = 'var(--ink-muted)'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
export default FilterCard
