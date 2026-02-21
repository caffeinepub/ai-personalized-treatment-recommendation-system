import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserRole, JobApplication } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCompanies() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCompanies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobPostings() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['jobPostings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJobPostings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAppliedJobs() {
  const { actor, isFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['appliedJobs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppliedJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobApplication(studentId: Principal | undefined, jobId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['jobApplication', studentId?.toString(), jobId.toString()],
    queryFn: async () => {
      if (!actor || !studentId) throw new Error('Actor or student ID not available');
      return actor.getJobApplication(studentId, jobId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}
