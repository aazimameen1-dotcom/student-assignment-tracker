import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AssignmentDetails from './pages/AssignmentDetails';
import Subjects from './pages/Subjects';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  const { user, authLoading, currentView } = useContext(AppContext);

  // loading state fallback
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 select-none">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="font-mono text-label-md text-on-surface-variant animate-pulse">
          Loading StudyTrack...
        </span>
      </div>
    );
  }

  // Render Landing Page if explicitly requested or unauthenticated on landing view
  if (currentView === 'landing') {
    return <Landing />;
  }

  // Route guarding: force guest users to authenticate or see landing
  if (!user) {
    if (currentView === 'login') {
      return <Login />;
    }
    return <Landing />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing />;
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'assignment-details':
        return <AssignmentDetails />;
      case 'subjects':
        return <Subjects />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Universal Navigation bar & side rail */}
      <Navigation />

      {/* Main content viewport */}
      <div className="pt-16 pb-16 md:pb-0 md:pl-20 min-h-screen w-full transition-all duration-300">
        {renderActiveView()}
      </div>
    </div>
  );
}

export default App;
