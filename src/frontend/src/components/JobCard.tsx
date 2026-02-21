import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, DollarSign, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import type { JobPosting, StudentProfile } from '../backend';
import { useGetCompanies } from '../hooks/useQueries';

interface JobCardProps {
  job: JobPosting;
  studentProfile: StudentProfile | null;
}

export function JobCard({ job, studentProfile }: JobCardProps) {
  const navigate = useNavigate();
  const { data: companies = [] } = useGetCompanies();
  
  const company = companies.find((c) => c.id === job.companyId);
  
  // Check eligibility
  const meetsGPA = studentProfile ? studentProfile.cgpa >= job.minCGPA : false;
  const meetsBranch = studentProfile
    ? studentProfile.branches.some((branch) => job.eligibleBranches.includes(branch))
    : false;
  const isEligible = meetsGPA && meetsBranch;

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

  const handleCardClick = () => {
    navigate({ to: '/job/$jobId', params: { jobId: job.id.toString() } });
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: '/job/$jobId', params: { jobId: job.id.toString() } });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {job.logoUrl ? (
              <img src={job.logoUrl} alt={company?.name} className="w-12 h-12 rounded" />
            ) : (
              <img src="/assets/generated/job-icon.dim_128x128.png" alt="Job" className="w-12 h-12 rounded" />
            )}
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {company?.name || 'Company'}
              </p>
            </div>
          </div>
          {studentProfile && (
            <Badge variant={isEligible ? 'default' : 'destructive'} className="flex items-center gap-1">
              {isEligible ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Eligible
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Not Eligible
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {formatSalary(job.salaryRange[0])} - {formatSalary(job.salaryRange[1])}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Posted: {formatDate(job.postedTime)}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-1">Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {job.requiredSkills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.requiredSkills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.requiredSkills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Min CGPA: {job.minCGPA.toFixed(2)}</p>
          <p>Eligible: {job.eligibleBranches.join(', ')}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
