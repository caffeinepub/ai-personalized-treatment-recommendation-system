import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useApplyForJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
      queryClient.invalidateQueries({ queryKey: ['appliedJobs'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to apply for job:', error);
      toast.error('Failed to submit application: ' + error.message);
    },
  });
}

export function useJobApplication() {
  const mutation = useApplyForJob();

  return {
    applyForJob: mutation.mutateAsync,
    isApplying: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
