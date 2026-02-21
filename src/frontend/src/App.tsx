import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { PlacementLayout } from './components/PlacementLayout';
import { StudentDashboard } from './pages/StudentDashboard';
import { JobDetails } from './pages/JobDetails';
import { ApplicationFlow } from './pages/ApplicationFlow';
import { AdminPanel } from './pages/AdminPanel';
import { ProfileSetup } from './pages/ProfileSetup';
import { ProfileEdit } from './pages/ProfileEdit';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});

const rootRoute = createRootRoute({
  component: PlacementLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StudentDashboard,
});

const jobDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/job/$jobId',
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
  indexRoute,
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

export default function App() {
  return (
    <InternetIdentityProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </InternetIdentityProvider>
  );
}
