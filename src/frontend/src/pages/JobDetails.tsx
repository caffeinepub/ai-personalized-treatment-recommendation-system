import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetJobPostings, useGetCompanies, useGetAppliedJobs } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useStudentProfile';
import { useApplyForJob } from '../hooks/useJobApplication';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { EligibilityChecker } from '../components/EligibilityChecker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, MapPin, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export function JobDetails() {
  const navigate = useNavigate();
  const { jobId } = useParams({ from: '/job/$jobId' });
  const { identity } = useInternetIdentity();
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobPostings();
  const { data: companies = [], isLoading: companiesLoading } = useGetCompanies();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: applications = [] } = useGetAppliedJobs();
  const applyMutation = useApplyForJob();

  const isAuthenticated = !!identity;
  const job = jobs.find((j) => j.id.toString() === jobId);
  const company = job ? companies.find((c) => c.id === job.companyId) : null;

  const hasApplied = job
    ? applications.some((app) => app.jobId.toString() === job.id.toString())
    : false;

  const isLoading = jobsLoading || companiesLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Briefcase className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Job Not Found</h2>
          <p className="text-muted-foreground">The job you're looking for doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/' })}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply for jobs');
      return;
    }

    if (!profile) {
      toast.error('Please complete your profile before applying');
      navigate({ to: '/profile/setup' });
      return;
    }

    navigate({ to: '/apply/$jobId', params: { jobId: job.id.toString() } });
  };

  const formatSalary = (range: [bigint, bigint]) => {
    const min = Number(range[0]) / 100000;
    const max = Number(range[1]) / 100000;
    return `₹${min}L - ₹${max}L`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                  {company && (
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{company.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                  )}
                </div>
                {job.logoUrl && (
                  <img src={job.logoUrl} alt={company?.name} className="w-16 h-16 object-contain" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{formatSalary(job.salaryRange)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Posted {formatDate(job.postedTime)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Minimum CGPA:</span> {job.minCGPA}
                  </p>
                  <p>
                    <span className="font-medium">Eligible Branches:</span>{' '}
                    {job.eligibleBranches.join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {profile && <EligibilityChecker job={job} studentProfile={profile} />}

          <Card>
            <CardHeader>
              <CardTitle>Apply for this Position</CardTitle>
            </CardHeader>
            <CardContent>
              {!isAuthenticated ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Please log in to apply for this job.</p>
                </div>
              ) : !profile ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to apply for jobs.
                  </p>
                  <Button onClick={() => navigate({ to: '/profile/setup' })} className="w-full">
                    Complete Profile
                  </Button>
                </div>
              ) : hasApplied ? (
                <div className="text-center space-y-4">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Already Applied
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    You have already applied for this position.
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  disabled={applyMutation.isPending}
                  className="w-full"
                >
                  {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                </Button>
              )}
            </CardContent>
          </Card>

          {company && (
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Industry:</span> {company.industry}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {company.location}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
