import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';

export function useGetDailyGoal() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint | null>({
    queryKey: ['dailyGoal', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      return actor.getDailyGoal(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useSetDailyGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (goal: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDailyGoal(BigInt(goal));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyGoal', identity?.getPrincipal().toString()] });
      toast.success('Daily goal updated!');
    },
    onError: (error: any) => {
      console.error('Failed to set daily goal:', error);
      toast.error(error.message || 'Failed to set daily goal. Please try again.');
    },
  });
}

export function useGetUserProgress() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['userProgress', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      return actor.getUserProgress(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetProgressPercentage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['progressPercentage', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      return actor.getProgressPercentage(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}
