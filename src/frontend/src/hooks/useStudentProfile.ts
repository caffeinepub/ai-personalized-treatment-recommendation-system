import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 2 * 60 * 1000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useStudentProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 2 * 60 * 1000,
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
      toast.success('Profile created successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to create profile:', error);
      toast.error('Failed to create profile: ' + error.message);
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
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile: ' + error.message);
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
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

export function calculateProfileCompletion(profile: UserProfile | null): number {
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

  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
}

export function getMissingFields(profile: UserProfile | null): string[] {
  if (!profile) return ['All fields'];

  const missing: string[] = [];
  if (!profile.name) missing.push('Name');
  if (!profile.email) missing.push('Email');
  if (profile.cgpa <= 0) missing.push('CGPA');
  if (profile.branches.length === 0) missing.push('Branches');
  if (profile.skills.length === 0) missing.push('Skills');
  if (!profile.resumeLink) missing.push('Resume Link');
  if (!profile.bio) missing.push('Bio');

  return missing;
}
