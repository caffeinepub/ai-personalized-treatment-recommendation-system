import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetJobPostings, useGetCompanies } from '../hooks/useQueries';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { useJobApplication } from '../hooks/useJobApplication';
import { EligibilityChecker } from '../components/EligibilityChecker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

export function ApplicationFlow() {
  const navigate = useNavigate();
  const { jobId } = useParams({ from: '/apply/$jobId' });
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobPostings();
  const { data: companies = [] } = useGetCompanies();
  const { profile } = useStudentProfile();
  const { applyForJob, isApplying, isSuccess } = useJobApplication();
  const [confirmed, setConfirmed] = useState(false);

  const job = jobs.find((j) => j.id.toString() === jobId);
  const company = job ? companies.find((c) => c.id === job.companyId) : null;

  const meetsGPA = profile ? profile.cgpa >= (job?.minCGPA || 0) : false;
  const meetsBranch = profile && job
    ? profile.branches.some((branch) => job.eligibleBranches.includes(branch))
    : false;
  const isEligible = meetsGPA && meetsBranch;

  const handleApply = async () => {
    if (!job) return;
    await applyForJob(BigInt(jobId));
  };

  if (jobsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!job || !profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Error</CardTitle>
          <CardDescription>Unable to process your application.</CardDescription>
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

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-6 h-6" />
            Application Submitted Successfully!
          </CardTitle>
          <CardDescription>Your application has been received</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <p className="font-medium mb-2">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Your application will be reviewed by the placement team</li>
                <li>You'll be notified about your application status</li>
                <li>Check your dashboard regularly for updates</li>
                <li>Prepare for potential interviews</li>
              </ul>
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button onClick={() => navigate({ to: '/' })} className="flex-1">
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/jobs/$jobId', params: { jobId: job.id.toString() } })}
              className="flex-1"
            >
              View Job Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate({ to: '/jobs/$jobId', params: { jobId: job.id.toString() } })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Job Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Apply for {job.title}</CardTitle>
          <CardDescription>at {company?.name || 'Company'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Eligibility Check */}
          <EligibilityChecker job={job} studentProfile={profile} />

          {/* Warning for ineligible students */}
          {!isEligible && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You do not meet the eligibility criteria for this position. Your application may not be considered.
              </AlertDescription>
            </Alert>
          )}

          {/* Confirmation */}
          <div className="space-y-4">
            <h3 className="font-semibold">Application Summary</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-medium">Position:</span> {job.title}
              </p>
              <p className="text-sm">
                <span className="font-medium">Company:</span> {company?.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Your CGPA:</span> {profile.cgpa.toFixed(2)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Your Branch:</span> {profile.branches.join(', ')}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="confirm"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="confirm" className="text-sm text-muted-foreground">
                I confirm that all information in my profile is accurate and I understand that providing false information may result in disqualification.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={!confirmed || isApplying}
              onClick={handleApply}
            >
              {isApplying ? 'Submitting...' : 'Submit Application'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate({ to: '/jobs/$jobId', params: { jobId: job.id.toString() } })}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
