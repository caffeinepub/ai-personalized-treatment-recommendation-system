import { useGetCallerUserRole } from '../hooks/useQueries';
import { AccessDeniedScreen } from '../components/AccessDeniedScreen';
import { CompanyManagement } from '../components/admin/CompanyManagement';
import { JobPostingManagement } from '../components/admin/JobPostingManagement';
import { ApplicationManagement } from '../components/admin/ApplicationManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Briefcase, FileText } from 'lucide-react';

export function AdminPanel() {
  const { data: userRole, isLoading } = useGetCallerUserRole();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (userRole !== 'admin') {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Admin Panel</CardTitle>
          <CardDescription>Manage companies, job postings, and applications</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job Postings
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <CompanyManagement />
        </TabsContent>

        <TabsContent value="jobs">
          <JobPostingManagement />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
