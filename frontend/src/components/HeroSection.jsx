import React, { useState } from 'react'
import { Search, ArrowRight, Star, TrendingUp, Users, Building2, Zap, ChevronRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const marqueeItems = [
  'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato', 'Paytm', 'Infosys', 'TCS',
  'Razorpay', 'CRED', 'Swiggy', 'Meesho', 'Byju\'s', 'PhonePe', 'Ola', 'Nykaa'
]

const quickTags = ['Frontend Dev', 'Backend Dev', 'Product Manager', 'Data Science', 'DevOps', 'UI/UX']

const stats = [
  { icon: Building2, value: '2,000+', label: 'Companies' },
  { icon: TrendingUp, value: '15K+', label: 'Active Jobs' },
  { icon: Users, value: '50K+', label: 'Placed' },
]

const HeroSection = () => {
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const search = () => { dispatch(setSearchedQuery(query)); navigate('/browse') }

  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--ink)' }}>
      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Spinning decorative ring */}
      <div className="absolute top-16 right-16 w-32 h-32 opacity-10 anim-spin-slow pointer-events-none hidden lg:block">
        <svg viewBox="0 0 128 128" fill="none">
          <circle cx="64" cy="64" r="60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="8 6"/>
          <circle cx="64" cy="64" r="40" stroke="#f59e0b" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-0">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 mb-8 anim-fade-up">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              India's Most Trusted Job Platform
            </span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Headline */}
          <h1 className="anim-fade-up delay-1 mb-6" style={{
            fontFamily: 'Clash Display', fontWeight: 700,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff'
          }}>
            Your Next Big Role<br />
            <span className="shimmer-text">Starts Right Here</span>
          </h1>

          <p className="anim-fade-up delay-2 mb-10" style={{
            fontFamily: 'Bricolage Grotesque', fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.55)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7
          }}>
            Connect with India's top companies, discover roles that match your ambitions, and land the career you deserve.
          </p>

          {/* Search */}
          <div className="anim-fade-up delay-3 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-2 rounded-2xl border border-white/10 bg-white/8 backdrop-blur-sm"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="text" value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && search()}
                  placeholder="Job title, skill, company..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-base py-2"
                  style={{ fontFamily: 'Bricolage Grotesque' }}
                />
              </div>
              <button onClick={search} className="btn-amber shrink-0" style={{ borderRadius: '0.75rem', padding: '0.75rem 1.5rem' }}>
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick tags */}
          <div className="anim-fade-up delay-4 flex flex-wrap justify-center gap-2 mb-16">
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, alignSelf: 'center' }}>Popular:</span>
            {quickTags.map(tag => (
              <button key={tag} onClick={() => { dispatch(setSearchedQuery(tag)); navigate('/browse') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
                style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontFamily: 'Bricolage Grotesque' }}>
                {tag} <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="anim-fade-up delay-5 flex items-center justify-center gap-8 pb-10 border-b border-white/8">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <React.Fragment key={label}>
              <div className="text-center">
                <div style={{ fontFamily: 'Clash Display', fontSize: '1.75rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{label}</div>
              </div>
              {i < stats.length - 1 && <div className="w-px h-10 bg-white/10" />}
            </React.Fragment>
          ))}
        </div>

        {/* Marquee companies */}
        <div className="py-6 overflow-hidden">
          <p className="text-center mb-4" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
            Trusted by teams at
          </p>
          <div className="flex gap-8 anim-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((name, i) => (
              <span key={i} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.2)', fontFamily: 'Clash Display', letterSpacing: '-0.01em', flexShrink: 0 }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
