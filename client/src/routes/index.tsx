import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { NotFound } from './NotFound';
import { ErrorPage } from './Error';
import { Loader } from '@/primitives/Loader';

// Lazy load experiences
const Landing = React.lazy(() => import('@/experiences/Landing/LandingExperience').then(m => ({ default: m.Landing })));
const Login = React.lazy(() => import('@/experiences/Authentication/LoginExperience').then(m => ({ default: m.Login })));
const Dashboard = React.lazy(() => import('@/experiences/MissionControl/MissionControlExperience').then(m => ({ default: m.Dashboard })));
const GoalSetup = React.lazy(() => import('@/experiences/Onboarding/OnboardingExperience').then(m => ({ default: m.GoalSetup })));
const Journey = React.lazy(() => import('@/experiences/Map/MapExperience').then(m => ({ default: m.Journey })));
const LearningPlan = React.lazy(() => import('@/experiences/Map/LearningPlan').then(m => ({ default: m.LearningPlan })));
const TaskDetails = React.lazy(() => import('@/experiences/Studio/StudioExperience').then(m => ({ default: m.TaskDetails })));
const Reflection = React.lazy(() => import('@/experiences/Mirror/MirrorExperience').then(m => ({ default: m.Reflection })));
const Settings = React.lazy(() => import('@/experiences/EngineRoom/EngineRoomExperience').then(m => ({ default: m.Settings })));
const LibraryExperience = React.lazy(() => import('@/experiences/Library/LibraryExperience').then(m => ({ default: m.LibraryExperience })));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <Landing />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      { 
        path: 'login', 
        element: (
          <GuestRoute>
            <SuspenseWrapper>
              <Login />
            </SuspenseWrapper>
          </GuestRoute>
        ) 
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'goals', element: <SuspenseWrapper><GoalSetup /></SuspenseWrapper> },
      { path: 'journey', element: <SuspenseWrapper><Journey /></SuspenseWrapper> },
      { path: 'plan', element: <SuspenseWrapper><LearningPlan /></SuspenseWrapper> },
      { path: 'tasks', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> }, // Fallback
      { path: 'tasks/:id', element: <SuspenseWrapper><TaskDetails /></SuspenseWrapper> },
      { path: 'reflection', element: <SuspenseWrapper><Reflection /></SuspenseWrapper> },
      { path: 'library', element: <SuspenseWrapper><LibraryExperience /></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><Settings /></SuspenseWrapper> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
