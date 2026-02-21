import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useJobApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobApplication'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Application failed', {
        description: error.message,
      });
    },
  });

  return {
    applyForJob: mutation.mutateAsync,
    isApplying: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
