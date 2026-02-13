import { useState } from 'react';
import type { Task } from '../../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCompleteTask, useDeleteTask, useSetTaskReminder, useClearTaskReminder } from '../../hooks/useTasks';
import { CheckCircle2, Circle, Flower2, Trash2, Bell, BellOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskCompletedFlashAnimation from './TaskCompletedFlashAnimation';
import { formatReminderTime, validateReminderInput, dateToNanos } from '../../lib/reminders';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();
  const setReminder = useSetTaskReminder();
  const clearReminder = useClearTaskReminder();
  const [animationTriggerId, setAnimationTriggerId] = useState(0);
  const [reminderInputs, setReminderInputs] = useState<Record<string, string>>({});

  const handleToggleComplete = (task: Task) => {
    if (!task.isCompleted) {
      completeTask.mutate(task.id, {
        onSuccess: () => {
          setAnimationTriggerId(prev => prev + 1);
        },
      });
    }
  };

  const handleDeleteTask = (taskId: bigint) => {
    deleteTask.mutate(taskId);
  };

  const handleSetReminder = (taskId: bigint) => {
    const input = reminderInputs[taskId.toString()];
    const validDate = validateReminderInput(input);
    
    if (!validDate) {
      return;
    }

    const reminderTime = dateToNanos(validDate);
    setReminder.mutate({ taskId, reminderTime }, {
      onSuccess: () => {
        setReminderInputs(prev => ({ ...prev, [taskId.toString()]: '' }));
      },
    });
  };

  const handleClearReminder = (taskId: bigint) => {
    clearReminder.mutate(taskId);
  };

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
              <Flower2 className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">No tasks yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start your mindful productivity journey by creating your first task.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const incompleteTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <>
      <div className="space-y-6">
        {/* Incomplete Tasks */}
        {incompleteTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Circle className="w-5 h-5 text-primary" />
              Active Tasks ({incompleteTasks.length})
            </h2>
            <div className="space-y-2">
              {incompleteTasks.map((task) => (
                <Card 
                  key={task.id.toString()} 
                  className={cn(
                    "transition-all hover:shadow-md",
                    completeTask.isPending && "opacity-50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={task.isCompleted}
                          onCheckedChange={() => handleToggleComplete(task)}
                          disabled={completeTask.isPending}
                          className="w-5 h-5"
                        />
                        <span className="text-foreground font-medium flex-1">
                          {task.title}
                        </span>
                      </div>
                      
                      {/* Reminder Section */}
                      <div className="flex items-center gap-2 ml-9">
                        {task.reminderTime ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Bell className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {formatReminderTime(task.reminderTime)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClearReminder(task.id)}
                              disabled={clearReminder.isPending}
                              className="h-7 px-2"
                            >
                              {clearReminder.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <BellOff className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                                <Bell className="w-3 h-3" />
                                Set Reminder
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label htmlFor={`reminder-${task.id}`}>Reminder Time</Label>
                                  <Input
                                    id={`reminder-${task.id}`}
                                    type="datetime-local"
                                    value={reminderInputs[task.id.toString()] || ''}
                                    onChange={(e) => setReminderInputs(prev => ({
                                      ...prev,
                                      [task.id.toString()]: e.target.value
                                    }))}
                                    disabled={setReminder.isPending}
                                  />
                                </div>
                                <Button
                                  onClick={() => handleSetReminder(task.id)}
                                  disabled={setReminder.isPending || !reminderInputs[task.id.toString()]}
                                  className="w-full"
                                  size="sm"
                                >
                                  {setReminder.isPending ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Setting...
                                    </>
                                  ) : (
                                    'Set Reminder'
                                  )}
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Completed ({completedTasks.length})
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <Card 
                  key={task.id.toString()} 
                  className="bg-muted/50 border-muted"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={task.isCompleted}
                        disabled
                        className="w-5 h-5"
                      />
                      <span className="text-muted-foreground line-through flex-1">
                        {task.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={deleteTask.isPending}
                        className="h-8 w-8 p-0"
                        aria-label="Delete task"
                      >
                        {deleteTask.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Completed Animation */}
      <TaskCompletedFlashAnimation triggerId={animationTriggerId} />
    </>
  );
}
