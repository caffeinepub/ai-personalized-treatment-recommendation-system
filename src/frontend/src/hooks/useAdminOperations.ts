import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCompanies, useGetJobPostings } from './useQueries';
import { toast } from 'sonner';
import type { ApplicationStatus } from '../backend';

export { useGetCompanies, useGetJobPostings };

export function useAddCompany() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; industry: string; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCompany(data.name, data.industry, data.location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company added successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to add company:', error);
      toast.error('Failed to add company: ' + error.message);
    },
  });

  return {
    addCompany: (name: string, industry: string, location: string) =>
      mutation.mutateAsync({ name, industry, location }),
    isAdding: mutation.isPending,
  };
}

export function useAddJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      companyId: bigint;
      title: string;
      description: string;
      requiredSkills: string[];
      minCGPA: number;
      eligibleBranches: string[];
      salaryRange: [bigint, bigint];
      logoUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJobPosting(
        data.companyId,
        data.title,
        data.description,
        data.requiredSkills,
        data.minCGPA,
        data.eligibleBranches,
        data.salaryRange,
        data.logoUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
      toast.success('Job posting created successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to create job posting:', error);
      toast.error('Failed to create job posting: ' + error.message);
    },
  });

  return {
    addJobPosting: (
      companyId: bigint,
      title: string,
      description: string,
      requiredSkills: string[],
      minCGPA: number,
      eligibleBranches: string[],
      salaryRange: [bigint, bigint],
      logoUrl: string | null
    ) =>
      mutation.mutateAsync({
        companyId,
        title,
        description,
        requiredSkills,
        minCGPA,
        eligibleBranches,
        salaryRange,
        logoUrl,
      }),
    isAdding: mutation.isPending,
  };
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      studentId: string;
      jobId: bigint;
      status: ApplicationStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      const principal = Principal.fromText(data.studentId);
      return actor.updateApplicationStatus(principal, data.jobId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobApplication'] });
      toast.success('Application status updated');
    },
    onError: (error: Error) => {
      console.error('Failed to update application status:', error);
      toast.error('Failed to update status: ' + error.message);
    },
  });

  return {
    updateStatus: (studentId: string, jobId: bigint, status: ApplicationStatus) =>
      mutation.mutateAsync({ studentId, jobId, status }),
    isUpdating: mutation.isPending,
  };
}
