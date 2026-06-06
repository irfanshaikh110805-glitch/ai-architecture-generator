import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isTokenExpired } = useAuthStore();

  // Show loading state while auth is initializing
  if (loading) {
    return (
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
    );
  }

  // Check if user is authenticated and token is not expired
  if (!isAuthenticated || isTokenExpired()) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
