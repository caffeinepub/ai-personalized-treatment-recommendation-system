import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { PlacementLayout } from './components/PlacementLayout';
import { StudentDashboard } from './pages/StudentDashboard';
import { JobDetails } from './pages/JobDetails';
import { ApplicationFlow } from './pages/ApplicationFlow';
import { AdminPanel } from './pages/AdminPanel';
import { ProfileSetup } from './pages/ProfileSetup';
import { ProfileEdit } from './pages/ProfileEdit';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: PlacementLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StudentDashboard,
});

const jobDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId',
  component: JobDetails,
});

const applicationFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/apply/$jobId',
  component: ApplicationFlow,
});

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/setup',
  component: ProfileSetup,
});

const profileEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/edit',
  component: ProfileEdit,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  jobDetailsRoute,
  applicationFlowRoute,
  adminPanelRoute,
  profileSetupRoute,
  profileEditRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
