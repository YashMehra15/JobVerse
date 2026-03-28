import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// ── Job Seeker Portal
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import StudentRoute from './components/auth/StudentRoute'

// ── Recruiter Portal
import RecruiterLogin from './components/auth/RecruiterLogin'
import RecruiterSignup from './components/auth/RecruiterSignup'
import RecruiterDashboard from './components/admin/RecruiterDashboard'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'

// ── Super Admin Portal
import AdminLogin from './components/superadmin/AdminLogin'
import AdminRoute from './components/superadmin/AdminRoute'
import AdminDashboard from './components/superadmin/AdminDashboard'
import AdminCompanies from './components/superadmin/AdminCompanies'
import AdminJobsPage from './components/superadmin/AdminJobs'
import AdminUsers from './components/superadmin/AdminUsers'
import AdminApplications from './components/superadmin/AdminApplications'

const appRouter = createBrowserRouter([

  // ── Public / Job Seeker ──────────────────────────────────
  { path: '/',               element: <StudentRoute><Home /></StudentRoute> },
  { path: '/login',          element: <Login /> },
  { path: '/signup',         element: <Signup /> },
  { path: '/jobs',           element: <StudentRoute><Jobs /></StudentRoute> },
  { path: '/description/:id',element: <StudentRoute><JobDescription /></StudentRoute> },
  { path: '/browse',         element: <StudentRoute><Browse /></StudentRoute> },
  { path: '/profile',        element: <StudentRoute><Profile /></StudentRoute> },

  // ── Recruiter Portal ─────────────────────────────────────
  { path: '/recruiter/login',     element: <RecruiterLogin /> },
  { path: '/recruiter/signup',    element: <RecruiterSignup /> },
  { path: '/recruiter/dashboard', element: <ProtectedRoute><RecruiterDashboard /></ProtectedRoute> },
  { path: '/admin/companies',     element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> },
  { path: '/admin/companies/:id', element: <ProtectedRoute><CompanySetup /></ProtectedRoute> },
  { path: '/admin/jobs',          element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
  { path: '/admin/jobs/create',   element: <ProtectedRoute><PostJob /></ProtectedRoute> },
  { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute><Applicants /></ProtectedRoute> },

  // ── Super Admin Portal ───────────────────────────────────
  { path: '/superadmin/login',        element: <AdminLogin /> },
  { path: '/superadmin/dashboard',    element: <AdminRoute><AdminDashboard /></AdminRoute> },
  { path: '/superadmin/companies',    element: <AdminRoute><AdminCompanies /></AdminRoute> },
  { path: '/superadmin/jobs',         element: <AdminRoute><AdminJobsPage /></AdminRoute> },
  { path: '/superadmin/users',        element: <AdminRoute><AdminUsers /></AdminRoute> },
  { path: '/superadmin/applications', element: <AdminRoute><AdminApplications /></AdminRoute> },

])

function App() {
  return <RouterProvider router={appRouter} />
}

export default App
