import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetJobPostings, useGetCompanies, useGetJobApplication } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { EligibilityChecker } from '../components/EligibilityChecker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Building2, DollarSign, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function JobDetails() {
  const navigate = useNavigate();
  const { jobId } = useParams({ from: '/jobs/$jobId' });
  const { identity } = useInternetIdentity();
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobPostings();
  const { data: companies = [] } = useGetCompanies();
  const { profile } = useStudentProfile();
  
  const studentPrincipal = identity ? identity.getPrincipal() : undefined;
  const { data: existingApplication, isLoading: appLoading } = useGetJobApplication(
    studentPrincipal!,
    BigInt(jobId)
  );

  const job = jobs.find((j) => j.id.toString() === jobId);
  const company = job ? companies.find((c) => c.id === job.companyId) : null;

  const hasApplied = !!existingApplication;

  const formatSalary = (amount: bigint) => {
    const num = Number(amount);
    if (num >= 100000) {
      return `${(num / 100000).toFixed(1)} LPA`;
    }
    return `₹${num.toLocaleString()}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  if (jobsLoading || appLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Not Found</CardTitle>
          <CardDescription>The job posting you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {job.logoUrl ? (
                <img src={job.logoUrl} alt={company?.name} className="w-16 h-16 rounded" />
              ) : (
                <img src="/assets/generated/job-icon.dim_128x128.png" alt="Job" className="w-16 h-16 rounded" />
              )}
              <div>
                <CardTitle className="text-3xl">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Building2 className="w-4 h-4" />
                  {company?.name || 'Company'}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Info */}
          {company && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <p className="font-medium">{company.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{company.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Posted</p>
                  <p className="font-medium">{formatDate(job.postedTime)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Salary */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Compensation
            </h3>
            <p className="text-2xl font-bold text-primary">
              {formatSalary(job.salaryRange[0])} - {formatSalary(job.salaryRange[1])}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Required Skills */}
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

          {/* Eligibility Criteria */}
          <div>
            <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Minimum CGPA:</span> {job.minCGPA.toFixed(2)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Eligible Branches:</span> {job.eligibleBranches.join(', ')}
              </p>
            </div>
          </div>

          {/* Eligibility Check */}
          {profile && <EligibilityChecker job={job} studentProfile={profile} />}

          {/* Application Status */}
          {hasApplied && (
            <Alert>
              <AlertDescription>
                You have already applied for this position. Check your application status in the dashboard.
              </AlertDescription>
            </Alert>
          )}

          {/* Apply Button */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={hasApplied || !profile}
              onClick={() => navigate({ to: '/apply/$jobId', params: { jobId: job.id.toString() } })}
            >
              {hasApplied ? 'Already Applied' : 'Apply Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
