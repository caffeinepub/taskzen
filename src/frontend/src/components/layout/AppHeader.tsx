import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const location = useLocation();

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/generated/taskzen-logomark.dim_512x512.png" 
              alt="TaskZen" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-semibold text-foreground tracking-tight">TaskZen</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Home
                </Button>
              )}
            </Link>
            <Link to="/dashboard">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Dashboard
                </Button>
              )}
            </Link>
            <Link to="/tasks">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Tasks
                </Button>
              )}
            </Link>
            <Link to="/tasks/add">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Add Task
                </Button>
              )}
            </Link>
            <Link to="/work">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Work Zone
                </Button>
              )}
            </Link>
            <Link to="/study">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Study Zone
                </Button>
              )}
            </Link>
            <Link to="/focus">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Focus Mode
                </Button>
              )}
            </Link>
            <Link to="/support">
              {({ isActive }) => (
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm",
                    isActive && "bg-secondary"
                  )}
                >
                  Support
                </Button>
              )}
            </Link>
          </nav>
        </div>
        
        <LoginButton />
      </div>
    </header>
  );
}
