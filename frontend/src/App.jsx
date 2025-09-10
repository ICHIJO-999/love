import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Header from './components/Layout/Header';
import './App.css';

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Articles = React.lazy(() => import('./pages/Articles'));
const Videos = React.lazy(() => import('./pages/Videos'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">読み込み中...</p>
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/articles" 
              element={
                <ProtectedRoute>
                  <Articles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/videos" 
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/dashboard" replace />} 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
