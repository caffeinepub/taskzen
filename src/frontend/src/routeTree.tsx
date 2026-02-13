import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import TaskZenLanding from './pages/TaskZenLanding';
import TasksPage from './pages/TasksPage';
import AddTaskPage from './pages/AddTaskPage';
import StudySubjectsPage from './pages/StudySubjectsPage';
import StudySubjectDetailPage from './pages/StudySubjectDetailPage';
import FocusModePage from './pages/FocusModePage';

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

export const routeTree = rootRoute.addChildren([
  landingRoute,
  appLayoutRoute.addChildren([
    tasksRoute, 
    addTaskRoute, 
    studyRoute, 
    studySubjectDetailRoute,
    focusModeRoute,
  ]),
]);

export interface RouterContext {
  queryClient: QueryClient;
}
