import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAddTask } from '../../hooks/useTasks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, X } from 'lucide-react';

export default function AddTaskForm() {
  const [title, setTitle] = useState('');
  const addTask = useAddTask();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask.mutate(title.trim(), {
        onSuccess: () => {
          setTitle('');
          navigate({ to: '/tasks' });
        },
      });
    }
  };

  const handleCancel = () => {
    navigate({ to: '/tasks' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base">
          Task Title
        </Label>
        <Input
          id="title"
          placeholder="Enter your task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={addTask.isPending}
          autoFocus
          className="text-base py-6"
        />
        <p className="text-sm text-muted-foreground">
          Describe what you need to accomplish with clarity and intention.
        </p>
      </div>

      {addTask.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {addTask.error instanceof Error 
              ? addTask.error.message 
              : 'Failed to create task. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button 
          type="submit" 
          className="flex-1 gap-2"
          disabled={!title.trim() || addTask.isPending}
          size="lg"
        >
          {addTask.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create Task
            </>
          )}
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={addTask.isPending}
          size="lg"
          className="gap-2"
        >
          <X className="w-5 h-5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
