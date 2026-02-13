import { Sparkles, Calendar, BookOpen, Focus, Bell, Cloud } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const features = [
  {
    icon: Sparkles,
    title: 'Work Zone',
    description: 'Organize professional tasks with clarity. Create projects, set priorities, and track progress—all within a peaceful environment.',
    route: '/work'
  },
  {
    icon: BookOpen,
    title: 'Study Zone',
    description: 'Dedicate yourself to learning with focused study sessions. Track subjects, assignments, and goals with devotion.',
    route: '/study'
  },
  {
    icon: Calendar,
    title: 'Daily Planner',
    description: 'Plan your day with intention and track your progress mindfully.',
    route: '/dashboard'
  },
  {
    icon: Focus,
    title: 'Focus Mode',
    description: 'Enter a distraction-free environment for deep, meditative work with timer support.',
    route: '/focus'
  },
  {
    icon: Bell,
    title: 'Gentle Reminders',
    description: 'Receive peaceful notifications that guide without disrupting.',
    route: '/tasks'
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Access your tasks seamlessly across all your devices.',
    route: '/dashboard'
  }
];

export default function FeatureGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <button
            key={index}
            type="button"
            onClick={() => navigate({ to: feature.route })}
            className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-soft-lg hover:border-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all space-y-4 text-left w-full"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
