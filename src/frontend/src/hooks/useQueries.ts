import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Company, JobPosting, JobApplication, UserRole } from '../backend';

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetCompanies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCompanies();
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
  });
}

export function useGetJobPostings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['jobPostings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJobPostings();
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
  });
}

export function useGetAppliedJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['appliedJobs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppliedJobs();
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
  });
}

export function useGetJobApplication(studentId: string | null, jobId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobApplication | null>({
    queryKey: ['jobApplication', studentId, jobId?.toString()],
    queryFn: async () => {
      if (!actor || !studentId || jobId === null) return null;
      const { Principal } = await import('@dfinity/principal');
      const principal = Principal.fromText(studentId);
      return actor.getJobApplication(principal, jobId);
    },
    enabled: !!actor && !actorFetching && !!studentId && jobId !== null,
    retry: 1,
  });
}
