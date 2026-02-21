import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { StudentProfileCard } from '../components/StudentProfileCard';
import { JobCard } from '../components/JobCard';
import { ApplicationHistoryCard } from '../components/ApplicationHistoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Briefcase, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { profile, jobs, applications, isLoading, profileLoading, isFetched } = useStudentDashboard();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [ctcFilter, setCtcFilter] = useState<string>('all');

  const isAuthenticated = !!identity;

  // Show loading while initializing auth
  if (isInitializing) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Authentication Required
          </CardTitle>
          <CardDescription>
            Please log in to access the PlacementPro Student Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You need to be authenticated to view job postings and manage your applications.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show profile setup prompt
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && profile === null;
  if (showProfileSetup) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to PlacementPro!</CardTitle>
          <CardDescription>
            Let's set up your profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Create your student profile to access job postings and apply for placements.
          </p>
          <Button onClick={() => navigate({ to: '/profile/setup' })}>
            Create Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCTC = true;
    if (ctcFilter !== 'all') {
      const minSalary = job.salaryRange[0];
      if (ctcFilter === 'below5') matchesCTC = Number(minSalary) < 500000;
      else if (ctcFilter === '5to10') matchesCTC = Number(minSalary) >= 500000 && Number(minSalary) < 1000000;
      else if (ctcFilter === 'above10') matchesCTC = Number(minSalary) >= 1000000;
    }
    
    return matchesSearch && matchesCTC;
  });

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      {profile && <StudentProfileCard profile={profile} />}

      {/* Job Listings Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Available Jobs
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse and apply for placement opportunities
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search jobs by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={ctcFilter} onValueChange={setCtcFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by CTC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All CTC Ranges</SelectItem>
              <SelectItem value="below5">Below 5 LPA</SelectItem>
              <SelectItem value="5to10">5-10 LPA</SelectItem>
              <SelectItem value="above10">Above 10 LPA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Cards */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No jobs found matching your criteria. Try adjusting your filters.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id.toString()} job={job} studentProfile={profile} />
            ))}
          </div>
        )}
      </section>

      {/* Application History Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              My Applications
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track your application status
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You haven't applied to any jobs yet. Browse available jobs above to get started!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationHistoryCard key={`${app.jobId}-${app.studentId}`} application={app} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
