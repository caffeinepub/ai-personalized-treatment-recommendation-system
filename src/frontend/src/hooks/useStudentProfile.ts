import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import type { StudentProfile } from '../backend';

export function useStudentProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<StudentProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      cgpa: number;
      branches: string[];
      skills: string[];
      resumeLink: string;
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStudentProfile(
        data.name,
        data.email,
        data.cgpa,
        data.branches,
        data.skills,
        data.resumeLink,
        data.bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create profile', {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      cgpa: number;
      branches: string[];
      skills: string[];
      resumeLink: string;
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStudentProfile(
        data.name,
        data.email,
        data.cgpa,
        data.branches,
        data.skills,
        data.resumeLink,
        data.bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update profile', {
        description: error.message,
      });
    },
  });

  const calculateCompletion = (profile: StudentProfile | null): number => {
    if (!profile) return 0;
    const fields = [
      profile.name,
      profile.email,
      profile.cgpa > 0,
      profile.branches.length > 0,
      profile.skills.length > 0,
      profile.resumeLink,
      profile.bio,
    ];
    const filledCount = fields.filter(Boolean).length;
    return Math.round((filledCount / fields.length) * 100);
  };

  return {
    profile: query.data ?? null,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    completion: calculateCompletion(query.data ?? null),
    createProfile: (
      name: string,
      email: string,
      cgpa: number,
      branches: string[],
      skills: string[],
      resumeLink: string,
      bio: string
    ) => createMutation.mutateAsync({ name, email, cgpa, branches, skills, resumeLink, bio }),
    updateProfile: (
      name: string,
      email: string,
      cgpa: number,
      branches: string[],
      skills: string[],
      resumeLink: string,
      bio: string
    ) => updateMutation.mutateAsync({ name, email, cgpa, branches, skills, resumeLink, bio }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
