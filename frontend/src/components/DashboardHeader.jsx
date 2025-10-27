import { useAuth } from '../hooks/useAuth';

export default function DashboardHeader({ title }) {
  const { signOut, user } = useAuth();

  function handleSignOut() {
    try {
      signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <header
      className="dashboard-header"
      role="banner"
    >
      <div className="header-info">
        <p className="welcome-message">
          Welcome, <span className="user-name">{user?.name || 'User'}</span>
        </p>
        <button
          className="btn-sign-out"
          onClick={handleSignOut}
          type="button"
          aria-label="Sign out of your account"
        >
          Sign Out
        </button>
      </div>

      <div
        className="header-divider"
        role="separator"
        aria-hidden="true"
      />

      <h1 className="dashboard-title">{title}</h1>
    </header>
  );
}
