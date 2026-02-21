import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { StudentProfileCard } from '../components/StudentProfileCard';
import { JobCard } from '../components/JobCard';
import { ApplicationHistoryCard } from '../components/ApplicationHistoryCard';
import { ProfileSetup } from './ProfileSetup';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, FileText } from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { profile, profileLoading, profileFetched, eligibleJobs, allJobs, applications, isLoading } = useStudentDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('eligible');

  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && profile === null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Briefcase className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Welcome to PlacementPro</h2>
          <p className="text-muted-foreground max-w-md">
            Please log in to access your dashboard, view job opportunities, and manage your applications.
          </p>
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Unable to load profile. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  const filteredEligibleJobs = eligibleJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAllJobs = allJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <StudentProfileCard profile={profile} />
        </div>

        <div className="md:w-2/3 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Job Opportunities</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="eligible">
                  Eligible Jobs ({filteredEligibleJobs.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Jobs ({filteredAllJobs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="eligible" className="space-y-4 mt-4">
                {filteredEligibleJobs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No eligible jobs found matching your criteria.</p>
                  </div>
                ) : (
                  filteredEligibleJobs.map((job) => (
                    <JobCard
                      key={job.id.toString()}
                      job={job}
                      studentProfile={profile}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4 mt-4">
                {filteredAllJobs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No jobs found matching your search.</p>
                  </div>
                ) : (
                  filteredAllJobs.map((job) => (
                    <JobCard
                      key={job.id.toString()}
                      job={job}
                      studentProfile={profile}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Application History
        </h2>
        {applications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>You haven't applied to any jobs yet.</p>
            <p className="text-sm mt-2">Start applying to jobs to see your application history here.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <ApplicationHistoryCard key={`${app.jobId}-${app.submittedTime}`} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
