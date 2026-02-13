import RequireAuth from '../components/auth/RequireAuth';
import AddTaskForm from '../components/tasks/AddTaskForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCallerUserProfile } from '../hooks/useTasks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProfileSetup from '../components/auth/ProfileSetup';

export default function AddTaskPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <RequireAuth>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Create New Task</CardTitle>
              <CardDescription>
                Add a new task to your mindful productivity journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddTaskForm />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetup open={showProfileSetup} />
    </RequireAuth>
  );
}
