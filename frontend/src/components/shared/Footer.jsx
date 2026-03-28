import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react'

const Footer = () => (
  <footer style={{ background: 'var(--ink)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-4 gap-12 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="md:col-span-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-5 w-fit">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center"
              style={{ boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 5.5C2 4.4 2.9 3.5 4 3.5h8c1.1 0 2 .9 2 2v5c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-5z" fill="#0f0d0a"/>
                <path d="M5 3.5V3a2 2 0 014 0v.5" stroke="#0f0d0a" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="8" r="1.5" fill="#f59e0b"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Clash Display', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
              Job<span style={{ color: '#f59e0b' }}>Verse</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            India's most trusted job discovery platform. Connecting ambitious professionals with industry-leading companies.
          </p>
          <div className="flex items-center gap-2">
            {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: 'Platform', links: ['Browse Jobs', 'Companies', 'Post a Job', 'Salary Guide'] },
          { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms'] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-bold mb-5 text-sm" style={{ fontFamily: 'Clash Display', color: '#fff', letterSpacing: '-0.01em' }}>
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map(item => (
                <li key={item}>
                  <a href="#" className="group flex items-center gap-1 text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Bricolage Grotesque' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fbbf24' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}>
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} JobVerse. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Built with MySQL · React · Node.js · Cloudinary
        </p>
      </div>
    </div>
  </footer>
)
export default Footer;