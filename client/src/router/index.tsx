import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { DashboardLayout } from '../layout/DashboardLayout';

import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { GoalSetup } from '../pages/GoalSetup';
import { Journey } from '../pages/Journey';
import { LearningPlan } from '../pages/LearningPlan';
import { TaskDetails } from '../pages/TaskDetails';
import { Reflection } from '../pages/Reflection';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';
import { ErrorPage } from '../pages/Error';

// Protected Route placeholder logic
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true; // Placeholder for real auth logic
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <ErrorPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'goals', element: <GoalSetup /> },
      { path: 'journey', element: <Journey /> },
      { path: 'plan', element: <LearningPlan /> },
      { path: 'tasks', element: <Dashboard /> }, // Fallback to dashboard for tasks list
      { path: 'tasks/:id', element: <TaskDetails /> },
      { path: 'reflection', element: <Reflection /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
