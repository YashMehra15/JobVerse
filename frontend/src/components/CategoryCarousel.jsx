import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Code2, Database, Palette, Globe, Smartphone, BarChart3, Cloud, Shield, Cpu, PenTool, ArrowRight } from 'lucide-react'

const categories = [
  { label: 'Frontend Dev',   icon: Globe,        count: '1.2k+ jobs', color: '#f59e0b' },
  { label: 'Backend Dev',    icon: Database,      count: '980 jobs',   color: '#10b981' },
  { label: 'Data Science',   icon: BarChart3,     count: '760 jobs',   color: '#3b82f6' },
  { label: 'UI/UX Design',   icon: Palette,       count: '540 jobs',   color: '#ec4899' },
  { label: 'Full Stack',     icon: Code2,         count: '1.5k+ jobs', color: '#8b5cf6' },
  { label: 'Mobile Dev',     icon: Smartphone,    count: '430 jobs',   color: '#06b6d4' },
  { label: 'DevOps',         icon: Cloud,         count: '620 jobs',   color: '#f97316' },
  { label: 'AI / ML',        icon: Cpu,           count: '890 jobs',   color: '#a855f7' },
]

const CategoryCarousel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const go = (q) => { dispatch(setSearchedQuery(q)); navigate('/browse') }

  return (
    <section style={{ background: 'var(--surface-2)' }} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-eyebrow mb-3">Explore by role</div>
            <h2 style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.03em', color: 'var(--ink)' }}>
              Browse by<br /><span className="gold-text">Category</span>
            </h2>
          </div>
          <button onClick={() => navigate('/jobs')}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-[var(--ink-muted)] hover:text-amber-600 transition-colors group">
            All categories <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(({ label, icon: Icon, count, color }, i) => (
            <button key={label} onClick={() => go(label)}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-[var(--border-c)] bg-white card-lift text-center"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <div className="font-bold text-xs text-[var(--ink)] leading-tight mb-0.5" style={{ fontFamily: 'Bricolage Grotesque' }}>{label}</div>
                <div className="text-[10px] text-[var(--ink-muted)] font-medium">{count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryCarousel
