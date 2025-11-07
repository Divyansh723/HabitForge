import { StrictMode } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageLayout } from './components/layout';
import { useAuth } from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Routes that should not have the sidebar layout
  const publicRoutes = ['/', '/test-auth', '/test-login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Show PageLayout (with sidebar) only for authenticated users on protected routes
  if (isAuthenticated && !isPublicRoute) {
    return (
      <PageLayout>
        <AppRoutes />
      </PageLayout>
    );
  }
  
  // Show routes without sidebar for public pages
  return <AppRoutes />;
}

function App() {
  return (
    <StrictMode>
      <ThemeProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </Router>
      </ThemeProvider>
    </StrictMode>
  );
}

export default App;