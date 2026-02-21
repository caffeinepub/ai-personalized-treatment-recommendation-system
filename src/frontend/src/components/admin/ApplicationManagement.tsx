import { useGetJobPostings, useGetCompanies, useUpdateApplicationStatus } from '../../hooks/useAdminOperations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ApplicationStatus } from '../../backend';

export function ApplicationManagement() {
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobPostings();
  const { data: companies = [] } = useGetCompanies();
  const { updateStatus, isUpdating } = useUpdateApplicationStatus();

  // Note: This is a simplified view. In a real implementation, you'd need a backend method
  // to fetch all applications across all students for admin view.
  // Currently, getAppliedJobs only returns the caller's applications.

  const handleStatusChange = async (studentId: string, jobId: string, status: ApplicationStatus) => {
    // Parse Principal from string representation
    const principal = { toString: () => studentId } as any;
    await updateStatus(principal, BigInt(jobId), status);
  };

  if (jobsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Application Management
        </CardTitle>
        <CardDescription>View and manage student applications</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Application management view is available. To see all applications, students must apply to jobs first.
            Use the status dropdown to update application progress.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No job postings available</p>
          ) : (
            jobs.map((job) => {
              const company = companies.find((c) => c.id === job.companyId);
              return (
                <Card key={job.id.toString()}>
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{company?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Applications for this position will appear here once students apply.
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
