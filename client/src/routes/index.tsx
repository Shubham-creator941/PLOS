import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

import { Landing } from '../experiences/Landing/LandingExperience';
import { Login } from '../experiences/Authentication/LoginExperience';
import { Dashboard } from '../experiences/MissionControl/MissionControlExperience';
import { GoalSetup } from '../experiences/Onboarding/OnboardingExperience';
import { Journey } from '../experiences/Map/MapExperience';
import { LearningPlan } from '../experiences/Map/LearningPlan';
import { TaskDetails } from '../experiences/Studio/StudioExperience';
import { Reflection } from '../experiences/Mirror/MirrorExperience';
import { Settings } from '../experiences/EngineRoom/EngineRoomExperience';
import { LibraryExperience } from '../experiences/Library/LibraryExperience';
import { NotFound } from './NotFound';
import { ErrorPage } from './Error';

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
 { path: 'library', element: <LibraryExperience /> },
 { path: 'settings', element: <Settings /> },
 ],
 },
 {
 path: '*',
 element: <NotFound />,
 },
]);
