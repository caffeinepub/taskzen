import type { Task } from '../../backend';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, CheckCircle2, Circle, Target, BarChart3 } from 'lucide-react';

interface DailyReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionPercentage: number;
  dailyGoal: number;
  goalProgress: number;
  goalPercentage: number;
}

export default function DailyReportDialog({
  open,
  onOpenChange,
  tasks,
  totalTasks,
  completedTasks,
  activeTasks,
  completionPercentage,
  dailyGoal,
  goalProgress,
  goalPercentage,
}: DailyReportDialogProps) {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const completedTasksList = tasks.filter(t => t.isCompleted);
  const activeTasksList = tasks.filter(t => !t.isCompleted);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto print-content">
        <DialogHeader className="no-print">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6 text-primary" />
            Daily Report
          </DialogTitle>
          <DialogDescription>
            Your productivity summary for today
          </DialogDescription>
        </DialogHeader>

        {/* Print-friendly Report Content */}
        <div className="space-y-6 report-content">
          {/* Report Header */}
          <div className="text-center space-y-2 print-header">
            <h1 className="text-3xl font-bold text-foreground">TaskZen Daily Report</h1>
            <p className="text-lg text-muted-foreground">{today}</p>
          </div>

          <Separator />

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Productivity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{totalTasks}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-primary">{completedTasks}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{activeTasks}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{completionPercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goal Progress */}
          {dailyGoal > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Daily Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {goalProgress} of {dailyGoal}
                    </p>
                    <p className="text-sm text-muted-foreground">Tasks completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{goalPercentage}%</p>
                    <p className="text-sm text-muted-foreground">Goal achieved</p>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${Math.min(goalPercentage, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Lists */}
          <div className="space-y-4">
            {/* Completed Tasks */}
            {completedTasksList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Completed Tasks ({completedTasksList.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {completedTasksList.map((task) => (
                      <li key={task.id.toString()} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{task.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Active Tasks */}
            {activeTasksList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Circle className="w-5 h-5 text-muted-foreground" />
                    Active Tasks ({activeTasksList.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {activeTasksList.map((task) => (
                      <li key={task.id.toString()} className="flex items-start gap-2">
                        <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{task.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {totalTasks === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tasks created yet</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Report Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4 print-footer">
            <p>Generated by TaskZen - Your Mindful Productivity Companion</p>
          </div>
        </div>

        {/* Print Button (hidden in print) */}
        <div className="flex justify-center gap-2 pt-4 no-print">
          <Button onClick={handlePrint} size="lg" className="gap-2">
            <Printer className="w-5 h-5" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
