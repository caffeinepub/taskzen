import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetSubjects, useGetAssignments, useAddAssignment } from '../hooks/useStudyZone';
import { useGetAllTasks, useCompleteTask, useDeleteTask } from '../hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Loader2, AlertCircle, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';
import { formatReminderTime, dateToNanos, validateReminderInput } from '../lib/reminders';

export default function StudySubjectDetailPage() {
  const { subjectId } = useParams({ from: '/app-layout/study/$subjectId' });
  const subjectIdBigInt = BigInt(subjectId);
  
  const { data: subjects } = useGetSubjects();
  const { data: assignments, isLoading, isError, error } = useGetAssignments(subjectIdBigInt);
  const { data: tasks } = useGetAllTasks();
  const addAssignment = useAddAssignment();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();
  
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');

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

  const handleDeleteAssignment = (taskId: bigint) => {
    deleteTask.mutate(taskId);
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

            {/* Error State */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to load assignments. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading assignments...</p>
                </div>
              </div>
            )}

            {/* Assignments List */}
            {!isLoading && !isError && assignments && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Assignments</h2>
                {assignments.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-16">
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">No assignments yet</h3>
                        <p className="text-muted-foreground">
                          Add your first assignment to get started.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {assignments.map((assignment) => {
                      const task = getTaskForAssignment(assignment.taskId);
                      const isCompleted = task?.isCompleted || false;
                      
                      return (
                        <Card 
                          key={assignment.id.toString()}
                          className={isCompleted ? 'bg-muted/50 border-muted' : ''}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => !isCompleted && handleCompleteAssignment(assignment.taskId)}
                                disabled={completeTask.isPending || isCompleted}
                                className="w-5 h-5 mt-0.5"
                              />
                              <div className="flex-1 space-y-1">
                                <p className={`font-medium ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                  {assignment.title}
                                </p>
                                {assignment.dueDate && (
                                  <p className="text-sm text-muted-foreground">
                                    Due: {formatReminderTime(assignment.dueDate)}
                                  </p>
                                )}
                              </div>
                              {isCompleted && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAssignment(assignment.taskId)}
                                  disabled={deleteTask.isPending}
                                  className="h-8 w-8 p-0"
                                  aria-label="Delete assignment"
                                >
                                  {deleteTask.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
