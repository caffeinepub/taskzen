import RequireAuth from '../components/auth/RequireAuth';
import TaskList from '../components/tasks/TaskList';
import { useGetAllTasks, useGetCallerUserProfile } from '../hooks/useTasks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useReminderNotifications } from '../hooks/useReminderNotifications';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Plus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ProfileSetup from '../components/auth/ProfileSetup';
import NotificationPermissionPrompt from '../components/notifications/NotificationPermissionPrompt';

export default function TasksPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: tasks, isLoading, isError, error } = useGetAllTasks();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Enable reminder notifications
  useReminderNotifications(tasks);

  return (
    <RequireAuth>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Your Tasks</h1>
                <p className="text-muted-foreground">
                  Manage your tasks with mindful productivity
                </p>
              </div>
              <Link to="/tasks/add">
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Add Task
                </Button>
              </Link>
            </div>

            {/* Notification Permission Prompt */}
            {isAuthenticated && <NotificationPermissionPrompt />}

            {/* Error State */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to load tasks. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading your tasks...</p>
                </div>
              </div>
            )}

            {/* Task List */}
            {!isLoading && !isError && tasks && (
              <TaskList tasks={tasks} />
            )}
          </div>
        </div>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetup open={showProfileSetup} />
    </RequireAuth>
  );
}
