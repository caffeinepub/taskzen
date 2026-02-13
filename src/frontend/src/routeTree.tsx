import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import TaskZenLanding from './pages/TaskZenLanding';
import TasksPage from './pages/TasksPage';
import AddTaskPage from './pages/AddTaskPage';
import DashboardPage from './pages/DashboardPage';
import StudySubjectsPage from './pages/StudySubjectsPage';
import StudySubjectDetailPage from './pages/StudySubjectDetailPage';
import FocusModePage from './pages/FocusModePage';
import WorkZonePage from './pages/WorkZonePage';
import SupportPage from './pages/SupportPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TaskZenLanding,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/tasks',
  component: TasksPage,
});

const addTaskRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/tasks/add',
  component: AddTaskPage,
});

const workRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/work',
  component: WorkZonePage,
});

const studyRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/study',
  component: StudySubjectsPage,
});

const studySubjectDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/study/$subjectId',
  component: StudySubjectDetailPage,
});

const focusModeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/focus',
  component: FocusModePage,
});

const supportRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/support',
  component: SupportPage,
});

export const routeTree = rootRoute.addChildren([
  landingRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    tasksRoute, 
    addTaskRoute,
    workRoute,
    studyRoute, 
    studySubjectDetailRoute,
    focusModeRoute,
    supportRoute,
  ]),
]);

export interface RouterContext {
  queryClient: QueryClient;
}
