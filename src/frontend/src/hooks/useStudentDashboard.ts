import { useGetCallerUserProfile } from './useStudentProfile';
import { useGetJobPostings, useGetAppliedJobs } from './useQueries';
import type { JobPosting, UserProfile } from '../backend';

export function useStudentDashboard() {
  const { data: profile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: allJobs = [], isLoading: jobsLoading } = useGetJobPostings();
  const { data: applications = [], isLoading: applicationsLoading } = useGetAppliedJobs();

  // Filter eligible jobs based on student profile
  const eligibleJobs = profile
    ? allJobs.filter((job) => isEligibleForJob(job, profile))
    : [];

  const isLoading = profileLoading || jobsLoading || applicationsLoading;

  return {
    profile,
    profileLoading,
    profileFetched,
    eligibleJobs,
    allJobs,
    applications,
    isLoading,
  };
}

function isEligibleForJob(job: JobPosting, profile: UserProfile): boolean {
  // Check CGPA requirement
  if (profile.cgpa < job.minCGPA) {
    return false;
  }

  // Check branch eligibility
  const hasEligibleBranch = profile.branches.some((branch) =>
    job.eligibleBranches.includes(branch)
  );

  return hasEligibleBranch;
}
