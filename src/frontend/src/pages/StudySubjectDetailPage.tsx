import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetSubjects, useGetAssignments, useAddAssignment, useDeleteAssignment } from '../hooks/useStudyZone';
import { useGetAllTasks, useCompleteTask } from '../hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Loader2, AlertCircle, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';
import { formatReminderTime, dateToNanos } from '../lib/reminders';

export default function StudySubjectDetailPage() {
  const { subjectId } = useParams({ from: '/app-layout/study/$subjectId' });
  const subjectIdBigInt = BigInt(subjectId);
  
  const { data: subjects } = useGetSubjects();
  const { data: assignments, isLoading, isError, error } = useGetAssignments(subjectIdBigInt);
  const { data: tasks } = useGetAllTasks();
  const addAssignment = useAddAssignment();
  const completeTask = useCompleteTask();
  const deleteAssignment = useDeleteAssignment();
  
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<bigint | null>(null);

  const subject = subjects?.find(s => s.id === subjectIdBigInt);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim()) return;

    const dueDate = newAssignmentDueDate 
      ? dateToNanos(new Date(newAssignmentDueDate))
      : null;

    addAssignment.mutate({
      subjectId: subjectIdBigInt,
      title: newAssignmentTitle,
      dueDate,
    }, {
      onSuccess: () => {
        setNewAssignmentTitle('');
        setNewAssignmentDueDate('');
      },
    });
  };

  const handleCompleteAssignment = (taskId: bigint) => {
    completeTask.mutate(taskId);
  };

  const handleDeleteAssignment = (assignmentId: bigint) => {
    setDeletingAssignmentId(assignmentId);
    deleteAssignment.mutate(
      { subjectId: subjectIdBigInt, assignmentId },
      {
        onSettled: () => {
          setDeletingAssignmentId(null);
        },
      }
    );
  };

  const getTaskForAssignment = (taskId: bigint) => {
    return tasks?.find(t => t.id === taskId);
  };

  return (
    <RequireAuth>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <Link to="/study">
                <Button variant="ghost" className="mb-4 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Subjects
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <BookOpen className="w-10 h-10 text-primary" />
                {subject?.title || 'Subject'}
              </h1>
              <p className="text-muted-foreground">
                Manage assignments for this subject
              </p>
            </div>

            {/* Add Assignment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAssignment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignment-title">Assignment Title</Label>
                    <Input
                      id="assignment-title"
                      placeholder="e.g., Chapter 5 homework, Essay on..."
                      value={newAssignmentTitle}
                      onChange={(e) => setNewAssignmentTitle(e.target.value)}
                      disabled={addAssignment.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignment-due">Due Date (Optional)</Label>
                    <Input
                      id="assignment-due"
                      type="datetime-local"
                      value={newAssignmentDueDate}
                      onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                      disabled={addAssignment.isPending}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={addAssignment.isPending || !newAssignmentTitle.trim()}
                    className="w-full gap-2"
                  >
                    {addAssignment.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Assignment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Assignments List */}
            {isLoading && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground mt-4">Loading assignments...</p>
                </CardContent>
              </Card>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error?.message || 'Failed to load assignments. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !isError && assignments && assignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.map((assignment) => {
                      const task = getTaskForAssignment(assignment.taskId);
                      const isCompleted = task?.isCompleted || false;
                      const isDeleting = deletingAssignmentId === assignment.id;

                      return (
                        <div
                          key={assignment.id.toString()}
                          className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => handleCompleteAssignment(assignment.taskId)}
                            disabled={isCompleted || completeTask.isPending}
                            className="mt-1"
                            aria-label={isCompleted ? 'Assignment completed' : 'Mark assignment as complete'}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium ${
                                isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                              }`}
                            >
                              {assignment.title}
                            </p>
                            {assignment.dueDate && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Due: {formatReminderTime(assignment.dueDate)}
                              </p>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            disabled={isDeleting}
                            aria-label="Delete assignment"
                            title="Delete assignment"
                            className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && assignments && assignments.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No assignments yet. Add your first assignment to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
