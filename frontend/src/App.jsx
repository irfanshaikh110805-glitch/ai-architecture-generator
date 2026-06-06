import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import PerformanceMonitor from './components/PerformanceMonitor'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './store/useAuthStore'
import './App.css'

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'))
const Home = lazy(() => import('./pages/Home'))
const Result = lazy(() => import('./pages/Result'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

// Loading component with better UX
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid rgba(255,255,255,0.3)',
      borderTop: '4px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on app load
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      {/* Performance monitoring in production */}
      <PerformanceMonitor />
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '12px',
            border: '1px solid rgba(37,99,235,0.12)',
            boxShadow: '0 4px 24px rgba(37,99,235,0.12)',
            fontSize: '14px',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 500,
          },
          success: {
            iconTheme: { primary: '#2563eb', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/generate" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/result" 
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
