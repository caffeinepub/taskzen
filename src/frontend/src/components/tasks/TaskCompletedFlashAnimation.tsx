import { useEffect, useState } from 'react';
import { HINDI_QUOTES } from '../../constants/taskCompletedHindiQuotes';
import { Sparkles } from 'lucide-react';

interface TaskCompletedFlashAnimationProps {
  triggerId: number;
  autoHideMs?: number;
}

export default function TaskCompletedFlashAnimation({
  triggerId,
  autoHideMs = 4000,
}: TaskCompletedFlashAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    if (triggerId > 0) {
      // Select a random quote
      const randomIndex = Math.floor(Math.random() * HINDI_QUOTES.length);
      setCurrentQuote(HINDI_QUOTES[randomIndex]);
      
      // Show the animation
      setIsVisible(true);

      // Auto-hide after specified duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideMs);

      return () => clearTimeout(timer);
    }
  }, [triggerId, autoHideMs]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Flash/Glow Overlay */}
      <div className="absolute inset-0 animate-flash-glow" />
      
      {/* Quote Popup */}
      <div className="relative max-w-2xl mx-4 px-8 py-10 bg-card/95 backdrop-blur-sm rounded-3xl shadow-soft-xl border-2 border-primary/20 animate-quote-fade-in pointer-events-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-primary">Task Completed! 🎉</h3>
            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {currentQuote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
