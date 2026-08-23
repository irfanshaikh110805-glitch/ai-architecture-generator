import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './store/useAuthStore'
import './App.css'

// Lazy load pages for code splitting and better performance
const Landing = lazy(() => import(/* webpackChunkName: "landing" */ './pages/Landing'))
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home'))
const Result = lazy(() => import(/* webpackChunkName: "result" */ './pages/Result'))
const Login = lazy(() => import(/* webpackChunkName: "login" */ './pages/Login'))
const Signup = lazy(() => import(/* webpackChunkName: "signup" */ './pages/Signup'))

// Neo-Brutalist loading component
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    backgroundColor: '#FDF6E3'
  }}>
    <div style={{
      width: '54px',
      height: '54px',
      border: '4px solid #000000',
      borderTopColor: '#FF00FF',
      borderRightColor: '#00FF00',
      boxShadow: '4px 4px 0px 0px #000000',
      animation: 'neoSpin 0.7s steps(8) infinite'
    }} />
    <div style={{
      fontFamily: "'Space Mono', monospace",
      fontWeight: 800,
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      background: '#00FF00',
      color: '#000000',
      padding: '4px 12px',
      border: '2px solid #000000',
      boxShadow: '3px 3px 0px 0px #000000'
    }}>
      Loading...
    </div>
    <style>{`
      @keyframes neoSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on app load - only runs once
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#000000',
            borderRadius: '4px',
            border: '2.5px solid #000000',
            boxShadow: '4px 4px 0px 0px #000000',
            fontSize: '13px',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            textTransform: 'uppercase',
          },
          success: {
            iconTheme: { primary: '#000000', secondary: '#00FF00' },
            style: {
              background: '#FFFFFF',
              border: '2.5px solid #000000',
            }
          },
          error: {
            iconTheme: { primary: '#000000', secondary: '#FF00FF' },
            style: {
              background: '#FFFFFF',
              border: '2.5px solid #000000',
            }
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
