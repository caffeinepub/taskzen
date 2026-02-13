import { useState } from 'react';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetCallerUserProfile, useGetAllTasks } from '../hooks/useTasks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Plus, FolderOpen, CheckCircle2, Trash2 } from 'lucide-react';
import ProfileSetup from '../components/auth/ProfileSetup';

type Priority = 'low' | 'medium' | 'high';

interface Project {
  id: string;
  name: string;
  items: ProjectItem[];
}

interface ProjectItem {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
}

export default function WorkZonePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: tasks = [] } = useGetAllTasks();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Local state for projects (UI-level only)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sample Project',
      items: [
        { id: '1', title: 'Review quarterly goals', priority: 'high', completed: false },
        { id: '2', title: 'Update documentation', priority: 'medium', completed: false },
        { id: '3', title: 'Team meeting prep', priority: 'low', completed: true },
      ]
    }
  ]);

  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id || '');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<Priority>('medium');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      items: []
    };
    
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setSelectedProject(newProject.id);
  };

  const handleAddItem = () => {
    if (!newItemTitle.trim() || !selectedProject) return;

    const newItem: ProjectItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      priority: newItemPriority,
      completed: false
    };

    setProjects(projects.map(p => 
      p.id === selectedProject 
        ? { ...p, items: [...p.items, newItem] }
        : p
    ));

    setNewItemTitle('');
    setNewItemPriority('medium');
  };

  const handleToggleItem = (projectId: string, itemId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? {
            ...p,
            items: p.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : p
    ));
  };

  const handleChangePriority = (projectId: string, itemId: string, priority: Priority) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? {
            ...p,
            items: p.items.map(item =>
              item.id === itemId ? { ...item, priority } : item
            )
          }
        : p
    ));
  };

  const handleDeleteItem = (projectId: string, itemId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? {
            ...p,
            items: p.items.filter(item => item.id !== itemId)
          }
        : p
    ));
  };

  const currentProject = projects.find(p => p.id === selectedProject);
  const completedItems = currentProject?.items.filter(i => i.completed).length || 0;
  const totalItems = currentProject?.items.length || 0;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Work Zone</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Organize professional tasks with clarity. Create projects, set priorities, and track progress—all within a peaceful, distraction-free environment.
              </p>
            </div>

            {/* Create New Project */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Project
                </CardTitle>
                <CardDescription>
                  Start a new project to organize your professional tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Project name..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                  <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Selection & Progress */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    Select Project
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {currentProject && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {completedItems} / {totalItems} completed ({progressPercentage}%)
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Add Item to Project */}
            {currentProject && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Task to {currentProject.name}</CardTitle>
                  <CardDescription>
                    Create a new task and set its priority
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-title">Task Title</Label>
                    <Input
                      id="item-title"
                      placeholder="Enter task title..."
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="item-priority">Priority</Label>
                    <Select value={newItemPriority} onValueChange={(v) => setNewItemPriority(v as Priority)}>
                      <SelectTrigger id="item-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleAddItem} disabled={!newItemTitle.trim()} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Project Items List */}
            {currentProject && currentProject.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Tasks in {currentProject.name}</span>
                    <Badge variant="outline">
                      {currentProject.items.length} {currentProject.items.length === 1 ? 'task' : 'tasks'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentProject.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <button
                          onClick={() => handleToggleItem(currentProject.id, item.id)}
                          className="flex-shrink-0"
                          aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <CheckCircle2
                            className={`w-5 h-5 transition-colors ${
                              item.completed ? 'text-primary fill-primary' : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                        
                        <span
                          className={`flex-1 ${
                            item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {item.title}
                        </span>

                        <Select
                          value={item.priority}
                          onValueChange={(v) => handleChangePriority(currentProject.id, item.id, v as Priority)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>

                        <Badge variant={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(currentProject.id, item.id)}
                          aria-label="Delete task"
                          title="Delete task"
                          className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {currentProject && currentProject.items.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No tasks yet. Add your first task to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetup open={showProfileSetup} />
    </RequireAuth>
  );
}
