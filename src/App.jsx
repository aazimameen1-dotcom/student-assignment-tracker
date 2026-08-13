import { useContext, lazy, Suspense } from 'react';
import { AppContext } from './context/AppContext';
import Navigation from './components/Navigation';

const Login = lazy(() => import('./pages/Login'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const AssignmentDetails = lazy(() => import('./pages/AssignmentDetails'));
const Subjects = lazy(() => import('./pages/Subjects'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Analytics = lazy(() => import('./pages/Analytics'));
const StudyGroups = lazy(() => import('./pages/StudyGroups'));
const ResearchDiscovery = lazy(() => import('./pages/ResearchDiscovery'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

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

  const PageFallback = () => (
    <div className="flex flex-col justify-center items-center h-64 gap-3 text-slate-500">
      <div className="w-8 h-8 rounded-full border-3 border-purple-600 border-t-transparent animate-spin"></div>
      <span className="text-xs font-mono animate-pulse">Loading view...</span>
    </div>
  );

  // Render Landing Page if explicitly requested or unauthenticated on landing view
  if (currentView === 'landing') {
    return (
      <Suspense fallback={<PageFallback />}>
        <Landing />
      </Suspense>
    );
  }

  // Route guarding: force guest users to authenticate or see landing
  if (!user) {
    if (currentView === 'login') {
      return (
        <Suspense fallback={<PageFallback />}>
          <Login />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<PageFallback />}>
        <Landing />
      </Suspense>
    );
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
      case 'projects':
        return <AssignmentDetails />;
      case 'subjects':
      case 'courses':
        return <Subjects />;
      case 'calendar':
        return <Calendar />;
      case 'analytics':
        return <Analytics />;
      case 'study-groups':
        return <StudyGroups />;
      case 'research':
        return <ResearchDiscovery />;
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
        <Suspense fallback={<PageFallback />}>
          {renderActiveView()}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
