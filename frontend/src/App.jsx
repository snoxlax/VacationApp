import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { useAuth } from './hooks/useAuth';
import ValidatorDashboard from './pages/ValidatorDashboard.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import RequesterDashboard from './pages/RequesterDashboard.jsx';
import './App.css';

// Public Route component (redirect if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? (
    <Navigate
      to={user.role === 'VALIDATOR' ? '/validator' : '/requester'}
      replace
    />
  ) : (
    children
  );
}

function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user)
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  if (user.role !== role)
    return (
      <Navigate
        to={user.role === 'VALIDATOR' ? '/validator' : '/requester'}
        replace
      />
    );
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to="/signin"
                  replace
                />
              }
            />
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/requester"
              element={
                <RoleRoute role="REQUESTER">
                  <RequesterDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/validator"
              element={
                <RoleRoute role="VALIDATOR">
                  <ValidatorDashboard />
                </RoleRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}
