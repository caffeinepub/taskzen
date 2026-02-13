import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useTasks';
import { useGetAllTasks } from '../hooks/useTasks';
import { useGetDailyGoal, useSetDailyGoal } from '../hooks/useDailyGoal';
import RequireAuth from '../components/auth/RequireAuth';
import ProfileSetup from '../components/auth/ProfileSetup';
import TaskList from '../components/tasks/TaskList';
import DailyReportDialog from '../components/dashboard/DailyReportDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, CheckCircle2, Circle, Target, FileText, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: tasks = [], isLoading: tasksLoading } = useGetAllTasks();
  const { data: dailyGoalData, isLoading: goalLoading } = useGetDailyGoal();
  const setDailyGoal = useSetDailyGoal();

  const [goalInput, setGoalInput] = useState('');
  const [showReportDialog, setShowReportDialog] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const activeTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Daily goal stats
  const dailyGoal = dailyGoalData ? Number(dailyGoalData) : 0;
  const goalProgress = completedTasks;
  const goalPercentage = dailyGoal > 0 ? Math.round((goalProgress / dailyGoal) * 100) : 0;

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal = parseInt(goalInput);
    if (!isNaN(goal) && goal > 0) {
      setDailyGoal.mutate(goal, {
        onSuccess: () => {
          setGoalInput('');
        },
      });
    }
  };

  if (showProfileSetup) {
    return (
      <RequireAuth>
        <ProfileSetup open={showProfileSetup} />
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your productivity and manage your daily goals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Tasks</CardDescription>
              <CardTitle className="text-3xl">{totalTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="w-4 h-4" />
                All tasks created
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-primary">{completedTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4" />
                Tasks finished
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-3xl">{activeTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="w-4 h-4" />
                Tasks in progress
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completion Rate</CardDescription>
              <CardTitle className="text-3xl">{completionPercentage}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                Overall progress
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Goal Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Daily Goal
            </CardTitle>
            <CardDescription>
              Set and track your daily task completion goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {dailyGoal > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-foreground">
                          {goalProgress} of {dailyGoal}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tasks completed today
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          {goalPercentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Goal progress
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(goalPercentage, 100)}%` }}
                      />
                    </div>

                    {goalProgress >= dailyGoal && (
                      <Alert className="bg-primary/10 border-primary/20">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <AlertDescription className="text-primary">
                          Congratulations! You've reached your daily goal! 🎉
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <Alert>
                    <Target className="w-4 h-4" />
                    <AlertDescription>
                      You haven't set a daily goal yet. Set one below to start tracking your progress!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Set/Update Goal Form */}
                <form onSubmit={handleSetGoal} className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="goal" className="sr-only">
                      Daily Goal
                    </Label>
                    <Input
                      id="goal"
                      type="number"
                      min="1"
                      placeholder={dailyGoal > 0 ? `Current: ${dailyGoal}` : 'Enter daily goal'}
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      disabled={setDailyGoal.isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={setDailyGoal.isPending || !goalInput}
                  >
                    {setDailyGoal.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : dailyGoal > 0 ? (
                      'Update Goal'
                    ) : (
                      'Set Goal'
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        {/* Daily Report Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => setShowReportDialog(true)}
            className="gap-2"
          >
            <FileText className="w-5 h-5" />
            View Daily Report
          </Button>
        </div>

        {/* Task Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Task Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage your tasks directly from the dashboard
            </p>
          </div>

          {tasksLoading ? (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading tasks...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <TaskList tasks={tasks} />
          )}
        </div>
      </div>

      {/* Daily Report Dialog */}
      <DailyReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        tasks={tasks}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        activeTasks={activeTasks}
        completionPercentage={completionPercentage}
        dailyGoal={dailyGoal}
        goalProgress={goalProgress}
        goalPercentage={goalPercentage}
      />
    </RequireAuth>
  );
}
