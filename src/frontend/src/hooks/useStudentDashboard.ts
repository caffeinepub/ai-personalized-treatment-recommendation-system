import { useGetJobPostings, useGetAppliedJobs } from './useQueries';
import { useStudentProfile } from './useStudentProfile';

export function useStudentDashboard() {
  const { profile, isLoading: profileLoading, isFetched } = useStudentProfile();
  const { data: allJobs = [], isLoading: jobsLoading } = useGetJobPostings();
  const { data: applications = [], isLoading: appsLoading } = useGetAppliedJobs();

  // Filter jobs based on student eligibility
  const eligibleJobs = profile
    ? allJobs.filter((job) => {
        const meetsGPA = profile.cgpa >= job.minCGPA;
        const meetsBranch = profile.branches.some((branch) =>
          job.eligibleBranches.includes(branch)
        );
        return meetsGPA && meetsBranch;
      })
    : allJobs;

  return {
    profile,
    jobs: eligibleJobs,
    applications,
    isLoading: jobsLoading || appsLoading,
    profileLoading,
    isFetched,
  };
}
