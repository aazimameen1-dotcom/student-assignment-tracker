import { useContext, lazy, Suspense } from 'react';
import { AppContext } from './context/AppContext';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ConsentBanner from './components/ConsentBanner';

const Login = lazy(() => import('./pages/Login'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Projects = lazy(() => import('./pages/Projects'));
const AssignmentDetails = lazy(() => import('./pages/AssignmentDetails'));
const Subjects = lazy(() => import('./pages/Subjects'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Analytics = lazy(() => import('./pages/Analytics'));
const StudyGroups = lazy(() => import('./pages/StudyGroups'));
const ResearchDiscovery = lazy(() => import('./pages/ResearchDiscovery'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const DataRightsRequest = lazy(() => import('./pages/DataRightsRequest'));

function AppContent() {
  const { user, authLoading, currentView, isPasswordRecovery } = useContext(AppContext);

  // loading state fallback
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4 select-none px-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-900 border-t-transparent animate-spin"></div>
        <span className="font-mono text-xs text-slate-500 animate-pulse">
          Loading Scholar...
        </span>
      </div>
    );
  }

  const PageFallback = () => (
    <div className="flex flex-col justify-center items-center h-64 gap-3 text-slate-500">
      <div className="w-8 h-8 rounded-full border-3 border-slate-800 border-t-transparent animate-spin"></div>
      <span className="text-xs font-mono animate-pulse">Loading view...</span>
    </div>
  );

  // Statutory pages viewable without authentication
  if (currentView === 'privacy-policy') {
    return (
      <Suspense fallback={<PageFallback />}>
        <PrivacyPolicy />
        <ConsentBanner />
      </Suspense>
    );
  }

  if (currentView === 'terms-of-service') {
    return (
      <Suspense fallback={<PageFallback />}>
        <TermsOfService />
        <ConsentBanner />
      </Suspense>
    );
  }

  if (currentView === 'data-rights') {
    return (
      <Suspense fallback={<PageFallback />}>
        <DataRightsRequest />
        <ConsentBanner />
      </Suspense>
    );
  }

  // If password recovery link was clicked, ALWAYS render Login / Set New Password screen
  if (isPasswordRecovery || currentView === 'login') {
    return (
      <Suspense fallback={<PageFallback />}>
        <Login />
        <ConsentBanner />
      </Suspense>
    );
  }

  // Render Landing Page if explicitly on landing view
  if (currentView === 'landing') {
    return (
      <Suspense fallback={<PageFallback />}>
        <Landing />
        <ConsentBanner />
      </Suspense>
    );
  }

  // Route guarding: force unauthenticated users to see landing or login
  if (!user) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Landing />
        <ConsentBanner />
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
      case 'projects':
        return <Projects />;
      case 'assignment-details':
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
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'terms-of-service':
        return <TermsOfService />;
      case 'data-rights':
        return <DataRightsRequest />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      <Navigation />
      
      {/* Dynamic Content Container */}
      <main className="flex-1 w-full pt-16 md:pl-64 transition-all overflow-x-hidden">
        <Suspense fallback={<PageFallback />}>
          {renderActiveView()}
        </Suspense>
      </main>

      <ConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
