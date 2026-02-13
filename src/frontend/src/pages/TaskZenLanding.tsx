import { Sparkles, Calendar, BookOpen, Focus, Bell, Cloud, Flower2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import Section from '../components/landing/Section';
import FeatureGrid from '../components/landing/FeatureGrid';
import PrimaryButton from '../components/landing/PrimaryButton';

export default function TaskZenLanding() {
  return (
    <div className="min-h-screen relative">
      {/* Background texture */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/taskzen-bg-texture.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/taskzen-logomark.dim_512x512.png" 
                alt="TaskZen" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-semibold text-foreground tracking-tight">TaskZen</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#philosophy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Philosophy</a>
              <Link to="/tasks" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Go to App
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <Section className="pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
              <Flower2 className="w-4 h-4" />
              <span>Find Peace in Productivity</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
              TaskZen — Where Productivity Meets Peace
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Experience a harmonious blend of mindful task management and spiritual calm. 
              Organize your life with clarity, focus, and devotion.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/tasks">
                <PrimaryButton size="lg">
                  Start Your Journey
                </PrimaryButton>
              </Link>
              <a href="#about">
                <button className="px-8 py-3 rounded-xl text-foreground hover:bg-muted transition-colors font-medium">
                  Learn More
                </button>
              </a>
            </div>
          </div>
        </Section>

        {/* Features Section */}
        <Section id="features" className="py-20 bg-muted/30">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Features for a Mindful Life
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay organized while maintaining inner peace
            </p>
          </div>
          
          <FeatureGrid />
        </Section>

        {/* About Section */}
        <Section id="about" className="py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Productivity with Spiritual Calm
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TaskZen is more than a to-do list app. It's a sanctuary for your daily tasks, 
              designed to bring clarity and peace to your workflow. Inspired by timeless spiritual 
              teachings, we believe that true productivity comes from a calm and focused mind.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every feature is crafted to help you work with intention, study with devotion, 
              and live with purpose. Let TaskZen be your companion on the path to mindful achievement.
            </p>
          </div>
        </Section>

        {/* Work & Study Sections */}
        <Section className="py-20 bg-muted/30">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Work Zone */}
            <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border/50 space-y-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Work Zone</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organize professional tasks with clarity. Create projects, set priorities, 
                and track progress—all within a peaceful, distraction-free environment.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-foreground">Project organization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-foreground">Priority management</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-foreground">Progress tracking</span>
                </li>
              </ul>
            </div>

            {/* Study Zone */}
            <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border/50 space-y-6">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Study Zone</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dedicate yourself to learning with focused study sessions. Track subjects, 
                assignments, and goals with the devotion they deserve.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span className="text-foreground">Subject organization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span className="text-foreground">Assignment tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span className="text-foreground">Learning goals</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Focus Mode Section */}
        <Section className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 md:p-16 border border-border/50 shadow-soft-xl">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Focus className="w-9 h-9 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Focus Mode
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Enter a meditative state of deep work. Focus Mode removes all distractions, 
                    presenting only your current task in a serene, minimalist interface. 
                    Work with complete presence and mindfulness.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="px-4 py-2 rounded-full bg-background text-sm font-medium">
                      Distraction-free
                    </span>
                    <span className="px-4 py-2 rounded-full bg-background text-sm font-medium">
                      Timer included
                    </span>
                    <span className="px-4 py-2 rounded-full bg-background text-sm font-medium">
                      Peaceful design
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-80 h-64 rounded-2xl bg-card border border-border/50 shadow-soft-lg flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                      <Flower2 className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your focused task appears here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Philosophy Section */}
        <Section id="philosophy" className="py-20 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
              <Flower2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Our Philosophy
            </h2>
            <blockquote className="text-xl md:text-2xl text-foreground/90 italic leading-relaxed border-l-4 border-primary pl-6 text-left">
              "A calm mind brings inner strength and self-confidence. 
              When the mind is at peace, clarity emerges, and with clarity comes focused action."
            </blockquote>
            <p className="text-lg text-muted-foreground">
              TaskZen embodies this wisdom, helping you achieve your goals with a peaceful heart and a clear mind.
            </p>
          </div>
        </Section>

        {/* Call-to-Action Section */}
        <Section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Start Your Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands who have discovered the peace of mindful productivity. 
              Begin your path to clarity and focus today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/tasks">
                <PrimaryButton size="lg">
                  Get Started Free
                </PrimaryButton>
              </Link>
              <a href="#features">
                <button className="px-8 py-3 rounded-xl text-foreground hover:bg-muted transition-colors font-medium">
                  Watch Demo
                </button>
              </a>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-muted/20">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/generated/taskzen-logomark.dim_512x512.png" 
                  alt="TaskZen" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-semibold text-foreground">TaskZen</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <span>© {new Date().getFullYear()} TaskZen. All rights reserved.</span>
                <span className="hidden sm:inline">•</span>
                <span>
                  Built with love using{' '}
                  <a 
                    href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    caffeine.ai
                  </a>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
