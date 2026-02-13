import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StudySubject, Assignment } from '../backend';
import { toast } from 'sonner';

export function useGetSubjects() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StudySubject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSubjects();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateSubject() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubject(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create subject:', error);
      
      // Parse backend authorization errors
      let errorMessage = 'Failed to create subject. Please try again.';
      if (error?.message) {
        if (error.message.includes('Unauthorized')) {
          errorMessage = 'You must be logged in to create subjects.';
        } else if (error.message.includes('trap')) {
          errorMessage = 'Authorization error. Please log in again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    },
  });
}

export function useGetAssignments(subjectId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Assignment[] | null>({
    queryKey: ['assignments', subjectId?.toString()],
    queryFn: async () => {
      if (!actor || !subjectId) return null;
      return actor.getAssignments(subjectId);
    },
    enabled: !!actor && !actorFetching && subjectId !== null,
  });
}

export function useAddAssignment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      subjectId, 
      title, 
      dueDate 
    }: { 
      subjectId: bigint; 
      title: string; 
      dueDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAssignment(subjectId, title, dueDate);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', variables.subjectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Assignment added successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to add assignment:', error);
      
      let errorMessage = 'Failed to add assignment. Please try again.';
      if (error?.message) {
        if (error.message.includes('Unauthorized')) {
          errorMessage = 'You do not have permission to add assignments to this subject.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    },
  });
}

export function useCompleteAssignment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // Assignments are linked to tasks, so we complete the underlying task
      return actor.completeTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Assignment completed!');
    },
    onError: (error: any) => {
      console.error('Failed to complete assignment:', error);
      
      let errorMessage = 'Failed to complete assignment. Please try again.';
      if (error?.message) {
        if (error.message.includes('Unauthorized')) {
          errorMessage = 'You do not have permission to complete this assignment.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    },
  });
}

export function useDeleteAssignment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subjectId, assignmentId }: { subjectId: bigint; assignmentId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAssignment(subjectId, assignmentId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', variables.subjectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Assignment deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to delete assignment:', error);
      
      let errorMessage = 'Failed to delete assignment. Please try again.';
      if (error?.message) {
        if (error.message.includes('Unauthorized')) {
          errorMessage = 'You do not have permission to delete this assignment.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Assignment not found.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    },
  });
}
